import Link from 'next/link';
import { getPartTypeIcon, getPartTypeLabel, type Part } from '@mpf/shared';

type Props = {
  part: Part;
};

export function PartCard({ part }: Props) {
  return (
    <Link
      href={`/parts/${part.id}`}
      className="mb-2.5 flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition hover:border-primary/40 hover:bg-surface-muted/40"
    >
      <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-surface-muted text-lg">
        {getPartTypeIcon(part.type)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-foreground">{part.name}</span>
        <span className="mt-0.5 block text-[13px] text-text-secondary">
          {getPartTypeLabel(part.type)}
          {part.partNumber ? ` · ${part.partNumber}` : ''}
        </span>
      </span>
      <span className="text-2xl leading-7 text-text-muted">›</span>
    </Link>
  );
}
