import { Activity, AlertTriangle, Database, HardDrive, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/** System health, background jobs, capacity and provider cost visibility. */
export default function AdminSystem() {
  const health = useCollection('systemHealth');
  const jobs = useCollection('jobs');
  const backups = useCollection('backups');
  const media = useCollection('media');
  const usage = useCollection('aiUsage');
  const integrations = useCollection('integrations');

  const degraded = health.filter((h) => h.status !== 'Healthy');

  return (
    <div>
      <PageHeader
        title="System health"
        description="Operational status of the platform and its dependencies, background job history, storage volume and third-party cost visibility. No credentials or infrastructure secrets are shown."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'System health' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Services healthy" value={`${health.filter((h) => h.status === 'Healthy').length} of ${health.length}`} hint={degraded.length ? `${degraded.length} needing attention` : 'All checks passing'} tone={degraded.length ? 'warning' : 'brand'} icon={Activity} />
        <StatCard label="Jobs failed" value={jobs.filter((j) => j.status === 'Failed').length} hint={`${jobs.filter((j) => j.status === 'Succeeded').length} succeeded`} tone={jobs.some((j) => j.status === 'Failed') ? 'danger' : 'brand'} icon={RefreshCw} />
        <StatCard label="Media stored" value={`${media.reduce((s, m) => s + parseFloat(m.size), 0).toFixed(1)} MB`} hint={`${media.length} files`} icon={HardDrive} />
        <StatCard label="Backups verified" value={backups.filter((b) => b.integrity === 'Verified').length} hint={`${backups.length} snapshots recorded`} icon={Database} />
      </div>

      <Tabs defaultValue="health" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="health">Service status</TabsTrigger>
          <TabsTrigger value="jobs">Background jobs</TabsTrigger>
          <TabsTrigger value="capacity">Capacity and cost</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-4">
          <DataTable
            rows={health}
            searchKeys={['check', 'status', 'detail']}
            searchPlaceholder="Search health checks…"
            filters={[{ key: 'status', label: 'Status', options: [...new Set(health.map((h) => h.status))] }]}
            columns={[
              { key: 'check', label: 'Check', render: (row) => <span className="font-medium">{row.check}</span> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'detail', label: 'Detail' },
              { key: 'measured', label: 'Measured' },
            ]}
            selectable={false}
            footerNote="Checks report honestly: an unconfigured service is shown as not connected, never as healthy"
          />
          <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              Backend API, database and backup checks will report real values once the backend is connected. Until then they
              are shown as not connected rather than assumed to be working.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-4">
          <DataTable
            rows={jobs}
            searchKeys={['name', 'schedule', 'status', 'detail']}
            searchPlaceholder="Search jobs…"
            filters={[{ key: 'status', label: 'Status', options: ['Succeeded', 'Failed', 'Running', 'Queued'] }]}
            columns={[
              { key: 'name', label: 'Job', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'schedule', label: 'Schedule' },
              { key: 'lastRun', label: 'Last run' },
              { key: 'duration', label: 'Duration', align: 'right' },
              { key: 'retries', label: 'Retries', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'detail', label: 'Detail' },
            ]}
            selectable={false}
            footerNote="Retries are idempotent — a repeated run cannot duplicate a payment, message or record"
          />
        </TabsContent>

        <TabsContent value="capacity" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Capacity indicators</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Media stored', `${media.reduce((s, m) => s + parseFloat(m.size), 0).toFixed(1)} MB across ${media.length} files`],
                ['Private files', `${media.filter((m) => m.visibility === 'Private').length} documents stored privately`],
                ['Background backlog', `${jobs.filter((j) => j.status === 'Queued' || j.status === 'Running').length} job(s)`],
                ['Integration failures', `${integrations.filter((i) => i.state === 'Connection failed').length} provider(s)`],
                ['Backup retention', `${backups[0]?.retention || '30 days'}`],
              ].map(([label, value]) => (
                <li key={label} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-right text-xs font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Third-party usage and cost</h2>
            <ul className="mt-4 space-y-3">
              {usage.map((row) => (
                <li key={row.id} className="rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">{row.feature}</span>
                    <StatusBadge value={row.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {row.provider} · {row.requests} requests · {row.estimatedCost} of {row.limit}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Costs are estimates derived from provider usage data. Where a provider does not supply billing detail, no
              figure is invented.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}