'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Home', match: (path: string) => path === '/' },
  { href: '/search', label: 'Search', match: (path: string) => path.startsWith('/search') },
  {
    href: '/inventory',
    label: 'Inventory',
    match: (path: string) => path.startsWith('/inventory') || path.startsWith('/brands'),
  },
] as const;

function NavIcon({ label, active }: { label: string; active: boolean }) {
  const className = `h-5 w-5 ${active ? 'text-primary' : 'text-text-muted'}`;

  if (label === 'Home') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
      </svg>
    );
  }

  if (label === 'Search') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-3.4-3.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z" />
      <path d="M4 8 6.5 4h11L20 8" strokeLinejoin="round" />
      <path d="M10 12h4" strokeLinecap="round" />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur-md md:hidden dark:border-white/8 dark:bg-[#0c1017]/95"
    >
      <ul className="grid grid-cols-3 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-1"
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-8 w-10 items-center justify-center rounded-lg ${
                    active ? 'bg-primary/15 shadow-[0_0_16px_rgba(36,184,242,0.35)]' : ''
                  }`}
                >
                  <NavIcon label={item.label} active={active} />
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    active ? 'text-primary' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
