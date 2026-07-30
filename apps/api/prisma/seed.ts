import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function resolveDataDir(): string {
  const candidates = [
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), '../../data'),
  ];
  for (const dir of candidates) {
    if (existsSync(path.join(dir, 'brands.csv'))) return dir;
  }
  throw new Error(`Could not find data/brands.csv. Tried: ${candidates.join(', ')}`);
}

const DATA_DIR = resolveDataDir();

/** Map human-readable part type names from CSV → stable API codes. */
const PART_TYPE_CODES: Record<string, string> = {
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
};

function parseCsv(fileName: string): Record<string, string>[] {
  const raw = readFileSync(path.join(DATA_DIR, fileName), 'utf8').replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]!);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });
    return row;
  });
}

/** Minimal CSV splitter (handles quoted fields with commas). */
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

function requiredInt(row: Record<string, string>, key: string): number {
  const value = Number(row[key]);
  if (!Number.isFinite(value)) {
    throw new Error(`Expected integer for "${key}", got "${row[key]}"`);
  }
  return value;
}

function optionalString(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseBool(value: string): boolean {
  return ['true', '1', 'yes'].includes(value.trim().toLowerCase());
}

async function ensureAdminUser(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@mpf.local').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }
  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${email} (password from ADMIN_PASSWORD or default)`);
}

async function seedCatalogFromCsv(): Promise<void> {
  const brands = parseCsv('brands.csv');
  const models = parseCsv('mobile_models.csv');
  const partTypes = parseCsv('part_types.csv');
  const parts = parseCsv('parts.csv');
  const compatibilities = parseCsv('compatibility.csv');

  // Wipe catalog only (keep AdminUser). Groups depend on parts/models.
  await prisma.compatibilityGroupMember.deleteMany();
  await prisma.compatibilityGroup.deleteMany();
  await prisma.compatibility.deleteMany();
  await prisma.modelAlias.deleteMany();
  await prisma.part.deleteMany();
  await prisma.partCategory.deleteMany();
  await prisma.mobileModel.deleteMany();
  await prisma.brand.deleteMany();

  for (const row of brands) {
    await prisma.brand.create({
      data: {
        id: requiredInt(row, 'id'),
        name: row.name!,
      },
    });
  }

  for (const row of models) {
    await prisma.mobileModel.create({
      data: {
        id: requiredInt(row, 'id'),
        brandId: requiredInt(row, 'brand_id'),
        name: row.model!,
        modelNumber: optionalString(row.model_number),
        releaseYear: row.release_year ? requiredInt(row, 'release_year') : null,
      },
    });
  }

  for (const row of partTypes) {
    const name = row.name!;
    const code = PART_TYPE_CODES[name];
    if (!code) {
      throw new Error(`No API code mapped for part type "${name}"`);
    }
    await prisma.partCategory.create({
      data: {
        id: requiredInt(row, 'id'),
        name,
        code,
      },
    });
  }

  for (const row of parts) {
    await prisma.part.create({
      data: {
        id: requiredInt(row, 'id'),
        partTypeId: requiredInt(row, 'part_type_id'),
        name: row.part_name!,
        partNumber: optionalString(row.part_number),
        manufacturer: optionalString(row.manufacturer),
      },
    });
  }

  for (const row of compatibilities) {
    await prisma.compatibility.create({
      data: {
        id: requiredInt(row, 'id'),
        mobileModelId: requiredInt(row, 'mobile_model_id'),
        partId: requiredInt(row, 'part_id'),
        verified: parseBool(row.verified ?? 'false'),
        notes: optionalString(row.notes),
      },
    });
  }

  console.log(
    `Seeded from data/: ${brands.length} brands, ${models.length} models, ${partTypes.length} part types, ${parts.length} parts, ${compatibilities.length} compatibilities`,
  );
}

async function main() {
  const brandCount = await prisma.brand.count();
  const forceWipe = process.env.SEED_WIPE === '1';

  if (forceWipe || brandCount === 0) {
    if (forceWipe && brandCount > 0) {
      console.log('SEED_WIPE=1 — reloading catalog from CSV (admin users kept)');
    }
    await seedCatalogFromCsv();
  } else {
    console.log(
      `Catalog already has ${brandCount} brands — skipping CSV wipe. Set SEED_WIPE=1 to force reload.`,
    );
  }

  await ensureAdminUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
