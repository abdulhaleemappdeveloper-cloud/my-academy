import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';

/**
 * Public directory layout shared by notes, papers, courses, teachers, events and
 * announcements: intro, search, filter chips, responsive grid and result count.
 */
export default function DirectoryPage({
  eyebrow,
  title,
  description,
  items,
  searchKeys = ['title'],
  filters = [],
  renderCard,
  emptyTitle = 'Nothing matches your search',
  emptyDescription = 'Try a different subject, class or keyword.',
  children,
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState({});

  const result = useMemo(() => {
    const term = query.trim().toLowerCase();
    let out = items;
    if (term) out = out.filter((item) => searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(term)));
    Object.entries(active).forEach(([key, value]) => {
      if (value) out = out.filter((item) => String(item[key]) === value);
    });
    return out;
  }, [items, query, active, searchKeys]);

  const activeCount = Object.values(active).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        {eyebrow && <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {description && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
      </header>

      {children}

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, subject or class…"
            aria-label="Search this directory"
            className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-10 text-sm outline-none focus:border-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{filter.label}</span>
              <select
                value={active[filter.key] || ''}
                onChange={(event) => setActive((prev) => ({ ...prev, [filter.key]: event.target.value }))}
                aria-label={filter.label}
                className="h-9 rounded-full border border-input bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary/50"
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
          {(activeCount > 0 || query) && (
            <button
              type="button"
              onClick={() => { setActive({}); setQuery(''); }}
              className="h-9 rounded-full border border-input px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{result.length} of {items.length} records</p>

      {result.length === 0 ? (
        <EmptyState className="mt-6" title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.map((item) => (
            <div key={item.id}>{renderCard(item)}</div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <p className="mt-8 text-xs text-muted-foreground">
          Enrolled students and staff can open the full library from the portal.{' '}
          <Link to="/portal" className="font-semibold text-primary hover:underline">Portal sign in</Link>
        </p>
      )}
    </div>
  );
}