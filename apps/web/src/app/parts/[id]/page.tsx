import type { Metadata } from 'next';
import { getPartTypeIcon, getPartTypeLabel, type Part } from '@mpf/shared';
import { notFound } from 'next/navigation';
import {
  getCompatibleModelsForPart,
  getPartById,
  isNotFoundError,
} from '@/lib/api';
import { isMatrixPartName } from '@/lib/format';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';
import { EmptyState, ErrorState } from '@/components/QueryState';
import { JsonLd } from '@/components/JsonLd';
import { ModelCard } from '@/components/ModelCard';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string }>;
};

function partDisplayName(part: Part): string {
  return isMatrixPartName(part.name) ? getPartTypeLabel(part.type) : part.name;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const partId = Number(id);
  if (Number.isNaN(partId)) {
    return { title: 'Part not found' };
  }

  try {
    const part = await getPartById(partId);
    const name = partDisplayName(part);
    const numberBit = part.partNumber ? ` (${part.partNumber})` : '';
    return buildPageMetadata({
      title: `${name}${numberBit} compatible models`,
      description: `See which mobile models are compatible with ${name}${numberBit}. Part type: ${getPartTypeLabel(part.type)}.`,
      path: `/parts/${part.id}`,
    });
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    return { title: 'Part details' };
  }
}

export default async function PartDetailsPage({ params }: Props) {
  const { id } = await params;
  const partId = Number(id);

  if (Number.isNaN(partId)) notFound();

  let part;
  let rows;
  try {
    [part, rows] = await Promise.all([
      getPartById(partId),
      getCompatibleModelsForPart(partId),
    ]);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    return (
      <>
        <SiteHeader title="Part details" backHref="/" />
        <ErrorState message={err instanceof Error ? err.message : 'Failed to load part.'} />
      </>
    );
  }

  const hideMatrixHeading = isMatrixPartName(part.name);
  const name = partDisplayName(part);

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
                name,
                item: absoluteUrl(`/parts/${part.id}`),
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name,
            category: getPartTypeLabel(part.type),
            ...(part.partNumber ? { sku: part.partNumber, mpn: part.partNumber } : {}),
            ...(part.manufacturer
              ? { brand: { '@type': 'Brand', name: part.manufacturer } }
              : {}),
            description:
              part.description ||
              `Compatible mobile models for ${name}${part.partNumber ? ` (${part.partNumber})` : ''}.`,
            url: absoluteUrl(`/parts/${part.id}`),
          },
        ]}
      />
      <SiteHeader title="Part details" backHref="/" />
      <main className="page-content">
        <div className="mb-6 rounded-[18px] border border-border bg-surface p-5">
          <p className="mb-2 text-[28px]">{getPartTypeIcon(part.type)}</p>
          <p className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-accent">
            {getPartTypeLabel(part.type)}
          </p>
          {!hideMatrixHeading ? (
            <h1 className="text-[22px] font-extrabold text-foreground">{part.name}</h1>
          ) : (
            <h1 className="text-[22px] font-extrabold text-foreground">{getPartTypeLabel(part.type)}</h1>
          )}
          {part.partNumber ? (
            <p className="mt-2 text-sm text-text-secondary">Part number: {part.partNumber}</p>
          ) : null}
          {part.manufacturer ? (
            <p className="mt-2 text-sm text-text-secondary">
              Manufacturer: {part.manufacturer}
            </p>
          ) : null}
          {part.description && !hideMatrixHeading ? (
            <p className="mt-3 text-sm leading-5 text-text-secondary">{part.description}</p>
          ) : null}
        </div>

        <h2 className="mb-3 text-[17px] font-bold text-foreground">Compatible models</h2>
        {rows.length === 0 ? (
          <EmptyState title="No models" body="No compatible models linked yet." />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows.map((row) => (
              <div key={row.model.id}>
                <ModelCard model={row.model} />
                <div
                  className={`mt-1.5 rounded-[10px] px-3 py-2 text-xs font-semibold ${
                    row.verified
                      ? 'bg-verified-bg text-verified'
                      : 'bg-unverified-bg text-unverified'
                  }`}
                >
                  {row.verified
                    ? 'Verified compatibility'
                    : 'Unverified — review recommended'}
                  {row.notes ? ` · ${row.notes}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
