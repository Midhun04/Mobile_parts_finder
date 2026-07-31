# Catalog data

**Postgres + Admin is the source of truth.**

Day-to-day catalog work:

1. Admin dashboard → **Overview**
2. **Export CSV** to share a snapshot
3. **Upload CSV** to merge updates (preview, then apply)

Seed (`npm run db:seed`) only creates the admin user and default part types. It does **not** load brands/models/parts from files.
