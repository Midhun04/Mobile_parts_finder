import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

type Props = {
  title?: string;
  backHref?: string;
};

export function SiteHeader({ title, backHref }: Props) {
  return (
    <header className="border-b border-border/80 dark:border-white/8">
      <div className="flex items-center gap-3 px-5 py-4 sm:px-8 sm:py-5 lg:px-12">
        {backHref ? (
          <Link
            href={backHref}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-primary transition hover:bg-surface-muted"
          >
            ← Back
          </Link>
        ) : null}
        {title ? (
          <h1 className="truncate text-base font-bold text-foreground">{title}</h1>
        ) : (
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-[10px] object-cover"
            />
            <span className="leading-tight">
              <span className="block text-[16px] font-extrabold tracking-[0.12em] text-primary sm:text-[17px] sm:tracking-[0.14em] sm:text-foreground">
                PARTS FINDER
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-primary/70 uppercase sm:text-[11px] sm:tracking-[0.18em] sm:text-text-muted">
                Find. Match. Repair.
              </span>
            </span>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
