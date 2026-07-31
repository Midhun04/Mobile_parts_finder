import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

type Props = {
  title?: string;
  backHref?: string;
};

export function SiteHeader({ title, backHref }: Props) {
  return (
    <header className="border-b border-border/80 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
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
              <span className="block text-[17px] font-extrabold tracking-wide">
                <span className="text-brand-blue">PARTS</span>
                <span className="text-brand-green"> FINDER</span>
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-text-muted">
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
