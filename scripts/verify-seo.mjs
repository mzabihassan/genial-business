import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Run against the built export, or pass the production origin to verify HTTP too.
const origin = "https://genial-business.com";
const base = process.argv[2];
const paths = ["/", "/services", "/realisations", "/methode", "/devis", "/confidentialite", "/mentions-legales", "/cgv", "/cookies"];

async function read(path, status = 200) {
  if (base) {
    const response = await fetch(new URL(path, base), { redirect: "manual" });
    assert.equal(response.status, status, `${path}: HTTP status`);
    if (status === 200) {
      assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex/i, `${path}: HTTP noindex`);
    }
    return response.text();
  }
  const file = path === "/" ? "/index.html" : /\.[a-z]+$/.test(path) ? path : `${path}.html`;
  return readFile(`out${file}`, "utf8");
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
}

function meta(html, key) {
  return [...html.matchAll(/<meta\s[^>]*>/g)].map(([tag]) => attributes(tag))
    .filter((tag) => tag.name === key || tag.property === key).map((tag) => tag.content);
}

const robots = await read("/robots.txt");
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, /Allow: \/(?:\r?\n|$)/);
assert.match(robots, /Disallow: \/api\//);
assert.doesNotMatch(robots, /Disallow: \/(?:\r?\n|$)|Disallow: \/devis/);
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));

const sitemap = await read("/sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(urls.sort(), paths.map((path) => `${origin}${path}`).sort());
assert.doesNotMatch(sitemap, /<lastmod>/, "Do not publish fabricated modification dates");

const titles = new Set();
const descriptions = new Set();
for (const path of paths) {
  const html = await read(path);
  const head = html.split("</head>")[0];
  const title = head.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique title`);
  titles.add(title);
  assert.equal(title.split("Genial Business").length - 1, 1, `${path}: no duplicated brand in title`);
  const [description] = meta(head, "description");
  assert.ok(description && !descriptions.has(description), `${path}: unique description`);
  descriptions.add(description);
  const canonicals = [...head.matchAll(/<link\s[^>]*>/g)].map(([tag]) => attributes(tag))
    .filter((tag) => tag.rel === "canonical");
  assert.equal(canonicals.length, 1, `${path}: one canonical`);
  assert.equal(new URL(canonicals[0].href).href, new URL(path, origin).href);
  assert.equal(new URL(meta(head, "og:url")[0]).href, new URL(path, origin).href);
  assert.deepEqual(meta(head, "og:title"), [title]);
  assert.deepEqual(meta(head, "og:description"), [description]);
  assert.deepEqual(meta(head, "twitter:title"), [title]);
  assert.ok(meta(head, "robots").some((value) => /\bindex\b/.test(value)));
  assert.ok(meta(head, "robots").every((value) => !/noindex/.test(value)));
  assert.match(html, /<html[^>]*lang="fr"/);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path}: one server-rendered heading`);
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    assert.doesNotThrow(() => JSON.parse(json), `${path}: valid structured data`);
  }
  console.log(`PASS ${path}: crawlable HTML, canonical, unique search/share metadata`);
}

for (const path of ["/devis/confirmation", base ? "/seo-check-nonexistent-page" : "/404.html"]) {
  const html = await read(path, path.includes("nonexistent") ? 404 : 200);
  assert.ok(meta(html, "robots").some((value) => /noindex/.test(value)), `${path}: noindex`);
}
if (base) {
  const legacy = await fetch(new URL("/sitemap", base), { redirect: "manual" });
  assert.equal(legacy.status, 301);
  assert.equal(new URL(legacy.headers.get("location"), base).pathname, "/sitemap.xml");
}
console.log(`SEO checks passed (${base ?? "local export"}).`);
