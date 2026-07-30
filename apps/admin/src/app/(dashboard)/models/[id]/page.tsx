'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api, type BrandRow, type ModelRow, type PartRow } from '@/lib/api';
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

type ModelDetail = ModelRow & {
  aliases: { id: number; alias: string }[];
  parts: (PartRow & { compatibilityId: number; verified: boolean; notes?: string })[];
};

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [model, setModel] = useState<ModelDetail | null>(null);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [parts, setParts] = useState<PartRow[]>([]);
  const [alias, setAlias] = useState('');
  const [linkPartId, setLinkPartId] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [m, b, p] = await Promise.all([api.model(id), api.brands(), api.parts()]);
      setModel(m);
      setBrands(b);
      setParts(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    if (!Number.isNaN(id)) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!model) return;
    const fd = new FormData(e.currentTarget);
    try {
      await api.updateModel(id, {
        name: String(fd.get('name')),
        brandId: Number(fd.get('brandId')),
        modelNumber: String(fd.get('modelNumber') || '') || null,
        releaseYear: fd.get('releaseYear') ? Number(fd.get('releaseYear')) : null,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function addAlias(e: FormEvent) {
    e.preventDefault();
    try {
      await api.addAlias(id, alias.trim());
      setAlias('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Alias failed');
    }
  }

  async function linkPart(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createCompatibility({
        mobileModelId: id,
        partId: Number(linkPartId),
      });
      setLinkPartId('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Link failed');
    }
  }

  async function removeModel() {
    if (!model || !window.confirm(`Delete ${model.brand.name} ${model.name}?`)) return;
    try {
      await api.deleteModel(id);
      router.replace('/models');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (!model) {
    return <p className="text-sm text-muted">{error ?? 'Loading…'}</p>;
  }

  return (
    <div>
      <PageHeader
        title={`${model.brand.name} ${model.name}`}
        description="Edit model, aliases, and linked parts."
        actions={
          <Button variant="danger" onClick={removeModel}>
            Delete model
          </Button>
        }
      />
      <ErrorBanner message={error} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold">Details</h2>
          <form onSubmit={save} className="space-y-3">
            <div>
              <Label>Brand</Label>
              <Select name="brandId" defaultValue={model.brandId} required>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Name</Label>
              <Input name="name" defaultValue={model.name} required />
            </div>
            <div>
              <Label>Model number</Label>
              <Input name="modelNumber" defaultValue={model.modelNumber ?? ''} />
            </div>
            <div>
              <Label>Release year</Label>
              <Input
                name="releaseYear"
                type="number"
                defaultValue={model.releaseYear ?? ''}
              />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold">Aliases</h2>
          <ul className="mb-3 space-y-1 text-sm">
            {model.aliases.length === 0 ? (
              <li className="text-muted">No aliases</li>
            ) : (
              model.aliases.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2">
                  <span>{a.alias}</span>
                  <button
                    type="button"
                    className="text-danger hover:underline"
                    onClick={async () => {
                      await api.deleteAlias(id, a.id);
                      await load();
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
          <form onSubmit={addAlias} className="flex gap-2">
            <Input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Alternate name"
              required
            />
            <Button type="submit">Add</Button>
          </form>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Compatible parts</h2>
          <Link href="/groups" className="text-sm text-primary hover:underline">
            Prefer groups for shared parts →
          </Link>
        </div>
        <form onSubmit={linkPart} className="mb-4 flex flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1">
            <Label>Link existing part</Label>
            <Select
              required
              value={linkPartId}
              onChange={(e) => setLinkPartId(e.target.value)}
            >
              <option value="">Select part…</option>
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.type}] {p.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit">Link</Button>
        </form>
        <Table headers={['Type', 'Part', 'Verified', 'Actions']}>
          {model.parts.map((p) => (
            <tr key={p.compatibilityId}>
              <td className="px-3 py-2 text-muted">{p.type}</td>
              <td className="px-3 py-2">
                <Link href={`/parts/${p.id}`} className="text-primary hover:underline">
                  {p.name}
                </Link>
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  className={p.verified ? 'text-ok' : 'text-warn'}
                  onClick={async () => {
                    await api.updateCompatibility(p.compatibilityId, {
                      verified: !p.verified,
                    });
                    await load();
                  }}
                >
                  {p.verified ? 'Verified' : 'Unverified'}
                </button>
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  className="text-danger hover:underline"
                  onClick={async () => {
                    await api.deleteCompatibility(p.compatibilityId);
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
