# Admin Dashboard — Spec & Plan

**App:** `@mpf/admin` (`apps/admin`)  
**Stack:** Next.js · React · TypeScript · Tailwind CSS  
**Backend:** existing Express API (`apps/api`) + PostgreSQL + Prisma  
**Status:** Implemented (MVP) — see [README.md](./README.md) for how to run.

---

## Why this exists

Today the catalog is managed in **Postgres via the Admin dashboard** (CRUD + CSV import/export).

Older bootstrap (Python builders → matrix CSV → wipe-seed) has been removed.

---

## Principles

1. **DB is live catalog** — everyday adds/edits happen in admin, not in CSV.
2. **Groups are first-class** — “same part for many phones” is a `CompatibilityGroup`, not a string.
3. **Non-destructive seeds** — seed only for empty DB / one-time migration; never wipe production data.
4. **Read-only public API stays** — mobile/web keep GET routes; admin uses authenticated write routes.
5. **Import is a tool, not the CMS** — bulk CSV/JSON upload is optional; not the daily workflow.

---

## Users & auth

| Role | Access |
|------|--------|
| **Admin** | Full CRUD on brands, models, parts, groups, compatibility |
| **Editor** (optional later) | CRUD parts/compat; no brand delete / no user management |
| **Viewer** (optional later) | Read-only catalog browser |

**Auth (MVP):**

- JWT login against API (`POST /api/admin/auth/login`)
- Protect all `/api/admin/*` write routes
- Store admin users in DB (`AdminUser`: email, password hash, role)
- Session: HTTP-only cookie or Bearer token in admin app

Public mobile/web apps do **not** get admin credentials.

---

## Information architecture

```text
Admin Dashboard
├── Login
├── Overview (counts, recent edits, unverified compat)
├── Brands
│   └── Brand detail → models list
├── Models
│   ├── Model list (search / filter by brand)
│   └── Model detail → compatible parts by type
├── Part types
├── Parts
│   ├── Part list (search / filter by type)
│   └── Part detail → compatible models + edit links
├── Compatibility groups   ← core workflow
│   ├── Group list (by part type)
│   └── Group detail → member models + linked Part
├── Compatibility links
│   └── Verify / notes / remove
└── Catalog CSV (Overview) — export snapshot / merge upload
```

---

## Core workflows

### A. Add a new phone model

1. Ensure brand exists (or create brand).
2. Add model: name, model number, release year, aliases (optional).
3. From model page, attach existing parts **or** create/open a compatibility group.

### B. Add a shared part (main workflow)

1. Create a **Compatibility Group** for a part type (e.g. Display).
2. Set name / supplier code / notes.
3. Add member models (multi-select search).
4. System creates or updates one `Part` and `Compatibility` rows for all members.
5. Mark verified when confirmed from a supplier / shop floor.

### C. Fix a wrong link

1. Open model or part → remove bad compatibility.
2. Or open group → remove model from group (auto-removes compat for that part).

### D. Bulk onboard from a supplier list

1. Paste / upload list of model names for one part type.
2. Admin resolves unmatched names (aliases / create model).
3. Creates one group + part + compat links.

---

## Data model

### Existing (keep)

```text
Brand → MobileModel
PartCategory (PartType) → Part
Compatibility (MobileModel ↔ Part, verified, notes)
```

### Add for admin

```prisma
model AdminUser {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  role         String   @default("ADMIN") // ADMIN | EDITOR | VIEWER
  createdAt    DateTime @default(now())
}

model ModelAlias {
  id            Int         @id @default(autoincrement())
  mobileModelId Int
  mobileModel   MobileModel @relation(fields: [mobileModelId], references: [id])
  alias         String
  @@unique([alias])
}

model CompatibilityGroup {
  id          Int      @id @default(autoincrement())
  name        String
  partTypeId  Int
  partType    PartCategory @relation(fields: [partTypeId], references: [id])
  supplierCode String?
  notes       String?
  partId      Int?     @unique  // the Part that represents this group
  part        Part?    @relation(fields: [partId], references: [id])
  members     CompatibilityGroupMember[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CompatibilityGroupMember {
  id        Int                 @id @default(autoincrement())
  groupId   Int
  group     CompatibilityGroup  @relation(fields: [groupId], references: [id], onDelete: Cascade)
  modelId   Int
  model     MobileModel         @relation(fields: [modelId], references: [id])
  @@unique([groupId, modelId])
}
```

**IDs:** Prefer `@default(autoincrement())` for new admin-created rows. Existing CSV integer IDs can remain; migration should not renumber live data.

**Group → Part sync rule:**

- Creating/updating a group upserts one `Part` (name derived from group name / members).
- Membership changes upsert/delete `Compatibility` rows for that `partId`.
- Deleting a group optionally deletes the orphan part if unused elsewhere.

---

## API surface (admin)

All under `/api/admin`, JWT required.

### Auth

```http
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
GET    /api/admin/auth/me
```

### Brands & models

```http
GET    /api/admin/brands
POST   /api/admin/brands
PATCH  /api/admin/brands/:id
DELETE /api/admin/brands/:id

GET    /api/admin/models?q=&brandId=
POST   /api/admin/models
GET    /api/admin/models/:id
PATCH  /api/admin/models/:id
DELETE /api/admin/models/:id
POST   /api/admin/models/:id/aliases
```

### Part types & parts

```http
GET    /api/admin/part-types
POST   /api/admin/part-types
PATCH  /api/admin/part-types/:id

GET    /api/admin/parts?q=&partTypeId=
POST   /api/admin/parts
GET    /api/admin/parts/:id
PATCH  /api/admin/parts/:id
DELETE /api/admin/parts/:id
```

### Compatibility

```http
POST   /api/admin/compatibility          # { mobileModelId, partId, verified?, notes? }
PATCH  /api/admin/compatibility/:id
DELETE /api/admin/compatibility/:id
```

### Groups (preferred write path)

```http
GET    /api/admin/groups?partTypeId=
POST   /api/admin/groups
GET    /api/admin/groups/:id
PATCH  /api/admin/groups/:id
DELETE /api/admin/groups/:id
POST   /api/admin/groups/:id/members     # { modelIds: number[] }
DELETE /api/admin/groups/:id/members/:modelId
```

### Import / export (later)

```http
POST   /api/admin/import/csv
POST   /api/admin/import/group-list      # paste list → draft group
GET    /api/admin/export/catalog
```

Public GET routes for mobile/web remain unchanged.

---

## UI screens (MVP)

### 1. Overview

- Counts: brands, models, parts, compat links, unverified count
- Recent changes (last 20)
- Quick actions: Add model, Add group, Verify queue

### 2. Models

- Searchable table: brand, name, model number, part count
- Detail: list parts by type; “Add to group” / “Link part”
- Create / edit form

### 3. Parts

- Filter by type; search name / part number
- Detail: compatible models table; toggle verified; notes
- Create / edit form (type, name, part number, manufacturer, description)

### 4. Compatibility groups

- List by part type
- Detail: member chips/table, linked part preview, sync status
- Create wizard:
  1. Part type + name
  2. Select models
  3. Review → save (creates part + links)

### 5. Verify queue

- List `Compatibility` where `verified = false`
- Bulk mark verified / add notes / remove

### Design notes

- Match admin utility UI (dense tables, filters) — not the consumer marketing look
- Mobile-usable tables for quick edits on a tablet in a shop
- Confirm dialogs on delete; soft-block delete if model has many links

---

## Migration from CSV / scripts

Historical bootstrap (Python builders → CSVs → wipe-seed) has been removed.
**Postgres + Admin CSV import/export** is the catalog source of truth.

---

## Implementation phases

### Phase A — Scaffold (week 1)

- [ ] Scaffold Next.js app in `apps/admin` (App Router, Tailwind)
- [ ] Wire `@mpf/shared` types
- [ ] Login page + auth guard
- [ ] `AdminUser` + JWT admin routes
- [ ] Overview page with live counts from API

### Phase B — Core CRUD (week 2–3)

- [ ] Brands / models CRUD UI + API
- [ ] Parts + part types CRUD UI + API
- [ ] Compatibility attach / detach / verify
- [ ] Non-destructive seed policy

### Phase C — Groups (week 3–4)

- [ ] Schema: `CompatibilityGroup` + members
- [ ] Group CRUD + member sync → Part + Compatibility
- [ ] Paste-list import for one group
- [ ] Verify queue screen

### Phase D — Harden

- [ ] Audit log (who changed what) — optional
- [ ] Export CSV snapshot
- [ ] Model aliases for better search matching
- [ ] Role-based access (Editor / Viewer)
- [ ] Deploy admin behind VPN or IP allowlist

---

## Repo layout (target)

```text
apps/admin/
├── ADMIN_DASHBOARD.md      # this file
├── README.md
├── package.json
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # overview
│   │   │   ├── brands/
│   │   │   ├── models/
│   │   │   ├── parts/
│   │   │   ├── groups/
│   │   │   └── verify/
│   │   └── api/                      # optional BFF proxies
│   ├── components/
│   ├── lib/api.ts                    # calls apps/api
│   └── lib/auth.ts
```

Root scripts (add when ready):

```bash
npm run admin          # next dev for apps/admin
```

---

## Success criteria

- Add a new model and link a shared display **without** touching CSV or Python
- Create a compatibility group of N models in under 2 minutes
- Fix a wrong compat link in under 30 seconds
- Seed no longer deletes production catalog data
- Mobile/web apps keep working with zero public write access

---

## Out of scope (for later)

- Public user submissions / crowdsourcing
- Barcode / OCR part intake
- Multi-tenant shops
- Full CMS for marketing content

---

## Related docs

- Root roadmap: `README.md` → MVP Phase 2 (Database management)
- Catalog notes: `data/README.md`
- Shared types: `packages/shared`
- API: `apps/api`
