import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  robots?: Metadata['robots'];
};

export function buildPageMetadata({
  title,
  description,
  path,
  robots,
}: PageMetaInput): Metadata {
  const url = `${getSiteUrl()}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Parts Finder',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    ...(robots ? { robots } : {}),
  };
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}
