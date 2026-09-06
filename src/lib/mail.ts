import nodemailer from "nodemailer";
import { PROJECT_TYPES, SITUATIONS, formatBytes, type QuoteData } from "./quote";

export type Attachment = { filename: string; content: Buffer; contentType: string };

const TO = process.env.QUOTE_TO_EMAIL || "contact@genial-business.com";
const FROM = process.env.QUOTE_FROM_EMAIL || "Genial Business <no-reply@genial-business.com>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function labelFor(list: readonly { value: string; label: string }[], value: string) {
  return list.find((i) => i.value === value)?.label ?? value;
}

type Section = { title: string; rows: [string, string][]; block?: string };

function buildSections(d: QuoteData, files: Attachment[], meta: Meta): Section[] {
  const projectType = d.projectType
    ? labelFor(PROJECT_TYPES, d.projectType) +
      (d.projectType === "autre" && d.projectTypeOther ? ` — ${d.projectTypeOther}` : "")
    : "—";

  return [
    {
      title: "Contact",
      rows: [
        ["Nom", d.name],
        ["Email", d.email],
        ["Société", d.company],
        ["Téléphone", d.phone],
        ["Site existant", d.website],
      ],
    },
    {
      title: "Projet",
      rows: [
        ["Type", projectType],
        ["Objectif principal", d.objective],
        ["Public visé", d.audience],
      ],
    },
    { title: "Description", rows: [], block: d.description },
    {
      title: "Fonctionnalités souhaitées",
      rows: [["", d.features.length ? d.features.join(" · ") : "—"]],
    },
    {
      title: "Situation actuelle",
      rows: [
        ["Avancement", d.situation ? labelFor(SITUATIONS, d.situation) : ""],
        ["Éléments disponibles", d.assets.join(" · ")],
      ],
    },
    {
      title: "Budget & délai",
      rows: [
        ["Budget", d.budget],
        ["Délai", d.timeline],
      ],
    },
    ...(d.message ? [{ title: "Message complémentaire", rows: [], block: d.message } as Section] : []),
    {
      title: "Pièces jointes",
      rows: files.length
        ? files.map((f) => [f.filename, formatBytes(f.content.length)] as [string, string])
        : [["", "Aucune"]],
    },
    {
      title: "Réception",
      rows: [
        ["Date", meta.receivedAt],
        ["Page d’origine", meta.referer || "—"],
      ],
    },
  ];
}

type Meta = { receivedAt: string; referer: string };

function toText(sections: Section[]): string {
  return sections
    .map((s) => {
      const head = `${s.title.toUpperCase()}\n${"-".repeat(s.title.length)}`;
      if (s.block) return `${head}\n${s.block.trim()}`;
      const body = s.rows
        .filter(([, v]) => v && v.trim())
        .map(([k, v]) => (k ? `${k}: ${v}` : v))
        .join("\n");
      return `${head}\n${body || "—"}`;
    })
    .join("\n\n");
}

function toHtml(sections: Section[], subject: string): string {
  const blocks = sections
    .map((s) => {
      const inner = s.block
        ? `<p style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.6;color:#0b1a21">${escapeHtml(
            s.block.trim(),
          )}</p>`
        : s.rows.filter(([, v]) => v && v.trim()).length
          ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${s.rows
              .filter(([, v]) => v && v.trim())
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:4px 16px 4px 0;font-size:13px;color:#5e6d74;white-space:nowrap;vertical-align:top;width:1%">${escapeHtml(
                    k,
                  )}</td><td style="padding:4px 0;font-size:15px;color:#0b1a21;vertical-align:top">${escapeHtml(
                    v,
                  )}</td></tr>`,
              )
              .join("")}</table>`
          : `<p style="margin:0;font-size:15px;color:#5e6d74">—</p>`;

      return `<tr><td style="padding:0 0 26px">
        <p style="margin:0 0 10px;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#8f5a10;font-family:Consolas,monospace">${escapeHtml(
          s.title,
        )}</p>
        <div style="border-left:2px solid #e4e4de;padding-left:16px">${inner}</div>
      </td></tr>`;
    })
    .join("");

  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f3f3f0;padding:28px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e4e4de;border-radius:6px">
      <tr><td style="padding:26px 28px;border-bottom:1px solid #e4e4de;background:#0e3a4f;border-radius:6px 6px 0 0">
        <p style="margin:0;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#e9a23b;font-family:Consolas,monospace">Nouvelle demande de devis</p>
        <p style="margin:8px 0 0;font-size:19px;font-weight:600;color:#ffffff">${escapeHtml(subject)}</p>
      </td></tr>
      <tr><td style="padding:28px"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">${blocks}</table></td></tr>
    </table>
  </body></html>`;
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

export async function sendQuoteEmail(
  data: QuoteData,
  files: Attachment[],
  meta: Meta,
): Promise<void> {
  const who = [data.name, data.company].filter(Boolean).join(" · ");
  const type = data.projectType ? labelFor(PROJECT_TYPES, data.projectType) : "Projet";
  const subject = `${who} — ${type}`;
  const sections = buildSections(data, files, meta);
  const text = toText(sections);

  const transport = getTransport();

  if (!transport) {
    // No SMTP configured: fine while developing, never acceptable in production —
    // a silent success here would lose real leads.
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP_NOT_CONFIGURED");
    }
    console.info(
      `\n──── DEVIS (SMTP non configuré — aperçu) ────\nÀ: ${TO}\nSujet: ${subject}\n\n${text}\n────────────────────────────────────────────\n`,
    );
    return;
  }

  await transport.sendMail({
    from: FROM,
    to: TO,
    replyTo: `${data.name} <${data.email}>`,
    subject: `Devis — ${subject}`,
    text,
    html: toHtml(sections, subject),
    attachments: files.map((f) => ({
      filename: f.filename,
      content: f.content,
      contentType: f.contentType,
    })),
  });

  // Acknowledgement to the person who wrote in. Best-effort: if it fails, the
  // lead is already safely delivered and must not be reported as an error.
  try {
    await transport.sendMail({
      from: FROM,
      to: data.email,
      subject: "Nous avons bien reçu votre demande — Genial Business",
      text: `Bonjour ${data.name},\n\nNous avons bien reçu votre demande et nous allons l’étudier.\nNous revenons vers vous pour en discuter, et si des éléments manquent pour chiffrer, nous vous poserons les bonnes questions.\n\nVoici ce que vous nous avez transmis :\n\n${data.description.trim()}\n\n— L’équipe Genial Business\ngenial-business.com`,
    });
  } catch (err) {
    console.warn("Accusé de réception non envoyé:", err);
  }
}
