import type { Brand, MobileModel, Part, PartCategory } from '@prisma/client';
import type { PartType as SharedPartType } from '@mpf/shared';

export type MobileModelWithBrand = MobileModel & { brand: Brand };
export type PartWithCategory = Part & { partCategory: PartCategory };

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

export function mapPart(part: PartWithCategory) {
  return {
    id: part.id,
    name: part.name,
    type: part.partCategory.code as SharedPartType,
    partTypeId: part.partTypeId,
    partNumber: part.partNumber ?? undefined,
    manufacturer: part.manufacturer ?? undefined,
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
