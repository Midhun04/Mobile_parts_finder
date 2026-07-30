'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type PartRow, type PartTypeRow } from '@/lib/api';
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

export default function PartsPage() {
  const [parts, setParts] = useState<PartRow[]>([]);
  const [types, setTypes] = useState<PartTypeRow[]>([]);
  const [q, setQ] = useState('');
  const [partTypeId, setPartTypeId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    partTypeId: '',
    partNumber: '',
    manufacturer: '',
  });
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [p, t] = await Promise.all([
        api.parts({
          q: q || undefined,
          partTypeId: partTypeId ? Number(partTypeId) : undefined,
        }),
        api.partTypes(),
      ]);
      setParts(p);
      setTypes(t);
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
      await api.createPart({
        name: form.name.trim(),
        partTypeId: Number(form.partTypeId),
        partNumber: form.partNumber || undefined,
        manufacturer: form.manufacturer || undefined,
      });
      setForm({ name: '', partTypeId: form.partTypeId, partNumber: '', manufacturer: '' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Parts"
        description="Individual spare parts. Use Groups when many models share one physical part."
      />
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="BN-59, display…" />
          </div>
          <div className="w-48">
            <Label>Type</Label>
            <Select value={partTypeId} onChange={(e) => setPartTypeId(e.target.value)}>
              <option value="">All</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit">Filter</Button>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-3 text-sm font-semibold">Add part</h2>
        <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Label>Type</Label>
            <Select
              required
              value={form.partTypeId}
              onChange={(e) => setForm((f) => ({ ...f, partTypeId: e.target.value }))}
            >
              <option value="">Select…</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
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
            <Label>Part number</Label>
            <Input
              value={form.partNumber}
              onChange={(e) => setForm((f) => ({ ...f, partNumber: e.target.value }))}
            />
          </div>
          <div>
            <Label>Manufacturer</Label>
            <Input
              value={form.manufacturer}
              onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={busy}>
              Add part
            </Button>
          </div>
        </form>
      </Card>

      <Table headers={['Type', 'Name', 'Part #', 'Models', '']}>
        {parts.map((p) => (
          <tr key={p.id}>
            <td className="px-3 py-2 text-muted">{p.type}</td>
            <td className="px-3 py-2 font-medium">{p.name}</td>
            <td className="px-3 py-2 text-muted">{p.partNumber ?? '—'}</td>
            <td className="px-3 py-2 tabular-nums">{p.modelCount ?? 0}</td>
            <td className="px-3 py-2">
              <Link href={`/parts/${p.id}`} className="text-sm text-primary hover:underline">
                Open
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
