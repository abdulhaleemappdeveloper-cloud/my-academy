import { AlertTriangle, Database, RotateCcw, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useCollection } from '@/data/store';

/** Backup administration and documented recovery procedure. */
export default function OwnerBackups() {
  const backups = useCollection('backups');
  const dictionary = useCollection('dictionary');
  const health = useCollection('systemHealth');

  const completed = backups.filter((b) => b.status === 'Completed');
  const failed = backups.filter((b) => b.status === 'Failed');

  return (
    <div>
      <PageHeader
        title="Backups and recovery"
        description="Backup schedule, completion and integrity status, retention policy and the documented restoration procedure. A backup is not treated as reliable until a restoration has been tested."
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Backups' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Backups completed" value={completed.length} hint={`${backups.length} snapshots recorded`} tone="brand" icon={Database} />
        <StatCard label="Integrity verified" value={completed.filter((b) => b.integrity === 'Verified').length} hint={`${completed.filter((b) => b.integrity !== 'Verified').length} not yet verified`} tone="warning" icon={ShieldCheck} />
        <StatCard label="Failed backups" value={failed.length} hint="Investigated before the next cycle" tone={failed.length ? 'danger' : 'brand'} icon={AlertTriangle} />
        <StatCard label="Recovery tests" value={1} hint="Documented, not yet performed in a safe environment" />
      </div>

      <div className="mt-6">
        <DataTable
          rows={backups}
          searchKeys={['type', 'started', 'storage', 'retention', 'status']}
          searchPlaceholder="Search backups…"
          filters={[
            { key: 'type', label: 'Type', options: ['Automatic', 'Manual'] },
            { key: 'status', label: 'Status', options: ['Completed', 'Failed'] },
            { key: 'integrity', label: 'Integrity', options: ['Verified', 'Not verified'] },
          ]}
          columns={[
            { key: 'started', label: 'Started', render: (row) => <span className="font-medium">{row.started}</span> },
            { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} tone="neutral" /> },
            { key: 'size', label: 'Size', align: 'right' },
            { key: 'storage', label: 'Storage' },
            { key: 'retention', label: 'Retention' },
            { key: 'integrity', label: 'Integrity', render: (row) => <StatusBadge value={row.integrity} /> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          selectable={false}
          footerNote="Restoration requires strong authorisation and explicit confirmation"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <RotateCcw className="h-4 w-4 text-primary" /> Restoration procedure
          </h2>
          <ol className="mt-4 space-y-2.5">
            {[
              'Identify the snapshot to restore and record the reason for the restoration.',
              'Confirm the authorisation — restoration is an owner-level action with explicit confirmation.',
              'Restore into a safe environment first, never directly over production data.',
              'Validate the restored records against the data dictionary.',
              'Test the application against the restored data: sign-in, student records, fees and results.',
              'Only then promote the restored data, and record the restoration in the audit log.',
            ].map((line, index) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                {line}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-cream p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">What is protected</h2>
          <ul className="mt-4 space-y-2.5">
            {dictionary.map((row) => (
              <li key={row.entity} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                <span className="text-sm text-foreground">{row.entity}</span>
                <span className="text-right text-xs text-muted-foreground">{row.retention}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Backups are protected as sensitive data: they are stored with restricted access, and no database credential or
            secret appears in a backup file name, a public directory or a log.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
          Scheduled backups, integrity checks and restoration run from the backend and the database service. Until that
          backend exists, this screen reports the schedule and policy that are configured — it does not claim a backup ran
          when it has not. Current service status:{' '}
          {health.filter((h) => h.check === 'Backups').map((h) => h.status).join(', ') || 'not reported'}.
        </p>
      </div>
    </div>
  );
}