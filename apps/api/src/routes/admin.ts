import { Router } from 'express';
import { prisma } from '../db.js';
import { nextId } from '../ids.js';
import { mapModel, mapPart } from '../mappers.js';
import {
  requireAdmin,
  signAdminToken,
  verifyPassword,
  type AuthedRequest,
} from '../adminAuth.js';

export const adminRouter = Router();

function parseId(value: string | undefined): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function optionalTrim(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t.length ? t : null;
}

async function loadGroup(id: number) {
  return prisma.compatibilityGroup.findUnique({
    where: { id },
    include: {
      partType: true,
      part: { include: { partCategory: true } },
      members: {
        include: { model: { include: { brand: true } } },
        orderBy: [{ model: { brand: { name: 'asc' } } }, { model: { name: 'asc' } }],
      },
    },
  });
}

function mapGroup(group: NonNullable<Awaited<ReturnType<typeof loadGroup>>>) {
  return {
    id: group.id,
    name: group.name,
    partTypeId: group.partTypeId,
    partType: { id: group.partType.id, name: group.partType.name, code: group.partType.code },
    supplierCode: group.supplierCode ?? undefined,
    notes: group.notes ?? undefined,
    partId: group.partId ?? undefined,
    part: group.part ? mapPart(group.part) : undefined,
    members: group.members.map((m) => mapModel(m.model)),
    memberCount: group.members.length,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

adminRouter.post('/auth/login', async (req, res) => {
  const email = optionalTrim(req.body?.email)?.toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = signAdminToken(user);
  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

adminRouter.get('/auth/me', requireAdmin, async (req: AuthedRequest, res) => {
  const user = await prisma.adminUser.findUnique({ where: { id: req.admin!.sub } });
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }
  res.json({ id: user.id, email: user.email, role: user.role });
});

adminRouter.use(requireAdmin);

// ── Overview ─────────────────────────────────────────────────────────────────

adminRouter.get('/stats', async (_req, res) => {
  const [brands, models, parts, compatibilities, unverified, groups, partTypes] =
    await Promise.all([
      prisma.brand.count(),
      prisma.mobileModel.count(),
      prisma.part.count(),
      prisma.compatibility.count(),
      prisma.compatibility.count({ where: { verified: false } }),
      prisma.compatibilityGroup.count(),
      prisma.partCategory.count(),
    ]);

  res.json({ brands, models, parts, compatibilities, unverified, groups, partTypes });
});

// ── Brands ───────────────────────────────────────────────────────────────────

adminRouter.get('/brands', async (_req, res) => {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { models: true } } },
  });
  res.json(
    brands.map((b) => ({
      id: b.id,
      name: b.name,
      modelCount: b._count.models,
    })),
  );
});

adminRouter.post('/brands', async (req, res) => {
  const name = optionalTrim(req.body?.name);
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  const existing = await prisma.brand.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });
  if (existing) {
    res.status(409).json({ error: 'Brand already exists' });
    return;
  }
  const brand = await prisma.brand.create({
    data: { id: await nextId('brand'), name },
  });
  res.status(201).json(brand);
});

adminRouter.patch('/brands/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const name = optionalTrim(req.body?.name);
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  try {
    const brand = await prisma.brand.update({ where: { id }, data: { name } });
    res.json(brand);
  } catch {
    res.status(404).json({ error: 'Brand not found' });
  }
});

adminRouter.delete('/brands/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const models = await prisma.mobileModel.count({ where: { brandId: id } });
  if (models > 0) {
    res.status(400).json({ error: `Brand has ${models} models; remove them first` });
    return;
  }
  try {
    await prisma.brand.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Brand not found' });
  }
});

// ── Models ───────────────────────────────────────────────────────────────────

adminRouter.get('/models', async (req, res) => {
  const q = optionalTrim(req.query.q);
  const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;
  const limit = Math.min(Number(req.query.limit) || 100, 500);

  const models = await prisma.mobileModel.findMany({
    where: {
      ...(brandId && !Number.isNaN(brandId) ? { brandId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { modelNumber: { contains: q, mode: 'insensitive' } },
              { brand: { name: { contains: q, mode: 'insensitive' } } },
              { aliases: { some: { alias: { contains: q, mode: 'insensitive' } } } },
            ],
          }
        : {}),
    },
    include: {
      brand: true,
      _count: { select: { compatibilities: true } },
    },
    orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
    take: limit,
  });

  res.json(
    models.map((m) => ({
      ...mapModel(m),
      partCount: m._count.compatibilities,
    })),
  );
});

adminRouter.get('/models/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const model = await prisma.mobileModel.findUnique({
    where: { id },
    include: {
      brand: true,
      aliases: { orderBy: { alias: 'asc' } },
      compatibilities: {
        include: { part: { include: { partCategory: true } } },
        orderBy: { part: { partTypeId: 'asc' } },
      },
    },
  });
  if (!model) {
    res.status(404).json({ error: 'Model not found' });
    return;
  }
  res.json({
    ...mapModel(model),
    aliases: model.aliases.map((a) => ({ id: a.id, alias: a.alias })),
    parts: model.compatibilities.map((c) => ({
      ...mapPart(c.part),
      compatibilityId: c.id,
      verified: c.verified,
      notes: c.notes ?? undefined,
    })),
  });
});

adminRouter.post('/models', async (req, res) => {
  const name = optionalTrim(req.body?.name);
  const brandId = Number(req.body?.brandId);
  if (!name || Number.isNaN(brandId)) {
    res.status(400).json({ error: 'name and brandId are required' });
    return;
  }
  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) {
    res.status(400).json({ error: 'Brand not found' });
    return;
  }
  const model = await prisma.mobileModel.create({
    data: {
      id: await nextId('mobileModel'),
      name,
      brandId,
      modelNumber: optionalTrim(req.body?.modelNumber),
      releaseYear:
        req.body?.releaseYear != null && req.body.releaseYear !== ''
          ? Number(req.body.releaseYear)
          : null,
    },
    include: { brand: true },
  });
  res.status(201).json(mapModel(model));
});

adminRouter.patch('/models/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const data: {
    name?: string;
    brandId?: number;
    modelNumber?: string | null;
    releaseYear?: number | null;
  } = {};
  if (req.body?.name !== undefined) {
    const name = optionalTrim(req.body.name);
    if (!name) {
      res.status(400).json({ error: 'Name cannot be empty' });
      return;
    }
    data.name = name;
  }
  if (req.body?.brandId !== undefined) {
    data.brandId = Number(req.body.brandId);
    if (Number.isNaN(data.brandId)) {
      res.status(400).json({ error: 'Invalid brandId' });
      return;
    }
  }
  if (req.body?.modelNumber !== undefined) {
    data.modelNumber = optionalTrim(req.body.modelNumber);
  }
  if (req.body?.releaseYear !== undefined) {
    data.releaseYear =
      req.body.releaseYear === '' || req.body.releaseYear == null
        ? null
        : Number(req.body.releaseYear);
  }
  try {
    const model = await prisma.mobileModel.update({
      where: { id },
      data,
      include: { brand: true },
    });
    res.json(mapModel(model));
  } catch {
    res.status(404).json({ error: 'Model not found' });
  }
});

adminRouter.delete('/models/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  await prisma.$transaction([
    prisma.compatibility.deleteMany({ where: { mobileModelId: id } }),
    prisma.compatibilityGroupMember.deleteMany({ where: { modelId: id } }),
    prisma.modelAlias.deleteMany({ where: { mobileModelId: id } }),
    prisma.mobileModel.delete({ where: { id } }),
  ]);
  res.status(204).send();
});

adminRouter.post('/models/:id/aliases', async (req, res) => {
  const id = parseId(req.params.id);
  const alias = optionalTrim(req.body?.alias);
  if (id == null || !alias) {
    res.status(400).json({ error: 'model id and alias are required' });
    return;
  }
  const model = await prisma.mobileModel.findUnique({ where: { id } });
  if (!model) {
    res.status(404).json({ error: 'Model not found' });
    return;
  }
  try {
    const row = await prisma.modelAlias.create({
      data: { mobileModelId: id, alias },
    });
    res.status(201).json({ id: row.id, alias: row.alias });
  } catch {
    res.status(409).json({ error: 'Alias already exists' });
  }
});

adminRouter.delete('/models/:id/aliases/:aliasId', async (req, res) => {
  const aliasId = parseId(req.params.aliasId);
  if (aliasId == null) {
    res.status(400).json({ error: 'Invalid alias id' });
    return;
  }
  await prisma.modelAlias.delete({ where: { id: aliasId } }).catch(() => null);
  res.status(204).send();
});

// ── Part types ───────────────────────────────────────────────────────────────

adminRouter.get('/part-types', async (_req, res) => {
  const types = await prisma.partCategory.findMany({
    orderBy: { id: 'asc' },
    include: { _count: { select: { parts: true } } },
  });
  res.json(
    types.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      partCount: t._count.parts,
    })),
  );
});

adminRouter.post('/part-types', async (req, res) => {
  const name = optionalTrim(req.body?.name);
  const code = optionalTrim(req.body?.code)?.toUpperCase().replace(/\s+/g, '_');
  if (!name || !code) {
    res.status(400).json({ error: 'name and code are required' });
    return;
  }
  try {
    const row = await prisma.partCategory.create({
      data: { id: await nextId('partCategory'), name, code },
    });
    res.status(201).json(row);
  } catch {
    res.status(409).json({ error: 'Part type name or code already exists' });
  }
});

adminRouter.patch('/part-types/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const data: { name?: string; code?: string } = {};
  if (req.body?.name !== undefined) {
    const name = optionalTrim(req.body.name);
    if (!name) {
      res.status(400).json({ error: 'Name cannot be empty' });
      return;
    }
    data.name = name;
  }
  if (req.body?.code !== undefined) {
    const code = optionalTrim(req.body.code)?.toUpperCase().replace(/\s+/g, '_');
    if (!code) {
      res.status(400).json({ error: 'Code cannot be empty' });
      return;
    }
    data.code = code;
  }
  try {
    const row = await prisma.partCategory.update({ where: { id }, data });
    res.json(row);
  } catch {
    res.status(404).json({ error: 'Part type not found' });
  }
});

// ── Parts ────────────────────────────────────────────────────────────────────

adminRouter.get('/parts', async (req, res) => {
  const q = optionalTrim(req.query.q);
  const partTypeId = req.query.partTypeId ? Number(req.query.partTypeId) : undefined;
  const limit = Math.min(Number(req.query.limit) || 100, 500);

  const parts = await prisma.part.findMany({
    where: {
      ...(partTypeId && !Number.isNaN(partTypeId) ? { partTypeId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { partNumber: { contains: q, mode: 'insensitive' } },
              { manufacturer: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      partCategory: true,
      _count: { select: { compatibilities: true } },
    },
    orderBy: { name: 'asc' },
    take: limit,
  });

  res.json(
    parts.map((p) => ({
      ...mapPart(p),
      modelCount: p._count.compatibilities,
    })),
  );
});

adminRouter.get('/parts/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const part = await prisma.part.findUnique({
    where: { id },
    include: {
      partCategory: true,
      compatibilityGroup: true,
      compatibilities: {
        include: { mobileModel: { include: { brand: true } } },
        orderBy: [
          { mobileModel: { brand: { name: 'asc' } } },
          { mobileModel: { name: 'asc' } },
        ],
      },
    },
  });
  if (!part) {
    res.status(404).json({ error: 'Part not found' });
    return;
  }
  res.json({
    ...mapPart(part),
    groupId: part.compatibilityGroup?.id,
    models: part.compatibilities.map((c) => ({
      ...mapModel(c.mobileModel),
      compatibilityId: c.id,
      verified: c.verified,
      notes: c.notes ?? undefined,
    })),
  });
});

adminRouter.post('/parts', async (req, res) => {
  const name = optionalTrim(req.body?.name);
  const partTypeId = Number(req.body?.partTypeId);
  if (!name || Number.isNaN(partTypeId)) {
    res.status(400).json({ error: 'name and partTypeId are required' });
    return;
  }
  const type = await prisma.partCategory.findUnique({ where: { id: partTypeId } });
  if (!type) {
    res.status(400).json({ error: 'Part type not found' });
    return;
  }
  const part = await prisma.part.create({
    data: {
      id: await nextId('part'),
      name,
      partTypeId,
      partNumber: optionalTrim(req.body?.partNumber),
      manufacturer: optionalTrim(req.body?.manufacturer),
      description: optionalTrim(req.body?.description),
    },
    include: { partCategory: true },
  });
  res.status(201).json(mapPart(part));
});

adminRouter.patch('/parts/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const data: {
    name?: string;
    partTypeId?: number;
    partNumber?: string | null;
    manufacturer?: string | null;
    description?: string | null;
  } = {};
  if (req.body?.name !== undefined) {
    const name = optionalTrim(req.body.name);
    if (!name) {
      res.status(400).json({ error: 'Name cannot be empty' });
      return;
    }
    data.name = name;
  }
  if (req.body?.partTypeId !== undefined) {
    data.partTypeId = Number(req.body.partTypeId);
  }
  if (req.body?.partNumber !== undefined) data.partNumber = optionalTrim(req.body.partNumber);
  if (req.body?.manufacturer !== undefined) {
    data.manufacturer = optionalTrim(req.body.manufacturer);
  }
  if (req.body?.description !== undefined) {
    data.description = optionalTrim(req.body.description);
  }
  try {
    const part = await prisma.part.update({
      where: { id },
      data,
      include: { partCategory: true },
    });
    res.json(mapPart(part));
  } catch {
    res.status(404).json({ error: 'Part not found' });
  }
});

adminRouter.delete('/parts/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  await prisma.$transaction([
    prisma.compatibilityGroup.updateMany({ where: { partId: id }, data: { partId: null } }),
    prisma.compatibility.deleteMany({ where: { partId: id } }),
    prisma.part.delete({ where: { id } }),
  ]);
  res.status(204).send();
});

// ── Compatibility ────────────────────────────────────────────────────────────

adminRouter.get('/compatibility', async (req, res) => {
  const unverifiedOnly = String(req.query.unverified ?? '') === '1';
  const limit = Math.min(Number(req.query.limit) || 100, 500);

  const links = await prisma.compatibility.findMany({
    where: unverifiedOnly ? { verified: false } : undefined,
    include: {
      mobileModel: { include: { brand: true } },
      part: { include: { partCategory: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  res.json(
    links.map((c) => ({
      id: c.id,
      verified: c.verified,
      notes: c.notes ?? undefined,
      model: mapModel(c.mobileModel),
      part: mapPart(c.part),
    })),
  );
});

adminRouter.post('/compatibility', async (req, res) => {
  const mobileModelId = Number(req.body?.mobileModelId);
  const partId = Number(req.body?.partId);
  if (Number.isNaN(mobileModelId) || Number.isNaN(partId)) {
    res.status(400).json({ error: 'mobileModelId and partId are required' });
    return;
  }
  try {
    const link = await prisma.compatibility.create({
      data: {
        id: await nextId('compatibility'),
        mobileModelId,
        partId,
        verified: Boolean(req.body?.verified),
        notes: optionalTrim(req.body?.notes),
      },
    });
    res.status(201).json(link);
  } catch {
    res.status(409).json({ error: 'Compatibility already exists or invalid ids' });
  }
});

adminRouter.patch('/compatibility/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const data: { verified?: boolean; notes?: string | null } = {};
  if (req.body?.verified !== undefined) data.verified = Boolean(req.body.verified);
  if (req.body?.notes !== undefined) data.notes = optionalTrim(req.body.notes);
  try {
    const link = await prisma.compatibility.update({ where: { id }, data });
    res.json(link);
  } catch {
    res.status(404).json({ error: 'Compatibility not found' });
  }
});

adminRouter.delete('/compatibility/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  await prisma.compatibility.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

// ── Groups ───────────────────────────────────────────────────────────────────

adminRouter.get('/groups', async (req, res) => {
  const partTypeId = req.query.partTypeId ? Number(req.query.partTypeId) : undefined;
  const groups = await prisma.compatibilityGroup.findMany({
    where: partTypeId && !Number.isNaN(partTypeId) ? { partTypeId } : undefined,
    include: {
      partType: true,
      part: { include: { partCategory: true } },
      members: {
        include: { model: { include: { brand: true } } },
        orderBy: [{ model: { brand: { name: 'asc' } } }, { model: { name: 'asc' } }],
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(groups.map(mapGroup));
});

adminRouter.get('/groups/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const group = await loadGroup(id);
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json(mapGroup(group));
});

adminRouter.post('/groups', async (req, res) => {
  const name = optionalTrim(req.body?.name);
  const partTypeId = Number(req.body?.partTypeId);
  const modelIds: number[] = Array.isArray(req.body?.modelIds)
    ? req.body.modelIds.map(Number).filter((n: number) => !Number.isNaN(n))
    : [];

  if (!name || Number.isNaN(partTypeId)) {
    res.status(400).json({ error: 'name and partTypeId are required' });
    return;
  }
  const type = await prisma.partCategory.findUnique({ where: { id: partTypeId } });
  if (!type) {
    res.status(400).json({ error: 'Part type not found' });
    return;
  }

  const partId = await nextId('part');
  let compatId = await nextId('compatibility');
  const group = await prisma.$transaction(async (tx) => {
    await tx.part.create({
      data: {
        id: partId,
        name,
        partTypeId,
        partNumber: optionalTrim(req.body?.supplierCode),
        description: optionalTrim(req.body?.notes),
      },
    });

    const created = await tx.compatibilityGroup.create({
      data: {
        name,
        partTypeId,
        supplierCode: optionalTrim(req.body?.supplierCode),
        notes: optionalTrim(req.body?.notes),
        partId,
      },
    });

    for (const modelId of [...new Set(modelIds)]) {
      await tx.compatibilityGroupMember.create({
        data: { groupId: created.id, modelId },
      });
      await tx.compatibility.create({
        data: {
          id: compatId,
          mobileModelId: modelId,
          partId,
          verified: Boolean(req.body?.verified),
        },
      });
      compatId += 1;
    }

    return created.id;
  });

  const loaded = await loadGroup(group);
  res.status(201).json(mapGroup(loaded!));
});

adminRouter.patch('/groups/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const existing = await prisma.compatibilityGroup.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }

  const name = req.body?.name !== undefined ? optionalTrim(req.body.name) : undefined;
  const supplierCode =
    req.body?.supplierCode !== undefined ? optionalTrim(req.body.supplierCode) : undefined;
  const notes = req.body?.notes !== undefined ? optionalTrim(req.body.notes) : undefined;

  await prisma.$transaction(async (tx) => {
    await tx.compatibilityGroup.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name ?? existing.name } : {}),
        ...(supplierCode !== undefined ? { supplierCode } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });
    if (existing.partId && name) {
      await tx.part.update({
        where: { id: existing.partId },
        data: {
          name,
          ...(supplierCode !== undefined ? { partNumber: supplierCode } : {}),
          ...(notes !== undefined ? { description: notes } : {}),
        },
      });
    }
  });

  const loaded = await loadGroup(id);
  res.json(mapGroup(loaded!));
});

adminRouter.delete('/groups/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const group = await prisma.compatibilityGroup.findUnique({ where: { id } });
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.compatibilityGroupMember.deleteMany({ where: { groupId: id } });
    await tx.compatibilityGroup.delete({ where: { id } });
    if (group.partId) {
      await tx.compatibility.deleteMany({ where: { partId: group.partId } });
      await tx.part.delete({ where: { id: group.partId } });
    }
  });

  res.status(204).send();
});

adminRouter.post('/groups/:id/members', async (req, res) => {
  const id = parseId(req.params.id);
  if (id == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const group = await prisma.compatibilityGroup.findUnique({ where: { id } });
  if (!group || !group.partId) {
    res.status(404).json({ error: 'Group not found or has no linked part' });
    return;
  }
  const modelIds: number[] = Array.isArray(req.body?.modelIds)
    ? req.body.modelIds.map(Number).filter((n: number) => !Number.isNaN(n))
    : [];
  if (!modelIds.length) {
    res.status(400).json({ error: 'modelIds required' });
    return;
  }

  let compatId = await nextId('compatibility');
  for (const modelId of [...new Set(modelIds)]) {
    await prisma.compatibilityGroupMember.upsert({
      where: { groupId_modelId: { groupId: id, modelId } },
      create: { groupId: id, modelId },
      update: {},
    });
    const existing = await prisma.compatibility.findUnique({
      where: {
        mobileModelId_partId: { mobileModelId: modelId, partId: group.partId },
      },
    });
    if (!existing) {
      await prisma.compatibility.create({
        data: {
          id: compatId,
          mobileModelId: modelId,
          partId: group.partId,
          verified: false,
        },
      });
      compatId += 1;
    }
  }

  const loaded = await loadGroup(id);
  res.json(mapGroup(loaded!));
});

adminRouter.delete('/groups/:id/members/:modelId', async (req, res) => {
  const id = parseId(req.params.id);
  const modelId = parseId(req.params.modelId);
  if (id == null || modelId == null) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const group = await prisma.compatibilityGroup.findUnique({ where: { id } });
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.compatibilityGroupMember.deleteMany({
      where: { groupId: id, modelId },
    });
    if (group.partId) {
      await tx.compatibility.deleteMany({
        where: { mobileModelId: modelId, partId: group.partId },
      });
    }
  });

  const loaded = await loadGroup(id);
  res.json(mapGroup(loaded!));
});
