import "dotenv/config";

import cors from "cors";
import express from "express";
import { z } from "zod";

import { createSessionToken, ensureUser, getUserFromToken, loginSchema, verifyPassword } from "./auth";
import { prisma } from "./prisma";

const app = express();
app.use(express.json());

const corsOrigins = [
  process.env.CORS_ORIGIN_WEBSITE,
  process.env.CORS_ORIGIN_MOBILE_WEB,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);

function getBearerToken(req: express.Request) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const [kind, token] = auth.split(" ");
  if (kind?.toLowerCase() !== "bearer") return null;
  return token || null;
}

async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "Missing Authorization bearer token" });
  try {
    const user = await getUserFromToken(token);
    if (!user) return res.status(401).json({ error: "Invalid session" });
    (req as any).user = user;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function adminOnly(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = (req as any).user as { role: "USER" | "ADMIN"; email: string } | undefined;
  if (!user) return res.status(401).json({ error: "Unauthenticated" });
  if (user.role !== "ADMIN") return res.status(403).json({ error: "Admin only" });
  return next();
}

app.get("/health", (_req, res) => res.json({ ok: true }));

// Optional bootstrap: creates a user record if not present (useful for admin emails on first login attempt).
app.post("/auth/bootstrap", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const user = await ensureUser(parsed.data.email, parsed.data.password);
  res.json({ id: user.id, email: user.email, role: user.role });
});

app.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  // If user doesn't exist yet, create them on first login attempt (dev-friendly).
  await ensureUser(parsed.data.email, parsed.data.password);
  const user = await verifyPassword(parsed.data.email, parsed.data.password);
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const { token } = await createSessionToken(user.id);
  res.json({
    token,
    user: { email: user.email, role: user.role },
  });
});

app.get("/me", authMiddleware, async (req, res) => {
  const user = (req as any).user as { email: string; role: string };
  res.json({ email: user.email, role: user.role });
});

// Public product list
app.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({ where: { active: true }, orderBy: { updatedAt: "desc" } });
  res.json({ products });
});

// Admin product management
const productUpsertSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

app.post("/products", authMiddleware, adminOnly, async (req, res) => {
  const parsed = productUpsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.product.create({ data: parsed.data });
  res.json({ product: created });
});

app.put("/products/:id", authMiddleware, adminOnly, async (req, res) => {
  const parsed = productUpsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.product.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ product: updated });
});

app.delete("/products/:id", authMiddleware, adminOnly, async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}`);
});

