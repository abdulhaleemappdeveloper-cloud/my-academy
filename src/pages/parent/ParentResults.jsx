import { BarChart3, ClipboardCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function ParentResults() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const results = useCollection('results');
  const reportCards = useCollection('reportCards');
  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));

  return (
    <div>
      <PageHeader
        title="Results and report cards"
        description="Published results for your children. Marks are shown only after the academic office approves and publishes them — unapproved results stay private."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Results' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Children" value={children.length} hint={children.map((c) => c.name.split(' ')[0]).join(', ')} icon={BarChart3} />
        <StatCard label="Published results" value={children.reduce((sum, c) => sum + results.filter((r) => r.studentId === c.id && r.status === 'Published').length, 0)} hint="Available to view" tone="brand" icon={ClipboardCheck} />
        <StatCard label="Awaiting approval" value={children.reduce((sum, c) => sum + results.filter((r) => r.studentId === c.id && r.status === 'Awaiting approval').length, 0)} hint="Being reviewed by the academy" tone="warning" />
        <StatCard label="Report cards issued" value={reportCards.filter((r) => children.some((c) => c.id === r.studentId) && r.status === 'Published').length} hint="Print or download" />
      </div>

      <div className="mt-6 space-y-8">
        {children.map((child) => {
          const rows = results.filter((r) => r.studentId === child.id);
          const published = rows.filter((r) => r.status === 'Published');
          const average = published.length ? Math.round(published.reduce((sum, r) => sum + r.percent, 0) / published.length) : null;
          const card = reportCards.find((r) => r.studentId === child.id);

          return (
            <section key={child.id}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={child.photo} alt={child.name} className="h-11 w-11 rounded-xl object-cover" />
                  <div>
                    <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{child.name}</h2>
                    <p className="text-xs text-muted-foreground">{child.className} · Section {child.section}</p>
                  </div>
                </div>
                {average !== null && <StatusBadge value={`Average ${average}%`} tone="brand" />}
              </div>

              {card && card.status === 'Published' && (
                <div className="mb-4 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4">
                  {[
                    ['Term', card.term],
                    ['Marks obtained', `${card.obtained} / ${card.total}`],
                    ['Overall grade', card.grade],
                    ['Attendance', `${card.attendance}%`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                  <div className="sm:col-span-4">
                    <button type="button" className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
                      Print or download report card
                    </button>
                  </div>
                </div>
              )}

              <DataTable
                rows={rows}
                searchKeys={['subject', 'exam']}
                searchPlaceholder={`Search ${child.name.split(' ')[0]}'s results…`}
                filters={[
                  { key: 'status', label: 'Status', options: ['Published', 'Awaiting approval', 'Pending marking', 'Recheck requested'] },
                  { key: 'subject', label: 'Subject', options: [...new Set(rows.map((r) => r.subject))] },
                ]}
                pageSize={5}
                selectable={false}
                columns={[
                  { key: 'exam', label: 'Examination' },
                  { key: 'subject', label: 'Subject' },
                  { key: 'marks', label: 'Marks', align: 'right', render: (row) => `${row.marks} / ${row.total}` },
                  { key: 'percent', label: 'Percent', align: 'right', render: (row) => `${row.percent}%` },
                  { key: 'grade', label: 'Grade' },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                  { key: 'publishedOn', label: 'Published' },
                ]}
                footerNote="A recheck request can be raised for any published result"
              />
            </section>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Rechecking a result</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If a mark looks inconsistent, raise a recheck request through the support screen with the subject and your
          reason. The examination controller reviews the script and records the outcome. Published marks are never edited
          directly — the correction and its reason stay in the history.
        </p>
      </div>
    </div>
  );
}