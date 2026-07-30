# Catalog data (CSV)

**Bootstrap / import source.** Day-to-day edits should go through the **admin dashboard** (`apps/admin`) — PostgreSQL is the live catalog.

CSVs are still used by `apps/api/prisma/seed.ts`:

- Empty database → seed loads CSVs automatically
- Existing catalog → seed **skips wipe** unless `SEED_WIPE=1`

```text
data/
├── brands.csv
├── mobile_models.csv
├── part_types.csv
├── parts.csv
├── compatibility.csv
└── model_part_matrix.csv   # per-model shared-part research (imported into catalog)
```

After editing the relational CSVs, re-seed:

```bash
npm run db:seed
```

To (re)merge the model-part matrix into catalog CSVs:

```bash
python scripts/import-model-part-matrix.py
```
