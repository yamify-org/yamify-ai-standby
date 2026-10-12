import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");

const required = [
  "OpenAI-compatible inference for African regions",
  'name="robots" content="noindex,nofollow"',
  'rel="canonical" href="https://www.yamify.co/"',
];

for (const marker of required) {
  if (!html.includes(marker)) throw new Error(`Missing homepage invariant: ${marker}`);
}

const assets = [...new Set(html.match(/\/(?:_next\/static|svgs|images)\/[^"'\\<> )]+/g) ?? [])];
const missing = assets.filter((asset) => !existsSync(path.join(root, asset.split("?")[0].slice(1))));
if (missing.length) throw new Error(`Missing local assets:\n${missing.join("\n")}`);

console.log(`Verified standby homepage with ${assets.length} local asset references`);
