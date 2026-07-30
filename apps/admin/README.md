# Admin Dashboard

Next.js admin for brands, models, parts, compatibility groups, and verification.

**Status:** Implemented (MVP)  
**Full plan:** [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md)

## Run

```bash
# API must be running (creates default admin on boot if missing)
npm run api

# Admin UI — http://localhost:3002
npm run admin
```

Default login (override via `apps/api/.env`):

- Email: `admin@mpf.local`
- Password: `admin123`

Set `NEXT_PUBLIC_API_URL` in `apps/admin/.env.local` if the API is not on `http://localhost:3001`.
