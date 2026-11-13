# Removing an exemplar

## Steps

1. Confirm the exemplar `id` and folder `journeys/<id>/` with the user if ambiguous.
2. Delete the entire folder `journeys/<id>/` (manifest, prose files, and `published/` package).
3. Regenerate `catalogue.json` from the remaining `journeys/*/manifest.json` files (same shape as [adding-an-exemplar.md](adding-an-exemplar.md) step 9). If no exemplars remain, write an empty list:

```json
{
  "generated_at": "<ISO-8601 timestamp>",
  "exemplars": []
}
```

4. Verify `http://localhost/prism-exemplars/` no longer shows the entry (empty state if none remain).
5. Do not leave orphaned paths in `catalogue.json`. Do not modify the source PRISM project.

## Note

Removal is corpus-only. It does not delete the original PRISM workflow or any external backups of the published package.
