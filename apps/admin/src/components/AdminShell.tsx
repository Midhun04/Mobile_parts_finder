'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';

const NAV = [
  { href: '/', label: 'Overview' },
  { href: '/brands', label: 'Brands' },
  { href: '/models', label: 'Models' },
  { href: '/parts', label: 'Parts' },
  { href: '/groups', label: 'Groups' },
  { href: '/verify', label: 'Verify queue' },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.replace('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col bg-sidebar text-sidebar-text">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-xs uppercase tracking-wider text-slate-400">MPF Admin</p>
          <p className="mt-1 text-sm font-semibold text-white">Parts Finder</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {NAV.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? 'bg-sidebar-active font-medium text-white'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="truncate text-xs text-slate-400">{email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-2 text-xs text-teal-300 hover:text-teal-200"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
