import { Download, History, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { downloadCSV, useCollection } from '@/data/store';

/** Audit log explorer: filter by actor, module, action and outcome, then export. */
export default function AdminAudit() {
  const logs = useCollection('auditLogs');
  const security = useCollection('systemHealth');

  const failures = logs.filter((l) => l.outcome !== 'Success');

  return (
    <div>
      <PageHeader
        title="Audit log explorer"
        description="Every privileged action with its actor, target, time, outcome and reason. Audit records are append-only — ordinary administrators cannot edit or delete them."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Audit logs' }]}
        actions={
          <button
            type="button"
            onClick={() => downloadCSV('audit-log', logs, [
              { key: 'time', label: 'Time' },
              { key: 'actor', label: 'Actor' },
              { key: 'role', label: 'Role' },
              { key: 'action', label: 'Action' },
              { key: 'module', label: 'Module' },
              { key: 'target', label: 'Target' },
              { key: 'outcome', label: 'Outcome' },
              { key: 'reason', label: 'Reason' },
              { key: 'requestId', label: 'Request ID' },
            ])}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground"
          >
            <Download className="h-4 w-4" /> Export audit log
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Audit entries" value={logs.length} hint="This session" icon={History} />
        <StatCard label="Financial actions" value={logs.filter((l) => l.module === 'Finance').length} hint="Payments, refunds and adjustments" />
        <StatCard label="Failed or denied" value={failures.length} hint="Reviewed for investigation" tone={failures.length ? 'warning' : 'brand'} icon={ShieldCheck} />
        <StatCard label="Services monitored" value={security.length} hint="Operational checks" />
      </div>

      <div className="mt-6">
        <DataTable
          rows={logs}
          searchKeys={['actor', 'role', 'action', 'module', 'target', 'reason', 'requestId']}
          searchPlaceholder="Search by actor, action, module, target or request ID…"
          filters={[
            { key: 'module', label: 'Module', options: [...new Set(logs.map((l) => l.module))] },
            { key: 'outcome', label: 'Outcome', options: ['Success', 'Failed', 'Denied'] },
            { key: 'role', label: 'Role', options: [...new Set(logs.map((l) => l.role))] },
          ]}
          pageSize={15}
          columns={[
            { key: 'time', label: 'Time' },
            { key: 'actor', label: 'Actor', render: (row) => <span className="font-medium">{row.actor}</span> },
            { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} tone="neutral" /> },
            { key: 'action', label: 'Action' },
            { key: 'module', label: 'Module' },
            { key: 'target', label: 'Target' },
            { key: 'outcome', label: 'Outcome', render: (row) => <StatusBadge value={row.outcome} /> },
            { key: 'reason', label: 'Reason' },
            { key: 'requestId', label: 'Request ID', render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.requestId}</span> },
          ]}
          selectable={false}
          footerNote="Passwords, tokens and payment credentials are never written to the log"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">What is recorded</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              'Role and permission changes, with the previous and new values.',
              'Student record changes, class and section transfers, suspension and restoration.',
              'Attendance corrections with the reason and the approving account.',
              'Examination settings, marks entry and result publication.',
              'Fee ledger adjustments, payment verification and refunds.',
              'Content publication, security settings and integration changes.',
              'Bulk operations, imports and exports.',
            ].map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-cream p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Investigation tools</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              ['Filter by actor, role, module, action and outcome', 'Available above'],
              ['Search by record identifier', 'Use the search field'],
              ['Group related events by request ID', 'Shown on each entry'],
              ['Review failed privileged actions', `Filter outcome = Failed (${logs.filter((l) => l.outcome === 'Failed').length} entries)`],
              ['Track denied attempts', `Filter outcome = Denied (${logs.filter((l) => l.outcome === 'Denied').length} entries)`],
              ['Export permitted records', 'Export button above'],
            ].map(([label, value]) => (
              <li key={label} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                <span className="text-sm text-foreground">{label}</span>
                <span className="text-right text-xs text-muted-foreground">{value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Audit exports are permission controlled and never include credentials, session tokens or unnecessary personal
            information.
          </p>
        </div>
      </div>
    </div>
  );
}