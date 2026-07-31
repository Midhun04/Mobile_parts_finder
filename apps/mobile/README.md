# @mpf/mobile

Expo React Native client for Mobile Parts Compatibility Finder.

## Run

Start the API first (from repo root), then the app:

```bash
npm run db:up      # Postgres
npm run db:setup   # once
npm run api
npm run mobile
```

Set your PC LAN IP in `apps/mobile/.env` (required for Expo Go on a physical device):

```env
EXPO_PUBLIC_API_URL=http://192.168.0.86:3001
```

## Structure

```text
apps/mobile/
├── App.tsx
├── .env
└── src/
    ├── api/                 # Axios client + endpoints
    ├── components/
    ├── navigation/
    ├── screens/
    ├── theme/
    └── utils/
```

Data is loaded from `@mpf/api` via TanStack Query.
