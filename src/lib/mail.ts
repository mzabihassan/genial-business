import { Buffer } from "node:buffer";
import {
  PROJECT_TYPES,
  SITUATIONS,
  formatBytes,
  type QuoteData,
} from "./quote";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export type Attachment = {
  filename: string;
  content: ArrayBuffer;
  contentType: string;
};

export type MailEnv = {
  BREVO_API_KEY?: string;
  QUOTE_TO_EMAIL?: string;
  QUOTE_FROM_EMAIL?: string;
};

export type MailMeta = { receivedAt: string; referer: string };

type Mailbox = { email: string; name?: string };
type Section = { title: string; rows: [string, string][]; block?: string };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function labelFor(
  list: readonly { value: string; label: string }[],
  value: string,
) {
  return list.find((item) => item.value === value)?.label ?? value;
}

function parseMailbox(value: string): Mailbox {
  const trimmed = value.trim();
  const withName = trimmed.match(
    /^\s*"?([^"<>]*)"?\s*<([^<>\s]+@[^<>\s]+)>\s*$/,
  );
  const email = (withName?.[2] ?? trimmed).trim();
  const name = withName?.[1]?.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("INVALID_MAIL_CONFIGURATION");
  }

  return name ? { email, name: name.slice(0, 70) } : { email };
}

function buildSections(
  data: QuoteData,
  files: Attachment[],
  meta: MailMeta,
): Section[] {
  const projectType = data.projectType
    ? labelFor(PROJECT_TYPES, data.projectType) +
      (data.projectType === "autre" && data.projectTypeOther
        ? ` : ${data.projectTypeOther}`
        : "")
    : "Non renseigné";

  return [
    {
      title: "Contact",
      rows: [
        ["Nom", data.name],
        ["Email", data.email],
        ["Société", data.company],
        ["Téléphone", data.phone],
        ["Site existant", data.website],
      ],
    },
    {
      title: "Projet",
      rows: [
        ["Type", projectType],
        ["Objectif principal", data.objective],
        ["Public visé", data.audience],
      ],
    },
    { title: "Description", rows: [], block: data.description },
    {
      title: "Fonctionnalités souhaitées",
      rows: [
        [
          "",
          data.features.length ? data.features.join(" · ") : "Non renseignées",
        ],
      ],
    },
    {
      title: "Situation actuelle",
      rows: [
        [
          "Avancement",
          data.situation ? labelFor(SITUATIONS, data.situation) : "",
        ],
        ["Éléments disponibles", data.assets.join(" · ")],
      ],
    },
    {
      title: "Budget & délai",
      rows: [
        ["Budget", data.budget],
        ["Délai", data.timeline],
      ],
    },
    ...(data.message
      ? [
          {
            title: "Message complémentaire",
            rows: [],
            block: data.message,
          } as Section,
        ]
      : []),
    {
      title: "Pièces jointes",
      rows: files.length
        ? files.map(
            (file) =>
              [file.filename, formatBytes(file.content.byteLength)] as [
                string,
                string,
              ],
          )
        : [["", "Aucune"]],
    },
    {
      title: "Réception",
      rows: [
        ["Date", meta.receivedAt],
        ["Page d’origine", meta.referer || "Non renseignée"],
      ],
    },
  ];
}

function toText(sections: Section[]): string {
  return sections
    .map((section) => {
      const heading = `${section.title.toUpperCase()}\n${"-".repeat(section.title.length)}`;
      if (section.block) return `${heading}\n${section.block.trim()}`;
      const body = section.rows
        .filter(([, value]) => value && value.trim())
        .map(([key, value]) => (key ? `${key}: ${value}` : value))
        .join("\n");
      return `${heading}\n${body || "Non renseigné"}`;
    })
    .join("\n\n");
}

function toHtml(sections: Section[], subject: string): string {
  const blocks = sections
    .map((section) => {
      const inner = section.block
        ? `<p style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.6;color:#0b1a21">${escapeHtml(section.block.trim())}</p>`
        : section.rows.filter(([, value]) => value && value.trim()).length
          ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${section.rows
              .filter(([, value]) => value && value.trim())
              .map(
                ([key, value]) =>
                  `<tr><td style="padding:4px 16px 4px 0;font-size:13px;color:#5e6d74;white-space:nowrap;vertical-align:top;width:1%">${escapeHtml(key)}</td><td style="padding:4px 0;font-size:15px;color:#0b1a21;vertical-align:top">${escapeHtml(value)}</td></tr>`,
              )
              .join("")}</table>`
          : `<p style="margin:0;font-size:15px;color:#5e6d74">Non renseigné</p>`;

      return `<tr><td style="padding:0 0 26px">
        <p style="margin:0 0 10px;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#8f5a10;font-family:Consolas,monospace">${escapeHtml(section.title)}</p>
        <div style="border-left:2px solid #e4e4de;padding-left:16px">${inner}</div>
      </td></tr>`;
    })
    .join("");

  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f7f5f0;padding:28px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e4e4de;border-radius:6px">
      <tr><td style="padding:26px 28px;border-bottom:1px solid #e4e4de;background:#bb4d2d;border-radius:6px 6px 0 0">
        <p style="margin:0;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#ed996f;font-family:Consolas,monospace">Nouvelle demande de devis</p>
        <p style="margin:8px 0 0;font-size:19px;font-weight:600;color:#ffffff">${escapeHtml(subject)}</p>
      </td></tr>
      <tr><td style="padding:28px"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">${blocks}</table></td></tr>
    </table>
  </body></html>`;
}

async function sendBrevoEmail(
  apiKey: string,
  payload: Record<string, unknown>,
  fetcher: typeof fetch,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetcher(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`BREVO_HTTP_${response.status}`);
  }
}

export async function sendQuoteEmail(
  data: QuoteData,
  files: Attachment[],
  meta: MailMeta,
  env: MailEnv,
  defer: (task: Promise<void>) => void,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const apiKey = env.BREVO_API_KEY?.trim();
  if (!apiKey) throw new Error("BREVO_NOT_CONFIGURED");

  const to = parseMailbox(
    env.QUOTE_TO_EMAIL || "contact@genial-business.com",
  );
  const from = parseMailbox(
    env.QUOTE_FROM_EMAIL ||
      "Genial Business <no-reply@genial-business.com>",
  );
  const who = [data.name, data.company].filter(Boolean).join(" · ");
  const type = data.projectType
    ? labelFor(PROJECT_TYPES, data.projectType)
    : "Projet";
  const subject = `${who} | ${type}`;
  const sections = buildSections(data, files, meta);

  await sendBrevoEmail(
    apiKey,
    {
      sender: from,
      to: [to],
      replyTo: { email: data.email, name: data.name.slice(0, 70) },
      subject: `Devis | ${subject}`,
      textContent: toText(sections),
      htmlContent: toHtml(sections, subject),
      attachment: files.map((file) => ({
        name: file.filename,
        content: Buffer.from(file.content).toString("base64"),
      })),
    },
    fetcher,
  );

  // Only acknowledge an accepted lead. The caller retains this task with
  // waitUntil so the visitor does not wait for a second email API request.
  const acknowledge = async () => {
    try {
      await sendBrevoEmail(
        apiKey,
        {
          sender: from,
          to: [{ email: data.email, name: data.name.slice(0, 70) }],
          subject: "Nous avons bien reçu votre demande | Genial Business",
          textContent: `Bonjour ${data.name},\n\nNous avons bien reçu votre demande. Un développeur va la lire et vous contacter pour en discuter. S’il manque une information pour préparer le devis, nous vous demanderons simplement de la préciser.\n\nVoici la description que vous nous avez transmise :\n\n${data.description.trim()}\n\nL’équipe Genial Business\ngenial-business.com`,
        },
        fetcher,
        // Stay within Cloudflare's 30-second post-response execution window.
        AbortSignal.timeout(20_000),
      );
    } catch (error) {
      console.warn(
        JSON.stringify({
          message: "Accusé de réception non envoyé",
          error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
        }),
      );
    }
  };
  defer(acknowledge());
}
