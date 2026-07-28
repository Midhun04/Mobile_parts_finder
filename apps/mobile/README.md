# @mpf/mobile

Expo React Native client for Mobile Parts Compatibility Finder.

## Run

From the **repo root**:

```bash
npm install
npm run mobile
```

Or from this package:

```bash
npm run start
```

## Structure

```text
apps/mobile/
├── App.tsx
├── index.ts
├── app.json
├── metro.config.js          # monorepo-aware Metro
└── src/
    ├── components/
    ├── data/mockData.ts     # Phase 1 mock compatibility data
    ├── navigation/
    ├── screens/
    ├── services/
    └── theme/
```

Shared types come from `@mpf/shared`.
