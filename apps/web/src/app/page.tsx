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
      <main className="mx-auto max-w-3xl px-5 pb-12 pt-6">
        <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-foreground">
          Find compatible
          <br />
          spare parts
        </h1>
        <div className="mt-5 mb-7">
          <SearchBar />
        </div>

        <h2 className="mb-3 text-[17px] font-bold text-foreground">Popular brands</h2>
        <div className="mb-7 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}?name=${encodeURIComponent(brand.name)}`}
              className="rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/40"
            >
              {brand.name}
            </Link>
          ))}
        </div>

        <h2 className="mb-3 text-[17px] font-bold text-foreground">Recently added</h2>
        {recentModels.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </main>
    </>
  );
}
