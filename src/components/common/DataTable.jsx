import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import EmptyState from './EmptyState';
import { cn } from '@/lib/utils';

/**
 * Data table used by every management screen.
 * Handles search, filters, sorting, pagination, row selection and bulk actions.
 * When the backend is connected, the same props are fed from a server query.
 */
export default function DataTable({
  columns,
  rows,
  searchKeys = [],
  searchPlaceholder = 'Search records…',
  filters = [],
  pageSize = 10,
  onRowClick,
  rowActions,
  selectable = false,
  bulkActions,
  toolbar,
  emptyTitle = 'No records found',
  emptyDescription = 'Adjust the search or filters to see results.',
  footerNote,
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const [selected, setSelected] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => setPage(1), [query, active, size]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows;
    if (q && searchKeys.length) {
      out = out.filter((row) => searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q)));
    }
    Object.entries(active).forEach(([key, value]) => {
      if (value) out = out.filter((row) => String(row[key]) === value);
    });
    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        const an = typeof av === 'number';
        const bn = typeof bv === 'number';
        const cmp = an && bn ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return out;
  }, [rows, query, active, sortKey, sortDir, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * size;
  const visible = filtered.slice(start, start + size);
  const activeFilters = Object.entries(active).filter(([, v]) => v);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  const allVisibleSelected = visible.length > 0 && visible.every((row) => selected.includes(row.id));
  const toggleAll = () =>
    setSelected(allVisibleSelected ? selected.filter((id) => !visible.some((r) => r.id === id)) : [...new Set([...selected, ...visible.map((r) => r.id)])]);
  const toggleRow = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const clearFilters = () => {
    setActive({});
    setQuery('');
  };

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-9 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {filters.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                'inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors',
                activeFilters.length ? 'border-primary/40 bg-brand-tint text-primary' : 'border-input text-muted-foreground hover:text-foreground'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters{activeFilters.length ? ` (${activeFilters.length})` : ''}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectable && selected.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-brand-tint px-3 py-1.5">
              <span className="text-xs font-semibold text-primary">{selected.length} selected</span>
              {bulkActions && bulkActions(selected, () => setSelected([]))}
              <button type="button" onClick={() => setSelected([])} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            </div>
          )}
          {toolbar}
        </div>
      </div>

      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 border-b border-border bg-muted/40 p-4">
          {filters.map((filter) => (
            <label key={filter.key} className="flex min-w-[150px] flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              {filter.label}
              <select
                value={active[filter.key] || ''}
                onChange={(event) => setActive((prev) => ({ ...prev, [filter.key]: event.target.value }))}
                className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/50"
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="h-9 rounded-lg border border-input px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset
          </button>
        </div>
      )}

      <div className="ta-scroll overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              {selectable && (
                <th scope="col" className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows on this page"
                    className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  className={cn('px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground', column.align === 'right' && 'text-right')}
                >
                  {column.sortable === false ? (
                    column.label
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      {column.label}
                      {sortKey === column.key && (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                    </button>
                  )}
                </th>
              ))}
              {rowActions && <th scope="col" className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-border/70 transition-colors last:border-0',
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  selected.includes(row.id) && 'bg-brand-tint/50'
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable && (
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      aria-label={`Select ${row.name || row.title || row.id}`}
                      className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-3 align-middle text-foreground', column.align === 'right' && 'text-right')}>
                    {column.render ? column.render(row) : String(row[column.key] ?? '—')}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ? (
        <div className="p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} action={
            <button type="button" onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">
              Clear search and filters
            </button>
          } />
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{start + 1}</span>–
            <span className="font-semibold text-foreground">{start + visible.length}</span> of{' '}
            <span className="font-semibold text-foreground">{filtered.length}</span> records
            {footerNote ? ` · ${footerNote}` : ''}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              aria-label="Rows per page"
              className="h-8 rounded-lg border border-input bg-background px-2 text-xs outline-none"
            >
              {[10, 25, 50].map((option) => (
                <option key={option} value={option}>{option} / page</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setPage(Math.max(1, current - 1))}
              disabled={current === 1}
              aria-label="Previous page"
              className="grid h-8 w-8 place-items-center rounded-lg border border-input text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground">
              Page {current} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(pageCount, current + 1))}
              disabled={current === pageCount}
              aria-label="Next page"
              className="grid h-8 w-8 place-items-center rounded-lg border border-input text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}