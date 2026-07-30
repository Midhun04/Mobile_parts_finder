'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type BrandRow, type ModelRow } from '@/lib/api';
import {
  Button,
  Card,
  ErrorBanner,
  Input,
  Label,
  PageHeader,
  Select,
  Table,
} from '@/components/ui';

export default function ModelsPage() {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [q, setQ] = useState('');
  const [brandId, setBrandId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    brandId: '',
    modelNumber: '',
    releaseYear: '',
  });
  const [busy, setBusy] = useState(false);

  async function load(search = q, brand = brandId) {
    try {
      const [m, b] = await Promise.all([
        api.models({
          q: search || undefined,
          brandId: brand ? Number(brand) : undefined,
        }),
        api.brands(),
      ]);
      setModels(m);
      setBrands(b);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.createModel({
        name: form.name.trim(),
        brandId: Number(form.brandId),
        modelNumber: form.modelNumber || undefined,
        releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
      });
      setForm({ name: '', brandId: form.brandId, modelNumber: '', releaseYear: '' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader title="Models" description="Add and search phone models." />
      <ErrorBanner message={error} />

      <Card className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load();
          }}
          className="flex flex-wrap items-end gap-2"
        >
          <div className="min-w-[180px] flex-1">
            <Label>Search</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Galaxy A50…" />
          </div>
          <div className="w-44">
            <Label>Brand</Label>
            <Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
              <option value="">All</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit">Filter</Button>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-3 text-sm font-semibold">Add model</h2>
        <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Label>Brand</Label>
            <Select
              required
              value={form.brandId}
              onChange={(e) => setForm((f) => ({ ...f, brandId: e.target.value }))}
            >
              <option value="">Select…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <Label>Model number</Label>
            <Input
              value={form.modelNumber}
              onChange={(e) => setForm((f) => ({ ...f, modelNumber: e.target.value }))}
            />
          </div>
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              value={form.releaseYear}
              onChange={(e) => setForm((f) => ({ ...f, releaseYear: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={busy}>
              Add model
            </Button>
          </div>
        </form>
      </Card>

      <Table headers={['Brand', 'Model', 'Number', 'Parts', '']}>
        {models.map((m) => (
          <tr key={m.id}>
            <td className="px-3 py-2 text-muted">{m.brand.name}</td>
            <td className="px-3 py-2 font-medium">{m.name}</td>
            <td className="px-3 py-2 text-muted">{m.modelNumber ?? '—'}</td>
            <td className="px-3 py-2 tabular-nums">{m.partCount ?? 0}</td>
            <td className="px-3 py-2">
              <Link href={`/models/${m.id}`} className="text-sm text-primary hover:underline">
                Open
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
