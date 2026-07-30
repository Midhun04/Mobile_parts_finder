import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ensureAdminUser } from './adminAuth.js';
import { adminRouter } from './routes/admin.js';
import { apiRouter } from './routes/api.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: '@mpf/api' });
});

app.use('/api', apiRouter);
app.use('/api/admin', adminRouter);

async function start() {
  await ensureAdminUser();
  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on http://0.0.0.0:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API', error);
  process.exit(1);
});
