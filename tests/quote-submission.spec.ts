import { test, expect, type Page, type Route } from "@playwright/test";

async function fillQuote(page: Page) {
  await page.goto("/devis");
  await page.getByText("Site web", { exact: true }).click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.getByRole("textbox", { name: "Votre projet" }).fill("Un site de réservation pour nos ateliers créatifs, avec un espace client.");
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Passer cette étape" }).click();
  await page.locator('[name="name"]').fill("Test Atelier");
  await page.locator('[name="email"]').fill("test@example.invalid");
  await page.locator('input[type="file"]').setInputFiles({ name: "brief.txt", mimeType: "text/plain", buffer: Buffer.from("Brief conservé après erreur") });
  await page.locator('label').filter({ has: page.locator('[name="consent"]') }).click();
}

test("envoi exclusif, progression, navigation protégée et confirmation immédiate", async ({ page }) => {
  let request: Route | undefined;
  let calls = 0;
  await page.route("**/api/devis", (route) => { calls++; request = route; });
  await fillQuote(page);
  await page.locator("form").evaluate((form: HTMLFormElement) => { form.requestSubmit(); form.requestSubmit(); });
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect.poll(() => calls).toBe(1);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Tab");
  expect(await modal.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.evaluate(() => history.back());
  await expect(modal).toBeVisible();
  await expect(page).toHaveURL(/\/devis$/);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", /\d+/);
  await expect.poll(async () => Number(await page.getByRole("progressbar").getAttribute("aria-valuenow"))).toBeGreaterThan(20);
  await page.screenshot({ animations: "disabled", path: "artifacts/quote-submission/desktop-sending.png" });
  const start = Date.now();
  await request!.fulfill({ json: { ok: true } });
  await expect(modal.getByRole("heading")).toHaveText("Votre idée estentre nos mains.");
  expect(Date.now() - start).toBeLessThan(1500);
  await page.screenshot({ animations: "disabled", path: "artifacts/quote-submission/desktop-success.png" });
  await page.getByRole("button", { name: "Et maintenant ?" }).click();
  await expect(page).toHaveURL(/\/devis\/confirmation$/);
  expect(await page.evaluate(() => document.body.style.position)).not.toBe("fixed");
  expect(calls).toBe(1);
});

test("erreur serveur, correction et nouvel envoi sans perdre les fichiers", async ({ page }) => {
  let calls = 0;
  const bodies: string[] = [];
  await page.route("**/api/devis", async (route) => {
    bodies.push(route.request().postDataBuffer()!.toString());
    calls++;
    await route.fulfill(calls === 1 ? { status: 502, json: { error: "La transmission est momentanément indisponible." } } : { json: { ok: true } });
  });
  await fillQuote(page);
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByRole("button", { name: "Réessayer l’envoi" })).toBeVisible();
  await page.screenshot({ animations: "disabled", path: "artifacts/quote-submission/desktop-error.png" });
  await page.getByRole("button", { name: "Revenir à ma demande" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator('[name="name"]')).toHaveValue("Test Atelier");
  await expect(page.getByText("brief.txt", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByRole("button", { name: "Et maintenant ?" })).toBeVisible();
  expect(calls).toBe(2);
  for (const body of bodies) {
    expect(body).toContain("Brief conservé après erreur");
    expect(body).toContain("Un site de réservation");
  }
});

test("réessayer directement après une interruption réseau", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/devis", async (route) => {
    calls++;
    if (calls === 1) await route.abort("internetdisconnected");
    else await route.fulfill({ json: { ok: true } });
  });
  await fillQuote(page);
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByText(/La connexion a été interrompue/).first()).toBeVisible();
  await page.getByRole("button", { name: "Réessayer l’envoi" }).click();
  await expect(page.getByRole("button", { name: "Et maintenant ?" })).toBeVisible();
  expect(calls).toBe(2);
});

test("mobile et réduction des mouvements, attente longue puis succès", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  let request: Route | undefined;
  await page.route("**/api/devis", (route) => { request = route; });
  await fillQuote(page);
  await page.clock.install();
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect.poll(() => Boolean(request)).toBe(true);
  await page.clock.fastForward(15000);
  await expect(page.getByText(/La transmission prend un peu plus de temps/)).toBeVisible();
  expect(Number(await page.getByRole("progressbar").getAttribute("aria-valuenow"))).toBeLessThan(100);
  const modal = page.getByRole("dialog");
  expect(await modal.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect(await page.locator(".dispatch-model").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await page.screenshot({ animations: "disabled", path: "artifacts/quote-submission/mobile-sending.png" });
  await request!.fulfill({ json: { ok: true } });
  await expect(page.getByRole("button", { name: "Et maintenant ?" })).toBeVisible();
  await page.screenshot({ animations: "disabled", path: "artifacts/quote-submission/mobile-success.png" });
});

test("une réponse HTTP 200 invalide ne déclenche pas un faux succès", async ({ page }) => {
  await page.route("**/api/devis", (route) => route.fulfill({ json: {} }));
  await fillQuote(page);
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByRole("button", { name: "Réessayer l’envoi" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Et maintenant ?" })).toHaveCount(0);
});

test("une réponse HTML inattendue reste une erreur lisible", async ({ page }) => {
  await page.route("**/api/devis", (route) => route.fulfill({ contentType: "text/html", body: "<html>Maintenance</html>" }));
  await fillQuote(page);
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByRole("dialog").getByText("La confirmation de l’envoi n’a pas pu être vérifiée.")).toBeVisible();
});

test("un serveur sans réponse libère le parcours après expiration", async ({ page }) => {
  await page.addInitScript(() => {
    const timeout = AbortSignal.timeout.bind(AbortSignal);
    AbortSignal.timeout = () => timeout(100);
  });
  await page.route("**/api/devis", () => {});
  await fillQuote(page);
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByRole("dialog").getByText(/La confirmation tarde à arriver/)).toBeVisible();
  await page.getByRole("button", { name: "Revenir à ma demande" }).click();
  await expect(page.locator('[name="email"]')).toHaveValue("test@example.invalid");
  await expect(page.getByText("brief.txt", { exact: true })).toBeVisible();
});

test("protection du retour et nettoyage dans les navigateurs sans Navigation API", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "navigation", { value: undefined, configurable: true }));
  let request: Route | undefined;
  await page.route("**/api/devis", (route) => { request = route; });
  await fillQuote(page);
  const historyLength = await page.evaluate(() => history.length);
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect.poll(() => page.evaluate(() => history.state?.quoteSending)).toBe(true);
  await page.evaluate(() => history.back());
  await expect.poll(() => page.evaluate(() => history.state?.quoteSending)).toBe(true);
  await expect(page.getByRole("dialog")).toBeVisible();
  await request!.fulfill({ status: 502, json: { error: "Veuillez réessayer." } });
  await expect.poll(() => page.evaluate(() => Boolean(history.state?.quoteSending))).toBe(false);
  await page.getByRole("button", { name: "Revenir à ma demande" }).click();
  await expect(page.locator('[name="name"]')).toHaveValue("Test Atelier");
  expect(await page.evaluate(() => history.length)).toBe(historyLength + 1);
});
