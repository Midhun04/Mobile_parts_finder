import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBrands, getRecentlyAddedModels } from '@/lib/api';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { ModelCard } from '@/components/ModelCard';
import { ErrorState } from '@/components/QueryState';
import { SiteHeader } from '@/components/SiteHeader';

export const revalidate = 30;

export const metadata: Metadata = buildPageMetadata({
  title: 'Brand inventory',
  description:
    'Browse every mobile brand in the Parts Finder catalog and open models to see compatible spare parts.',
  path: '/inventory',
});

export default async function InventoryPage() {
  let brands;
  let recentModels;

  try {
    [brands, recentModels] = await Promise.all([getAllBrands(), getRecentlyAddedModels()]);
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
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Brand inventory',
          url: absoluteUrl('/inventory'),
          description:
            'Browse every mobile brand in the Parts Finder catalog and open models to see compatible spare parts.',
        }}
      />
      <SiteHeader title="Inventory" backHref="/" hideBackOnMobile />
      <main className="page-content">
        <h1 className="mb-2 text-[22px] font-extrabold text-foreground">All brands</h1>
        <p className="mb-6 text-sm text-text-secondary">
          Pick a brand to browse models and compatible spare parts.
        </p>

        <h2 className="mb-3.5 text-lg font-bold text-foreground">Brands</h2>
        <div className="mb-8 flex flex-wrap gap-2.5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
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
