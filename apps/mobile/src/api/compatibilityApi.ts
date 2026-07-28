import type { Brand, MobileModelWithBrand, Part, PartType, SearchResult } from '@mpf/shared';
import { apiClient } from './client';

export type CompatibleModelRow = {
  model: MobileModelWithBrand;
  verified: boolean;
  notes?: string;
};

export async function searchAll(query: string): Promise<SearchResult> {
  const { data } = await apiClient.get<SearchResult>('/api/search', {
    params: { q: query },
  });
  return data;
}

export async function getPopularBrands(): Promise<Brand[]> {
  const { data } = await apiClient.get<Brand[]>('/api/brands/popular');
  return data;
}

export async function getRecentlyAddedModels(): Promise<MobileModelWithBrand[]> {
  const { data } = await apiClient.get<MobileModelWithBrand[]>('/api/mobile-models/recent');
  return data;
}

export async function getModelsByBrand(brandId: number): Promise<MobileModelWithBrand[]> {
  const { data } = await apiClient.get<MobileModelWithBrand[]>(`/api/brands/${brandId}/models`);
  return data;
}

export async function getModelById(id: number): Promise<MobileModelWithBrand> {
  const { data } = await apiClient.get<MobileModelWithBrand>(`/api/mobile-models/${id}`);
  return data;
}

export async function getPartsForModel(modelId: number, type?: PartType): Promise<Part[]> {
  const { data } = await apiClient.get<Part[]>(`/api/mobile-models/${modelId}/parts`, {
    params: type ? { type } : undefined,
  });
  return data;
}

export async function getPartById(id: number): Promise<Part> {
  const { data } = await apiClient.get<Part>(`/api/parts/${id}`);
  return data;
}

export async function getCompatibleModelsForPart(partId: number): Promise<CompatibleModelRow[]> {
  const { data } = await apiClient.get<CompatibleModelRow[]>(
    `/api/parts/${partId}/compatible-models`,
  );
  return data;
}
