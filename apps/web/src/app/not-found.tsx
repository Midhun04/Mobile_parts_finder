import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader title="Not found" backHref="/" />
      <main className="page-content">
        <h1 className="text-[22px] font-extrabold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-text-secondary">
          That brand, model, or part is not in the catalog (or the link is invalid).
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          Back to home
        </Link>
      </main>
    </>
  );
}
