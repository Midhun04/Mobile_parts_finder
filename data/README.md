# Catalog data (CSV)

Source of truth for brands, models, part types, parts, and compatibility.

Loaded by `apps/api/prisma/seed.ts` via `npm run db:seed`.

```text
data/
├── brands.csv
├── mobile_models.csv
├── part_types.csv
├── parts.csv
└── compatibility.csv
```

After editing CSVs, re-seed:

```bash
npm run db:seed
```
