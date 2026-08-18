import type { MetadataRoute } from 'next';
import { getCatalogIndex } from '@/lib/api';
import { getSiteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: site,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${site}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    const catalog = await getCatalogIndex();
    return [
      ...staticRoutes,
      ...catalog.brands.map((brand) => ({
        url: `${site}/brands/${brand.id}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...catalog.models.map((model) => ({
        url: `${site}/models/${model.id}`,
        lastModified: model.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...catalog.parts.map((part) => ({
        url: `${site}/parts/${part.id}`,
        lastModified: part.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...(catalog.compatibility ?? []).map((entry) => ({
        url: `${site}/models/${entry.modelId}/compatibility/${entry.type}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
