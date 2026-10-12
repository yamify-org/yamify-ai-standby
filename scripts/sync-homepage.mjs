import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const source = "https://www.yamify.co";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function fetchRequired(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response;
}

async function saveAsset(assetPath) {
  const cleanPath = assetPath.split("?")[0];
  const destination = path.join(root, cleanPath.replace(/^\//, ""));
  const response = await fetchRequired(`${source}${assetPath}`);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return destination;
}

function collectAssets(text) {
  return [...new Set(text.match(/\/(?:_next\/static|svgs|images)\/[^"'\\<> )]+/g) ?? [])];
}

await rm(path.join(root, "_next", "static"), { recursive: true, force: true });

let html = await (await fetchRequired(`${source}/`)).text();
html = html
  .replace(/<meta name="robots"[^>]*>/gi, "")
  .replace("</head>", '<meta name="robots" content="noindex,nofollow"/></head>')
  .replace(/<link rel="canonical" href="[^"]*"\/>/i, '<link rel="canonical" href="https://www.yamify.co/"/>')
  .replaceAll(
    /\/_next\/image\?url=%2Fimages%2Fstealth%2Fyamify-stealth-logo\.jpg(?:&amp;|&)w=\d+(?:&amp;|&)q=75/g,
    "/images/stealth/yamify-stealth-logo.jpg",
  );

const initialAssets = collectAssets(html).filter((asset) => !asset.startsWith("/_next/image"));
const cssFiles = [];
for (const asset of initialAssets) {
  const destination = await saveAsset(asset);
  if (destination.endsWith(".css")) cssFiles.push(destination);
}

for (const cssFile of cssFiles) {
  const css = await readFile(cssFile, "utf8");
  for (const asset of collectAssets(css)) await saveAsset(asset);
}

await writeFile(path.join(root, "index.html"), html);
await writeFile(path.join(root, ".nojekyll"), "");
await writeFile(path.join(root, "CNAME"), "yamify.ai\n");

console.log(`Mirrored ${initialAssets.length} homepage assets from ${source}`);
