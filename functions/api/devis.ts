import type { PagesFunction } from "@cloudflare/workers-types";
import { z } from "zod";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME,
  ASSETS,
  BUDGETS,
  FEATURES,
  FEATURE_UNSURE,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  PROJECT_TYPES,
  SITUATIONS,
  TIMELINES,
  type QuoteData,
} from "../../src/lib/quote";
import { sendQuoteEmail, type Attachment } from "../../src/lib/mail";

// This is an isolate-local abuse throttle, not a global counter. Cloudflare's
// Pages Functions binding list does not currently include Rate Limiting, and a
// KV/DO just for this low-volume form would add avoidable infrastructure.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const oneOf = <T extends readonly string[]>(values: T) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || values.includes(value), {
      message: "Valeur inattendue.",
    });

const schema = z.object({
  projectType: z.enum(PROJECT_TYPES.map((project) => project.value), {
    message: "Choisissez un type de projet.",
  }),
  projectTypeOther: z.string().trim().max(200),
  description: z
    .string()
    .trim()
    .min(20, "Décrivez votre projet en quelques phrases.")
    .max(8000),
  objective: z.string().trim().max(500),
  audience: z.string().trim().max(500),
  situation: oneOf(SITUATIONS.map((situation) => situation.value)),
  assets: z.array(oneOf(ASSETS)).max(ASSETS.length),
  features: z
    .array(oneOf([...FEATURES, FEATURE_UNSURE]))
    .max(FEATURES.length + 1),
  budget: oneOf(BUDGETS),
  timeline: oneOf(TIMELINES),
  name: z.string().trim().min(1, "Indiquez votre nom.").max(120),
  email: z.email("Cet email ne semble pas valide.").max(200),
  company: z.string().trim().max(160),
  phone: z.string().trim().max(60),
  website: z.string().trim().max(300),
  message: z.string().trim().max(4000),
  consent: z.literal(true, { message: "Votre accord est nécessaire." }),
});

function fail(error: string, status = 400): Response {
  return Response.json({ error }, { status });
}

export const onRequestPost: PagesFunction<CloudflareEnv> = async ({
  request,
  env,
}) => {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "inconnu";

  if (rateLimited(ip)) {
    return fail("Trop de demandes envoyées. Réessayez dans quelques minutes.", 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Requête illisible.");
  }

  if (String(form.get("siteWebConf") ?? "").trim() !== "") {
    return Response.json({ ok: true });
  }
  const elapsed = Number(form.get("elapsed") ?? 0);
  if (!Number.isFinite(elapsed) || elapsed < 2500) {
    return fail("Envoi trop rapide. Réessayez.");
  }

  const parsed = schema.safeParse({
    projectType: form.get("projectType") ?? "",
    projectTypeOther: form.get("projectTypeOther") ?? "",
    description: form.get("description") ?? "",
    objective: form.get("objective") ?? "",
    audience: form.get("audience") ?? "",
    situation: form.get("situation") ?? "",
    assets: form.getAll("assets").map(String),
    features: form.getAll("features").map(String),
    budget: form.get("budget") ?? "",
    timeline: form.get("timeline") ?? "",
    name: form.get("name") ?? "",
    email: form.get("email") ?? "",
    company: form.get("company") ?? "",
    phone: form.get("phone") ?? "",
    website: form.get("website") ?? "",
    message: form.get("message") ?? "",
    consent: form.get("consent") === "true",
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Formulaire incomplet.");
  }

  const uploads = form
    .getAll("attachments")
    .filter((file): file is File => file instanceof File);
  if (uploads.length > MAX_FILES) {
    return fail(`${MAX_FILES} fichiers au maximum.`);
  }

  const files: Attachment[] = [];
  let total = 0;

  for (const upload of uploads) {
    if (upload.size === 0) continue;

    const extension = `.${upload.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(extension)) {
      return fail(`Format non accepté : ${upload.name}`);
    }
    if (upload.type && !ACCEPTED_MIME.has(upload.type)) {
      return fail(`Format non accepté : ${upload.name}`);
    }
    if (upload.size > MAX_FILE_BYTES) {
      return fail(`${upload.name} est trop volumineux.`);
    }
    total += upload.size;
    if (total > MAX_TOTAL_BYTES) {
      return fail("Poids total des pièces jointes dépassé.");
    }

    files.push({
      filename: upload.name
        .replace(/[\\/]/g, "_")
        .replace(/[\r\n]/g, "")
        .slice(0, 120),
      content: await upload.arrayBuffer(),
      contentType: upload.type || "application/octet-stream",
    });
  }

  try {
    await sendQuoteEmail(
      parsed.data as QuoteData,
      files,
      {
        receivedAt: new Date().toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        }),
        referer: request.headers.get("referer") ?? "",
      },
      env,
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "Échec d’envoi de la demande de devis",
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      }),
    );
    return fail(
      "Votre demande n’a pas pu être envoyée. Réessayez, ou écrivez-nous directement à",
      502,
    );
  }

  return Response.json({ ok: true });
};
