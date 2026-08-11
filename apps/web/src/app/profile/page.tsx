import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return (
    <>
      <SiteHeader title="Profile" backHref="/" />
      <main className="page-content">
        <h1 className="mb-5 text-[1.65rem] font-extrabold tracking-tight text-foreground">
          Profile
        </h1>

        <div className="max-w-lg space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 dark:border-white/8 dark:bg-[#161b24]">
            <div>
              <p className="font-bold text-foreground">Appearance</p>
              <p className="mt-0.5 text-sm text-text-secondary">Switch between light and dark</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 dark:border-white/8 dark:bg-[#161b24]">
            <p className="font-bold text-foreground">Parts Finder</p>
            <p className="mt-1 text-sm text-text-secondary">
              Find compatible spare parts by phone model or part number.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
