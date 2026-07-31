# Mobile Parts Compatibility Finder

A mobile application for mobile phone shop owners and technicians to quickly identify compatible spare parts for different mobile phone models.

The application allows users to search for a mobile phone model and find all compatible components such as displays, batteries, OCA glass, pouches, charging boards, and other spare parts.

---

## Monorepo Structure

```text
Mobile_parts_finder/
├── apps/
│   ├── mobile/          # Expo React Native app (@mpf/mobile)
│   ├── web/             # Next.js Parts Finder web app (@mpf/web)
│   ├── admin/           # Next.js admin dashboard (@mpf/admin) — planned
│   └── api/             # Node.js / Express API (@mpf/api) — PostgreSQL
├── packages/
│   └── shared/          # Shared types & constants (@mpf/shared)
├── data/                # Notes only — catalog lives in Postgres (Admin CSV import/export)
├── package.json         # npm workspaces root
└── README.md
```

---

## Project Overview

Mobile phone technicians and shop owners often need to identify compatible spare parts for a particular mobile model.

For example, when a technician searches for:

> Samsung Galaxy A50

The application can display:

- Compatible Display / Combo
- Compatible Battery
- Compatible OCA Glass
- Compatible Pouch / Back Panel
- Compatible Charging Board
- Compatible Camera
- Compatible Speaker
- Other compatible components

The application can also provide reverse compatibility search.

For example:

> Search: Battery BN-59

The application can show:

- Samsung Galaxy A50
- Samsung Galaxy A50s
- Other compatible mobile models

The main purpose of the application is to provide a centralized compatibility database for mobile repair shops and technicians.

---

## Project Goal

> **To help mobile phone technicians and shop owners quickly identify suitable spare parts for a particular mobile model.**

Instead of manually checking different catalogues, supplier websites, or physical records, users can search for a phone model and instantly view compatible parts.

---

## Target Users

- Mobile phone shop owners
- Mobile repair technicians
- Spare parts dealers
- Mobile wholesalers
- Service centres
- Spare parts inventory managers

---

## Application Type

### 1. Mobile Application (`apps/mobile`)

Used by mobile shop owners and technicians.

- React Native
- Expo
- TypeScript

### 2. Web Application (`apps/web`)

Same parts-finder experience in the browser.

- Next.js
- React
- TypeScript
- Tailwind CSS

### 3. Admin Web Dashboard (`apps/admin`)

Used to manage the compatibility database.

- Next.js
- React
- TypeScript
- Tailwind CSS

### 4. Backend API (`apps/api`)

- Node.js / Express
- TypeScript
- REST API
- PostgreSQL + Prisma

---

## System Architecture

```text
        ┌──────────────────┐     ┌──────────────────┐
        │ React Native App │     │   Web App        │
        │  (apps/mobile)   │     │  (apps/web)      │
        └────────┬─────────┘     └────────┬─────────┘
                 │ API Requests           │
                 └───────────┬────────────┘
                             ▼
                  ┌─────────────────────┐
                  │     Backend API     │
                  │     (apps/api)      │
                  │ Node.js / Express   │
                  └──────────┬──────────┘
                             ▼
                  ┌─────────────────────┐
                  │     PostgreSQL      │
                  └─────────────────────┘
                             ▲
                  ┌──────────┴──────────┐
                  │   Admin Dashboard   │
                  │    (apps/admin)     │
                  │      Next.js        │
                  └─────────────────────┘
```

Shared domain types live in `packages/shared` (`@mpf/shared`).

---

## Technology Stack

| Area | Stack |
|------|--------|
| Mobile | React Native, Expo, TypeScript, React Navigation, TanStack Query, Axios |
| Web | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript, REST API |
| Database | PostgreSQL, Prisma ORM |
| Admin | Next.js, React, TypeScript, Tailwind CSS |
| Auth | JWT |

---

## Getting Started

```bash
# install all workspaces
npm install

# start PostgreSQL (Docker)
npm run db:up

# push schema + seed catalog
npm run db:setup

# terminal 1 — API (http://localhost:3001, LAN-reachable)
npm run api

# terminal 2 — Expo app
npm run mobile

# or — web app (http://localhost:3000)
npm run web

# or — admin dashboard (http://localhost:3002)
npm run admin
```

Admin default login: `admin@mpf.local` / `admin123` (set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `apps/api/.env`).

For a physical phone, set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to your PC LAN IP (e.g. `http://192.168.0.86:3001`).

---

## Current Status

| Component | Path | Status |
|-----------|------|--------|
| Documentation | `README.md` | Done |
| Shared types | `packages/shared` | Done |
| Mobile app (API-backed) | `apps/mobile` | Done |
| Web app (API-backed) | `apps/web` | Done |
| Backend API (PostgreSQL) | `apps/api` | Done |
| PostgreSQL (Docker) | `docker-compose.yml` | Done |
| Admin dashboard | `apps/admin` | Done (MVP) |

---

## Main Features

### Mobile Model Search

Search by brand, model name, model number, or keywords.

### Two-way Compatibility Search

```text
Mobile Model → Compatible Parts
Spare Part   → Compatible Mobile Models
```

### Compatibility Group Concept

One part (e.g. A50 AMOLED Display) can link multiple models (A50, A50s, A50 5G).

---

## Database Design (planned)

### Brand / MobileModel / Part / Compatibility

See Prisma schema below for the intended API/database shape.

```prisma
model Brand {
  id      Int           @id @default(autoincrement())
  name    String        @unique
  models  MobileModel[]
}

model MobileModel {
  id              Int             @id @default(autoincrement())
  name            String
  modelNumber     String?
  brandId         Int
  brand           Brand           @relation(fields: [brandId], references: [id])
  compatibilities Compatibility[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model Part {
  id              Int             @id @default(autoincrement())
  name            String
  type            PartType
  partNumber      String?
  description     String?
  compatibilities Compatibility[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model Compatibility {
  id            Int         @id @default(autoincrement())
  mobileModelId Int
  partId        Int
  mobileModel   MobileModel @relation(fields: [mobileModelId], references: [id])
  part          Part         @relation(fields: [partId], references: [id])
  verified      Boolean     @default(false)
  notes         String?
  createdAt     DateTime    @default(now())

  @@unique([mobileModelId, partId])
}

enum PartType {
  DISPLAY
  BATTERY
  OCA
  POUCH
  CHARGING_BOARD
  CAMERA
  SPEAKER
  MICROPHONE
  FINGERPRINT
  HOUSING
  BACK_GLASS
  OTHER
}
```

---

## API Structure (planned)

```http
GET /api/mobile-models/search?q=galaxy+a50
GET /api/mobile-models/:id
GET /api/mobile-models/:id/parts
GET /api/parts/search?q=BN-59
GET /api/parts/:id/compatible-models
```

---

## MVP Phases

1. **Basic mobile app + API** — search, model/part details, PostgreSQL seed ✅
2. **Database management** — API + admin CRUD ✅
3. **More part types** — pouch, charging board, camera, speaker, etc. ✅ (catalog)
4. **Advanced** — barcode scanner, offline, favourites, submissions

---

## Final Project Definition

This project is a **mobile spare-parts compatibility database and search application**.

```text
React Native Mobile  +  Next.js Web  +  Node.js API  +  PostgreSQL  +  Next.js Admin
```

Core value: **Accurate data + simple search + fast compatibility results.**
