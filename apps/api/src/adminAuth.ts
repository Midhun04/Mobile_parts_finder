import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'mpf-dev-jwt-secret-change-me';
const TOKEN_TTL = '7d';

export type AdminTokenPayload = {
  sub: number;
  email: string;
  role: string;
};

export type AuthedRequest = Request & {
  admin?: AdminTokenPayload;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(user: { id: number; email: string; role: string }): string {
  const payload: AdminTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as AdminTokenPayload;
    if (!decoded?.sub || !decoded.email) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function ensureAdminUser(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@mpf.local').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return;

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${email}`);
}
