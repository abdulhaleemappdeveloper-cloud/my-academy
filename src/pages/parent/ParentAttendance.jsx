import { CalendarDays, Clock, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function ParentAttendance() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const attendance = useCollection('attendance');
  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));

  return (
    <div>
      <PageHeader
        title="Attendance overview"
        description="Attendance for each linked child, calculated as (present + late) ÷ marked sessions × 100. Holidays and approved leave are excluded."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Attendance' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Children tracked" value={children.length} hint={children.map((c) => c.name.split(' ')[0]).join(', ')} icon={CalendarDays} />
        <StatCard label="Absences this term" value={children.reduce((sum, c) => sum + attendance.filter((a) => a.studentId === c.id && a.status === 'Absent').length, 0)} hint="Guardian notified where enabled" tone="danger" />
        <StatCard label="Late arrivals" value={children.reduce((sum, c) => sum + attendance.filter((a) => a.studentId === c.id && a.status === 'Late').length, 0)} hint="Reported at the front desk" tone="warning" icon={Clock} />
        <StatCard label="Corrections pending" value={attendance.filter((a) => children.some((c) => c.id === a.studentId) && a.correction === 'Correction requested').length} hint="Reviewed by the academic office" />
      </div>

      <div className="mt-6 space-y-8">
        {children.map((child) => {
          const rows = attendance.filter((a) => a.studentId === child.id);
          const present = rows.filter((a) => a.status === 'Present' || a.status === 'Late').length;
          const rate = rows.length ? Math.round((present / rows.length) * 100) : child.attendancePct;
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
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{rows.length} marked sessions</span>
                  <StatusBadge value={`${rate}% attendance`} tone={rate >= 85 ? 'success' : 'warning'} />
                </div>
              </div>

              <DataTable
                rows={rows}
                searchKeys={['date', 'subject', 'status']}
                searchPlaceholder={`Search ${child.name.split(' ')[0]}'s attendance…`}
                filters={[
                  { key: 'status', label: 'Status', options: ['Present', 'Absent', 'Late', 'Excused', 'Leave'] },
                  { key: 'subject', label: 'Session', options: [...new Set(rows.map((r) => r.subject))] },
                ]}
                pageSize={5}
                selectable={false}
                columns={[
                  { key: 'date', label: 'Date' },
                  { key: 'subject', label: 'Session' },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                  { key: 'markedBy', label: 'Marked by' },
                  { key: 'note', label: 'Note', render: (row) => <span className="text-xs text-muted-foreground">{row.note}</span> },
                  { key: 'correction', label: 'Correction', render: (row) => <StatusBadge value={row.correction} /> },
                ]}
                footerNote="Corrections are requested, approved and recorded — never overwritten silently"
              />
            </section>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-cream p-5">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Attendance below 85 per cent may affect promotion and examination eligibility. If a session has been marked
          incorrectly, raise a correction request from the support screen rather than contacting the teacher directly —
          every correction is reviewed and keeps the original record in history.
        </p>
      </div>
    </div>
  );
}