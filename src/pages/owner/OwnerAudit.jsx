import { Download, Search, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { downloadCSV, useCollection } from '@/data/store';

/** Audit investigation with the tools needed to reconstruct what happened and why. */
export default function OwnerAudit() {
  const logs = useCollection('auditLogs');
  const roles = useCollection('roles');

  const privileged = logs.filter((l) => ['Security', 'System', 'Finance'].includes(l.module));
  const failures = logs.filter((l) => l.outcome !== 'Success');

  return (
    <div>
      <PageHeader
        title="Audit investigation"
        description="Filter by actor, role, module, action, record and outcome, follow a request identifier across related events, and export a permitted extract."
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Audit investigation' }]}
        actions={
          <button
            type="button"
            onClick={() => downloadCSV('audit-investigation', logs, [
              { key: 'time', label: 'Time' },
              { key: 'actor', label: 'Actor' },
              { key: 'role', label: 'Role' },
              { key: 'action', label: 'Action' },
              { key: 'module', label: 'Module' },
              { key: 'target', label: 'Record' },
              { key: 'before', label: 'Before' },
              { key: 'after', label: 'After' },
              { key: 'outcome', label: 'Outcome' },
              { key: 'reason', label: 'Reason' },
              { key: 'requestId', label: 'Request ID' },
            ])}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
          >
            <Download className="h-4 w-4" /> Export permitted extract
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Audit entries" value={logs.length} hint="Append-only record" icon={Search} />
        <StatCard label="Privileged modules" value={privileged.length} hint="Security, system and finance actions" tone="warning" />
        <StatCard label="Failed or denied" value={failures.length} hint="Reconstructed with their reason" tone={failures.length ? 'danger' : 'brand'} icon={ShieldCheck} />
        <StatCard label="Roles represented" value={roles.length} hint="Every action carries an actor and role" />
      </div>

      <div className="mt-6">
        <DataTable
          rows={logs}
          searchKeys={['actor', 'role', 'action', 'module', 'target', 'reason', 'requestId', 'before', 'after']}
          searchPlaceholder="Search by actor, action, record, request ID or reason…"
          filters={[
            { key: 'module', label: 'Module', options: [...new Set(logs.map((l) => l.module))] },
            { key: 'outcome', label: 'Outcome', options: ['Success', 'Failed', 'Denied'] },
            { key: 'role', label: 'Role', options: [...new Set(logs.map((l) => l.role))] },
          ]}
          pageSize={15}
          columns={[
            { key: 'time', label: 'Time' },
            { key: 'actor', label: 'Actor', render: (row) => <span className="font-medium">{row.actor}</span> },
            { key: 'role', label: 'Role' },
            { key: 'action', label: 'Action' },
            { key: 'module', label: 'Module' },
            { key: 'target', label: 'Record' },
            { key: 'before', label: 'Before', render: (row) => <span className="text-xs text-muted-foreground">{row.before}</span> },
            { key: 'after', label: 'After', render: (row) => <span className="text-xs text-muted-foreground">{row.after}</span> },
            { key: 'outcome', label: 'Outcome', render: (row) => <StatusBadge value={row.outcome} /> },
            { key: 'reason', label: 'Reason' },
            { key: 'requestId', label: 'Request ID', render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.requestId}</span> },
          ]}
          selectable={false}
          footerNote="Audit records cannot be edited or deleted by an ordinary administrator"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Reconstructing a change</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              'Filter by the record identifier to list every action against that record.',
              'Filter by request identifier to follow everything done in a single operation.',
              'Compare the before and after values to see exactly what changed.',
              'Read the reason field recorded by the acting account.',
              'Filter by outcome to isolate failed or denied attempts.',
            ].map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-cream p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Audit integrity</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              'Entries are append-only — no interface allows an edit or a delete.',
              'Passwords, session tokens, PINs and payment credentials are never written to the log.',
              'Exports are permission controlled and exclude unnecessary personal identifiers.',
              'Retention follows the configured policy; audit history needed for an open investigation is retained.',
            ].map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            {logs.filter((l) => l.outcome === 'Success').length} successful actions, {logs.filter((l) => l.outcome === 'Denied').length} denied
            and {logs.filter((l) => l.outcome === 'Failed').length} failed actions are recorded in this period.
          </p>
        </div>
      </div>
    </div>
  );
}