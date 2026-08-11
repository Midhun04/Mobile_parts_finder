import Link from 'next/link';
import type { MobileModelWithBrand } from '@mpf/shared';
import { formatModelName } from '@/lib/format';

type Props = {
  model: MobileModelWithBrand;
  className?: string;
};

export function ModelCard({ model, className = '' }: Props) {
  return (
    <Link
      href={`/models/${model.id}`}
      className={`flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition hover:border-primary/50 hover:bg-surface-muted/40 dark:border-white/8 dark:bg-[#161b24] dark:hover:border-primary/40 ${className}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-secondary dark:bg-[#222833]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M11 18h2" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-foreground">
          {formatModelName(model)}
        </span>
        {model.modelNumber ? (
          <span className="mt-0.5 block truncate text-[13px] text-text-secondary">
            Model: {model.modelNumber}
          </span>
        ) : null}
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
