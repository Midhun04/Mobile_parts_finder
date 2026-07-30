'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api, type GroupRow, type ModelRow } from '@/lib/api';
import {
  Button,
  Card,
  ErrorBanner,
  Input,
  Label,
  PageHeader,
  Table,
  Textarea,
} from '@/components/ui';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [group, setGroup] = useState<GroupRow | null>(null);
  const [modelQ, setModelQ] = useState('');
  const [results, setResults] = useState<ModelRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setGroup(await api.group(id));
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
        setResults([]);
        return;
      }
      api.models({ q: modelQ }).then(setResults).catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [modelQ]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.updateGroup(id, {
        name: String(fd.get('name')),
        supplierCode: String(fd.get('supplierCode') || '') || null,
        notes: String(fd.get('notes') || '') || null,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function addMember(modelId: number) {
    try {
      setGroup(await api.addGroupMembers(id, [modelId]));
      setModelQ('');
      setResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Add failed');
    }
  }

  async function removeMember(modelId: number) {
    try {
      setGroup(await api.removeGroupMember(id, modelId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    }
  }

  async function removeGroup() {
    if (!group || !window.confirm(`Delete group "${group.name}" and its linked part?`)) return;
    try {
      await api.deleteGroup(id);
      router.replace('/groups');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (!group) {
    return <p className="text-sm text-muted">{error ?? 'Loading…'}</p>;
  }

  const memberIds = new Set(group.members.map((m) => m.id));

  return (
    <div>
      <PageHeader
        title={group.name}
        description={`${group.partType.name} · ${group.memberCount} models`}
        actions={
          <Button variant="danger" onClick={removeGroup}>
            Delete group
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
              <Input name="name" defaultValue={group.name} required />
            </div>
            <div>
              <Label>Supplier code</Label>
              <Input name="supplierCode" defaultValue={group.supplierCode ?? ''} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea name="notes" defaultValue={group.notes ?? ''} rows={3} />
            </div>
            <Button type="submit">Save</Button>
          </form>
          {group.partId ? (
            <p className="mt-3 text-sm">
              Linked part:{' '}
              <Link href={`/parts/${group.partId}`} className="text-primary hover:underline">
                #{group.partId} {group.part?.name}
              </Link>
            </p>
          ) : null}
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold">Add members</h2>
          <Input
            value={modelQ}
            onChange={(e) => setModelQ(e.target.value)}
            placeholder="Search models…"
            className="mb-3"
          />
          <ul className="max-h-56 space-y-1 overflow-y-auto text-sm">
            {results
              .filter((m) => !memberIds.has(m.id))
              .map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <span>
                    {m.brand.name} {m.name}
                  </span>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => addMember(m.id)}
                  >
                    Add
                  </button>
                </li>
              ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-3 text-sm font-semibold">Members</h2>
        <Table headers={['Brand', 'Model', '']}>
          {group.members.map((m) => (
            <tr key={m.id}>
              <td className="px-3 py-2 text-muted">{m.brand.name}</td>
              <td className="px-3 py-2">
                <Link href={`/models/${m.id}`} className="text-primary hover:underline">
                  {m.name}
                </Link>
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  className="text-danger hover:underline"
                  onClick={() => removeMember(m.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
