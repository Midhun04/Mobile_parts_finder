import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

type Props = {
  title?: string;
  backHref?: string;
};

export function SiteHeader({ title, backHref }: Props) {
  return (
    <header>
      <div className="flex items-center gap-3 px-5 py-5 sm:px-8 lg:px-12">
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
              <span className="block text-[17px] font-extrabold tracking-[0.14em] text-foreground">
                PARTS FINDER
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.18em] text-text-muted uppercase">
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
