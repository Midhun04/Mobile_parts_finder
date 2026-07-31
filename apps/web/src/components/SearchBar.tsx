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
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search model or part number…"
        aria-label="Search models or parts"
        className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-foreground outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-primary px-5 py-3 text-[15px] font-bold text-white transition hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary"
      >
        Search
      </button>
    </form>
  );
}
