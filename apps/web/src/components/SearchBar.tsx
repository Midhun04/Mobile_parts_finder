'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
};

export function SearchBar({ initialQuery = '', autoFocus = false, className = '' }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-2.5 md:flex-row ${className}`}>
      <div className="relative min-w-0 flex-1">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Search model or part number..."
          aria-label="Search models or parts"
          className="w-full rounded-xl border border-border bg-surface-muted/70 py-3 pr-4 pl-11 text-[15px] text-foreground outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/8 dark:bg-[#1a1e27]"
        />
      </div>
      <button
        type="submit"
        className="w-full shrink-0 rounded-xl bg-primary px-6 py-3 text-[15px] font-bold text-white transition hover:bg-primary-dark md:w-auto dark:bg-[#4ecfff] dark:text-[#071018] dark:hover:bg-[#7adfff]"
      >
        Search
      </button>
    </form>
  );
}
