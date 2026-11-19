# Exemplar metadata schema

Each exemplar’s authoritative metadata lives in:

`journeys/<id>/manifest.json`

Longer prose lives in sibling Markdown files referenced by path. Do not duplicate large project payloads in the manifest.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Stable, filesystem-safe identifier. Lowercase letters, digits, hyphens. Matches the folder name under `journeys/`. |
| `title` | string | yes | Learning Journey title. |
| `teaching_need` | string | yes | The problem or requirement that motivated the design. |
| `intended_capability` | string | yes | What learners should become better able to do. |
| `summary` | string | yes | Short description for catalogue readers. |
| `primary_pattern` | string | yes | Principal pedagogical design mechanism. |
| `supporting_patterns` | string[] | yes | Other relevant mechanisms (may be empty). |
| `learning_sequence` | string[] | yes | Ordered short descriptions of learner activities. |
| `transferable_principle` | string | yes | What another lecturer could reuse. |
| `product_count` | number | yes | Number of constituent products. |
| `duration_minutes` | number \| null | yes | Approximate total duration in minutes, or `null` if unknown. |
| `status` | string | yes | `candidate` or `validated`. |
| `created_with_prism_version` | string \| null | yes | PRISM version used to create the exemplar when reliably known (e.g. `Beta 0.9`). Use `null` when unrecorded. Do not infer from ZIP rebuild date, runtime bundle, or publication date. |
| `launch` | string | yes | Path to the published entry point, relative to the exemplar folder. Normally `published/index.html`. |
| `original_brief` | string \| null | yes | Relative path to the original commissioning brief Markdown, or `null` if none exists. |
| `prism_ready_brief` | string \| null | recommended | Relative path to the current **PRISM-ready** Workflow Basics brief. Preferred for copying into the current application; do not replace `original_brief`. |
| `adaptation_prompt` | string | yes | Relative path to the reusable consultation prompt Markdown. |
| `design_notes` | string | recommended | Relative path to retrospective design notes Markdown. |

Optional drafting aid (strip before publishing if preferred):

| Field | Description |
|-------|-------------|
| `_field_origins` | Map of field → `extracted` \| `user_supplied` \| `commentary`. |

## Field origins

Distinguish clearly:

1. **Extracted** — facts taken from the PRISM project, Design Page, workflow brief, or published package (e.g. title, product count, commission order, launch path, a real stored brief).
2. **User-supplied** — information provided when it cannot reasonably be established from the project (e.g. teaching need wording, status).
3. **Retrospective commentary** — design interpretation written for the corpus (patterns, transferable principle, adaptation prompt). Store in `design-notes.md` / `adaptation-prompt.md`; never label it as the original brief.

### Original brief rule

- If an original commissioning brief is available in the supplied materials, save it as `original-brief.md` (or similarly named) and set `original_brief` to that path.
- If it is **not** available, set `original_brief` to `null`. Do **not** invent, reconstruct, or paraphrase a brief and call it original.
- Never present design notes or adaptation prompts as the original brief.
- Keep historical briefs verbatim in `original-brief.md`. Provide a current-form mapping as `prism-ready-brief.md` (referenced by `prism_ready_brief`) using the Workflow Basics field labels in order: Workflow name; Domain; What are you creating?; Learning time; Duration; What should this cover?; Who is this for?; Starting point (optional); Scope and constraints.

## Site version

Current PRISM version for the homepage is maintained in:

`assets/site.json` → `current_prism_version`

Regenerate the catalogue after changing it:

```text
node scripts/regenerate-catalogue.js
```

## Catalogue index

`catalogue.json` is regenerated from manifests and `assets/site.json`. It includes:

- `current_prism_version` — copied from `assets/site.json`
- one object per exemplar with the flat homepage fields, plus:
  - `path` — relative path to the exemplar folder (e.g. `journeys/<id>/`)
  - `manifest` — relative path to `manifest.json`

Do not maintain independent edited copies of the same fields in `catalogue.json`.

Homepage display rules:

- Intro shows **Current PRISM version: {current_prism_version}**
- Each card shows **Created with: PRISM {created_with_prism_version}** when set
- When `created_with_prism_version` is `null`/empty, the card shows **Created with: Earlier PRISM version (unrecorded)**

## Homepage launch URL

From the site root, the browser launch link is:

`{path}{launch}` → e.g. `journeys/example-id/published/index.html`
