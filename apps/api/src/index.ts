import 'dotenv/config';
import { app } from './app.js';

const port = Number(process.env.PORT ?? 3001);

if (!process.env.VERCEL) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on http://0.0.0.0:${port}`);
  });
}

export default app;
