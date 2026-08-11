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
      <SiteHeader title={query ? 'Search results' : undefined} backHref={query ? '/' : undefined} />
      <main className="page-content">
        <SearchBar initialQuery={query} autoFocus />

        {error ? (
          <div className="mt-6 rounded-2xl border border-danger/30 bg-surface p-5">
            <p className="font-bold text-danger">Unable to load data</p>
            <p className="mt-2 text-sm text-text-secondary">{error}</p>
          </div>
        ) : (
          <div className="mt-6">
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
                <h2 className="mb-3 text-lg font-bold text-foreground">Mobile models</h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.models.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </>
            ) : null}

            {results.parts.length > 0 ? (
              <>
                <h2
                  className={`mb-3 text-lg font-bold text-foreground ${
                    results.models.length > 0 ? 'mt-8' : ''
                  }`}
                >
                  Spare parts
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.parts.map((part) => (
                    <PartCard key={part.id} part={part} />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        )}
      </main>
    </>
  );
}
