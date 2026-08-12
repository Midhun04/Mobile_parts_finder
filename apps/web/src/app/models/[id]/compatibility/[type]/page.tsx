import type { Metadata } from 'next';
import Link from 'next/link';
import { getPartTypeLabel, type PartType } from '@mpf/shared';
import {
  getCompatibleModelsForPart,
  getModelById,
  getPartsForModel,
} from '@/lib/api';
import { formatModelName, isMatrixPartName } from '@/lib/format';
import { ErrorState } from '@/components/QueryState';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  params: Promise<{ id: string; type: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  return { title: getPartTypeLabel(type.toUpperCase()) };
}

export default async function CompatibilityPage({ params }: Props) {
  const { id, type: typeParam } = await params;
  const modelId = Number(id);
  const partType = typeParam.toUpperCase() as PartType;

  if (Number.isNaN(modelId)) {
    return (
      <>
        <SiteHeader title="Compatibility" backHref="/" />
        <ErrorState message="Invalid model id" />
      </>
    );
  }

  let model;
  let parts;
  try {
    [model, parts] = await Promise.all([
      getModelById(modelId),
      getPartsForModel(modelId, partType),
    ]);
  } catch (err) {
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

  return (
    <>
      <SiteHeader title={getPartTypeLabel(partType)} backHref={`/models/${modelId}`} />
      <main className="page-content">
        <p className="mb-1.5 text-[13px] font-bold uppercase tracking-wider text-accent">
          {getPartTypeLabel(partType)} compatibility
        </p>
        <h1 className="mb-[18px] text-xl font-extrabold text-foreground">
          Selected: {formatModelName(model)}
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
