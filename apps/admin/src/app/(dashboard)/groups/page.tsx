'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type GroupRow, type PartTypeRow } from '@/lib/api';
import { Button, ErrorBanner, PageHeader, Select, Table } from '@/components/ui';

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [types, setTypes] = useState<PartTypeRow[]>([]);
  const [partTypeId, setPartTypeId] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load(typeId = partTypeId) {
    try {
      const [g, t] = await Promise.all([
        api.groups(typeId ? Number(typeId) : undefined),
        api.partTypes(),
      ]);
      setGroups(g);
      setTypes(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHeader
        title="Compatibility groups"
        description="One shared part linked to many models — preferred way to manage supplier lists."
        actions={
          <Link href="/groups/new">
            <Button>New group</Button>
          </Link>
        }
      />
      <ErrorBanner message={error} />

      <div className="mb-4 flex flex-wrap items-end gap-2">
        <div className="w-56">
          <Select
            value={partTypeId}
            onChange={(e) => {
              setPartTypeId(e.target.value);
              void load(e.target.value);
            }}
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Table headers={['Name', 'Type', 'Members', 'Part', '']}>
        {groups.map((g) => (
          <tr key={g.id}>
            <td className="px-3 py-2 font-medium">{g.name}</td>
            <td className="px-3 py-2 text-muted">{g.partType.name}</td>
            <td className="px-3 py-2 tabular-nums">{g.memberCount}</td>
            <td className="px-3 py-2 text-muted">
              {g.partId ? (
                <Link href={`/parts/${g.partId}`} className="text-primary hover:underline">
                  #{g.partId}
                </Link>
              ) : (
                '—'
              )}
            </td>
            <td className="px-3 py-2">
              <Link href={`/groups/${g.id}`} className="text-sm text-primary hover:underline">
                Open
              </Link>
            </td>
          </tr>
        ))}
      </Table>
      {groups.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No groups yet. Create one from a supplier list.</p>
      ) : null}
    </div>
  );
}
