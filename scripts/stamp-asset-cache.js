/**
 * Stamp content-hash cache-busters onto homepage CSS/JS links and assets/version.json.
 *
 * Run after changing assets/styles.css or assets/catalogue.js (and before commit):
 *   node scripts/stamp-asset-cache.js
 */
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const cssPath = path.join(root, "assets", "styles.css");
const jsPath = path.join(root, "assets", "catalogue.js");
const htmlPath = path.join(root, "index.html");
const versionPath = path.join(root, "assets", "version.json");

function shortHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(buf).digest("hex").slice(0, 10);
}

const css = shortHash(cssPath);
const js = shortHash(jsPath);
const rev = crypto
  .createHash("sha1")
  .update(css + ":" + js)
  .digest("hex")
  .slice(0, 10);

const version = {
  rev: rev,
  css: css,
  js: js,
  stamped_at: new Date().toISOString(),
};

fs.writeFileSync(versionPath, JSON.stringify(version, null, 2) + "\n", "utf8");

let html = fs.readFileSync(htmlPath, "utf8");

if (!/name="prism-exemplars-assets"/.test(html)) {
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    (m) =>
      m +
      '\n    <meta name="prism-exemplars-assets" content="' +
      rev +
      '" />'
  );
} else {
  html = html.replace(
    /(<meta\s+name="prism-exemplars-assets"\s+content=")[^"]*("\s*\/?>)/i,
    "$1" + rev + "$2"
  );
}

html = html.replace(
  /href="assets\/styles\.css(?:\?v=[^"]*)?"/i,
  'href="assets/styles.css?v=' + css + '"'
);
html = html.replace(
  /src="assets\/catalogue\.js(?:\?v=[^"]*)?"/i,
  'src="assets/catalogue.js?v=' + js + '"'
);

fs.writeFileSync(htmlPath, html, "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      versionPath: path.relative(root, versionPath).replace(/\\/g, "/"),
      ...version,
    },
    null,
    2
  )
);
