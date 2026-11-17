# Updating an exemplar

Use when an existing corpus entry needs refreshed package files, corrected metadata, or improved commentary.

## Rules

- **Preserve `id`** and the folder name `journeys/<id>/` unless explicitly migrating (rare). Renaming `id` requires remove + re-add or a coordinated folder rename plus catalogue regeneration.
- **Authoritative edits** happen in `journeys/<id>/manifest.json` and linked Markdown files — not by editing `catalogue.json` alone.
- **Do not rewrite `original-brief.md`** to invent or “improve” a missing original. If a genuine original brief was newly supplied, add it and set `original_brief`; if it was never available, keep `null`.
- **Do not modify** the source PRISM project as part of the corpus update (unless the user separately asks to change PRISM).
- **Do not invent** QA outcomes or validation evidence. Changing `status` to `validated` requires user confirmation and available evidence.

## Steps

1. Identify the exemplar folder (`journeys/<id>/`) from the title or `id`.
2. Inspect what changed: published package, metadata fields, and/or prose files.
3. If the published Learning Journey changed, replace `published/` with a complete fresh copy (preserve relative paths; entry remains `published/index.html`).
4. Update `manifest.json` fields that must change. Keep origins accurate (extracted / user_supplied / commentary).
5. Update `design-notes.md` and/or `adaptation-prompt.md` when commentary should change.
6. Regenerate `catalogue.json` with `node scripts/regenerate-catalogue.js` (same procedure as [adding-an-exemplar.md](adding-an-exemplar.md) step 9). To change the homepage “current PRISM version”, edit `assets/site.json` before regenerating.
7. If `assets/styles.css` or `assets/catalogue.js` changed, run `node scripts/stamp-asset-cache.js` so GitHub Pages visitors pick up new homepage assets without a hard refresh.
8. Verify the homepage card, launch link, brief expand (if any), and adaptation prompt copy.

## Partial updates

| Change | Touch |
|--------|--------|
| Metadata wording only | `manifest.json` → regenerate catalogue |
| Commentary only | `design-notes.md` / `adaptation-prompt.md` (catalogue only if paths change) |
| Published package only | Replace `published/` → verify launch |
| Status | `manifest.json` `status` → regenerate catalogue |
