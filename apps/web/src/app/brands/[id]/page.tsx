import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getBrandById,
  getModelsByBrand,
  isNotFoundError,
} from '@/lib/api';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { ModelCard } from '@/components/ModelCard';
import { EmptyState, ErrorState } from '@/components/QueryState';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const brandId = Number(id);
  if (Number.isNaN(brandId)) {
    return { title: 'Brand not found' };
  }

  try {
    const brand = await getBrandById(brandId);
    return buildPageMetadata({
      title: `${brand.name} models and spare parts`,
      description: `Browse ${brand.name} mobile models and find compatible spare parts in Parts Finder.`,
      path: `/brands/${brand.id}`,
    });
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    return { title: 'Brand' };
  }
}

export default async function BrandModelsPage({ params }: Props) {
  const { id } = await params;
  const brandId = Number(id);

  if (Number.isNaN(brandId)) notFound();

  let brand;
  let models;
  try {
    [brand, models] = await Promise.all([getBrandById(brandId), getModelsByBrand(brandId)]);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    return (
      <>
        <SiteHeader title="Brand" backHref="/inventory" />
        <ErrorState message={err instanceof Error ? err.message : 'Failed to load models.'} />
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: absoluteUrl('/'),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Inventory',
                item: absoluteUrl('/inventory'),
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: brand.name,
                item: absoluteUrl(`/brands/${brand.id}`),
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${brand.name} models`,
            url: absoluteUrl(`/brands/${brand.id}`),
            description: `Browse ${brand.name} mobile models and find compatible spare parts.`,
          },
        ]}
      />
      <SiteHeader title={brand.name} backHref="/inventory" />
      <main className="page-content">
        <h1 className="mb-4 text-[22px] font-extrabold text-foreground">{brand.name} models</h1>
        {models.length === 0 ? (
          <EmptyState title="No models" body="No models for this brand yet." />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
