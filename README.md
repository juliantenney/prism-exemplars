# PRISM Exemplar Corpus

A static website of completed Learning Journey exemplars for lecturers, learning designers, and educational technologists.

The site emphasises the pedagogical designs these journeys demonstrate, described in terms of recognisable teaching needs.

## Public URL

[https://juliantenney.github.io/prism-exemplars/](https://juliantenney.github.io/prism-exemplars/)

## Local URL

With XAMPP running:

[http://localhost/prism-exemplars/](http://localhost/prism-exemplars/)

No build step, package manager, backend, or database. Static files only.

## Authority model

| Artefact | Role |
|----------|------|
| `journeys/<id>/manifest.json` | **Authoritative** metadata for one exemplar |
| Linked Markdown (`original-brief.md`, `design-notes.md`, `adaptation-prompt.md`) | Longer prose owned by that exemplar |
| `journeys/<id>/published/` | Complete published Learning Journey package |
| `catalogue.json` | **Generated** homepage index — regenerate from manifests; do not edit fields by hand as a second source of truth |

The homepage reads only `catalogue.json`. It does not scan the filesystem.

## Folder layout

```text
prism-exemplars/
  index.html
  catalogue.json
  assets/
    styles.css
    catalogue.js
  journeys/
    <id>/
      manifest.json
      original-brief.md          # only when a real original brief exists
      design-notes.md
      adaptation-prompt.md
      published/
        index.html
        …
  templates/
  docs/
```

## Procedures

- [Add an exemplar](docs/adding-an-exemplar.md)
- [Update an exemplar](docs/updating-an-exemplar.md)
- [Remove an exemplar](docs/removing-an-exemplar.md)
- [Metadata schema](docs/metadata-schema.md)

## Design rules

1. Extract facts from the PRISM project / published package when they are already present.
2. Ask the user only for essential gaps that cannot reasonably be established.
3. Keep retrospective design commentary in `design-notes.md` (and the adaptation prompt). Never present reconstructed text as the original commissioning brief.
4. Do not modify the source PRISM project when adding an exemplar to this corpus.
