import type { Metadata } from 'next';
import Link from 'next/link';
import { getPartTypeLabel, PART_TYPE_LABELS, type PartType } from '@mpf/shared';
import { notFound } from 'next/navigation';
import {
  getCompatibleModelsForPart,
  getModelById,
  getPartsForModel,
  isNotFoundError,
} from '@/lib/api';
import { formatModelName, isMatrixPartName } from '@/lib/format';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';
import { ErrorState } from '@/components/QueryState';
import { JsonLd } from '@/components/JsonLd';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string; type: string }>;
};

function parsePartType(value: string): PartType | null {
  const code = value.toUpperCase();
  if (code in PART_TYPE_LABELS) return code as PartType;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, type } = await params;
  const modelId = Number(id);
  const partType = parsePartType(type);
  if (Number.isNaN(modelId) || !partType) {
    return { title: 'Compatibility' };
  }

  try {
    const model = await getModelById(modelId);
    const name = formatModelName(model);
    const typeLabel = getPartTypeLabel(partType);
    return buildPageMetadata({
      title: `${typeLabel} for ${name}`,
      description: `Compatible ${typeLabel.toLowerCase()} options for the ${name}, including part numbers and other models that share the same part.`,
      path: `/models/${model.id}/compatibility/${partType}`,
    });
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    return { title: getPartTypeLabel(partType) };
  }
}

export default async function CompatibilityPage({ params }: Props) {
  const { id, type: typeParam } = await params;
  const modelId = Number(id);
  const partType = parsePartType(typeParam);

  if (Number.isNaN(modelId) || !partType) notFound();

  let model;
  let parts;
  try {
    [model, parts] = await Promise.all([
      getModelById(modelId),
      getPartsForModel(modelId, partType),
    ]);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    return (
      <>
        <SiteHeader title={getPartTypeLabel(partType)} backHref={`/models/${modelId}`} />
        <ErrorState message={err instanceof Error ? err.message : 'Failed to load.'} />
      </>
    );
  }

  const rows = await Promise.all(
    parts.map(async (part) => ({
      part,
      compatibleModels: await getCompatibleModelsForPart(part.id),
    })),
  );

  const name = formatModelName(model);
  const typeLabel = getPartTypeLabel(partType);
  const path = `/models/${model.id}/compatibility/${partType}`;

  return (
    <>
      <JsonLd
        data={{
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
            {
              '@type': 'ListItem',
              position: 4,
              name: typeLabel,
              item: absoluteUrl(path),
            },
          ],
        }}
      />
      <SiteHeader title={typeLabel} backHref={`/models/${modelId}`} />
      <main className="page-content">
        <p className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-accent">
          {typeLabel} compatibility
        </p>
        <h1 className="mb-[18px] text-xl font-extrabold text-foreground">
          {typeLabel} for {name}
        </h1>

        {rows.map(({ part, compatibleModels }) => {
          const showHeading = !isMatrixPartName(part.name);
          return (
            <div
              key={part.id}
              className="mb-3.5 rounded-2xl border border-border bg-surface p-4"
            >
              {showHeading ? (
                <Link href={`/parts/${part.id}`} className="block hover:opacity-80">
                  <p className="text-[17px] font-bold text-foreground">{part.name}</p>
                  {part.partNumber ? (
                    <p className="mt-1 text-[13px] text-text-secondary">
                      Part #: {part.partNumber}
                    </p>
                  ) : null}
                </Link>
              ) : null}

              <p
                className={`mb-2.5 text-sm font-bold text-text-secondary ${
                  showHeading ? 'mt-4' : ''
                }`}
              >
                Compatible models
              </p>
              {compatibleModels.map((row) => (
                <Link
                  key={row.model.id}
                  href={`/models/${row.model.id}`}
                  className="flex items-start gap-2.5 border-t border-border py-2.5"
                >
                  <span className="mt-0.5 font-extrabold text-primary">✓</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-foreground">
                      {formatModelName(row.model)}
                    </span>
                    {row.notes ? (
                      <span className="mt-1 block text-xs text-text-muted">{row.notes}</span>
                    ) : null}
                  </span>
                  <span
                    className={`ml-2 rounded-lg px-2 py-1 text-[11px] font-bold ${
                      row.verified
                        ? 'bg-verified-bg text-verified'
                        : 'bg-unverified-bg text-unverified'
                    }`}
                  >
                    {row.verified ? 'Verified' : 'Unverified'}
                  </span>
                </Link>
              ))}
            </div>
          );
        })}
      </main>
    </>
  );
}
