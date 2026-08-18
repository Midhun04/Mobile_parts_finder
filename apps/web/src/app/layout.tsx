import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { BottomNav } from '@/components/BottomNav';
import { JsonLd } from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const siteUrl = getSiteUrl();
const defaultTitle = 'Parts Finder — compatible mobile spare parts';
const defaultDescription =
  'Find compatible spare parts for mobile phones. Search by brand, model name, model number, or part number to see which batteries, displays, and other parts fit.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s · Parts Finder',
  },
  description: defaultDescription,
  applicationName: 'Parts Finder',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Parts Finder',
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: '/logo.png', alt: 'Parts Finder' }],
  },
  twitter: {
    card: 'summary',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

const themeScript = `(function(){try{var stored=localStorage.getItem('theme');var dark=stored?stored==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${plusJakarta.variable} antialiased`}>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Parts Finder',
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
          }}
        />
        <div className="home-canvas home-frame min-h-screen pb-20 md:pb-0">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
