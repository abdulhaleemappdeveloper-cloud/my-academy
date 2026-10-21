import { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import PageHeader from './PageHeader';
import StatCard from './StatCard';
import DataTable from './DataTable';
import RecordDrawer from './RecordDrawer';
import { useToast } from '@/components/ui/use-toast';
import { insert, bulkPatch, downloadCSV, logAction, useCollection } from '@/data/store';
import { toDetailRows } from '@/lib/format';
import { useSession } from '@/lib/session';

/**
 * Generic management screen.
 *
 * Every management module uses this: it renders the page header, metric tiles,
 * a searchable / filterable / sortable table, a record detail panel, a create
 * form, bulk actions and CSV export. Modules only describe their columns,
 * filters and form fields — the behaviour stays identical across the platform.
 */
export default function ModulePage({
  title,
  description,
  breadcrumbs,
  collection,
  columns,
  filters = [],
  searchKeys = ['name', 'title'],
  searchPlaceholder,
  stats,
  createFields,
  createLabel = 'Add record',
  detailFields,
  detailExtra,
  bulkStatus,
  extraActions,
  quickLinks,
  pageSize = 10,
  selectable = true,
  footerNote,
}) {
  const rows = useCollection(collection);
  const { account } = useSession();
  const { toast } = useToast();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({});

  const detailRows = useMemo(
    () => (selectedRecord ? toDetailRows(selectedRecord, { only: detailFields }) : []),
    [selectedRecord, detailFields]
  );

  const create = () => {
    if (!form.name && !form.title) {
      toast({
        title: 'A name or title is required',
        description: 'Complete the required field before saving.',
        variant: 'destructive',
      });
      return;
    }
    const record = insert(collection, { status: 'Draft', ...form });
    logAction({
      actor: account?.name || 'Unknown user',
      role: account?.label || 'Unknown',
      action: `Created ${collection} record`,
      module: collection,
      target: record.name || record.title || record.id,
      reason: 'Created from the management screen',
    });
    setForm({});
    setCreating(false);
    toast({ title: 'Record created', description: `${record.name || record.title} was added and recorded in the audit log.` });
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <button
              type="button"
              onClick={() => downloadCSV(collection, rows, columns.map((c) => ({ key: c.key, label: c.label })))}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              <Download className="h-4 w-4" /> Export
            </button>
            {createFields && (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> {createLabel}
              </button>
            )}
            {extraActions}
          </>
        }
      />

      {stats && stats.length > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {quickLinks && quickLinks.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href || '#'}
              onClick={(event) => { if (!link.href) event.preventDefault(); }}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        filters={filters}
        searchKeys={searchKeys}
        searchPlaceholder={searchPlaceholder || `Search ${title.toLowerCase()}…`}
        pageSize={pageSize}
        selectable={selectable}
        footerNote={footerNote}
        onRowClick={(row) => setSelectedRecord(row)}
        rowActions={(row) => (
          <button
            type="button"
            onClick={() => setSelectedRecord(row)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View
          </button>
        )}
        bulkActions={
          bulkStatus
            ? (ids, clear) => (
                <select
                  aria-label={`Update ${bulkStatus.key}`}
                  defaultValue=""
                  onChange={(event) => {
                    if (!event.target.value) return;
                    bulkPatch(collection, ids, { [bulkStatus.key]: event.target.value });
                    logAction({
                      actor: account?.name || 'Unknown user',
                      role: account?.label || 'Unknown',
                      action: `Bulk update — ${bulkStatus.key} set to ${event.target.value}`,
                      module: collection,
                      target: `${ids.length} records`,
                    });
                    toast({ title: 'Bulk update applied', description: `${ids.length} records updated.` });
                    clear();
                  }}
                  className="h-7 rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none"
                >
                  <option value="">Set {bulkStatus.key}…</option>
                  {bulkStatus.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )
            : null
        }
      />

      <RecordDrawer
        open={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.name || selectedRecord?.title || selectedRecord?.reference || 'Record details'}
        subtitle={selectedRecord?.code || selectedRecord?.number || selectedRecord?.id}
        badge={selectedRecord?.status}
        rows={detailRows}
      >
        {detailExtra && selectedRecord ? detailExtra(selectedRecord) : null}
      </RecordDrawer>

      {creating && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">{createLabel}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              New records are saved to the {collection} collection and written to the audit log.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {createFields.map((field) => (
                <label
                  key={field.key}
                  className={`flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground ${field.wide ? 'sm:col-span-2' : ''}`}
                >
                  {field.label}
                  {field.type === 'select' ? (
                    <select
                      value={form[field.key] || ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary/50"
                    >
                      <option value="">Select…</option>
                      {(field.options || []).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={form[field.key] || ''}
                      placeholder={field.placeholder}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary/50"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setCreating(false); setForm({}); }}
                className="h-10 rounded-xl border border-input px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={create}
                className="h-10 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Save record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}