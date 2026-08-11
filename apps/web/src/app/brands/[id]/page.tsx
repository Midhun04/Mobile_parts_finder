import type { Metadata } from 'next';
import { getModelsByBrand } from '@/lib/api';
import { ModelCard } from '@/components/ModelCard';
import { EmptyState, ErrorState } from '@/components/QueryState';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { name } = await searchParams;
  return { title: name || `Brand ${id}` };
}

export default async function BrandModelsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { name } = await searchParams;
  const brandId = Number(id);

  if (Number.isNaN(brandId)) {
    return (
      <>
        <SiteHeader title="Brand" backHref="/" />
        <ErrorState message="Invalid brand id" />
      </>
    );
  }

  let models;
  try {
    models = await getModelsByBrand(brandId);
  } catch (err) {
    return (
      <>
        <SiteHeader title={name || 'Brand'} backHref="/" />
        <ErrorState message={err instanceof Error ? err.message : 'Failed to load models.'} />
      </>
    );
  }

  const brandName = name || models[0]?.brand.name || 'Brand';

  return (
    <>
      <SiteHeader title={brandName} backHref="/" />
      <main className="page-content">
        <h1 className="mb-4 text-[22px] font-extrabold text-foreground">{brandName} models</h1>
        {models.length === 0 ? (
          <EmptyState title="No models" body="No models for this brand yet." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
