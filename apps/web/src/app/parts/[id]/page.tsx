import type { Metadata } from 'next';
import { getPartTypeIcon, getPartTypeLabel } from '@mpf/shared';
import { getCompatibleModelsForPart, getPartById } from '@/lib/api';
import { isMatrixPartName } from '@/lib/format';
import { EmptyState, ErrorState } from '@/components/QueryState';
import { ModelCard } from '@/components/ModelCard';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const part = await getPartById(Number(id));
    return {
      title: isMatrixPartName(part.name) ? getPartTypeLabel(part.type) : part.name,
    };
  } catch {
    return { title: 'Part details' };
  }
}

export default async function PartDetailsPage({ params }: Props) {
  const { id } = await params;
  const partId = Number(id);

  if (Number.isNaN(partId)) {
    return (
      <>
        <SiteHeader title="Part details" backHref="/" />
        <ErrorState message="Invalid part id" />
      </>
    );
  }

  let part;
  let rows;
  try {
    [part, rows] = await Promise.all([
      getPartById(partId),
      getCompatibleModelsForPart(partId),
    ]);
  } catch (err) {
    return (
      <>
        <SiteHeader title="Part details" backHref="/" />
        <ErrorState message={err instanceof Error ? err.message : 'Failed to load part.'} />
      </>
    );
  }

  const hideMatrixHeading = isMatrixPartName(part.name);

  return (
    <>
      <SiteHeader title="Part details" backHref="/" />
      <main className="page-content">
        <div className="mb-6 rounded-[18px] border border-border bg-surface p-5">
          <p className="mb-2 text-[28px]">{getPartTypeIcon(part.type)}</p>
          <p className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-accent">
            {getPartTypeLabel(part.type)}
          </p>
          {!hideMatrixHeading ? (
            <h1 className="text-[22px] font-extrabold text-foreground">{part.name}</h1>
          ) : null}
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
