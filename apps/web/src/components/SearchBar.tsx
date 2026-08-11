'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { MobileModelWithBrand } from '@mpf/shared';
import { searchAll } from '@/lib/api';
import { formatModelName } from '@/lib/format';

type Props = {
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
};

const SUGGEST_MIN_CHARS = 2;
const SUGGEST_LIMIT = 8;
const SUGGEST_DEBOUNCE_MS = 250;

export function SearchBar({ initialQuery = '', autoFocus = false, className = '' }: Props) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<MobileModelWithBrand[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < SUGGEST_MIN_CHARS) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const results = await searchAll(trimmed, SUGGEST_LIMIT);
        if (controller.signal.aborted) return;
        setSuggestions(results.models);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SUGGEST_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const goToModel = (model: MobileModelWithBrand) => {
    setOpen(false);
    router.push(`/models/${model.id}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToModel(suggestions[activeIndex]);
      return;
    }
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const showList = open && query.trim().length >= SUGGEST_MIN_CHARS;

  return (
    <form
      ref={rootRef}
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2.5 md:flex-row ${className}`}
    >
      <div className="relative min-w-0 flex-1">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-3.5 z-10 h-[18px] w-[18px] -translate-y-1/2 text-text-muted"
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
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (!showList || suggestions.length === 0) {
              if (e.key === 'Escape') setOpen(false);
              return;
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
            } else if (e.key === 'Escape') {
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
          autoFocus={autoFocus}
          placeholder="Search model or part number..."
          aria-label="Search models or parts"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showList}
          autoComplete="off"
          className="w-full rounded-xl border border-border bg-surface-muted/70 py-3 pr-4 pl-11 text-[15px] text-foreground outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/8 dark:bg-[#1a1e27]"
        />

        {showList ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute top-[calc(100%+6px)] right-0 left-0 z-30 max-h-72 overflow-auto rounded-xl border border-border bg-surface py-1 shadow-lg dark:border-white/10 dark:bg-[#161b24]"
          >
            {loading && suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-text-muted">Searching…</li>
            ) : suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-text-muted">No matching models</li>
            ) : (
              suggestions.map((model, index) => (
                <li key={model.id} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToModel(model)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                      index === activeIndex
                        ? 'bg-primary/15'
                        : 'hover:bg-surface-muted/80 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary dark:bg-[#222833]">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="7" y="3" width="10" height="18" rx="2" />
                        <path d="M11 18h2" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground">
                        {formatModelName(model)}
                      </span>
                      {model.modelNumber ? (
                        <span className="mt-0.5 block truncate text-xs text-text-secondary">
                          Model: {model.modelNumber}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
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
