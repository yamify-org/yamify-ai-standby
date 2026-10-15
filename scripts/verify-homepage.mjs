import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");

const required = [
  "Open-model inference",
  'name="robots" content="noindex,nofollow"',
  'rel="canonical" href="https://www.yamify.co/"',
];

const forbidden = ["mixpanel", "api-js.mixpanel", "mixpanel.com"];

for (const marker of required) {
  if (!html.includes(marker)) throw new Error(`Missing homepage invariant: ${marker}`);
}

for (const marker of forbidden) {
  if (html.toLowerCase().includes(marker)) throw new Error(`Forbidden homepage marker: ${marker}`);
}

const assets = [
  ...new Set(html.match(/\/(?:_next\/static|svgs|images)\/[^"'\\<> )]+/g) ?? []),
  ...new Set(html.match(/\/(?:favicon\.ico|favicon-32x32\.png|icon-192\.png|icon-512\.png|apple-touch-icon\.png)/g) ?? []),
];
const missing = assets.filter((asset) => !existsSync(path.join(root, asset.split("?")[0].slice(1))));
if (missing.length) throw new Error(`Missing local assets:\n${missing.join("\n")}`);

for (const asset of assets.filter((asset) => asset.startsWith("/_next/static/"))) {
  const body = await readFile(path.join(root, asset.split("?")[0].slice(1)), "utf8");
  for (const marker of forbidden) {
    if (body.toLowerCase().includes(marker)) throw new Error(`Forbidden marker ${marker} in ${asset}`);
  }
}

console.log(`Verified standby homepage with ${assets.length} local asset references`);
