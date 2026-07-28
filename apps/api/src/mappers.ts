import type { Brand, MobileModel, Part, PartType } from '@prisma/client';

export type MobileModelWithBrand = MobileModel & { brand: Brand };

export function mapModel(model: MobileModelWithBrand) {
  return {
    id: model.id,
    brandId: model.brandId,
    name: model.name,
    modelNumber: model.modelNumber ?? undefined,
    releaseYear: model.releaseYear ?? undefined,
    brand: {
      id: model.brand.id,
      name: model.brand.name,
    },
  };
}

export function mapPart(part: Part) {
  return {
    id: part.id,
    name: part.name,
    type: part.type as PartType,
    partNumber: part.partNumber ?? undefined,
    description: part.description ?? undefined,
  };
}

export function mapCompatibilityMeta(item: {
  verified: boolean;
  notes: string | null;
}) {
  return {
    verified: item.verified,
    notes: item.notes ?? undefined,
  };
}
