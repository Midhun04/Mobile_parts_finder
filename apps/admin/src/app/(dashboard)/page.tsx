'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Stats } from '@/lib/api';
import { CatalogCsvPanel } from '@/components/CatalogCsvPanel';
import { Card, ErrorBanner, PageHeader } from '@/components/ui';

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(() => {
    api
      .stats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const tiles = stats
    ? [
        { label: 'Brands', value: stats.brands, href: '/brands' },
        { label: 'Models', value: stats.models, href: '/models' },
        { label: 'Parts', value: stats.parts, href: '/parts' },
        { label: 'Compat links', value: stats.compatibilities, href: '/verify' },
        { label: 'Unverified', value: stats.unverified, href: '/verify' },
        { label: 'Groups', value: stats.groups, href: '/groups' },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Catalog totals from PostgreSQL. Prefer Groups when linking a shared part to many phones."
      />
      <ErrorBanner message={error} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href}>
            <Card className="transition hover:border-primary">
              <p className="text-xs uppercase tracking-wide text-muted">{t.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{t.value.toLocaleString()}</p>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link className="text-primary hover:underline" href="/groups">
          Create compatibility group →
        </Link>
        <Link className="text-primary hover:underline" href="/models">
          Add model →
        </Link>
        <Link className="text-primary hover:underline" href="/verify">
          Review unverified →
        </Link>
      </div>

      <CatalogCsvPanel onApplied={loadStats} />
    </div>
  );
}
