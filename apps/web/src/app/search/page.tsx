import type { Metadata } from 'next';
import { searchAll } from '@/lib/api';
import { ModelCard } from '@/components/ModelCard';
import { PartCard } from '@/components/PartCard';
import { EmptyState, ErrorState } from '@/components/QueryState';
import { SearchBar } from '@/components/SearchBar';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search results',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  let results = { models: [], parts: [] } as Awaited<ReturnType<typeof searchAll>>;
  let error: string | null = null;

  if (query) {
    try {
      results = await searchAll(query);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Search failed.';
    }
  }

  return (
    <>
      <SiteHeader title="Search results" backHref="/" />
      <div className="border-b border-border bg-background px-5 py-3">
        <div className="mx-auto max-w-3xl">
          <SearchBar initialQuery={query} autoFocus />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : (
        <main className="mx-auto max-w-3xl px-5 py-5 pb-12">
          {query ? (
            <p className="mb-4 text-sm text-text-secondary">Results for “{query}”</p>
          ) : (
            <EmptyState
              title="Enter a search"
              body="Try a brand, model name, model number, or part number like BN-59."
            />
          )}

          {query && results.models.length === 0 && results.parts.length === 0 ? (
            <EmptyState
              title="No matches found"
              body="Try a brand, model name, model number, or part number like BN-59."
            />
          ) : null}

          {results.models.length > 0 ? (
            <>
              <h2 className="mb-3 text-[17px] font-bold text-foreground">Mobile models</h2>
              {results.models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </>
          ) : null}

          {results.parts.length > 0 ? (
            <>
              <h2
                className={`mb-3 text-[17px] font-bold text-foreground ${
                  results.models.length > 0 ? 'mt-[18px]' : ''
                }`}
              >
                Spare parts
              </h2>
              {results.parts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </>
          ) : null}
        </main>
      )}
    </>
  );
}
