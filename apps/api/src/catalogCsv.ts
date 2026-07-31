import { prisma } from './db.js';
import { nextId } from './ids.js';

/** Human-readable part type name → stable API code (same as seed). */
export const PART_TYPE_CODES: Record<string, string> = {
  Display: 'DISPLAY',
  Battery: 'BATTERY',
  'OCA Glass': 'OCA',
  Pouch: 'POUCH',
  'Charging Board': 'CHARGING_BOARD',
  'Back Glass': 'BACK_GLASS',
  Camera: 'CAMERA',
  Speaker: 'SPEAKER',
  Earpiece: 'EARPIECE',
  Microphone: 'MICROPHONE',
  'Fingerprint Sensor': 'FINGERPRINT',
  Housing: 'HOUSING',
  'Volume Flex': 'VOLUME_FLEX',
  'Power Flex': 'POWER_FLEX',
  Vibrator: 'VIBRATOR',
  'Tempered Glass': 'TEMPERED_GLASS',
  'UV Glass': 'UV_GLASS',
  'Display Connector': 'DISPLAY_CONNECTOR',
  'Display / Combo': 'DISPLAY',
  'Pouch / Back Panel': 'POUCH',
};

export const CATALOG_CSV_HEADERS = [
  'brand',
  'model',
  'model_number',
  'release_year',
  'part_type',
  'part_name',
  'part_number',
  'manufacturer',
  'verified',
  'notes',
  'brand_id',
  'mobile_model_id',
  'part_id',
  'part_type_id',
  'compatibility_id',
] as const;

export type CatalogCsvRow = {
  brand: string;
  model: string;
  modelNumber: string | null;
  releaseYear: number | null;
  partType: string;
  partName: string;
  partNumber: string | null;
  manufacturer: string | null;
  verified: boolean;
  notes: string | null;
  line: number;
};

export type ImportCounts = {
  brandsCreated: number;
  brandsUpdated: number;
  modelsCreated: number;
  modelsUpdated: number;
  partTypesCreated: number;
  partsCreated: number;
  partsUpdated: number;
  compatCreated: number;
  compatUpdated: number;
  rows: number;
  skipped: number;
};

export type ImportPreview = {
  dryRun: boolean;
  counts: ImportCounts;
  errors: string[];
  sampleCreates: string[];
  sampleUpdates: string[];
};

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]!;
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

function escapeCsv(value: string | number | boolean | null | undefined): string {
  if (value == null) return '';
  const s = String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function norm(value: string): string {
  return value.trim().toLowerCase();
}

function emptyToNull(value: string | undefined): string | null {
  const t = (value ?? '').trim();
  return t.length ? t : null;
}

function parseVerified(value: string | undefined): boolean {
  const v = (value ?? '').trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

function parseYear(value: string | undefined): number | null {
  const t = (value ?? '').trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function codeFromPartTypeName(name: string): string {
  const known = PART_TYPE_CODES[name];
  if (known) return known;
  const upper = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  return upper || 'OTHER';
}

export function parseCatalogCsv(raw: string): { rows: CatalogCsvRow[]; errors: string[] } {
  const text = raw.replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const errors: string[] = [];
  if (lines.length < 2) {
    return { rows: [], errors: ['CSV must include a header row and at least one data row'] };
  }

  const headers = splitCsvLine(lines[0]!).map((h) => h.trim().toLowerCase());
  const required = ['brand', 'model', 'part_type', 'part_name'];
  for (const col of required) {
    if (!headers.includes(col)) {
      errors.push(`Missing required column: ${col}`);
    }
  }
  if (errors.length) return { rows: [], errors };

  const idx = (name: string) => headers.indexOf(name);
  const rows: CatalogCsvRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const lineNo = i + 1;
    const values = splitCsvLine(lines[i]!);
    const get = (name: string) => {
      const j = idx(name);
      return j >= 0 ? (values[j] ?? '') : '';
    };

    const brand = get('brand').trim();
    const model = get('model').trim();
    const partType = get('part_type').trim();
    const partName = get('part_name').trim();

    if (!brand || !model || !partType || !partName) {
      errors.push(`Line ${lineNo}: brand, model, part_type, and part_name are required`);
      continue;
    }

    rows.push({
      brand,
      model,
      modelNumber: emptyToNull(get('model_number')),
      releaseYear: parseYear(get('release_year')),
      partType,
      partName,
      partNumber: emptyToNull(get('part_number')),
      manufacturer: emptyToNull(get('manufacturer')),
      verified: parseVerified(get('verified')),
      notes: emptyToNull(get('notes')),
      line: lineNo,
    });
  }

  return { rows, errors };
}

export async function exportCatalogCsv(): Promise<string> {
  const links = await prisma.compatibility.findMany({
    include: {
      mobileModel: { include: { brand: true } },
      part: { include: { partCategory: true } },
    },
    orderBy: [{ id: 'asc' }],
  });

  const lines = [CATALOG_CSV_HEADERS.join(',')];
  for (const link of links) {
    const m = link.mobileModel;
    const p = link.part;
    lines.push(
      [
        escapeCsv(m.brand.name),
        escapeCsv(m.name),
        escapeCsv(m.modelNumber),
        escapeCsv(m.releaseYear),
        escapeCsv(p.partCategory.name),
        escapeCsv(p.name),
        escapeCsv(p.partNumber),
        escapeCsv(p.manufacturer),
        escapeCsv(link.verified ? 'TRUE' : 'FALSE'),
        escapeCsv(link.notes),
        escapeCsv(m.brandId),
        escapeCsv(m.id),
        escapeCsv(p.id),
        escapeCsv(p.partTypeId),
        escapeCsv(link.id),
      ].join(','),
    );
  }
  return `${lines.join('\n')}\n`;
}

function emptyCounts(): ImportCounts {
  return {
    brandsCreated: 0,
    brandsUpdated: 0,
    modelsCreated: 0,
    modelsUpdated: 0,
    partTypesCreated: 0,
    partsCreated: 0,
    partsUpdated: 0,
    compatCreated: 0,
    compatUpdated: 0,
    rows: 0,
    skipped: 0,
  };
}

type BrandRec = { id: number; name: string };
type ModelRec = {
  id: number;
  brandId: number;
  name: string;
  modelNumber: string | null;
  releaseYear: number | null;
};
type PartTypeRec = { id: number; name: string; code: string };
type PartRec = {
  id: number;
  partTypeId: number;
  name: string;
  partNumber: string | null;
  manufacturer: string | null;
};
type CompatRec = {
  id: number;
  mobileModelId: number;
  partId: number;
  verified: boolean;
  notes: string | null;
};

export async function importCatalogCsv(
  raw: string,
  options: { dryRun: boolean },
): Promise<ImportPreview> {
  const { rows, errors: parseErrors } = parseCatalogCsv(raw);
  const errors = [...parseErrors];
  const counts = emptyCounts();
  const sampleCreates: string[] = [];
  const sampleUpdates: string[] = [];
  const pushSample = (list: string[], msg: string) => {
    if (list.length < 8) list.push(msg);
  };

  if (!rows.length) {
    return { dryRun: options.dryRun, counts, errors, sampleCreates, sampleUpdates };
  }

  const [brands, models, partTypes, parts, compats] = await Promise.all([
    prisma.brand.findMany(),
    prisma.mobileModel.findMany(),
    prisma.partCategory.findMany(),
    prisma.part.findMany(),
    prisma.compatibility.findMany(),
  ]);

  const brandByName = new Map<string, BrandRec>();
  for (const b of brands) brandByName.set(norm(b.name), b);

  const modelByKey = new Map<string, ModelRec>();
  for (const m of models) {
    modelByKey.set(`${m.brandId}:${norm(m.name)}`, m);
  }

  const partTypeByName = new Map<string, PartTypeRec>();
  const partTypeByCode = new Map<string, PartTypeRec>();
  for (const pt of partTypes) {
    partTypeByName.set(norm(pt.name), pt);
    partTypeByCode.set(norm(pt.code), pt);
  }

  const partByKey = new Map<string, PartRec>();
  const partByNumber = new Map<string, PartRec>();
  for (const p of parts) {
    partByKey.set(`${p.partTypeId}:${norm(p.name)}`, p);
    if (p.partNumber) partByNumber.set(norm(p.partNumber), p);
  }

  const compatByKey = new Map<string, CompatRec>();
  for (const c of compats) {
    compatByKey.set(`${c.mobileModelId}:${c.partId}`, c);
  }

  let nextBrandId = options.dryRun ? 0 : await nextId('brand');
  let nextModelId = options.dryRun ? 0 : await nextId('mobileModel');
  let nextPartTypeId = options.dryRun ? 0 : await nextId('partCategory');
  let nextPartId = options.dryRun ? 0 : await nextId('part');
  let nextCompatId = options.dryRun ? 0 : await nextId('compatibility');

  const touchedBrands = new Set<number>();
  const touchedModels = new Set<number>();
  const touchedParts = new Set<number>();

  for (const row of rows) {
    counts.rows += 1;

    // ── Brand ──────────────────────────────────────────────────────────────
    let brand = brandByName.get(norm(row.brand));
    if (!brand) {
      counts.brandsCreated += 1;
      pushSample(sampleCreates, `Brand: ${row.brand}`);
      const id = options.dryRun ? -1 - counts.brandsCreated : nextBrandId++;
      brand = { id, name: row.brand };
      brandByName.set(norm(row.brand), brand);
      if (!options.dryRun) {
        await prisma.brand.create({ data: { id: brand.id, name: brand.name } });
      }
    } else if (!touchedBrands.has(brand.id) && brand.name !== row.brand) {
      // Keep existing canonical casing unless CSV differs only by whitespace — skip rename churn
      touchedBrands.add(brand.id);
    }

    // ── Part type ──────────────────────────────────────────────────────────
    let partType =
      partTypeByName.get(norm(row.partType)) ??
      partTypeByCode.get(norm(row.partType)) ??
      partTypeByCode.get(norm(codeFromPartTypeName(row.partType)));

    if (!partType) {
      const code = codeFromPartTypeName(row.partType);
      const existingByCode = partTypeByCode.get(norm(code));
      if (existingByCode) {
        partType = existingByCode;
      } else {
        counts.partTypesCreated += 1;
        pushSample(sampleCreates, `Part type: ${row.partType}`);
        const id = options.dryRun ? -1 - counts.partTypesCreated : nextPartTypeId++;
        partType = { id, name: row.partType, code };
        partTypeByName.set(norm(partType.name), partType);
        partTypeByCode.set(norm(partType.code), partType);
        if (!options.dryRun) {
          await prisma.partCategory.create({
            data: { id: partType.id, name: partType.name, code: partType.code },
          });
        }
      }
    }

    // ── Model ──────────────────────────────────────────────────────────────
    const modelKey = `${brand.id}:${norm(row.model)}`;
    let model = modelByKey.get(modelKey);
    if (!model) {
      counts.modelsCreated += 1;
      pushSample(sampleCreates, `Model: ${row.brand} ${row.model}`);
      const id = options.dryRun ? -1 - counts.modelsCreated : nextModelId++;
      model = {
        id,
        brandId: brand.id,
        name: row.model,
        modelNumber: row.modelNumber,
        releaseYear: row.releaseYear,
      };
      modelByKey.set(modelKey, model);
      if (!options.dryRun) {
        await prisma.mobileModel.create({
          data: {
            id: model.id,
            brandId: model.brandId,
            name: model.name,
            modelNumber: model.modelNumber,
            releaseYear: model.releaseYear,
          },
        });
      }
    } else {
      const nextNumber = row.modelNumber ?? model.modelNumber;
      const nextYear = row.releaseYear ?? model.releaseYear;
      if (
        (nextNumber !== model.modelNumber || nextYear !== model.releaseYear) &&
        !touchedModels.has(model.id)
      ) {
        counts.modelsUpdated += 1;
        touchedModels.add(model.id);
        pushSample(
          sampleUpdates,
          `Model: ${row.brand} ${row.model} → number/year from CSV`,
        );
        model = { ...model, modelNumber: nextNumber, releaseYear: nextYear };
        modelByKey.set(modelKey, model);
        if (!options.dryRun) {
          await prisma.mobileModel.update({
            where: { id: model.id },
            data: {
              modelNumber: model.modelNumber,
              releaseYear: model.releaseYear,
            },
          });
        }
      }
    }

    // ── Part ───────────────────────────────────────────────────────────────
    let part =
      (row.partNumber ? partByNumber.get(norm(row.partNumber)) : undefined) ??
      partByKey.get(`${partType.id}:${norm(row.partName)}`);

    if (!part) {
      counts.partsCreated += 1;
      pushSample(sampleCreates, `Part: ${row.partName}`);
      const id = options.dryRun ? -1 - counts.partsCreated : nextPartId++;
      part = {
        id,
        partTypeId: partType.id,
        name: row.partName,
        partNumber: row.partNumber,
        manufacturer: row.manufacturer,
      };
      partByKey.set(`${partType.id}:${norm(part.name)}`, part);
      if (part.partNumber) partByNumber.set(norm(part.partNumber), part);
      if (!options.dryRun) {
        await prisma.part.create({
          data: {
            id: part.id,
            partTypeId: part.partTypeId,
            name: part.name,
            partNumber: part.partNumber,
            manufacturer: part.manufacturer,
          },
        });
      }
    } else {
      const nextName = row.partName;
      const nextNumber = row.partNumber ?? part.partNumber;
      const nextMfr = row.manufacturer ?? part.manufacturer;
      if (
        (nextName !== part.name ||
          nextNumber !== part.partNumber ||
          nextMfr !== part.manufacturer ||
          part.partTypeId !== partType.id) &&
        !touchedParts.has(part.id)
      ) {
        counts.partsUpdated += 1;
        touchedParts.add(part.id);
        pushSample(sampleUpdates, `Part: ${row.partName}`);
        part = {
          ...part,
          name: nextName,
          partNumber: nextNumber,
          manufacturer: nextMfr,
          partTypeId: partType.id,
        };
        partByKey.set(`${part.partTypeId}:${norm(part.name)}`, part);
        if (part.partNumber) partByNumber.set(norm(part.partNumber), part);
        if (!options.dryRun) {
          await prisma.part.update({
            where: { id: part.id },
            data: {
              name: part.name,
              partNumber: part.partNumber,
              manufacturer: part.manufacturer,
              partTypeId: part.partTypeId,
            },
          });
        }
      }
    }

    // ── Compatibility ──────────────────────────────────────────────────────
    const compatKey = `${model.id}:${part.id}`;
    const existing = compatByKey.get(compatKey);
    if (!existing) {
      counts.compatCreated += 1;
      pushSample(
        sampleCreates,
        `Link: ${row.brand} ${row.model} ↔ ${row.partName}`,
      );
      const id = options.dryRun ? -1 - counts.compatCreated : nextCompatId++;
      const created: CompatRec = {
        id,
        mobileModelId: model.id,
        partId: part.id,
        verified: row.verified,
        notes: row.notes,
      };
      compatByKey.set(compatKey, created);
      if (!options.dryRun) {
        await prisma.compatibility.create({
          data: {
            id: created.id,
            mobileModelId: created.mobileModelId,
            partId: created.partId,
            verified: created.verified,
            notes: created.notes,
          },
        });
      }
    } else {
      const verifiedChanged = existing.verified !== row.verified;
      const notesChanged = (existing.notes ?? null) !== (row.notes ?? null);
      if (verifiedChanged || notesChanged) {
        counts.compatUpdated += 1;
        pushSample(
          sampleUpdates,
          `Link: ${row.brand} ${row.model} ↔ ${row.partName}`,
        );
        const updated: CompatRec = {
          ...existing,
          verified: row.verified,
          notes: row.notes,
        };
        compatByKey.set(compatKey, updated);
        if (!options.dryRun && existing.id > 0) {
          await prisma.compatibility.update({
            where: { id: existing.id },
            data: { verified: updated.verified, notes: updated.notes },
          });
        }
      } else {
        counts.skipped += 1;
      }
    }
  }

  return {
    dryRun: options.dryRun,
    counts,
    errors,
    sampleCreates,
    sampleUpdates,
  };
}
