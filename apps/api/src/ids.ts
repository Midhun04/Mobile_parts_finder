import { prisma } from './db.js';

type IdTable = 'brand' | 'mobileModel' | 'part' | 'compatibility' | 'partCategory';

export async function nextId(table: IdTable): Promise<number> {
  switch (table) {
    case 'brand': {
      const row = await prisma.brand.aggregate({ _max: { id: true } });
      return (row._max.id ?? 0) + 1;
    }
    case 'mobileModel': {
      const row = await prisma.mobileModel.aggregate({ _max: { id: true } });
      return (row._max.id ?? 0) + 1;
    }
    case 'part': {
      const row = await prisma.part.aggregate({ _max: { id: true } });
      return (row._max.id ?? 0) + 1;
    }
    case 'compatibility': {
      const row = await prisma.compatibility.aggregate({ _max: { id: true } });
      return (row._max.id ?? 0) + 1;
    }
    case 'partCategory': {
      const row = await prisma.partCategory.aggregate({ _max: { id: true } });
      return (row._max.id ?? 0) + 1;
    }
    default: {
      const _exhaustive: never = table;
      return _exhaustive;
    }
  }
}
