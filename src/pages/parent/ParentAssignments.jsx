import { ClipboardList, FileText, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function ParentAssignments() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const assignments = useCollection('assignments');
  const submissions = useCollection('submissions');
  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));

  return (
    <div>
      <PageHeader
        title="Assignment status"
        description="What has been set for your children, what has been submitted and the feedback returned. You can see status and marks, not the submitted work itself."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Assignments' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assignments set" value={assignments.filter((a) => children.some((c) => c.className === a.className)).length} hint="This term" icon={ClipboardList} />
        <StatCard label="Submitted" value={submissions.filter((s) => children.some((c) => c.id === s.studentId)).length} hint="Across your children" tone="brand" icon={FileText} />
        <StatCard label="Awaiting marking" value={submissions.filter((s) => children.some((c) => c.id === s.studentId) && s.status === 'Submitted').length} hint="With the subject teacher" tone="warning" />
        <StatCard label="Late submissions" value={submissions.filter((s) => children.some((c) => c.id === s.studentId) && s.late).length} hint="Late work follows the assignment rule" tone="danger" icon={TrendingUp} />
      </div>

      <div className="mt-6 space-y-8">
        {children.map((child) => (
          <section key={child.id}>
            <div className="mb-3 flex items-center gap-3">
              <img src={child.photo} alt={child.name} className="h-11 w-11 rounded-xl object-cover" />
              <div>
                <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{child.name}</h2>
                <p className="text-xs text-muted-foreground">{child.className} · Section {child.section}</p>
              </div>
            </div>

            <DataTable
              rows={submissions.filter((s) => s.studentId === child.id)}
              searchKeys={['assignment', 'status']}
              searchPlaceholder="Search submissions…"
              filters={[{ key: 'status', label: 'Status', options: ['Submitted', 'Marked', 'Resubmit requested'] }]}
              pageSize={5}
              selectable={false}
              columns={[
                { key: 'assignment', label: 'Assignment', render: (row) => <span className="font-medium">{row.assignment}</span> },
                { key: 'submittedOn', label: 'Submitted on' },
                { key: 'late', label: 'Timing', render: (row) => <StatusBadge value={row.late ? 'Late' : 'On time'} /> },
                { key: 'marks', label: 'Marks', align: 'right', render: (row) => (row.marks === '—' ? '—' : `${row.marks} / ${row.outOf}`) },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                { key: 'feedback', label: 'Teacher feedback', render: (row) => <span className="line-clamp-1 text-xs text-muted-foreground">{row.feedback}</span> },
              ]}
              footerNote="Feedback is published by the subject teacher after marking"
            />
          </section>
        ))}
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <h2 className="border-b border-border px-5 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em]">Open assignments</h2>
        <ul className="divide-y divide-border">
          {assignments.filter((a) => children.some((c) => c.className === a.className) && a.status === 'Open').slice(0, 6).map((row) => (
            <li key={row.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {row.subject} · {row.className} {row.section} · set {row.assignedOn}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">due {row.dueOn}</span>
                <StatusBadge value={row.lateAllowed} tone="neutral" />
              </div>
            </li>
          ))}
          {assignments.filter((a) => children.some((c) => c.className === a.className) && a.status === 'Open').length === 0 && (
            <li className="px-5 py-6 text-sm text-muted-foreground">No assignments are currently open.</li>
          )}
        </ul>
      </section>
    </div>
  );
}