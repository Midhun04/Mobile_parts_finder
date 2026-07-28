import {
  brands,
  compatibilities,
  mobileModels,
  parts,
  popularBrandIds,
  recentlyAddedModelIds,
} from '../data/mockData';
import type {
  MobileModelWithBrand,
  Part,
  PartType,
  SearchResult,
} from '@mpf/shared';

function getBrand(brandId: number) {
  const brand = brands.find((item) => item.id === brandId);
  if (!brand) {
    throw new Error(`Brand ${brandId} not found`);
  }
  return brand;
}

export function withBrand(modelId: number): MobileModelWithBrand | undefined {
  const model = mobileModels.find((item) => item.id === modelId);
  if (!model) return undefined;
  return { ...model, brand: getBrand(model.brandId) };
}

export function getAllModelsWithBrand(): MobileModelWithBrand[] {
  return mobileModels.map((model) => ({
    ...model,
    brand: getBrand(model.brandId),
  }));
}

export function getModelById(id: number): MobileModelWithBrand | undefined {
  return withBrand(id);
}

export function getPartById(id: number): Part | undefined {
  return parts.find((part) => part.id === id);
}

export function getPopularBrands() {
  return brands.filter((brand) => popularBrandIds.includes(brand.id));
}

export function getRecentlyAddedModels(): MobileModelWithBrand[] {
  return recentlyAddedModelIds
    .map((id) => withBrand(id))
    .filter((model): model is MobileModelWithBrand => Boolean(model));
}

export function searchAll(query: string): SearchResult {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { models: [], parts: [] };
  }

  const matchedModels = getAllModelsWithBrand().filter((model) => {
    const haystack = [
      model.name,
      model.modelNumber ?? '',
      model.brand.name,
      `${model.brand.name} ${model.name}`,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  const matchedParts = parts.filter((part) => {
    const haystack = [part.name, part.partNumber ?? '', part.type, part.description ?? '']
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  return { models: matchedModels, parts: matchedParts };
}

export function getPartsForModel(modelId: number): Part[] {
  const partIds = compatibilities
    .filter((item) => item.mobileModelId === modelId)
    .map((item) => item.partId);

  return parts.filter((part) => partIds.includes(part.id));
}

export function getPartsForModelByType(modelId: number, type: PartType): Part[] {
  return getPartsForModel(modelId).filter((part) => part.type === type);
}

export function getCompatibleModelsForPart(partId: number): MobileModelWithBrand[] {
  const modelIds = compatibilities
    .filter((item) => item.partId === partId)
    .map((item) => item.mobileModelId);

  return modelIds
    .map((id) => withBrand(id))
    .filter((model): model is MobileModelWithBrand => Boolean(model));
}

export function getCompatibilityMeta(modelId: number, partId: number) {
  return compatibilities.find(
    (item) => item.mobileModelId === modelId && item.partId === partId,
  );
}

export function getModelsByBrand(brandId: number): MobileModelWithBrand[] {
  return getAllModelsWithBrand().filter((model) => model.brandId === brandId);
}

export function formatModelName(model: MobileModelWithBrand): string {
  return `${model.brand.name} ${model.name}`;
}
