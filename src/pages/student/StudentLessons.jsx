import { useState } from 'react';
import { Download, FileText, Library } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bulkPatch, useCollection } from '@/data/store';

export default function StudentLessons() {
  const notes = useCollection('notes');
  const lessons = useCollection('lessons');
  const papers = useCollection('papers');
  const bookmarks = useCollection('bookmarks');
  const downloads = useCollection('downloads');
  const [reading, setReading] = useState(null);

  const published = notes.filter((row) => row.status === 'Published');

  return (
    <div>
      <PageHeader
        title="Lessons, notes and papers"
        description="Chapter-wise material for your class, plus past papers and solved sets. Downloads are recorded so your history stays complete."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Lessons and notes' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Notes available" value={published.length} hint="Published for your class" icon={FileText} />
        <StatCard label="Lessons" value={lessons.filter((l) => l.status === 'Published').length} hint="Across your courses" icon={Library} />
        <StatCard label="Papers" value={papers.filter((p) => p.status === 'Published').length} hint="Past, solved and sample" icon={Download} />
        <StatCard label="Saved items" value={bookmarks.length} hint="Bookmarks and downloads" tone="brand" />
      </div>

      <Tabs defaultValue="notes" className="mt-6">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="saved">Saved and downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4">
          <DataTable
            rows={published}
            searchKeys={['title', 'subject', 'className', 'chapter']}
            searchPlaceholder="Search notes by title, subject or chapter…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(published.map((n) => n.subject))] },
              { key: 'className', label: 'Class', options: [...new Set(published.map((n) => n.className))] },
              { key: 'type', label: 'Type', options: [...new Set(published.map((n) => n.type))] },
            ]}
            columns={[
              { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'subject', label: 'Subject' },
              { key: 'className', label: 'Class' },
              { key: 'type', label: 'Type' },
              { key: 'pages', label: 'Pages', align: 'right' },
              { key: 'updated', label: 'Updated' },
            ]}
            onRowClick={(row) => setReading({ kind: 'note', row })}
            rowActions={(row) => (
              <button type="button" onClick={() => setReading({ kind: 'note', row })} className="text-xs font-semibold text-primary hover:underline">
                Read
              </button>
            )}
            selectable={false}
            emptyTitle="No notes match your filters"
          />
        </TabsContent>

        <TabsContent value="lessons" className="mt-4">
          <DataTable
            rows={lessons}
            searchKeys={['title', 'subject', 'chapter', 'type']}
            searchPlaceholder="Search lessons…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(lessons.map((l) => l.subject))] },
              { key: 'type', label: 'Type', options: [...new Set(lessons.map((l) => l.type))] },
              { key: 'status', label: 'Status', options: ['Published', 'Draft'] },
            ]}
            columns={[
              { key: 'title', label: 'Lesson', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'subject', label: 'Subject' },
              { key: 'chapter', label: 'Chapter' },
              { key: 'type', label: 'Type' },
              { key: 'duration', label: 'Duration' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            onRowClick={(row) => setReading({ kind: 'lesson', row })}
            rowActions={(row) => (
              <button type="button" onClick={() => setReading({ kind: 'lesson', row })} className="text-xs font-semibold text-primary hover:underline">
                Open
              </button>
            )}
            selectable={false}
          />
        </TabsContent>

        <TabsContent value="papers" className="mt-4">
          <DataTable
            rows={papers}
            searchKeys={['title', 'subject', 'className']}
            searchPlaceholder="Search papers by subject or year…"
            filters={[
              { key: 'type', label: 'Type', options: ['Past paper', 'Solved paper', 'Sample paper'] },
              { key: 'year', label: 'Year', options: [...new Set(papers.map((p) => String(p.year)))].sort() },
            ]}
            columns={[
              { key: 'title', label: 'Paper', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
              { key: 'subject', label: 'Subject' },
              { key: 'className', label: 'Class' },
              { key: 'marks', label: 'Marks', align: 'right' },
              { key: 'pages', label: 'Pages', align: 'right' },
            ]}
            onRowClick={(row) => setReading({ kind: 'paper', row })}
            rowActions={(row) => (
              <button type="button" onClick={() => setReading({ kind: 'paper', row })} className="text-xs font-semibold text-primary hover:underline">
                Open
              </button>
            )}
            selectable={false}
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Bookmarks</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <ul className="divide-y divide-border">
                {bookmarks.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 bg-card px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.type} · {item.subject} · saved {item.savedOn}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => bulkPatch('bookmarks', [item.id], { progress: '100%' })}
                      className="shrink-0 text-xs font-semibold text-primary hover:underline"
                    >
                      Mark revised
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Download history</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <ul className="divide-y divide-border">
                {downloads.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 bg-card px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.type} · {item.size}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.downloadedOn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(reading)}
        onClose={() => setReading(null)}
        title={reading?.row?.title}
        subtitle={reading ? `${reading.row.subject} · ${reading.row.className || reading.row.chapter || ''}` : ''}
        badge={reading?.row?.status || reading?.row?.type}
        footer={
          <>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Download className="h-4 w-4" /> Download and record
            </button>
            <button
              type="button"
              onClick={() => reading && bulkPatch('bookmarks', [], {})}
              className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground"
            >
              Save for revision
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Content</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {reading?.row?.summary ||
                'This resource opens in the reader. Text notes can be enlarged, and documents can be printed for offline revision.'}
            </p>
          </div>
          <div className="grid place-items-center rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <p className="text-xs text-muted-foreground">
              The document viewer loads here once file storage is connected. Downloads are logged so the academy can see
              which material students are using most.
            </p>
          </div>
        </div>
      </RecordDrawer>
    </div>
  );
}