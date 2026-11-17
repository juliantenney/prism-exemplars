/**
 * Rebuild catalogue.json from journey manifests and assets/site.json.
 *
 * Usage:
 *   node scripts/regenerate-catalogue.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const journeysRoot = path.join(root, "journeys");
const sitePath = path.join(root, "assets", "site.json");
const cataloguePath = path.join(root, "catalogue.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const site = fs.existsSync(sitePath) ? readJson(sitePath) : {};
const currentPrismVersion = String(site.current_prism_version || "").trim() || null;

const ids = fs
  .readdirSync(journeysRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const exemplars = ids
  .map((id) => {
    const manifestPath = path.join(journeysRoot, id, "manifest.json");
    if (!fs.existsSync(manifestPath)) return null;
    const m = readJson(manifestPath);
    const { _field_origins, ...fields } = m;
    if (
      !Object.prototype.hasOwnProperty.call(fields, "created_with_prism_version")
    ) {
      fields.created_with_prism_version = null;
    }
    return {
      ...fields,
      path: "journeys/" + id + "/",
      manifest: "journeys/" + id + "/manifest.json"
    };
  })
  .filter(Boolean)
  .sort((a, b) => String(a.title).localeCompare(String(b.title)));

const catalogue = {
  generated_at: new Date().toISOString(),
  current_prism_version: currentPrismVersion,
  exemplars: exemplars
};

fs.writeFileSync(cataloguePath, JSON.stringify(catalogue, null, 2) + "\n", "utf8");
console.log(
  JSON.stringify(
    {
      ok: true,
      current_prism_version: currentPrismVersion,
      count: exemplars.length,
      ids: exemplars.map((e) => e.id),
      recorded: exemplars
        .filter((e) => e.created_with_prism_version)
        .map((e) => e.id),
      unrecorded: exemplars
        .filter((e) => !e.created_with_prism_version)
        .map((e) => e.id)
    },
    null,
    2
  )
);
