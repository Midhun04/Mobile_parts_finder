import Link from 'next/link';
import { getPartTypeIcon, getPartTypeLabel, type Part } from '@mpf/shared';
import { isMatrixPartName } from '@/lib/format';

type Props = {
  part: Part;
  className?: string;
};

export function PartCard({ part, className = '' }: Props) {
  if (isMatrixPartName(part.name)) return null;

  return (
    <Link
      href={`/parts/${part.id}`}
      className={`flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition hover:border-primary/50 hover:bg-surface-muted/40 dark:border-white/8 dark:bg-[#161b24] dark:hover:border-primary/40 ${className}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-lg dark:bg-[#222833]">
        {getPartTypeIcon(part.type)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-foreground">{part.name}</span>
        <span className="mt-0.5 block truncate text-[13px] text-text-secondary">
          {getPartTypeLabel(part.type)}
          {part.partNumber ? ` · ${part.partNumber}` : ''}
        </span>
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
