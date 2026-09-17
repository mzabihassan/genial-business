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
const backgroundTasks = [];
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
    ["functions/lib/quote-request.ts", "quote-request.mjs"],
    ["functions/api/devis.ts", "devis.mjs"],
  ]) {
    const code = (await readFile(join(root, source), "utf8"))
      .replaceAll('"./quote"', '"./quote.mjs"')
      .replaceAll('"../../src/lib/quote"', '"./quote.mjs"')
      .replaceAll('"../lib/quote-request"', '"./quote-request.mjs"')
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
  globalThis.fetch = mockFetch;

  const { emptyQuote, MAX_TOTAL_BYTES, MAX_QUOTE_REQUEST_BYTES, QUOTE_FIELD_LIMITS, validateStep } = await import(
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

    const encoded = new Request("http://localhost/api/devis", {
      method: "POST",
      body: form,
      headers: { "cf-connecting-ip": ip || `127.0.0.${++caseNumber}` },
    });
    // Model received wire bytes; canceling Node's FormData encoder mid-part
    // triggers an unrelated undici producer bug (the edge receives a stream).
    const request = new Request(encoded.url, { method: "POST", headers: encoded.headers, body: await encoded.arrayBuffer() });
    return onRequestPost({
      request,
      env: requestEnv,
      waitUntil(task) { backgroundTasks.push(task); },
    });
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
  for (const [field, limit] of Object.entries(QUOTE_FIELD_LIMITS)) {
    assert.equal((await post({ [field]: "x".repeat(limit + 1) })).status, 400, `${field} must reject limit + 1`);
    const step = ["projectTypeOther", "description", "objective", "audience"].includes(field) ? 1 : 5;
    assert.ok(validateStep(step, { ...valid, [field]: "x".repeat(limit + 1) })[field]);
    assert.equal((await post({ [field]: " ".repeat(limit) + "x" })).status, 400, `${field}: padding cannot bypass the cap`);
  }
  for (const invalid of [
    { name: ["Test", "Duplicate"] },
    { features: ["Dashboard", "Dashboard"] },
    { unexpected: "value" },
    { siteWebConf: "x".repeat(201) },
    { elapsed: "1".repeat(17) },
    { consent: "true plus unexpected padding" },
    { projectType: " ".repeat(500) + "site" },
  ]) {
    assert.ok([400, 413].includes((await post(invalid)).status), "Unexpected or repeated fields must be rejected");
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
    413,
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
    413,
  );
  assert.equal(messages.length, 0, "Attachment failures must not call Brevo");

  async function rawPost(body, headers = {}) {
    if (body instanceof FormData) {
      const encoded = new Request("http://localhost", { method: "POST", body });
      headers = { "content-type": encoded.headers.get("content-type"), ...headers };
      body = await encoded.arrayBuffer();
    }
    const request = new Request("http://localhost/api/devis", {
      method: "POST", body, duplex: "half",
      headers: { "cf-connecting-ip": `test-${++caseNumber}`, ...headers },
    });
    return onRequestPost({ request, env, waitUntil(task) { backgroundTasks.push(task); } });
  }
  assert.equal((await rawPost("{}", { "content-type": "application/json" })).status, 415);
  let canceled = false;
  assert.equal((await rawPost(new ReadableStream({
    pull() { throw new Error("Declared oversized request must not be read"); },
    cancel() { canceled = true; },
  }, { highWaterMark: 0 }), {
    "content-type": "multipart/form-data; boundary=test",
    "content-length": String(MAX_QUOTE_REQUEST_BYTES + 1),
  })).status, 413);
  assert.equal(canceled, true);
  for (const headers of [{}, { "content-length": "1" }]) {
    let pulls = 0;
    let stopped = false;
    const body = new ReadableStream({
      pull(controller) {
        pulls++;
        controller.enqueue(new Uint8Array(MAX_QUOTE_REQUEST_BYTES + 1));
        if (pulls > 1) throw new Error("Oversized stream must stop immediately");
      },
      cancel() { stopped = true; },
    }, { highWaterMark: 0 });
    assert.equal((await rawPost(body, { "content-type": "multipart/form-data; boundary=test", ...headers })).status, 413);
    assert.equal(pulls, 1);
    assert.equal(stopped, true);
  }
  const hugeHeader = `--test\r\nContent-Disposition: form-data; name="name"\r\nX-Padding: ${"a".repeat(1100)}\r\n\r\nx\r\n--test--\r\n`;
  assert.equal((await rawPost(hugeHeader, { "content-type": "multipart/form-data; boundary=test" })).status, 413);
  assert.equal((await rawPost("--test\r\ninvalid", { "content-type": "multipart/form-data; boundary=test" })).status, 400);
  const fileAsText = new FormData();
  fileAsText.append("name", new File(["not text"], "wrong.txt"));
  assert.equal((await rawPost(fileAsText)).status, 400);
  assert.equal(messages.length, 0, "Malformed or oversized requests must never send mail");

  globalThis.fetch = mockFetch;
  const file = new File(["Local test project brief"], "brief.txt", {
    type: "text/plain",
  });
  assert.equal((await post({}, [file])).status, 200);
  await Promise.all(backgroundTasks.splice(0));
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

  const maximums = Object.fromEntries(Object.entries(QUOTE_FIELD_LIMITS).map(([field, limit]) => [field, "é".repeat(limit)]));
  maximums.email = "a".repeat(64) + "@" + "b".repeat(63) + "." + "c".repeat(63) + "." + "d".repeat(57) + ".com";
  assert.equal(maximums.email.length, QUOTE_FIELD_LIMITS.email);
  assert.equal((await post(maximums)).status, 200, "Exact limits and Unicode must remain valid");
  await Promise.all(backgroundTasks.splice(0));

  // Gate each external call independently: success must wait for the lead,
  // but must not wait for even a very slow acknowledgement.
  let acceptLead;
  let acceptAcknowledgement;
  const leadGate = new Promise((resolve) => { acceptLead = resolve; });
  const acknowledgementGate = new Promise((resolve) => { acceptAcknowledgement = resolve; });
  let acknowledgeStarted = false;
  let responseReturned = false;
  globalThis.fetch = async (input, init) => {
    const payload = JSON.parse(String(init.body));
    if (payload.to[0].email === "visitor@example.invalid") {
      acknowledgeStarted = true;
      assert.ok(init.signal, "Background delivery must have a bounded timeout");
      await acknowledgementGate;
    } else {
      await leadGate;
    }
    return mockFetch(input, init);
  };
  const pendingResponse = post().then((response) => {
    responseReturned = true;
    return response;
  });
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(responseReturned, false, "Never confirm before lead acceptance");
  assert.equal(acknowledgeStarted, false, "Never acknowledge a pending lead");
  acceptLead();
  let watchdog;
  try {
    const response = await Promise.race([
      pendingResponse,
      new Promise((_, reject) => {
        watchdog = setTimeout(() => reject(new Error("Slow acknowledgement blocked the response")), 1000);
      }),
    ]);
    assert.equal(response.status, 200);
    assert.equal(acknowledgeStarted, true);
    assert.equal(backgroundTasks.length, 1, "Cloudflare must retain the acknowledgement after the response");
  } finally {
    clearTimeout(watchdog);
    acceptAcknowledgement();
    await Promise.all(backgroundTasks.splice(0));
    globalThis.fetch = mockFetch;
  }

  leadError = true;
  assert.equal(
    (await post()).status,
    502,
    "Brevo lead failure must never show success",
  );
  leadError = false;
  assert.equal(backgroundTasks.length, 0, "No acknowledgement after failed lead delivery");

  acknowledgementError = true;
  assert.equal(
    (await post()).status,
    200,
    "Acknowledgement failure must not discard a delivered lead",
  );
  await Promise.all(backgroundTasks.splice(0));
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
    "Quote checks passed: valid submission, invalid input, honeypot, completion timing, attachment type/size/count/total limits, escaped HTML, base64 attachment, Brevo failure, lead delivery, non-blocking slow acknowledgement, retained background delivery, acknowledgement failure, missing credentials, and isolate-local rate limiting. No email sent.",
  );
} finally {
  console.error = savedError;
  console.warn = savedWarn;
  await rm(temp, { recursive: true, force: true });
}
