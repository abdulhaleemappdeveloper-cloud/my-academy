import { Link } from 'react-router-dom';
import {
  AlertTriangle, BarChart3, CalendarDays, CheckCircle2, MessageSquare, Receipt, TrendingUp, Users, Wallet,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { formatMoney } from '@/lib/format';

export default function ParentDashboard() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const results = useCollection('results');
  const attendance = useCollection('attendance');
  const invoices = useCollection('invoices');
  const announcements = useCollection('announcements');
  const meetings = useCollection('meetings');
  const assignments = useCollection('assignments');

  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));
  const child = children[0] || students[0];

  const childResults = results.filter((r) => r.studentId === child.id && r.status === 'Published');
  const average = childResults.length ? Math.round(childResults.reduce((sum, r) => sum + r.percent, 0) / childResults.length) : null;
  const marked = attendance.filter((a) => a.studentId === child.id);
  const present = marked.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const rate = marked.length ? Math.round((present / marked.length) * 100) : child.attendancePct;
  const childInvoices = invoices.filter((i) => i.studentId === child.id);
  const balance = childInvoices.reduce((sum, i) => sum + i.balance, 0);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${guardian.name.split(' ')[0]}`}
        description={`Verified guardian of ${children.map((c) => c.name).join(' and ')}. You see only the children whose guardian link the campus office has verified.`}
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Dashboard' }]}
        actions={
          <>
            <Link to="/parent/payments" className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
              <Wallet className="h-4 w-4" /> Submit payment proof
            </Link>
            <Link to="/parent/meetings" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <CalendarDays className="h-4 w-4" /> Book a meeting
            </Link>
          </>
        }
      />

      {children.length === 0 && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            No student is linked to your account yet. Contact the campus office with your CNIC and the student's admission
            number so the relationship can be verified. Access is never granted by guessing a student ID.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Linked children" value={children.length} hint={children.map((c) => c.className).join(', ') || 'None verified'} icon={Users} to="/parent/children" />
        <StatCard label="Attendance" value={`${rate}%`} hint={`${child.name.split(' ')[0]} · ${marked.length} marked sessions`} tone={rate >= 85 ? 'brand' : 'warning'} icon={CalendarDays} to="/parent/attendance" />
        <StatCard label="Result average" value={average === null ? '—' : `${average}%`} hint="Published results only" icon={BarChart3} to="/parent/results" />
        <StatCard label="Fee balance" value={balance ? formatMoney(balance) : 'Cleared'} hint={`${childInvoices.length} invoices`} tone={balance ? 'warning' : 'brand'} icon={Receipt} to="/parent/fees" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <TrendingUp className="h-4 w-4 text-primary" /> {child.name} — snapshot
            </h2>
            <Link to="/parent/progress" className="text-xs font-semibold text-primary hover:underline">Full progress</Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ['Class', `${child.className} · Section ${child.section}`],
              ['Roll number', child.rollNumber],
              ['Status', child.status],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-background p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Published subject results</h3>
          <ul className="mt-3 divide-y divide-border">
            {childResults.slice(0, 5).map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{row.subject}</p>
                  <p className="text-xs text-muted-foreground">{row.exam}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{row.marks} / {row.total}</span>
                  <StatusBadge value={row.grade} tone="brand" />
                </div>
              </li>
            ))}
            {childResults.length === 0 && (
              <li className="py-5 text-sm text-muted-foreground">
                No results have been published for this term yet.
              </li>
            )}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Assignments</h2>
            <ul className="mt-3 space-y-3">
              {assignments.filter((a) => a.className === child.className).slice(0, 4).map((row) => (
                <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                  <p className="text-sm font-medium text-foreground">{row.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.subject} · due {row.dueOn}</p>
                </li>
              ))}
            </ul>
            <Link to="/parent/assignments" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">All assignments</Link>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" /> Meetings
            </h2>
            <ul className="mt-3 space-y-3">
              {meetings.slice(0, 3).map((row) => (
                <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{row.teacher}</p>
                    <StatusBadge value={row.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{row.slot} · {row.mode}</p>
                </li>
              ))}
            </ul>
            <Link to="/parent/meetings" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">Manage meetings</Link>
          </section>
        </div>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-cream p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <MessageSquare className="h-4 w-4 text-primary" /> Notices from the academy
          </h2>
          <ul className="mt-4 space-y-3">
            {announcements.filter((a) => a.audience === 'Parents' || a.audience === 'Everyone').slice(0, 4).map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-card p-3.5">
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.category} · {row.date}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <CheckCircle2 className="h-4 w-4 text-primary" /> What you can do here
          </h2>
          <ul className="mt-4 space-y-2.5">
            {[
              'Track attendance, results and assignments for your own children only.',
              'Submit a fee payment proof against an invoice and follow its verification.',
              'Request a meeting with a subject teacher and view meeting notes.',
              'Raise a support request with the campus office and follow its progress.',
            ].map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Guardian status: <StatusBadge value={guardian.status} /> · last contact {guardian.lastContact}
          </p>
        </div>
      </section>
    </div>
  );
}