import type { Metadata } from 'next';
import type { PartType } from '@mpf/shared';
import { getModelById, getPartsForModel } from '@/lib/api';
import { formatModelName } from '@/lib/format';
import { EmptyState, ErrorState } from '@/components/QueryState';
import { PartCategoryRow } from '@/components/PartCategoryRow';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const model = await getModelById(Number(id));
    return { title: formatModelName(model) };
  } catch {
    return { title: 'Model details' };
  }
}

export default async function ModelDetailsPage({ params }: Props) {
  const { id } = await params;
  const modelId = Number(id);

  if (Number.isNaN(modelId)) {
    return (
      <>
        <SiteHeader title="Model details" backHref="/" />
        <ErrorState message="Invalid model id" />
      </>
    );
  }

  let model;
  let parts;
  try {
    [model, parts] = await Promise.all([getModelById(modelId), getPartsForModel(modelId)]);
  } catch (err) {
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

  return (
    <>
      <SiteHeader title="Model details" backHref="/" />
      <main className="mx-auto max-w-3xl px-5 py-5 pb-12">
        <div className="mb-6 rounded-[18px] bg-primary p-5 text-white dark:bg-primary-dark">
          <p className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-white/75">
            {model.brand.name}
          </p>
          <h1 className="mb-2.5 text-2xl font-extrabold">{formatModelName(model)}</h1>
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
