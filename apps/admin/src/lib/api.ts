import { clearToken, getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401 && !path.includes('/auth/login')) {
    clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? res.statusText);
  }
  return data as T;
}

export type AdminUser = { id: number; email: string; role: string };
export type Stats = {
  brands: number;
  models: number;
  parts: number;
  compatibilities: number;
  unverified: number;
  groups: number;
  partTypes: number;
};

export type BrandRow = { id: number; name: string; modelCount: number };
export type PartTypeRow = { id: number; name: string; code: string; partCount: number };
export type ModelRow = {
  id: number;
  name: string;
  brandId: number;
  modelNumber?: string;
  releaseYear?: number;
  brand: { id: number; name: string };
  partCount?: number;
};
export type PartRow = {
  id: number;
  name: string;
  type: string;
  partTypeId: number;
  partNumber?: string;
  manufacturer?: string;
  description?: string;
  modelCount?: number;
};
export type CompatRow = {
  id: number;
  verified: boolean;
  notes?: string;
  model: ModelRow;
  part: PartRow;
};
export type GroupRow = {
  id: number;
  name: string;
  partTypeId: number;
  partType: { id: number; name: string; code: string };
  supplierCode?: string;
  notes?: string;
  partId?: number;
  part?: PartRow;
  members: ModelRow[];
  memberCount: number;
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

async function downloadCatalogCsv(): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/admin/export/catalog`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (data as { error?: string }).error ?? res.statusText);
  }
  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition') ?? '';
  const match = /filename="([^"]+)"/.exec(disposition);
  const filename = match?.[1] ?? 'mpf-catalog.csv';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AdminUser }>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<AdminUser>('/api/admin/auth/me'),
  stats: () => request<Stats>('/api/admin/stats'),

  brands: () => request<BrandRow[]>('/api/admin/brands'),
  createBrand: (name: string) =>
    request<{ id: number; name: string }>('/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  updateBrand: (id: number, name: string) =>
    request(`/api/admin/brands/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
  deleteBrand: (id: number) => request<void>(`/api/admin/brands/${id}`, { method: 'DELETE' }),

  models: (params?: { q?: string; brandId?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.brandId) sp.set('brandId', String(params.brandId));
    sp.set('limit', '200');
    return request<ModelRow[]>(`/api/admin/models?${sp}`);
  },
  model: (id: number) =>
    request<
      ModelRow & {
        aliases: { id: number; alias: string }[];
        parts: (PartRow & { compatibilityId: number; verified: boolean; notes?: string })[];
      }
    >(`/api/admin/models/${id}`),
  createModel: (body: {
    name: string;
    brandId: number;
    modelNumber?: string;
    releaseYear?: number;
  }) =>
    request<ModelRow>('/api/admin/models', { method: 'POST', body: JSON.stringify(body) }),
  updateModel: (id: number, body: Record<string, unknown>) =>
    request<ModelRow>(`/api/admin/models/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteModel: (id: number) => request<void>(`/api/admin/models/${id}`, { method: 'DELETE' }),
  addAlias: (id: number, alias: string) =>
    request(`/api/admin/models/${id}/aliases`, {
      method: 'POST',
      body: JSON.stringify({ alias }),
    }),
  deleteAlias: (id: number, aliasId: number) =>
    request<void>(`/api/admin/models/${id}/aliases/${aliasId}`, { method: 'DELETE' }),

  partTypes: () => request<PartTypeRow[]>('/api/admin/part-types'),

  parts: (params?: { q?: string; partTypeId?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.partTypeId) sp.set('partTypeId', String(params.partTypeId));
    sp.set('limit', '200');
    return request<PartRow[]>(`/api/admin/parts?${sp}`);
  },
  part: (id: number) =>
    request<
      PartRow & {
        groupId?: number;
        models: (ModelRow & { compatibilityId: number; verified: boolean; notes?: string })[];
      }
    >(`/api/admin/parts/${id}`),
  createPart: (body: Record<string, unknown>) =>
    request<PartRow>('/api/admin/parts', { method: 'POST', body: JSON.stringify(body) }),
  updatePart: (id: number, body: Record<string, unknown>) =>
    request<PartRow>(`/api/admin/parts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deletePart: (id: number) => request<void>(`/api/admin/parts/${id}`, { method: 'DELETE' }),

  compatibility: (unverified?: boolean) =>
    request<CompatRow[]>(
      `/api/admin/compatibility?limit=200${unverified ? '&unverified=1' : ''}`,
    ),
  createCompatibility: (body: {
    mobileModelId: number;
    partId: number;
    verified?: boolean;
    notes?: string;
  }) =>
    request('/api/admin/compatibility', { method: 'POST', body: JSON.stringify(body) }),
  updateCompatibility: (id: number, body: { verified?: boolean; notes?: string }) =>
    request(`/api/admin/compatibility/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  deleteCompatibility: (id: number) =>
    request<void>(`/api/admin/compatibility/${id}`, { method: 'DELETE' }),

  groups: (partTypeId?: number) => {
    const sp = partTypeId ? `?partTypeId=${partTypeId}` : '';
    return request<GroupRow[]>(`/api/admin/groups${sp}`);
  },
  group: (id: number) => request<GroupRow>(`/api/admin/groups/${id}`),
  createGroup: (body: {
    name: string;
    partTypeId: number;
    modelIds?: number[];
    supplierCode?: string;
    notes?: string;
    verified?: boolean;
  }) => request<GroupRow>('/api/admin/groups', { method: 'POST', body: JSON.stringify(body) }),
  updateGroup: (id: number, body: Record<string, unknown>) =>
    request<GroupRow>(`/api/admin/groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  deleteGroup: (id: number) => request<void>(`/api/admin/groups/${id}`, { method: 'DELETE' }),
  addGroupMembers: (id: number, modelIds: number[]) =>
    request<GroupRow>(`/api/admin/groups/${id}/members`, {
      method: 'POST',
      body: JSON.stringify({ modelIds }),
    }),
  removeGroupMember: (id: number, modelId: number) =>
    request<GroupRow>(`/api/admin/groups/${id}/members/${modelId}`, { method: 'DELETE' }),

  exportCatalog: () => downloadCatalogCsv(),
  importCatalogPreview: (csv: string) =>
    request<ImportPreview>('/api/admin/import/csv', {
      method: 'POST',
      body: JSON.stringify({ csv, dryRun: true }),
    }),
  importCatalogApply: (csv: string) =>
    request<ImportPreview>('/api/admin/import/csv', {
      method: 'POST',
      body: JSON.stringify({ csv, dryRun: false }),
    }),
};
