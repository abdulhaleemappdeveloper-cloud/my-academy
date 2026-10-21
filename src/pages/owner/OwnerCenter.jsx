import { Link } from 'react-router-dom';
import {
  Activity, AlertTriangle, Award, Banknote, Database, GraduationCap, KeyRound, Landmark, Receipt,
  ScrollText, ShieldCheck, TrendingUp, Users, Wallet,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';
import { ACADEMY } from '@/data/academy';
import { formatMoney } from '@/lib/format';

/** Owner control centre — ownership-level oversight for the whole institution. */
export default function OwnerCenter() {
  const students = useCollection('students');
  const teachers = useCollection('teachers');
  const roles = useCollection('roles');
  const invoices = useCollection('invoices');
  const payments = useCollection('payments');
  const results = useCollection('results');
  const attendance = useCollection('attendance');
  const incidents = useCollection('incidents');
  const accreditation = useCollection('accreditation');
  const backups = useCollection('backups');
  const audits = useCollection('auditLogs');
  const health = useCollection('systemHealth');
  const certificates = useCollection('certificates');
  const dictionary = useCollection('dictionary');

  const billed = invoices.reduce((s, i) => s + i.amount - i.discount, 0);
  const collected = invoices.reduce((s, i) => s + i.paid, 0);
  const published = results.filter((r) => r.status === 'Published');
  const average = published.length ? Math.round(published.reduce((s, r) => s + r.percent, 0) / published.length) : 0;
  const attendanceRate = attendance.length
    ? Math.round((attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length / attendance.length) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="Owner control centre"
        description={`${ACADEMY.brand}, ${ACADEMY.campus} · owned by ${ACADEMY.owner} · platform built by ${ACADEMY.developer}`}
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Control centre' }]}
        actions={
          <>
            <Link to="/owner/security" className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4" /> Security overview
            </Link>
            <Link to="/admin" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Landmark className="h-4 w-4" /> Administration
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value={students.length} hint={`${students.filter((s) => s.status === 'Active').length} active`} icon={GraduationCap} to="/admin/students" />
        <StatCard label="Teaching accounts" value={teachers.length} hint={`${roles.reduce((s, r) => s + r.users, 0)} accounts across all roles`} icon={Users} to="/admin/people" />
        <StatCard label="Fee collection rate" value={`${billed ? Math.round((collected / billed) * 100) : 0}%`} hint={`${formatMoney(billed - collected)} outstanding`} tone="brand" icon={Receipt} to="/admin/fees" />
        <StatCard label="Verified payments" value={payments.filter((p) => p.status === 'Approved').length} hint={`${formatMoney(payments.filter((p) => p.status === 'Approved').reduce((s, p) => s + p.amount, 0))} collected`} icon={Wallet} to="/admin/payments" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Academic average" value={`${average}%`} hint={`${published.length} published results`} icon={TrendingUp} to="/admin/results" />
        <StatCard label="Attendance rate" value={`${attendanceRate}%`} hint={`${attendance.length} marked sessions`} />
        <StatCard label="Risk register open" value={incidents.filter((i) => i.status !== 'Closed').length} hint={`${accreditation.filter((a) => a.status === 'Renewal due soon').length} documents due for renewal`} tone="warning" icon={AlertTriangle} to="/owner/compliance" />
        <StatCard label="Privileged accounts" value={roles.filter((r) => r.risk === 'Critical' || r.risk === 'High').reduce((s, r) => s + r.users, 0)} hint="Owner, admin, finance and examination roles" tone="danger" icon={KeyRound} to="/owner/accounts" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <ShieldCheck className="h-4 w-4 text-primary" /> Institutional oversight
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {[
              ['Enrolment and admissions', `${students.length} on roll · ${students.filter((s) => s.status === 'Applicant').length} applicants in progress`],
              ['Academic performance', `Average ${average}% across published results`],
              ['Attendance', `${attendanceRate}% including late arrivals`],
              ['Fee collection', `${formatMoney(collected)} collected of ${formatMoney(billed)} billed`],
              ['Payment verification', `${payments.filter((p) => p.status === 'Pending verification').length} submissions awaiting review`],
              ['Staffing', `${teachers.length} teaching accounts · ${roles.find((r) => r.id === 'staff')?.users || 0} staff accounts`],
              ['Platform services', `${health.filter((h) => h.status === 'Healthy').length} of ${health.length} checks healthy`],
              ['Backups', `${backups.filter((b) => b.status === 'Completed').length} completed · ${backups.filter((b) => b.integrity !== 'Verified').length} not integrity-verified`],
            ].map(([label, value]) => (
              <li key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-right text-sm text-muted-foreground">{value}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Owner-only controls</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: 'Privileged accounts and roles', to: '/owner/accounts' },
                { label: 'Security overview and login activity', to: '/owner/security' },
                { label: 'Compliance, policy and consent', to: '/owner/compliance' },
                { label: 'Platform configuration and secrets', to: '/owner/configuration' },
                { label: 'Feature flags and rollout', to: '/owner/features' },
                { label: 'Backups and recovery', to: '/owner/backups' },
                { label: 'Audit investigation', to: '/owner/audit' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40">
                    {item.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Ownership-level permissions are enforced on the server. Hiding a control in the interface is never treated as
              authorisation.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Recent privileged activity</h2>
            <ul className="mt-4 space-y-3">
              {audits.slice(0, 5).map((row) => (
                <li key={row.id} className="text-xs">
                  <p className="text-sm text-foreground">{row.action}</p>
                  <p className="mt-0.5 text-muted-foreground">{row.actor} · {row.time} · {row.outcome}</p>
                </li>
              ))}
            </ul>
            <Link to="/owner/audit" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">
              Open audit investigation
            </Link>
          </section>
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Compliance documents', value: `${accreditation.filter((a) => a.status === 'Valid').length} valid`, icon: ScrollText, to: '/owner/compliance' },
          { label: 'Verified collections', value: formatMoney(payments.filter((p) => p.status === 'Approved').reduce((s, p) => s + p.amount, 0)), icon: Banknote, to: '/admin/payments' },
          { label: 'Certificates issued', value: `${certificates.filter((c) => c.status === 'Issued').length}`, icon: Award, to: '/admin/certificates' },
          { label: 'Data dictionary entries', value: `${dictionary.length}`, icon: Database, to: '/admin/data' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            <item.icon className="h-4 w-4 text-primary" />
            <span className="min-w-0">
              <span className="block text-xs font-medium text-muted-foreground">{item.label}</span>
              <span className="block truncate">{item.value}</span>
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-cream p-5">
        <Activity className="h-4 w-4 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          This console reports real records only. Operational figures that depend on the backend — database connectivity,
          backup completion and error monitoring — are labelled as not connected until they genuinely are.
        </p>
        <StatusBadge className="ml-auto" value={`${health.filter((h) => h.status === 'Healthy').length} services healthy`} tone="brand" />
      </div>
    </div>
  );
}