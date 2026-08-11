import Link from 'next/link';
import { getPopularBrands, getRecentlyAddedModels } from '@/lib/api';
import { ModelCard } from '@/components/ModelCard';
import { ErrorState } from '@/components/QueryState';
import { SearchBar } from '@/components/SearchBar';
import { SiteHeader } from '@/components/SiteHeader';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let brands;
  let recentModels;

  try {
    [brands, recentModels] = await Promise.all([
      getPopularBrands(),
      getRecentlyAddedModels(),
    ]);
  } catch (err) {
    return (
      <>
        <SiteHeader />
        <ErrorState message={err instanceof Error ? err.message : 'Unable to reach the API.'} />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="page-content">
        <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight text-foreground md:text-[2.15rem]">
          Find compatible spare parts
        </h1>
        <div className="mt-5 mb-9">
          <SearchBar />
        </div>

        <h2 className="mb-3.5 text-lg font-bold text-foreground">Popular brands</h2>
        <div className="mb-9 flex flex-wrap gap-2.5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}?name=${encodeURIComponent(brand.name)}`}
              className="rounded-lg border border-border bg-surface-muted/60 px-3.5 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary dark:border-white/8 dark:bg-[#161b24] dark:hover:border-primary"
            >
              {brand.name}
            </Link>
          ))}
        </div>

        <h2 className="mb-3.5 text-lg font-bold text-foreground">Recently added</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </main>
    </>
  );
}
