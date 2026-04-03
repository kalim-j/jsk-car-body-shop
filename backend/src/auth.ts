import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { prisma } from "./prisma";

export const ADMIN_EMAILS = new Set([
  "jskjageer@gmail.com",
  "kalimdon07@gmail.com",
]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return "dev-change-me";
  return secret;
}

export async function ensureUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const role = ADMIN_EMAILS.has(normalizedEmail) ? "ADMIN" : "USER";

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email: normalizedEmail, passwordHash, role },
  });
}

export async function verifyPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  // Keep role aligned to the admin email allowlist.
  const desiredRole = ADMIN_EMAILS.has(normalizedEmail) ? "ADMIN" : "USER";
  if (user.role !== desiredRole) {
    return prisma.user.update({ where: { id: user.id }, data: { role: desiredRole } });
  }

  return user;
}

export async function createSessionToken(userId: string) {
  // Save login/session in DB
  const session = await prisma.session.create({ data: { userId } });
  const token = jwt.sign({ sid: session.id }, getJwtSecret(), { expiresIn: "30d" });
  return { token, sessionId: session.id };
}

export async function getUserFromToken(token: string) {
  const decoded = jwt.verify(token, getJwtSecret()) as { sid: string };
  const session = await prisma.session.findUnique({
    where: { id: decoded.sid },
    include: { user: true },
  });
  if (!session) return null;
  return session.user;
}

