import { Link } from 'react-router-dom';
import { Eye, ImageIcon, PenLine, Search } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useCollection } from '@/data/store';

/** Website page management: the entry point into the visual page builder. */
export default function AdminPages() {
  const pages = useCollection('pages');
  const media = useCollection('media');
  const navigation = useCollection('navigation');

  const unpublished = pages.filter((p) => p.status !== 'Published');
  const missingMeta = pages.filter((p) => !p.seoTitle || !p.metaDescription);

  return (
    <div>
      <PageHeader
        title="Website pages"
        description="Every public page, its publishing state and its search metadata. Pages are edited in the visual builder — application screens are never affected by page changes."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Website pages' }]}
        actions={
          <Link to="/admin/builder" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
            <PenLine className="h-4 w-4" /> Open the page builder
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pages" value={pages.length} hint={`${pages.filter((p) => p.status === 'Published').length} published`} />
        <StatCard label="Awaiting publication" value={unpublished.length} hint="Draft, in review or scheduled" tone="warning" />
        <StatCard label="Missing SEO metadata" value={missingMeta.length} hint="Title or meta description" tone={missingMeta.length ? 'warning' : 'brand'} icon={Search} />
        <StatCard label="Media files" value={media.length} hint={`${media.filter((m) => m.visibility === 'Private').length} stored privately`} icon={ImageIcon} />
      </div>

      <div className="mt-6">
        <DataTable
          rows={pages}
          searchKeys={['title', 'slug', 'type', 'updatedBy']}
          searchPlaceholder="Search pages by title or slug…"
          filters={[
            { key: 'status', label: 'Status', options: ['Published', 'Draft', 'In review', 'Scheduled'] },
            { key: 'type', label: 'Type', options: [...new Set(pages.map((p) => p.type))] },
          ]}
          columns={[
            { key: 'title', label: 'Page', render: (row) => <span className="font-medium">{row.title}</span> },
            { key: 'slug', label: 'Slug', render: (row) => <span className="font-mono text-xs">{row.slug}</span> },
            { key: 'type', label: 'Type' },
            { key: 'sections', label: 'Sections', align: 'right' },
            { key: 'views', label: 'Views', align: 'right' },
            { key: 'updatedBy', label: 'Last edited by' },
            { key: 'updated', label: 'Updated' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          selectable={false}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Link to="/admin/builder" className="text-xs font-semibold text-primary hover:underline">Edit</Link>
              <Link to={`/p${row.slug === '/' ? '' : row.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                <Eye className="h-3 w-3" /> Preview
              </Link>
            </div>
          )}
          footerNote="Slugs must be unique; a duplicate slug cannot be saved"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Navigation and footer</h2>
          <ul className="mt-4 space-y-2.5">
            {navigation.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{item.label}</span>
                  <span className="block font-mono text-xs text-muted-foreground">{item.path} · order {item.order} · parent {item.parent}</span>
                </span>
                <StatusBadge value={item.status} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Menu items can be reordered, nested or hidden, and every link is validated so a broken destination cannot be
            published. Menu editing can never expose a restricted administration route to the public.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-cream p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Content health</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              ['Pages without a meta description', missingMeta.length],
              ['Media files missing alt text', media.filter((m) => !m.altText).length],
              ['Pages not published yet', unpublished.length],
              ['Media files not referenced anywhere', media.filter((m) => m.usedIn === 'Unused').length],
            ].map(([label, value]) => (
              <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                <span className="text-sm text-muted-foreground">{label}</span>
                <StatusBadge value={String(value)} tone={value > 0 ? 'warning' : 'success'} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            These checks surface actionable issues; nothing is changed automatically. Private pages and student records are
            never indexed by search engines.
          </p>
        </div>
      </div>
    </div>
  );
}