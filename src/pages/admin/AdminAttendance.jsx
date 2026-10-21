import { AlertTriangle, CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function AdminAttendance() {
  const { account } = useSession();
  const attendance = useCollection('attendance');
  const classes = useCollection('classes');
  const students = useCollection('students');
  const staff = useCollection('staff');
  const { toast } = useToast();

  const present = attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const rate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const corrections = attendance.filter((a) => a.correction === 'Correction requested');

  const decide = (row, outcome) => {
    patch('attendance', row.id, { correction: outcome === 'Approved' ? 'Corrected & approved' : 'Correction declined' });
    logAction({
      actor: account?.name,
      role: account?.label,
      action: `Attendance correction ${outcome.toLowerCase()}`,
      module: 'Attendance',
      target: `${row.studentName} · ${row.date}`,
      reason: row.note || 'Correction request review',
      before: `correction: ${row.correction}`,
      after: `correction: ${outcome === 'Approved' ? 'Corrected & approved' : 'Correction declined'}`,
    });
    toast({
      title: `Correction ${outcome.toLowerCase()}`,
      description: 'The original record is preserved and the decision is recorded in the audit log.',
    });
  };

  return (
    <div>
      <PageHeader
        title="Attendance administration"
        description="Attendance records, correction requests and the policy that governs the calculation. Teachers mark attendance only for their assigned classes."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Attendance' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance rate" value={`${rate}%`} hint={`${attendance.length} marked sessions`} tone={rate >= 90 ? 'brand' : 'warning'} icon={CalendarCheck} />
        <StatCard label="Absences" value={attendance.filter((a) => a.status === 'Absent').length} hint="Guardian notified where enabled" tone="danger" />
        <StatCard label="Late arrivals" value={attendance.filter((a) => a.status === 'Late').length} hint="Recorded by the class teacher" tone="warning" icon={Clock} />
        <StatCard label="Corrections to review" value={corrections.length} hint="Reviewed with a reason" tone={corrections.length ? 'warning' : 'brand'} icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="records" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="corrections">Correction requests</TabsTrigger>
          <TabsTrigger value="students">Student summaries</TabsTrigger>
          <TabsTrigger value="staff">Staff attendance</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="mt-4">
          <DataTable
            rows={attendance}
            searchKeys={['studentName', 'date', 'subject', 'markedBy']}
            searchPlaceholder="Search attendance records…"
            filters={[
              { key: 'className', label: 'Class', options: [...new Set(attendance.map((a) => a.className))] },
              { key: 'status', label: 'Status', options: ['Present', 'Absent', 'Late', 'Excused', 'Leave'] },
              { key: 'correction', label: 'Correction', options: ['None', 'Correction requested', 'Corrected & approved'] },
            ]}
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'section', label: 'Section' },
              { key: 'subject', label: 'Session' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'markedBy', label: 'Marked by' },
              { key: 'correction', label: 'Correction', render: (row) => <StatusBadge value={row.correction} /> },
            ]}
            selectable={false}
            footerNote="Duplicate records for the same student, date and session are rejected"
          />
        </TabsContent>

        <TabsContent value="corrections" className="mt-4">
          <DataTable
            rows={corrections}
            searchKeys={['studentName', 'date', 'subject', 'markedBy']}
            searchPlaceholder="Search correction requests…"
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'studentName', label: 'Student' },
              { key: 'subject', label: 'Session' },
              { key: 'status', label: 'Marked as', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'markedBy', label: 'Marked by' },
              { key: 'note', label: 'Request note', render: (row) => <span className="text-xs text-muted-foreground">{row.note}</span> },
            ]}
            selectable={false}
            rowActions={(row) => (
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => decide(row, 'Approved')} className="text-xs font-semibold text-primary hover:underline">
                  Approve
                </button>
                <button type="button" onClick={() => decide(row, 'Declined')} className="text-xs font-semibold text-muted-foreground hover:underline">
                  Decline
                </button>
              </div>
            )}
            emptyTitle="No correction requests are waiting"
            emptyDescription="Corrections appear here when a teacher or guardian reports a marking error."
          />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Correcting a record never erases the original entry — the
            change, the actor and the reason are kept in the history.
          </p>
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          <DataTable
            rows={students}
            searchKeys={['name', 'code', 'className']}
            searchPlaceholder="Search students…"
            filters={[
              { key: 'className', label: 'Class', options: classes.map((c) => c.name) },
              { key: 'section', label: 'Section', options: ['A', 'B'] },
            ]}
            columns={[
              { key: 'name', label: 'Student', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'className', label: 'Class' },
              { key: 'section', label: 'Section' },
              { key: 'attendancePct', label: 'Attendance', align: 'right', render: (row) => <StatusBadge value={`${row.attendancePct}%`} tone={row.attendancePct >= 85 ? 'success' : 'warning'} /> },
              { key: 'status', label: 'Enrolment', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Below 75% attendance may affect examination eligibility"
          />
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <DataTable
            rows={staff}
            searchKeys={['name', 'role', 'department']}
            searchPlaceholder="Search staff…"
            filters={[{ key: 'department', label: 'Department', options: [...new Set(staff.map((s) => s.department))] }]}
            columns={[
              { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'role', label: 'Role' },
              { key: 'department', label: 'Department' },
              { key: 'joined', label: 'Joined' },
              { key: 'contractExpiry', label: 'Contract expiry' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Staff attendance and leave follow the HR module and are recorded separately from student attendance"
          />
        </TabsContent>

        <TabsContent value="policy" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Calculation and codes</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Attendance percentage = (present + late) ÷ total marked sessions × 100. Holidays, campus closures and
              approved leave are excluded from the total. The same formula is used on report cards and in parent
              summaries.
            </p>
            <ul className="mt-4 space-y-2">
              {['Present', 'Absent', 'Late', 'Excused', 'Leave'].map((code) => (
                <li key={code} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{code}</span>
                  <StatusBadge value={code === 'Present' || code === 'Late' ? 'Counts as attended' : 'Excluded from the count'} tone="neutral" />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Notification thresholds</h2>
            <ul className="mt-4 space-y-3">
              {[
                ['First absence in a week', 'Guardian notified in the portal'],
                ['Three consecutive absences', 'Class teacher calls the guardian'],
                ['Attendance below 85%', 'Flagged for academic review'],
                ['Attendance below 75%', 'Examination eligibility review'],
              ].map(([rule, action]) => (
                <li key={rule} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-3">
                  <span className="text-sm text-foreground">{rule}</span>
                  <span className="text-right text-xs text-muted-foreground">{action}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Notifications are sent through the channels the academy has configured. SMS and WhatsApp remain disabled
              until a provider is connected.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}