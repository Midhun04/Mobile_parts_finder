'use client';

import { useRef, useState } from 'react';
import { api, type ImportPreview } from '@/lib/api';
import { Button, Card, ErrorBanner } from '@/components/ui';

function CountsList({ preview }: { preview: ImportPreview }) {
  const c = preview.counts;
  const items = [
    ['Rows read', c.rows],
    ['Brands created', c.brandsCreated],
    ['Models created', c.modelsCreated],
    ['Models updated', c.modelsUpdated],
    ['Part types created', c.partTypesCreated],
    ['Parts created', c.partsCreated],
    ['Parts updated', c.partsUpdated],
    ['Links created', c.compatCreated],
    ['Links updated', c.compatUpdated],
    ['Unchanged links', c.skipped],
  ] as const;

  return (
    <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-3 rounded bg-bg px-2 py-1">
          <dt className="text-muted">{label}</dt>
          <dd className="font-medium tabular-nums">{value.toLocaleString()}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CatalogCsvPanel({ onApplied }: { onApplied?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [applied, setApplied] = useState<ImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'export' | 'preview' | 'apply' | null>(null);

  async function handleExport() {
    setError(null);
    setBusy('export');
    try {
      await api.exportCatalog();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setBusy(null);
    }
  }

  async function onFilePicked(file: File | null) {
    setError(null);
    setPreview(null);
    setApplied(null);
    setCsvText(null);
    setFileName(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please choose a .csv file');
      return;
    }
    setBusy('preview');
    try {
      const text = await file.text();
      setCsvText(text);
      setFileName(file.name);
      const result = await api.importCatalogPreview(text);
      setPreview(result);
      if (result.errors.length) {
        setError(result.errors.slice(0, 5).join(' · '));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview failed');
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleApply() {
    if (!csvText) return;
    setError(null);
    setBusy('apply');
    try {
      const result = await api.importCatalogApply(csvText);
      setApplied(result);
      setPreview(result);
      onApplied?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card className="mt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Catalog CSV</h2>
          <p className="mt-1 text-sm text-muted">
            Export the live catalog, or upload a denormalized CSV to merge (add new + update
            existing). Nothing is deleted. Preview runs before apply.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" disabled={busy != null} onClick={handleExport}>
            {busy === 'export' ? 'Exporting…' : 'Export CSV'}
          </Button>
          <Button
            type="button"
            disabled={busy != null}
            onClick={() => inputRef.current?.click()}
          >
            {busy === 'preview' ? 'Reading…' : 'Upload CSV'}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => void onFilePicked(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <ErrorBanner message={error} />

      {fileName ? (
        <p className="mt-3 text-sm text-muted">
          File: <span className="font-medium text-foreground">{fileName}</span>
        </p>
      ) : null}

      {preview ? (
        <div className="mt-4 rounded-md border border-border bg-white p-3">
          <p className="text-sm font-medium">
            {applied && !applied.dryRun ? 'Import applied' : 'Preview (not saved yet)'}
          </p>
          <CountsList preview={preview} />
          {preview.sampleCreates.length ? (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Sample creates</p>
              <ul className="mt-1 list-inside list-disc text-sm text-muted">
                {preview.sampleCreates.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {preview.sampleUpdates.length ? (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Sample updates</p>
              <ul className="mt-1 list-inside list-disc text-sm text-muted">
                {preview.sampleUpdates.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {csvText && (!applied || applied.dryRun) ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" disabled={busy != null} onClick={() => void handleApply()}>
                {busy === 'apply' ? 'Applying…' : 'Apply import'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busy != null}
                onClick={() => {
                  setPreview(null);
                  setCsvText(null);
                  setFileName(null);
                  setApplied(null);
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
