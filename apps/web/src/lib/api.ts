import type {
  Brand,
  MobileModelWithBrand,
  Part,
  PartType,
  SearchResult,
} from '@mpf/shared';

export type CompatibleModelRow = {
  model: MobileModelWithBrand;
  verified: boolean;
  notes?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    ...(init?.cache ? {} : { next: { revalidate: 30 } }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || `API error ${res.status} for ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function searchAll(query: string): Promise<SearchResult> {
  const q = encodeURIComponent(query);
  return apiFetch<SearchResult>(`/api/search?q=${q}`, { cache: 'no-store' });
}

export async function getPopularBrands(): Promise<Brand[]> {
  return apiFetch<Brand[]>('/api/brands/popular');
}

export async function getRecentlyAddedModels(): Promise<MobileModelWithBrand[]> {
  return apiFetch<MobileModelWithBrand[]>('/api/mobile-models/recent');
}

export async function getModelsByBrand(brandId: number): Promise<MobileModelWithBrand[]> {
  return apiFetch<MobileModelWithBrand[]>(`/api/brands/${brandId}/models`);
}

export async function getModelById(id: number): Promise<MobileModelWithBrand> {
  return apiFetch<MobileModelWithBrand>(`/api/mobile-models/${id}`);
}

export async function getPartsForModel(modelId: number, type?: PartType): Promise<Part[]> {
  const params = type ? `?type=${encodeURIComponent(type)}` : '';
  return apiFetch<Part[]>(`/api/mobile-models/${modelId}/parts${params}`);
}

export async function getPartById(id: number): Promise<Part> {
  return apiFetch<Part>(`/api/parts/${id}`);
}

export async function getCompatibleModelsForPart(partId: number): Promise<CompatibleModelRow[]> {
  return apiFetch<CompatibleModelRow[]>(`/api/parts/${partId}/compatible-models`);
}
