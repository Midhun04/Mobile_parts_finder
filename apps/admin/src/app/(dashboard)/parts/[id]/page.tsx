'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api, type ModelRow, type PartRow } from '@/lib/api';
import {
  Button,
  Card,
  ErrorBanner,
  Input,
  Label,
  PageHeader,
  Select,
  Table,
  Textarea,
} from '@/components/ui';

type PartDetail = PartRow & {
  groupId?: number;
  models: (ModelRow & { compatibilityId: number; verified: boolean; notes?: string })[];
};

export default function PartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [part, setPart] = useState<PartDetail | null>(null);
  const [models, setModels] = useState<ModelRow[]>([]);
  const [modelId, setModelId] = useState('');
  const [modelQ, setModelQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setPart(await api.part(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    if (!Number.isNaN(id)) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!modelQ.trim()) {
        setModels([]);
        return;
      }
      api.models({ q: modelQ }).then(setModels).catch(() => setModels([]));
    }, 250);
    return () => clearTimeout(t);
  }, [modelQ]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.updatePart(id, {
        name: String(fd.get('name')),
        partNumber: String(fd.get('partNumber') || '') || null,
        manufacturer: String(fd.get('manufacturer') || '') || null,
        description: String(fd.get('description') || '') || null,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function linkModel(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createCompatibility({
        partId: id,
        mobileModelId: Number(modelId),
      });
      setModelId('');
      setModelQ('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Link failed');
    }
  }

  async function removePart() {
    if (!part || !window.confirm(`Delete part "${part.name}"?`)) return;
    try {
      await api.deletePart(id);
      router.replace('/parts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (!part) {
    return <p className="text-sm text-muted">{error ?? 'Loading…'}</p>;
  }

  return (
    <div>
      <PageHeader
        title={part.name}
        description={`${part.type}${part.groupId ? ` · Group #${part.groupId}` : ''}`}
        actions={
          <Button variant="danger" onClick={removePart}>
            Delete part
          </Button>
        }
      />
      <ErrorBanner message={error} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold">Details</h2>
          <form onSubmit={save} className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input name="name" defaultValue={part.name} required />
            </div>
            <div>
              <Label>Part number</Label>
              <Input name="partNumber" defaultValue={part.partNumber ?? ''} />
            </div>
            <div>
              <Label>Manufacturer</Label>
              <Input name="manufacturer" defaultValue={part.manufacturer ?? ''} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea name="description" defaultValue={part.description ?? ''} rows={3} />
            </div>
            <Button type="submit">Save</Button>
          </form>
          {part.groupId ? (
            <p className="mt-3 text-sm">
              <Link href={`/groups/${part.groupId}`} className="text-primary hover:underline">
                Open compatibility group →
              </Link>
            </p>
          ) : null}
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold">Link model</h2>
          <form onSubmit={linkModel} className="space-y-3">
            <div>
              <Label>Search models</Label>
              <Input
                value={modelQ}
                onChange={(e) => setModelQ(e.target.value)}
                placeholder="Type to search…"
              />
            </div>
            <div>
              <Label>Model</Label>
              <Select required value={modelId} onChange={(e) => setModelId(e.target.value)}>
                <option value="">Select…</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.brand.name} {m.name}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit">Link</Button>
          </form>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-3 text-sm font-semibold">Compatible models</h2>
        <Table headers={['Brand', 'Model', 'Verified', 'Actions']}>
          {part.models.map((m) => (
            <tr key={m.compatibilityId}>
              <td className="px-3 py-2 text-muted">{m.brand.name}</td>
              <td className="px-3 py-2">
                <Link href={`/models/${m.id}`} className="text-primary hover:underline">
                  {m.name}
                </Link>
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  className={m.verified ? 'text-ok' : 'text-warn'}
                  onClick={async () => {
                    await api.updateCompatibility(m.compatibilityId, {
                      verified: !m.verified,
                    });
                    await load();
                  }}
                >
                  {m.verified ? 'Verified' : 'Unverified'}
                </button>
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  className="text-danger hover:underline"
                  onClick={async () => {
                    await api.deleteCompatibility(m.compatibilityId);
                    await load();
                  }}
                >
                  Unlink
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
