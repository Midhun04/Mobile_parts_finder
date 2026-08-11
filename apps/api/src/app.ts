import cors from 'cors';
import express from 'express';
import { ensureAdminUser } from './adminAuth.js';
import { adminRouter } from './routes/admin.js';
import { apiRouter } from './routes/api.js';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: '@mpf/api' });
});

let adminReady: Promise<void> | null = null;

function ensureAdminOnce(): Promise<void> {
  if (!adminReady) {
    adminReady = ensureAdminUser().catch((error) => {
      adminReady = null;
      throw error;
    });
  }
  return adminReady;
}

app.use((req, res, next) => {
  if (req.path === '/health') {
    next();
    return;
  }
  ensureAdminOnce()
    .then(() => next())
    .catch(next);
});

app.use('/api', apiRouter);
app.use('/api/admin', adminRouter);
