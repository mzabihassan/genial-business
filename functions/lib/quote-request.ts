import {
  getMultipartBoundary,
  MultipartParser,
  MaxFileSizeExceededError,
  MaxHeaderSizeExceededError,
  MaxPartsExceededError,
  MaxTotalSizeExceededError,
} from "@remix-run/multipart-parser";
import {
  ASSETS, FEATURES, MAX_FILES, MAX_FILE_BYTES, MAX_TOTAL_BYTES,
  MAX_QUOTE_PARTS, MAX_QUOTE_REQUEST_BYTES, MAX_QUOTE_TEXT_BYTES,
  QUOTE_FIELD_LIMITS,
} from "../../src/lib/quote";

export class QuoteRequestError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

const textLimits: Readonly<Record<string, number>> = {
  ...QUOTE_FIELD_LIMITS,
  projectType: 32, situation: 32, budget: 80, timeline: 80,
  assets: 80, features: 80, consent: 5, elapsed: 16, siteWebConf: 200,
};

/** Enforce limits during parsing, including when Content-Length is absent or false. */
export async function readQuoteRequest(request: Request): Promise<FormData> {
  const declared = request.headers.get("content-length");
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > MAX_QUOTE_REQUEST_BYTES)) {
    void request.body?.cancel().catch(() => {});
    throw new QuoteRequestError("Demande trop volumineuse.", 413);
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.length > 256 || !/^multipart\/form-data\s*;/i.test(contentType) ||
      ![null, "identity"].includes(request.headers.get("content-encoding"))) {
    void request.body?.cancel().catch(() => {});
    throw new QuoteRequestError("Format de demande non accepté.", 415);
  }
  const boundary = getMultipartBoundary(contentType);
  if (!boundary || !request.body) throw new QuoteRequestError("Requête illisible.");

  const form = new FormData();
  const counts = new Map<string, number>();
  const reader = request.body.getReader();
  let wireBytes = 0;
  let textBytes = 0;
  let fileBytes = 0;
  let completed = false;
  try {
    const parser = new MultipartParser(boundary, {
      maxHeaderSize: 1024,
      maxFileSize: MAX_FILE_BYTES,
      maxParts: MAX_QUOTE_PARTS,
      maxTotalSize: MAX_TOTAL_BYTES + MAX_QUOTE_TEXT_BYTES,
    });
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      wireBytes += chunk.value.byteLength;
      if (wireBytes > MAX_QUOTE_REQUEST_BYTES) throw new QuoteRequestError("Demande trop volumineuse.", 413);
      for (const part of parser.write(chunk.value)) {
        const name = part.name;
        if (!name || (name !== "attachments" && !Object.hasOwn(textLimits, name))) {
          throw new QuoteRequestError("Champ inattendu dans la demande.");
        }
        const count = (counts.get(name) ?? 0) + 1;
        counts.set(name, count);
        const maximum = name === "attachments" ? MAX_FILES : name === "assets" ? ASSETS.length : name === "features" ? FEATURES.length + 1 : 1;
        if (count > maximum) throw new QuoteRequestError("Un champ est répété trop de fois.");
        if (name === "attachments") {
          if (!part.isFile || !part.filename || part.filename.length > 255) throw new QuoteRequestError("Pièce jointe invalide.");
          fileBytes += part.size;
          if (fileBytes > MAX_TOTAL_BYTES) throw new QuoteRequestError("Poids total des pièces jointes dépassé.", 413);
          form.append(name, new File([part.arrayBuffer], part.filename, { type: part.mediaType ?? "" }));
        } else {
          if (part.isFile) throw new QuoteRequestError("Un champ texte ne peut pas contenir un fichier.");
          textBytes += part.size;
          if (textBytes > MAX_QUOTE_TEXT_BYTES || part.size > textLimits[name] * 3) throw new QuoteRequestError("Texte trop volumineux.", 413);
          const value = part.text;
          // Count raw input before trim: padding must not bypass the limit.
          if (value.length > textLimits[name]) throw new QuoteRequestError(`${textLimits[name]} caractères maximum pour ce champ.`);
          if (form.getAll(name).includes(value)) throw new QuoteRequestError("Valeur répétée dans la demande.");
          form.append(name, value);
        }
      }
    }
    parser.finish();
    completed = true;
    return form;
  } catch (error) {
    if (error instanceof QuoteRequestError) throw error;
    if (error instanceof MaxFileSizeExceededError || error instanceof MaxHeaderSizeExceededError ||
        error instanceof MaxPartsExceededError || error instanceof MaxTotalSizeExceededError) {
      throw new QuoteRequestError("Demande trop volumineuse.", 413);
    }
    throw new QuoteRequestError("Requête illisible.");
  } finally {
    if (!completed) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
