'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api, type BrandRow } from '@/lib/api';
import {
  Button,
  Card,
  ErrorBanner,
  Input,
  Label,
  PageHeader,
  Table,
} from '@/components/ui';

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setBrands(await api.brands());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.createBrand(name.trim());
      setName('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setBusy(false);
    }
  }

  async function rename(id: number, current: string) {
    const next = window.prompt('Brand name', current);
    if (!next || next.trim() === current) return;
    try {
      await api.updateBrand(id, next.trim());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function remove(id: number, brandName: string) {
    if (!window.confirm(`Delete brand "${brandName}"?`)) return;
    try {
      await api.deleteBrand(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div>
      <PageHeader title="Brands" description="Canonical phone brands." />
      <ErrorBanner message={error} />
      <Card className="mb-6 max-w-md">
        <form onSubmit={onCreate} className="flex items-end gap-2">
          <div className="flex-1">
            <Label>New brand</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <Button type="submit" disabled={busy}>
            Add
          </Button>
        </form>
      </Card>
      <Table headers={['Name', 'Models', 'Actions']}>
        {brands.map((b) => (
          <tr key={b.id}>
            <td className="px-3 py-2 font-medium">{b.name}</td>
            <td className="px-3 py-2 tabular-nums text-muted">{b.modelCount}</td>
            <td className="px-3 py-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => rename(b.id, b.name)}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="text-sm text-danger hover:underline"
                  onClick={() => remove(b.id, b.name)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
