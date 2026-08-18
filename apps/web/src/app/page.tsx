import type { Metadata } from 'next';
import Link from 'next/link';
import { getPopularBrands, getRecentlyAddedModels } from '@/lib/api';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';
import { ModelCard } from '@/components/ModelCard';
import { ErrorState } from '@/components/QueryState';
import { SearchBar } from '@/components/SearchBar';
import { SiteHeader } from '@/components/SiteHeader';

export const revalidate = 30;

export const metadata: Metadata = buildPageMetadata({
  title: 'Find compatible mobile spare parts',
  description:
    'Search by brand, model name, model number, or part number to find compatible batteries, displays, and other spare parts.',
  path: '/',
});

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

  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Parts Finder',
          url: siteUrl,
          description:
            'Find compatible spare parts for mobile phones by brand, model, or part number.',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${absoluteUrl('/search')}?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <SiteHeader />
      <main className="page-content">
        <h1 className="text-[1.65rem] leading-tight font-extrabold tracking-tight text-foreground md:text-[2.15rem]">
          Find compatible spare parts
        </h1>
        <div className="mt-5 mb-9">
          <SearchBar />
        </div>

        <h2 className="mb-3.5 text-lg font-bold text-foreground">Popular brands</h2>
        <div className="-mx-5 mb-8 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="shrink-0 rounded-xl border border-border bg-surface-muted/60 px-3.5 py-2 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary dark:border-white/8 dark:bg-[#161b24] dark:hover:border-primary dark:hover:text-primary"
            >
              {brand.name}
            </Link>
          ))}
        </div>

        <h2 className="mb-3.5 text-lg font-bold text-foreground">Recently added</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </main>
    </>
  );
}
