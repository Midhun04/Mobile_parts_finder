'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type CompatRow } from '@/lib/api';
import { Button, ErrorBanner, PageHeader, Table } from '@/components/ui';

export default function VerifyPage() {
  const [rows, setRows] = useState<CompatRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setRows(await api.compatibility(true));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function verify(id: number) {
    await api.updateCompatibility(id, { verified: true });
    await load();
  }

  async function remove(id: number) {
    if (!window.confirm('Remove this compatibility link?')) return;
    await api.deleteCompatibility(id);
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Verify queue"
        description="Compatibility links that are not marked verified yet."
      />
      <ErrorBanner message={error} />
      <p className="mb-4 text-sm text-muted">{rows.length} unverified (showing up to 200)</p>
      <Table headers={['Model', 'Part', 'Type', 'Actions']}>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="px-3 py-2">
              <Link href={`/models/${r.model.id}`} className="text-primary hover:underline">
                {r.model.brand.name} {r.model.name}
              </Link>
            </td>
            <td className="px-3 py-2">
              <Link href={`/parts/${r.part.id}`} className="text-primary hover:underline">
                {r.part.name}
              </Link>
            </td>
            <td className="px-3 py-2 text-muted">{r.part.type}</td>
            <td className="px-3 py-2">
              <div className="flex gap-2">
                <Button onClick={() => verify(r.id)}>Verify</Button>
                <Button variant="danger" onClick={() => remove(r.id)}>
                  Remove
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
