import type { Metadata } from 'next';
import Link from 'next/link';
import { getPopularBrands, getRecentlyAddedModels } from '@/lib/api';
import { ModelCard } from '@/components/ModelCard';
import { ErrorState } from '@/components/QueryState';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Inventory',
};

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
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
        <SiteHeader title="Inventory" backHref="/" hideBackOnMobile />
        <ErrorState message={err instanceof Error ? err.message : 'Unable to reach the API.'} />
      </>
    );
  }

  return (
    <>
      <SiteHeader title="Inventory" backHref="/" hideBackOnMobile />
      <main className="page-content">
        <h1 className="mb-4 text-[1.65rem] font-extrabold tracking-tight text-foreground">
          Inventory
        </h1>

        <h2 className="mb-3.5 text-lg font-bold text-foreground">Brands</h2>
        <div className="mb-8 flex flex-wrap gap-2.5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}?name=${encodeURIComponent(brand.name)}`}
              className="rounded-xl border border-border bg-surface-muted/60 px-3.5 py-2 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary dark:border-white/8 dark:bg-[#161b24]"
            >
              {brand.name}
            </Link>
          ))}
        </div>

        <h2 className="mb-3.5 text-lg font-bold text-foreground">Latest models</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </main>
    </>
  );
}
