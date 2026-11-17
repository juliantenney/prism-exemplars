# Adding an exemplar

Use this procedure when asked:

> Here's a completed Learning Journey. Add it to the exemplar corpus.

Do **not** modify the source PRISM project. Do **not** invent missing original briefs, QA outcomes, or validation evidence.

## Preconditions

- Corpus root: sibling of the PRISM app at `htdocs/prism-exemplars/` (typically `C:\xampp\htdocs\prism-exemplars\`).
- Schema: [metadata-schema.md](metadata-schema.md)
- Templates: `templates/exemplar-manifest.json`, `templates/design-notes.md`, `templates/adaptation-prompt.md`

## Steps

### 1. Inspect the supplied materials

Locate and inspect:

- The PRISM workflow / project export (Design Page, commissions, workflow brief if present).
- The **published** Learning Journey package (unified shell with root `index.html`, `runtime/`, `media/`, optional `lib/`).

Confirm the package opens locally via its root `index.html` and that relative asset paths resolve inside the package.

### 2. Extract available metadata

From project and package data, extract rather than re-ask:

| Prefer extract | Typical source |
|----------------|----------------|
| `title` | Design Page `title` / package home title |
| `product_count` | `commissions.length` or published resources |
| `learning_sequence` | Commission titles / order from Design Page |
| `duration_minutes` | Workflow brief `duration` / `learningTime` when present |
| `launch` | Always `published/index.html` after copy |

Record origin as **extracted** for these fields.

### 3. Identify the original commissioning brief

If the materials include a clear original commissioning brief (author-supplied brief document or unambiguous stored brief), keep it for step 8.

If none is present, leave `original_brief` as `null`. Do not reconstruct one.

### 4. Identify pedagogical patterns and sequence

Derive `learning_sequence` from the actual commission / activity order.

Propose `primary_pattern`, `supporting_patterns`, and `transferable_principle` from the **actual design**, as retrospective commentary. These are not facts claimed as original brief content.

### 5. Ask only for essential gaps

Ask the user only when a field cannot reasonably be established, typically:

- `teaching_need`
- `intended_capability`
- `summary` (if no suitable short description exists)
- `status` (`candidate` vs `validated`) — never invent validation evidence
- `duration_minutes` if absent from project data
- Confirmation of pattern / transferable-principle wording if uncertain

Do not ask for information already present in the export.

### 6. Create a stable exemplar folder

Choose `id`: lowercase, filesystem-safe, stable (e.g. slug of the title). Folder:

```text
journeys/<id>/
```

### 7. Copy the published package

Copy the **complete** published package into:

```text
journeys/<id>/published/
```

Preserve relative paths. Entry point must be `published/index.html`.

### 8. Save manifest and prose files

From `templates/`:

1. Write `manifest.json` (authoritative fields per schema).
2. If an original brief exists, save it as `original-brief.md` and set `original_brief` to that filename; otherwise `null`.
3. Write `design-notes.md` using the template sections (extracted / user-supplied / commentary).
4. Write `adaptation-prompt.md` filled for this exemplar (consultation prompt, not an original brief).

Set `launch` to `published/index.html`.

Set `created_with_prism_version` to the known PRISM creation version (for example `"Beta 0.9"`), or `null` when unrecorded. Do not infer it from ZIP rebuild date, runtime bundle, or publication date.

### 9. Regenerate the catalogue

```text
node scripts/regenerate-catalogue.js
```

This rebuilds `catalogue.json` from every `journeys/*/manifest.json` and copies `current_prism_version` from `assets/site.json`. Do not hand-edit catalogue fields as a second source of truth.

### 10. Homepage asset cache (when CSS/JS changed)

If this change also edited `assets/styles.css` or `assets/catalogue.js`, run:

```text
node scripts/stamp-asset-cache.js
```

This refreshes content-hash query strings and `assets/version.json` so GitHub Pages clients are less likely to keep a stale homepage shell.

### 11. Verify

1. Open `http://localhost/prism-exemplars/`.
2. Confirm the new card appears with teaching need, capability, patterns, and transferable principle.
3. Confirm **Launch** opens the journey (`journeys/<id>/published/index.html`).
4. If `original_brief` is set, expand the brief section and confirm content loads.
5. Confirm the adaptation prompt copies successfully.
6. Confirm the source PRISM project was not modified.

## Done when

The exemplar is reachable from the homepage via catalogue data only, with no hardcoded exemplar copy in `index.html` or `catalogue.js`.
