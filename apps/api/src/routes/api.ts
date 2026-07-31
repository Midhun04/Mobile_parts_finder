import type { Prisma } from '@prisma/client';
import { Router } from 'express';
import {
  BRAND_ALIASES,
  MAX_POPULAR_BRANDS,
  POPULAR_BRAND_IDS,
  RECENT_MODEL_IDS,
} from '../constants.js';
import { prisma } from '../db.js';
import { mapCompatibilityMeta, mapModel, mapPart } from '../mappers.js';

export const apiRouter = Router();

const partInclude = { partCategory: true } as const;

const MAX_SEARCH_TERMS = 8;

/**
 * A query spans several columns ("samsung a50" = brand + model name), so each
 * word is matched on its own and every word has to land somewhere.
 */
function toSearchTerms(q: string): string[] {
  return q
    .split(/[\s,/]+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .slice(0, MAX_SEARCH_TERMS);
}

function aliasedBrands(term: string): readonly string[] {
  return BRAND_ALIASES[term.toLowerCase()] ?? [];
}

apiRouter.get('/search', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const terms = toSearchTerms(q);
  if (!terms.length) {
    res.json({ models: [], parts: [] });
    return;
  }

  const maybeCode = q.toUpperCase().replace(/[\s-]/g, '_');
  const matchedType = await prisma.partCategory.findFirst({
    where: {
      OR: [
        { code: maybeCode },
        { name: { equals: q, mode: 'insensitive' } },
      ],
    },
  });

  const modelWhere: Prisma.MobileModelWhereInput = {
    AND: terms.map((term): Prisma.MobileModelWhereInput => ({
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { modelNumber: { contains: term, mode: 'insensitive' } },
        { brand: { name: { contains: term, mode: 'insensitive' } } },
        ...aliasedBrands(term).map(
          (brand): Prisma.MobileModelWhereInput => ({
            brand: { name: { equals: brand, mode: 'insensitive' } },
          }),
        ),
      ],
    })),
  };

  const partWhere: Prisma.PartWhereInput = {
    OR: [
      {
        AND: terms.map((term): Prisma.PartWhereInput => ({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { partNumber: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { manufacturer: { contains: term, mode: 'insensitive' } },
            { partCategory: { name: { contains: term, mode: 'insensitive' } } },
            ...aliasedBrands(term).flatMap((brand): Prisma.PartWhereInput[] => [
              { name: { contains: brand, mode: 'insensitive' } },
              { manufacturer: { equals: brand, mode: 'insensitive' } },
            ]),
          ],
        })),
      },
      ...(matchedType ? [{ partTypeId: matchedType.id }] : []),
    ],
  };

  const [models, parts] = await Promise.all([
    prisma.mobileModel.findMany({
      where: modelWhere,
      include: { brand: true },
      orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
    }),
    prisma.part.findMany({
      where: partWhere,
      include: partInclude,
      orderBy: { name: 'asc' },
    }),
  ]);

  res.json({
    models: models.map(mapModel),
    parts: parts.map(mapPart),
  });
});

apiRouter.get('/brands/popular', async (req, res) => {
  const requested = Number(req.query.limit);
  const limit = Number.isInteger(requested)
    ? Math.min(Math.max(requested, 1), MAX_POPULAR_BRANDS)
    : POPULAR_BRAND_IDS.length;

  const brands = await prisma.brand.findMany({
    include: { _count: { select: { models: true } } },
    orderBy: [{ models: { _count: 'desc' } }, { name: 'asc' }],
  });

  const curated = POPULAR_BRAND_IDS.map((id) => brands.find((b) => b.id === id)).filter(
    (b): b is NonNullable<typeof b> => Boolean(b),
  );
  const fillers = brands.filter((b) => !POPULAR_BRAND_IDS.includes(b.id));

  const ordered = [...curated, ...fillers].slice(0, limit).map(({ _count, ...brand }) => brand);

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
      ...(typeParam ? { part: { partCategory: { code: typeParam } } } : {}),
    },
    include: { part: { include: partInclude } },
    orderBy: { part: { partTypeId: 'asc' } },
  });

  res.json(links.map((link) => mapPart(link.part)));
});

apiRouter.get('/parts/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid part id' });
    return;
  }

  const part = await prisma.part.findUnique({
    where: { id },
    include: partInclude,
  });
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
