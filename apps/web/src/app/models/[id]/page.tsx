import type { Metadata } from 'next';
import type { PartType } from '@mpf/shared';
import { notFound } from 'next/navigation';
import { getModelById, getPartsForModel, isNotFoundError } from '@/lib/api';
import { formatModelName } from '@/lib/format';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';
import { EmptyState, ErrorState } from '@/components/QueryState';
import { JsonLd } from '@/components/JsonLd';
import { PartCategoryRow } from '@/components/PartCategoryRow';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const modelId = Number(id);
  if (Number.isNaN(modelId)) {
    return { title: 'Model not found' };
  }

  try {
    const model = await getModelById(modelId);
    const name = formatModelName(model);
    const numberBit = model.modelNumber ? ` (${model.modelNumber})` : '';
    return buildPageMetadata({
      title: `${name} compatible parts`,
      description: `Find compatible spare parts for the ${name}${numberBit}. Browse displays, batteries, and other part categories.`,
      path: `/models/${model.id}`,
    });
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    return { title: 'Model details' };
  }
}

export default async function ModelDetailsPage({ params }: Props) {
  const { id } = await params;
  const modelId = Number(id);

  if (Number.isNaN(modelId)) notFound();

  let model;
  let parts;
  try {
    [model, parts] = await Promise.all([getModelById(modelId), getPartsForModel(modelId)]);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    return (
      <>
        <SiteHeader title="Model details" backHref="/" />
        <ErrorState message={err instanceof Error ? err.message : 'Failed to load model.'} />
      </>
    );
  }

  const grouped = parts.reduce<Partial<Record<PartType, number>>>((acc, part) => {
    acc[part.type] = (acc[part.type] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(grouped) as [PartType, number][];
  const name = formatModelName(model);

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
                name: model.brand.name,
                item: absoluteUrl(`/brands/${model.brand.id}`),
              },
              {
                '@type': 'ListItem',
                position: 3,
                name,
                item: absoluteUrl(`/models/${model.id}`),
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name,
            brand: {
              '@type': 'Brand',
              name: model.brand.name,
            },
            ...(model.modelNumber ? { sku: model.modelNumber, mpn: model.modelNumber } : {}),
            description: `Compatible spare parts for the ${name}.`,
            url: absoluteUrl(`/models/${model.id}`),
          },
        ]}
      />
      <SiteHeader title="Model details" backHref={`/brands/${model.brand.id}`} />
      <main className="page-content">
        <div className="mb-6 rounded-[18px] bg-primary p-5 text-white dark:bg-primary-dark">
          <p className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-white/75">
            {model.brand.name}
          </p>
          <h1 className="mb-2.5 text-2xl font-extrabold">{name}</h1>
          {model.modelNumber ? (
            <p className="text-sm text-white/85">Model number: {model.modelNumber}</p>
          ) : null}
          {model.releaseYear ? (
            <p className="mt-0.5 text-sm text-white/85">Released: {model.releaseYear}</p>
          ) : null}
        </div>

        <h2 className="mb-3 text-[17px] font-bold text-foreground">Compatible parts</h2>
        {categories.length === 0 ? (
          <EmptyState title="No parts" body="No parts linked to this model yet." />
        ) : (
          categories.map(([type, count]) => (
            <PartCategoryRow key={type} modelId={model.id} type={type} count={count} />
          ))
        )}
      </main>
    </>
  );
}
