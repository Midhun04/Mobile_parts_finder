import Link from 'next/link';
import { getPartTypeIcon, getPartTypeLabel, type PartType } from '@mpf/shared';

type Props = {
  modelId: number;
  type: PartType;
  count: number;
};

export function PartCategoryRow({ modelId, type, count }: Props) {
  return (
    <Link
      href={`/models/${modelId}/compatibility/${type}`}
      className="mb-2.5 flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-4 transition hover:border-primary/40 hover:bg-surface-muted/40"
    >
      <span className="text-xl">{getPartTypeIcon(type)}</span>
      <span className="flex-1 text-base font-semibold text-foreground">
        {getPartTypeLabel(type)}
      </span>
      <span className="mr-2 rounded-lg bg-surface-muted px-2 py-1 text-[13px] font-bold text-primary">
        {count}
      </span>
      <span className="text-2xl leading-7 text-text-muted">›</span>
    </Link>
  );
}
