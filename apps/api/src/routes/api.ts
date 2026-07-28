import { Router } from 'express';
import type { PartType } from '@prisma/client';
import { POPULAR_BRAND_IDS, RECENT_MODEL_IDS } from '../constants.js';
import { prisma } from '../db.js';
import { mapCompatibilityMeta, mapModel, mapPart } from '../mappers.js';

export const apiRouter = Router();

const PART_TYPES: PartType[] = [
  'DISPLAY',
  'BATTERY',
  'OCA',
  'POUCH',
  'CHARGING_BOARD',
  'CAMERA',
  'SPEAKER',
  'MICROPHONE',
  'FINGERPRINT',
  'HOUSING',
  'BACK_GLASS',
  'OTHER',
];

apiRouter.get('/search', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  if (!q) {
    res.json({ models: [], parts: [] });
    return;
  }

  const maybeType = q.toUpperCase().replace(/[\s-]/g, '_') as PartType;
  const typeFilter = PART_TYPES.includes(maybeType) ? ({ type: maybeType } as const) : null;

  const [models, parts] = await Promise.all([
    prisma.mobileModel.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { modelNumber: { contains: q, mode: 'insensitive' } },
          { brand: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: { brand: true },
      orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
    }),
    prisma.part.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { partNumber: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          ...(typeFilter ? [typeFilter] : []),
        ],
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  res.json({
    models: models.map(mapModel),
    parts: parts.map(mapPart),
  });
});

apiRouter.get('/brands/popular', async (_req, res) => {
  const brands = await prisma.brand.findMany({
    where: { id: { in: POPULAR_BRAND_IDS } },
  });

  const ordered = POPULAR_BRAND_IDS.map((id) => brands.find((b) => b.id === id)).filter(
    (b): b is NonNullable<typeof b> => Boolean(b),
  );

  res.json(ordered);
});

apiRouter.get('/brands/:id/models', async (req, res) => {
  const brandId = Number(req.params.id);
  if (Number.isNaN(brandId)) {
    res.status(400).json({ error: 'Invalid brand id' });
    return;
  }

  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }

  const models = await prisma.mobileModel.findMany({
    where: { brandId },
    include: { brand: true },
    orderBy: { name: 'asc' },
  });

  res.json(models.map(mapModel));
});

apiRouter.get('/mobile-models/recent', async (_req, res) => {
  const models = await prisma.mobileModel.findMany({
    where: { id: { in: RECENT_MODEL_IDS } },
    include: { brand: true },
  });

  const ordered = RECENT_MODEL_IDS.map((id) => models.find((m) => m.id === id)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m),
  );

  res.json(ordered.map(mapModel));
});

apiRouter.get('/mobile-models/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid model id' });
    return;
  }

  const model = await prisma.mobileModel.findUnique({
    where: { id },
    include: { brand: true },
  });

  if (!model) {
    res.status(404).json({ error: 'Model not found' });
    return;
  }

  res.json(mapModel(model));
});

apiRouter.get('/mobile-models/:id/parts', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid model id' });
    return;
  }

  const typeParam = req.query.type ? String(req.query.type).toUpperCase() : undefined;

  const model = await prisma.mobileModel.findUnique({ where: { id } });
  if (!model) {
    res.status(404).json({ error: 'Model not found' });
    return;
  }

  const links = await prisma.compatibility.findMany({
    where: {
      mobileModelId: id,
      ...(typeParam ? { part: { type: typeParam as PartType } } : {}),
    },
    include: { part: true },
    orderBy: { part: { type: 'asc' } },
  });

  res.json(links.map((link) => mapPart(link.part)));
});

apiRouter.get('/parts/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid part id' });
    return;
  }

  const part = await prisma.part.findUnique({ where: { id } });
  if (!part) {
    res.status(404).json({ error: 'Part not found' });
    return;
  }

  res.json(mapPart(part));
});

apiRouter.get('/parts/:id/compatible-models', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid part id' });
    return;
  }

  const part = await prisma.part.findUnique({ where: { id } });
  if (!part) {
    res.status(404).json({ error: 'Part not found' });
    return;
  }

  const links = await prisma.compatibility.findMany({
    where: { partId: id },
    include: {
      mobileModel: { include: { brand: true } },
    },
    orderBy: [{ mobileModel: { brand: { name: 'asc' } } }, { mobileModel: { name: 'asc' } }],
  });

  res.json(
    links.map((link) => ({
      model: mapModel(link.mobileModel),
      ...mapCompatibilityMeta(link),
    })),
  );
});

apiRouter.get('/compatibility', async (req, res) => {
  const modelId = Number(req.query.modelId);
  const partId = Number(req.query.partId);

  if (Number.isNaN(modelId) || Number.isNaN(partId)) {
    res.status(400).json({ error: 'modelId and partId are required' });
    return;
  }

  const link = await prisma.compatibility.findUnique({
    where: {
      mobileModelId_partId: { mobileModelId: modelId, partId },
    },
  });

  if (!link) {
    res.status(404).json({ error: 'Compatibility not found' });
    return;
  }

  res.json(mapCompatibilityMeta(link));
});
