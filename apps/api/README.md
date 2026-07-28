# @mpf/api

Express + Prisma API for Mobile Parts Compatibility Finder.

## Local setup (PostgreSQL)

```bash
# from repo root
npm install
npm run db:up        # start Postgres via Docker
npm run db:setup     # prisma db push + seed from data/*.csv
npm run api
```

Catalog CSVs live in repo-root `data/` (`brands`, `mobile_models`, `part_types`, `parts`, `compatibility`). Edit those files and re-run `npm run db:seed` to reload.

API runs at `http://localhost:3001` (bound to `0.0.0.0` for Expo Go on LAN).

Default connection (see `.env`):

```text
postgresql://mpf:mpf@localhost:5433/mpf?schema=public
```

Postgres runs in Docker on host port **5433** (avoids clashing with a local Postgres on 5432).

## Endpoints

- `GET /health`
- `GET /api/search?q=`
- `GET /api/brands/popular`
- `GET /api/brands/:id/models`
- `GET /api/mobile-models/recent`
- `GET /api/mobile-models/:id`
- `GET /api/mobile-models/:id/parts?type=`
- `GET /api/parts/:id`
- `GET /api/parts/:id/compatible-models`
- `GET /api/compatibility?modelId=&partId=`
