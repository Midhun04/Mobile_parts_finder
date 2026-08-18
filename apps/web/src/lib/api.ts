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

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

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
    throw new ApiError(res.status, body || `API error ${res.status} for ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function searchAll(query: string, limit?: number): Promise<SearchResult> {
  const q = encodeURIComponent(query);
  const extra = limit ? `&limit=${limit}` : '';
  return apiFetch<SearchResult>(`/api/search?q=${q}${extra}`, { cache: 'no-store' });
}

export async function getAllBrands(): Promise<Brand[]> {
  return apiFetch<Brand[]>('/api/brands');
}

export async function getPopularBrands(limit = 8): Promise<Brand[]> {
  return apiFetch<Brand[]>(`/api/brands/popular?limit=${limit}`);
}

export async function getBrandById(id: number): Promise<Brand> {
  return apiFetch<Brand>(`/api/brands/${id}`);
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

export type CatalogIndexEntry = {
  id: number;
  updatedAt?: string;
};

export type CatalogIndex = {
  brands: CatalogIndexEntry[];
  models: CatalogIndexEntry[];
  parts: CatalogIndexEntry[];
  compatibility: { modelId: number; type: string }[];
};

export async function getCatalogIndex(): Promise<CatalogIndex> {
  return apiFetch<CatalogIndex>('/api/catalog-index');
}
