import { Link } from 'react-router-dom';
import {
  Activity, AlertTriangle, Award, Banknote, Bell, CalendarDays, CheckCircle2, ClipboardCheck,
  Database, FileText, Inbox, Megaphone, PenLine, Receipt, TrendingUp, UserPlus, Users, Wallet,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { formatMoney } from '@/lib/format';

/**
 * Admin command centre.
 * Every widget reads live academy data — nothing here is a placeholder figure.
 */
export default function AdminCommandCenter() {
  const { account } = useSession();
  const students = useCollection('students');
  const admissions = useCollection('admissions');
  const payments = useCollection('payments');
  const invoices = useCollection('invoices');
  const results = useCollection('results');
  const attendance = useCollection('attendance');
  const tickets = useCollection('tickets');
  const approvals = useCollection('approvals');
  const exams = useCollection('exams');
  const submissions = useCollection('submissions');
  const pages = useCollection('pages');
  const auditLogs = useCollection('auditLogs');
  const health = useCollection('systemHealth');
  const jobs = useCollection('jobs');
  const backups = useCollection('backups');
  const dataQuality = useCollection('dataQuality');
  const teachers = useCollection('teachers');

  const active = students.filter((s) => s.status === 'Active');
  const pendingAdmissions = admissions.filter((a) => ['Submitted', 'Under review', 'Information requested'].includes(a.stage));
  const pendingPayments = payments.filter((p) => p.status === 'Pending verification');
  const outstanding = invoices.reduce((sum, row) => sum + row.balance, 0);
  const awaitingResultApproval = results.filter((r) => r.status === 'Awaiting approval');
  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In progress');
  const drafts = pages.filter((p) => p.status !== 'Published');
  const markedToday = attendance.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length;
  const present = attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const upcomingExams = exams.filter((e) => ['Scheduled', 'Approved'].includes(e.status));

  return (
    <div>
      <PageHeader
        title={`${account?.label} command centre`}
        description={`Al Mursusb Campus · session 2025 – 2026 · signed in as ${account?.name}`}
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Command centre' }]}
        actions={
          <>
            <Link to="/admin/approvals" className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
              <Inbox className="h-4 w-4" /> Approvals ({approvals.filter((a) => a.status === 'Pending').length})
            </Link>
            <Link to="/admin/reports" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <TrendingUp className="h-4 w-4" /> Reports
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students enrolled" value={students.length} hint={`${active.length} currently active`} icon={Users} to="/admin/students" />
        <StatCard label="Admissions in progress" value={pendingAdmissions.length} hint="Submitted, reviewing or awaiting documents" tone="warning" icon={UserPlus} to="/admin/admissions" />
        <StatCard label="Payments to verify" value={pendingPayments.length} hint={formatMoney(pendingPayments.reduce((s, p) => s + p.amount, 0))} tone="warning" icon={Wallet} to="/admin/payments" />
        <StatCard label="Outstanding fees" value={formatMoney(outstanding)} hint={`${invoices.filter((i) => i.balance > 0).length} invoices`} tone="gold" icon={Receipt} to="/admin/fees" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Results awaiting approval" value={awaitingResultApproval.length} hint="Not visible until published" tone="warning" icon={ClipboardCheck} to="/admin/results" />
        <StatCard label="Attendance today" value={markedToday ? `${markedToday} marked` : 'Not marked yet'} hint={`Term average ${attendanceRate}%`} icon={CalendarDays} to="/admin/attendance" />
        <StatCard label="Assignments to review" value={submissions.filter((s) => s.status === 'Submitted').length} hint="Awaiting teacher marking" icon={FileText} to="/admin/academics" />
        <StatCard label="Open support tickets" value={openTickets.length} hint="Across all departments" tone={openTickets.length ? 'warning' : 'brand'} icon={Bell} to="/admin/documents" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <Inbox className="h-4 w-4 text-primary" /> Waiting on a decision
            </h2>
            <Link to="/admin/approvals" className="text-xs font-semibold text-primary hover:underline">Open approvals inbox</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {approvals.filter((a) => a.status === 'Pending').slice(0, 6).map((row) => (
              <li key={row.id} className="flex items-start justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{row.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {row.type} · {row.requester} · waiting {row.waiting} · {row.evidence}
                  </p>
                </div>
                <StatusBadge value={row.priority} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <Activity className="h-4 w-4 text-primary" /> System and operations
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              { label: 'Services healthy', value: `${health.filter((h) => h.status === 'Healthy').length} of ${health.length}`, tone: 'brand' },
              { label: 'Jobs needing attention', value: jobs.filter((j) => j.status === 'Failed').length, tone: 'warning' },
              { label: 'Backups completed', value: `${backups.filter((b) => b.status === 'Completed').length} of ${backups.length}`, tone: 'neutral' },
              { label: 'Data quality issues', value: dataQuality.filter((d) => d.status === 'Open').length, tone: 'warning' },
              { label: 'Unpublished website pages', value: drafts.length, tone: 'neutral' },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <StatusBadge value={String(item.value)} tone={item.tone} />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/admin/system" className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground">System health</Link>
            <Link to="/admin/data" className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground">Data tools</Link>
            <Link to="/admin/audit" className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground">Audit logs</Link>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
            <Users className="h-4 w-4 text-primary" /> Students by class
          </h2>
          <ul className="mt-4 space-y-2.5">
            {[...new Set(students.map((s) => s.className))].slice(0, 7).map((className) => {
              const rows = students.filter((s) => s.className === className);
              return (
                <li key={className} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">{className}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {rows.filter((r) => r.section === 'A').length}A · {rows.filter((r) => r.section === 'B').length}B
                    </span>
                    <StatusBadge value={String(rows.length)} tone="neutral" />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
            <ClipboardCheck className="h-4 w-4 text-primary" /> Examinations ahead
          </h2>
          <ul className="mt-4 space-y-3">
            {upcomingExams.slice(0, 4).map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-sm font-medium text-foreground">{row.subject} · {row.className}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.date} · {row.start} · {row.room}</p>
              </li>
            ))}
            {upcomingExams.length === 0 && <li className="text-sm text-muted-foreground">No examinations are currently scheduled.</li>}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
            <PenLine className="h-4 w-4 text-primary" /> Recent administrative actions
          </h2>
          <ul className="mt-4 space-y-3">
            {auditLogs.slice(0, 5).map((row) => (
              <li key={row.id} className="text-xs">
                <p className="text-sm text-foreground">{row.action}</p>
                <p className="mt-0.5 text-muted-foreground">{row.actor} · {row.time} · {row.module}</p>
              </li>
            ))}
          </ul>
          <Link to="/admin/audit" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">Open audit log explorer</Link>
        </section>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[
          { label: 'Add a student', to: '/admin/students', icon: UserPlus },
          { label: 'Verify payments', to: '/admin/payments', icon: Wallet },
          { label: 'Publish results', to: '/admin/results', icon: ClipboardCheck },
          { label: 'Issue a certificate', to: '/admin/certificates', icon: Award },
          { label: 'Publish an announcement', to: '/admin/communications', icon: Megaphone },
          { label: 'Review website pages', to: '/admin/pages', icon: FileText },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            <action.icon className="h-4 w-4 text-primary" /> {action.label}
          </Link>
        ))}
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-cream p-5">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Every action taken from this console is written to the audit log with the account, time and reason. Widgets
          only show data the signed-in role is permitted to read — permissions are enforced on the server once the
          backend is connected, not only hidden in this interface.
        </p>
        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Database className="h-3.5 w-3.5" /> {teachers.length} teaching accounts · <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> live data
        </span>
      </div>
    </div>
  );
}