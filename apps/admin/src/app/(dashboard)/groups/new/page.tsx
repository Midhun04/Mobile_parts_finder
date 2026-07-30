'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type ModelRow, type PartTypeRow } from '@/lib/api';
import {
  Button,
  Card,
  ErrorBanner,
  Input,
  Label,
  PageHeader,
  Select,
  Textarea,
} from '@/components/ui';

export default function NewGroupPage() {
  const router = useRouter();
  const [types, setTypes] = useState<PartTypeRow[]>([]);
  const [name, setName] = useState('');
  const [partTypeId, setPartTypeId] = useState('');
  const [supplierCode, setSupplierCode] = useState('');
  const [notes, setNotes] = useState('');
  const [modelQ, setModelQ] = useState('');
  const [results, setResults] = useState<ModelRow[]>([]);
  const [selected, setSelected] = useState<ModelRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.partTypes().then(setTypes).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!modelQ.trim()) {
        setResults([]);
        return;
      }
      api.models({ q: modelQ }).then(setResults).catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [modelQ]);

  const selectedIds = useMemo(() => new Set(selected.map((m) => m.id)), [selected]);

  function toggle(model: ModelRow) {
    setSelected((prev) =>
      prev.some((m) => m.id === model.id)
        ? prev.filter((m) => m.id !== model.id)
        : [...prev, model],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const group = await api.createGroup({
        name: name.trim(),
        partTypeId: Number(partTypeId),
        modelIds: selected.map((m) => m.id),
        supplierCode: supplierCode || undefined,
        notes: notes || undefined,
      });
      router.replace(`/groups/${group.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="New compatibility group"
        description="Creates one Part and links all selected models."
      />
      <ErrorBanner message={error} />

      <form onSubmit={onSubmit} className="grid max-w-3xl gap-4">
        <Card className="space-y-3">
          <div>
            <Label>Part type</Label>
            <Select
              required
              value={partTypeId}
              onChange={(e) => setPartTypeId(e.target.value)}
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
            <Label>Group / part name</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oppo A15 / A15s Display"
            />
          </div>
          <div>
            <Label>Supplier code (optional)</Label>
            <Input value={supplierCode} onChange={(e) => setSupplierCode(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold">Member models ({selected.length})</h2>
          <Input
            value={modelQ}
            onChange={(e) => setModelQ(e.target.value)}
            placeholder="Search models to add…"
            className="mb-3"
          />
          <ul className="mb-4 max-h-48 space-y-1 overflow-y-auto text-sm">
            {results.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => toggle(m)}
                  className={`w-full rounded px-2 py-1.5 text-left hover:bg-bg ${
                    selectedIds.has(m.id) ? 'bg-teal-50 text-primary' : ''
                  }`}
                >
                  {selectedIds.has(m.id) ? '✓ ' : ''}
                  {m.brand.name} {m.name}
                </button>
              </li>
            ))}
          </ul>
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              {selected.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m)}
                  className="rounded-full bg-bg px-2.5 py-1 text-xs hover:bg-red-50"
                >
                  {m.brand.name} {m.name} ×
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No members yet — you can add them after create too.</p>
          )}
        </Card>

        <Button type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create group'}
        </Button>
      </form>
    </div>
  );
}
