import { AlertTriangle, CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const STATUS_TONE = {
  Present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Late: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Absent: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  Excused: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Leave: 'bg-muted text-muted-foreground',
};

export default function StudentAttendance() {
  const { account } = useSession();
  const students = useCollection('students');
  const attendance = useCollection('attendance');
  const student = students.find((s) => s.name === account?.name) || students[9];
  const mine = attendance.filter((row) => row.studentId === student.id);

  const counted = mine.filter((row) => row.status === 'Present' || row.status === 'Late').length;
  const rate = mine.length ? Math.round((counted / mine.length) * 100) : student.attendancePct;

  const bySubject = [...new Set(mine.map((row) => row.subject))].map((subject) => {
    const rows = mine.filter((row) => row.subject === subject);
    const ok = rows.filter((row) => row.status === 'Present' || row.status === 'Late').length;
    return { subject, sessions: rows.length, present: ok, rate: Math.round((ok / rows.length) * 100) };
  });

  const recent = mine.slice(0, 20);

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Daily and subject attendance. Attendance is marked by the teacher of the period and can be corrected only through a recorded request."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Attendance' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance rate" value={`${rate}%`} hint="Present plus late, all marked sessions" tone={rate >= 85 ? 'brand' : 'warning'} icon={CalendarCheck} />
        <StatCard label="Sessions marked" value={mine.length} hint="Current term" icon={CheckCircle2} />
        <StatCard label="Absences" value={mine.filter((r) => r.status === 'Absent').length} hint="Guardian notified where enabled" tone="danger" />
        <StatCard label="Late arrivals" value={mine.filter((r) => r.status === 'Late').length} hint="Reported at the front desk" tone="warning" icon={Clock} />
      </div>

      {rate < 85 && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            Attendance below 85 per cent may affect promotion and examination eligibility under the academy's academic
            policy. Speak to your class teacher about making up missed sessions.
          </p>
        </div>
      )}

      <Tabs defaultValue="records" className="mt-6">
        <TabsList>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="subjects">By subject</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="mt-4">
          <DataTable
            rows={recent}
            searchKeys={['date', 'subject', 'status', 'markedBy']}
            searchPlaceholder="Search by date or subject…"
            filters={[
              { key: 'status', label: 'Status', options: ['Present', 'Absent', 'Late', 'Excused', 'Leave'] },
              { key: 'subject', label: 'Session', options: [...new Set(recent.map((r) => r.subject))] },
            ]}
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'subject', label: 'Session' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'markedBy', label: 'Marked by' },
              { key: 'note', label: 'Note', render: (row) => <span className="text-xs text-muted-foreground">{row.note}</span> },
              { key: 'correction', label: 'Correction', render: (row) => <StatusBadge value={row.correction} /> },
            ]}
            selectable={false}
            footerNote="Corrections are reviewed by the academic office"
          />
        </TabsContent>

        <TabsContent value="subjects" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bySubject.map((row) => (
            <div key={row.subject} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-foreground">{row.subject}</h2>
                <StatusBadge value={`${row.rate}%`} tone={row.rate >= 85 ? 'success' : 'warning'} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{row.present} present of {row.sessions} sessions</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand" style={{ width: `${row.rate}%` }} />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">How attendance is calculated</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Attendance percentage = (present + late) ÷ total marked sessions × 100. Holidays, campus closures and
          approved leave are excluded from the total. The same formula is used in your report card.
        </p>
      </div>
    </div>
  );
}