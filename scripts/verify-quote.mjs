/** Exercise the real quote schema, Pages Function and Brevo builder without sending mail. */
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const temp = await mkdtemp(join(root, ".quote-check-"));
const savedError = console.error;
const savedWarn = console.warn;
const messages = [];
const env = {
  BREVO_API_KEY: "test-api-key",
  QUOTE_TO_EMAIL: "studio@example.invalid",
  QUOTE_FROM_EMAIL: "Genial Business <sender@example.invalid>",
};
let leadError = false;
let acknowledgementError = false;
let caseNumber = 0;

try {
  for (const [source, output] of [
    ["src/lib/quote.ts", "quote.mjs"],
    ["src/lib/mail.ts", "mail.mjs"],
    ["functions/api/devis.ts", "devis.mjs"],
  ]) {
    const code = (await readFile(join(root, source), "utf8"))
      .replaceAll('"./quote"', '"./quote.mjs"')
      .replaceAll('"../../src/lib/quote"', '"./quote.mjs"')
      .replaceAll('"../../src/lib/mail"', '"./mail.mjs"');
    await writeFile(
      join(temp, output),
      ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      }).outputText,
    );
  }

  console.error = () => {};
  console.warn = () => {};

  const mockFetch = async (input, init) => {
    assert.equal(String(input), "https://api.brevo.com/v3/smtp/email");
    assert.equal(init?.method, "POST");
    assert.equal(init?.headers?.["api-key"], env.BREVO_API_KEY);
    const message = JSON.parse(String(init?.body));
    const isAcknowledgement =
      message.to?.[0]?.email === "visitor@example.invalid";

    if (leadError && !isAcknowledgement) {
      return Response.json({ message: "simulated" }, { status: 500 });
    }
    if (acknowledgementError && isAcknowledgement) {
      return Response.json({ message: "simulated" }, { status: 500 });
    }

    messages.push(message);
    return Response.json(
      { messageId: "local-mocked-test" },
      { status: 201 },
    );
  };

  const { emptyQuote, MAX_TOTAL_BYTES, validateStep } = await import(
    pathToFileURL(join(temp, "quote.mjs"))
  );
  const { onRequestPost } = await import(
    pathToFileURL(join(temp, "devis.mjs"))
  );
  const valid = {
    ...emptyQuote,
    projectType: "inconnu",
    description:
      'Un outil de réservation pour un cabinet <script>alert("test")</script>',
    name: "Test local",
    email: "visitor@example.invalid",
    consent: true,
  };

  assert.ok(validateStep(0, emptyQuote).projectType);
  assert.ok(validateStep(1, { ...valid, description: "Court" }).description);
  for (let step = 0; step < 6; step += 1) {
    assert.deepEqual(validateStep(step, valid), {});
  }

  async function post(
    overrides = {},
    attachments = [],
    ip,
    requestEnv = env,
  ) {
    const data = { ...valid, ...overrides };
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) value.forEach((item) => form.append(key, item));
      else form.append(key, String(value));
    }
    if (!form.has("elapsed")) form.append("elapsed", "6000");
    for (const file of attachments) form.append("attachments", file);

    const request = new Request("http://localhost/api/devis", {
      method: "POST",
      body: form,
      headers: { "cf-connecting-ip": ip || `127.0.0.${++caseNumber}` },
    });
    return onRequestPost({ request, env: requestEnv });
  }

  for (const invalid of [
    { projectType: "" },
    { projectType: "invalid" },
    { description: "Court" },
    { consent: false },
    { email: "invalid" },
    { features: ["invalid"] },
  ]) {
    assert.equal((await post(invalid)).status, 400);
  }
  assert.equal(messages.length, 0, "Invalid input must not call Brevo");

  assert.equal((await post({ siteWebConf: "bot" })).status, 200);
  assert.equal(messages.length, 0, "Honeypot must not call Brevo");
  assert.equal((await post({ elapsed: 10 })).status, 400);
  assert.equal((await post({ elapsed: "not-a-number" })).status, 400);
  assert.equal(messages.length, 0, "Timing failures must not call Brevo");

  assert.equal(
    (
      await post({}, [
        new File(["x"], "unsafe.exe", {
          type: "application/octet-stream",
        }),
      ])
    ).status,
    400,
  );
  assert.equal(
    (
      await post({}, [
        new File(["x"], "image.png", { type: "application/javascript" }),
      ])
    ).status,
    400,
  );
  assert.equal(
    (
      await post({}, [
        new File(["x"], "unsupported.webp", { type: "image/webp" }),
      ])
    ).status,
    400,
  );
  assert.equal(
    (
      await post({}, [
        new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.txt", {
          type: "text/plain",
        }),
      ])
    ).status,
    400,
  );
  assert.equal(
    (
      await post(
        {},
        Array.from(
          { length: 6 },
          (_, index) =>
            new File(["brief"], `brief-${index}.txt`, { type: "text/plain" }),
        ),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await post({}, [
        new File([new Uint8Array(8 * 1024 * 1024)], "part-1.txt", {
          type: "text/plain",
        }),
        new File([new Uint8Array(MAX_TOTAL_BYTES - 8 * 1024 * 1024 + 1)], "part-2.txt", {
          type: "text/plain",
        }),
      ])
    ).status,
    400,
  );
  assert.equal(messages.length, 0, "Attachment failures must not call Brevo");

  globalThis.fetch = mockFetch;
  const file = new File(["Local test project brief"], "brief.txt", {
    type: "text/plain",
  });
  assert.equal((await post({}, [file])).status, 200);
  assert.equal(messages.length, 2, "Lead and acknowledgement must be sent");
  assert.equal(messages[0].to[0].email, "studio@example.invalid");
  assert.equal(messages[0].replyTo.email, "visitor@example.invalid");
  assert.match(messages[0].textContent, /Budget & délai/i);
  assert.ok(messages[0].htmlContent.includes("&lt;script&gt;"));
  assert.ok(!messages[0].htmlContent.includes("<script>"));
  assert.equal(
    Buffer.from(messages[0].attachment[0].content, "base64").toString(),
    "Local test project brief",
  );
  assert.equal(messages[1].to[0].email, "visitor@example.invalid");

  leadError = true;
  assert.equal(
    (await post()).status,
    502,
    "Brevo lead failure must never show success",
  );
  leadError = false;

  acknowledgementError = true;
  assert.equal(
    (await post()).status,
    200,
    "Acknowledgement failure must not discard a delivered lead",
  );
  acknowledgementError = false;

  assert.equal(
    (await post({}, [], undefined, { ...env, BREVO_API_KEY: "" })).status,
    502,
    "Missing Brevo credentials must never show success",
  );

  for (let attempt = 0; attempt < 5; attempt += 1) {
    assert.equal(
      (await post({ description: "Court" }, [], "192.0.2.100")).status,
      400,
    );
  }
  assert.equal((await post({}, [], "192.0.2.100")).status, 429);

  console.log(
    "Quote checks passed: valid submission, invalid input, honeypot, completion timing, attachment type/size/count/total limits, escaped HTML, base64 attachment, Brevo failure, lead delivery, acknowledgement failure, missing credentials, and isolate-local rate limiting. No email sent.",
  );
} finally {
  console.error = savedError;
  console.warn = savedWarn;
  await rm(temp, { recursive: true, force: true });
}
