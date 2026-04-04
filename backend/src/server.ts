import "dotenv/config";

import cors from "cors";
import express from "express";
import { z } from "zod";

import { createSessionToken, ensureUser, getUserFromToken, loginSchema, signupSchema, verifyPassword } from "./auth.js";
import { prisma } from "./prisma.js";

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
  const user = (req as any).user;
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

app.post("/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.trim().toLowerCase() } });
  if (existing) return res.status(400).json({ error: "Email already in use" });

  const user = await ensureUser(parsed.data.email, parsed.data.password, parsed.data.name);
  const { token } = await createSessionToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// ── Cars Marketplace ────────────────────────────────────────────────────────

const carFilterSchema = z.object({
  state: z.string().optional(),
  district: z.string().optional(),
  brand: z.string().optional(), // Can also be comma separated
  condition: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});

app.get("/cars", async (req, res) => {
  const { state, district, brand, condition, minPrice, maxPrice } = req.query as Record<string, string>;
  const brandList = brand ? (typeof brand === 'string' ? brand.split(',') : brand) : [];

  const cars = await prisma.car.findMany({
    where: {
      status: "Approved",
      ...(state && { state }),
      ...(district && { district }),
      ...(condition && { condition }),
      ...(brandList.length > 0 && { brand: { in: brandList as string[] } }),
      ...(minPrice && { price: { gte: Number(minPrice) } }),
      ...(maxPrice && { price: { lte: Number(maxPrice) } }),
    },
    include: {
      seller: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ cars });
});

const uploadCarSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().int().min(0),
  condition: z.enum(["New", "Used", "Repaired"]),
  images: z.array(z.string()).default([]),
  state: z.string().min(1),
  district: z.string().min(1),
});

app.post("/cars/sell", authMiddleware, async (req, res) => {
  const parsed = uploadCarSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  const user = (req as any).user;
  const created = await prisma.car.create({
    data: {
      ...parsed.data,
      images: JSON.stringify(parsed.data.images),
      sellerId: user.id,
      sellerType: user.role === "ADMIN" ? "Dealer" : "User",
      // Admins auto-approve their own uploads
      status: user.role === "ADMIN" ? "Approved" : "Pending"
    }
  });

  res.json({ car: created });
});

app.get("/admin/cars", authMiddleware, adminOnly, async (_req, res) => {
  const cars = await prisma.car.findMany({
    include: {
      seller: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json({ cars });
});

app.put("/admin/cars/:id/status", authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const updated = await prisma.car.update({
    where: { id: req.params.id as string },
    data: { status }
  });
  res.json({ car: updated });
});

app.delete("/admin/cars/:id", authMiddleware, adminOnly, async (req, res) => {
  await prisma.car.delete({ where: { id: req.params.id as string } });
  res.json({ ok: true });
});



// ── Dealers ────────────────────────────────────────────────────────────────

// Public: list dealers with optional filters
app.get("/dealers", async (req, res) => {
  const { state, district, brand, dealerType, search } = req.query as Record<string, string>;

  // Convert brand query to an array of specific filters if comma-separated or simple array
  const brandList = brand ? (typeof brand === 'string' ? brand.split(',') : brand) : [];

  const dealers = await prisma.dealer.findMany({
    where: {
      active: true,
      ...(state && { state }),
      ...(district && { district }),
      ...(dealerType && { dealerType }),
      ...(brandList.length > 0 && {
        AND: (brandList as string[]).map(b => ({ brands: { contains: b } }))
      }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { state: { contains: search } },
          { district: { contains: search } },
        ],
      }),
    },
    orderBy: { name: "asc" },
  });

  res.json({ dealers });
});

// Public: get single dealer
app.get("/dealers/:id", async (req, res) => {
  const dealer = await prisma.dealer.findUnique({ where: { id: req.params.id } });
  if (!dealer) return res.status(404).json({ error: "Dealer not found" });
  res.json({ dealer });
});

const dealerSchema = z.object({
  name: z.string().min(1),
  state: z.string().min(1),
  district: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  brands: z.array(z.string()).default([]),
  dealerType: z.enum(["New", "Used", "Both", "Luxury"]).default("Both"),
  imageUrl: z.string().optional(),
  rating: z.number().min(0).max(5).default(0.0),
  verified: z.boolean().default(false),
  active: z.boolean().default(true),
});

// Admin: create dealer
app.post("/dealers", authMiddleware, adminOnly, async (req, res) => {
  const parsed = dealerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { brands, ...rest } = parsed.data;
  const created = await prisma.dealer.create({ data: { ...rest, brands: JSON.stringify(brands) } });
  res.json({ dealer: { ...created, brands: JSON.parse(created.brands) } });
});

// Admin: update dealer
app.put("/dealers/:id", authMiddleware, adminOnly, async (req, res) => {
  const parsed = dealerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { brands, ...rest } = parsed.data;
  const updated = await prisma.dealer.update({
    where: { id: req.params.id as string },
    data: { ...rest, brands: JSON.stringify(brands) },
  });
  res.json({ dealer: { ...updated, brands: JSON.parse(updated.brands) } });
});

// Admin: delete dealer
app.delete("/dealers/:id", authMiddleware, adminOnly, async (req, res) => {
  await prisma.dealer.delete({ where: { id: req.params.id as string } });
  res.json({ ok: true });
});

// Public: seed sample dealers (dev only — remove in production)
app.post("/dealers/seed", async (_req, res) => {
  // Clearing existing sample data to inject new clean mock data
  await prisma.dealer.deleteMany({});
  
  const sample = [
    {
      name: "Morya Cars Pvt Ltd",
      state: "Maharashtra",
      district: "Mumbai",
      dealerType: "Used",
      brands: JSON.stringify(["Hyundai", "Honda", "Maruti Suzuki"]),
      phone: "9112062000",
      email: "info@moryacars.com",
      rating: 4.7,
      verified: true
    },
    {
      name: "Raj Motors",
      state: "Maharashtra",
      district: "Mumbai",
      dealerType: "Luxury",
      brands: JSON.stringify(["Toyota", "Kia"]),
      phone: "9324243639",
      email: "sales@rajmotors.com",
      rating: 4.3,
      verified: true
    },
    {
      name: "Mahindra Randhawa Motors",
      state: "Maharashtra",
      district: "Mumbai",
      dealerType: "New",
      brands: JSON.stringify(["Mahindra", "Tata Motors"]),
      phone: "9168300500",
      email: "contact@randhawamotors.com",
      rating: 4.8,
      verified: true
    },
    {
      name: "Maruti Suzuki Arena",
      state: "Haryana",
      district: "Gurugram",
      dealerType: "New",
      brands: JSON.stringify(["Maruti Suzuki"]),
      phone: "8062216251",
      email: "arena.gurgaon@maruti.com",
      rating: 4.7,
      verified: true
    }
  ];
  
  for (const dealer of sample) {
    await prisma.dealer.create({ data: dealer }).catch(() => {});
  }
  
  res.json({ ok: true, seeded: sample.length });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}`);
});

