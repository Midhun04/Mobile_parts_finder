import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/** Default part categories for an empty database. Catalog data is loaded via Admin CSV. */
const DEFAULT_PART_TYPES: { id: number; name: string; code: string }[] = [
  { id: 1, name: 'Display', code: 'DISPLAY' },
  { id: 2, name: 'Battery', code: 'BATTERY' },
  { id: 3, name: 'OCA Glass', code: 'OCA' },
  { id: 4, name: 'Pouch', code: 'POUCH' },
  { id: 5, name: 'Charging Board', code: 'CHARGING_BOARD' },
  { id: 6, name: 'Back Glass', code: 'BACK_GLASS' },
  { id: 7, name: 'Camera', code: 'CAMERA' },
  { id: 8, name: 'Speaker', code: 'SPEAKER' },
  { id: 9, name: 'Earpiece', code: 'EARPIECE' },
  { id: 10, name: 'Microphone', code: 'MICROPHONE' },
  { id: 11, name: 'Fingerprint Sensor', code: 'FINGERPRINT' },
  { id: 12, name: 'Housing', code: 'HOUSING' },
  { id: 13, name: 'Volume Flex', code: 'VOLUME_FLEX' },
  { id: 14, name: 'Power Flex', code: 'POWER_FLEX' },
  { id: 15, name: 'Vibrator', code: 'VIBRATOR' },
  { id: 16, name: 'Tempered Glass', code: 'TEMPERED_GLASS' },
  { id: 17, name: 'UV Glass', code: 'UV_GLASS' },
  { id: 18, name: 'Display Connector', code: 'DISPLAY_CONNECTOR' },
];

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

async function ensureDefaultPartTypes(): Promise<void> {
  const count = await prisma.partCategory.count();
  if (count > 0) {
    console.log(`Part types already present (${count}) — skipping defaults`);
    return;
  }
  for (const row of DEFAULT_PART_TYPES) {
    await prisma.partCategory.create({ data: row });
  }
  console.log(`Created ${DEFAULT_PART_TYPES.length} default part types`);
}

async function main() {
  await ensureDefaultPartTypes();
  await ensureAdminUser();
  console.log('Seed done. Load catalog via Admin → Overview → Upload CSV (or create in the UI).');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
