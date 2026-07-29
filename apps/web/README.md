# @mpf/web

Next.js web client for Mobile Parts Compatibility Finder — same search and compatibility flows as the mobile app, for browsers.

## Run

Start the API first (from repo root), then the web app:

```bash
npm run db:up
npm run db:setup   # once
npm run api
npm run web
```

Open [http://localhost:3000](http://localhost:3000).

Optional — set the API URL in `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Structure

```text
apps/web/
├── public/              # logo, favicon
├── src/
│   ├── app/             # App Router pages
│   ├── components/
│   └── lib/             # API client + helpers
└── .env.example
```

Pages:

| Route | Purpose |
|-------|---------|
| `/` | Home — search, popular brands, recent models |
| `/search?q=` | Two-way search results |
| `/brands/[id]` | Models for a brand |
| `/models/[id]` | Model details + part categories |
| `/models/[id]/compatibility/[type]` | Parts of a type + compatible models |
| `/parts/[id]` | Part details + compatible models |
