/**
 * build.mjs — builds the bundle and stamps index.html with a fresh
 * cache-busting version string so browsers always load the latest JS/CSS.
 * Run:  node build.mjs          (production build + version stamp)
 *       node build.mjs --dev    (version stamp only, then hand off to esbuild serve)
 */
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const v = Date.now();
const isDev = process.argv.includes("--dev");

// Stamp index.html — replace any existing ?v=... or add one
let html = readFileSync("index.html", "utf8");
html = html
  .replace(/(bundle\.js)(\?v=\d+)?/g,  `$1?v=${v}`)
  .replace(/(app\.css)(\?v=\d+)?/g,    `$1?v=${v}`);
writeFileSync("index.html", html);
console.log(`[build] version stamp: v=${v}`);

if (!isDev) {
  execSync(
    "npx esbuild src/main.jsx --bundle --outfile=dist/bundle.js" +
    " --format=esm --loader:.js=jsx --jsx=automatic",
    { stdio: "inherit" }
  );
  console.log("[build] done ✓");
}
