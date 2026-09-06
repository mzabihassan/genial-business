import { NextResponse } from "next/server";
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
} from "@/lib/quote";
import { sendQuoteEmail, type Attachment } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* --- Rate limiting -------------------------------------------------------- */
/* Per-instance and in-memory on purpose: enough to stop a form-spam loop
   without adding infrastructure to a marketing site. */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude ceiling, never unbounded
  return recent.length > MAX_PER_WINDOW;
}

/* --- Validation ----------------------------------------------------------- */

const oneOf = <T extends readonly string[]>(values: T) =>
  z.string().trim().refine((v) => v === "" || (values as readonly string[]).includes(v), {
    message: "Valeur inattendue.",
  });

const schema = z.object({
  projectType: oneOf(PROJECT_TYPES.map((p) => p.value)),
  projectTypeOther: z.string().trim().max(200),
  description: z.string().trim().min(20, "Décrivez votre projet en quelques phrases.").max(8000),
  objective: z.string().trim().max(500),
  audience: z.string().trim().max(500),
  situation: oneOf(SITUATIONS.map((s) => s.value)),
  assets: z.array(oneOf(ASSETS)).max(ASSETS.length),
  features: z.array(oneOf([...FEATURES, FEATURE_UNSURE])).max(FEATURES.length + 1),
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

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const ip =
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

  // Bot traps: a filled honeypot, or a form completed faster than a human can read it.
  if (String(form.get("siteWebConf") ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  if (Number(form.get("elapsed") ?? 0) < 2500) {
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

  /* --- Attachments -------------------------------------------------------- */

  const uploads = form.getAll("attachments").filter((f): f is File => f instanceof File);
  if (uploads.length > MAX_FILES) {
    return fail(`${MAX_FILES} fichiers au maximum.`);
  }

  const files: Attachment[] = [];
  let total = 0;

  for (const upload of uploads) {
    if (upload.size === 0) continue;

    const ext = "." + (upload.name.split(".").pop() ?? "").toLowerCase();
    if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
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
      // Strip any path and keep the name harmless — it lands in an email header.
      filename: upload.name.replace(/[\\/]/g, "_").replace(/[\r\n]/g, "").slice(0, 120),
      content: Buffer.from(await upload.arrayBuffer()),
      contentType: upload.type || "application/octet-stream",
    });
  }

  /* --- Deliver ------------------------------------------------------------ */

  try {
    await sendQuoteEmail(parsed.data as QuoteData, files, {
      receivedAt: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
      referer: request.headers.get("referer") ?? "",
    });
  } catch (err) {
    console.error("Échec d’envoi de la demande de devis:", err);
    return fail(
      "Votre demande n’a pas pu être envoyée. Réessayez, ou écrivez-nous directement à",
      502,
    );
  }

  return NextResponse.json({ ok: true });
}
