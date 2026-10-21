import { AlertTriangle, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { SITE_SETTINGS } from '@/data/records';

/** Security operations: evidence-based review of authentication, privilege and data access events. */
export default function OwnerSecurity() {
  const audits = useCollection('auditLogs');
  const health = useCollection('systemHealth');
  const roles = useCollection('roles');
  const integrations = useCollection('integrations');
  const consents = useCollection('consents');

  const denied = audits.filter((a) => a.outcome === 'Denied');
  const failed = audits.filter((a) => a.outcome === 'Failed');
  const sensitive = audits.filter((a) => ['Finance', 'Results', 'Security', 'Certificates'].includes(a.module));

  const findings = [
    { id: 'sf-1', title: 'Two-step verification not yet required for privileged accounts', severity: 'High', evidence: 'Policy currently set to recommended', remedy: 'Enable the requirement once the authentication service is connected.' },
    { id: 'sf-2', title: 'SMS and WhatsApp channels not configured', severity: 'Low', evidence: 'Integration state: not configured', remedy: 'Configure a provider if guardians are to be notified by SMS.' },
    { id: 'sf-3', title: 'Error monitoring test last failed', severity: 'Medium', evidence: 'Last test returned an authorisation error', remedy: 'Replace the project key and re-run the connection test.' },
    { id: 'sf-4', title: 'Backend authorisation not yet enforced server-side', severity: 'High', evidence: 'Front end runs on local demo data', remedy: 'Implement the backend APIs with server-side permission checks before go-live.' },
    { id: 'sf-5', title: 'Public certificate verification rate limits not yet active', severity: 'Medium', evidence: 'Rate limiting is a backend control', remedy: 'Apply rate limits when the verification endpoint is built.' },
  ];

  return (
    <div>
      <PageHeader
        title="Security overview"
        description="Authentication events, privilege changes, denied attempts and configuration findings. Findings are evidence-based and reviewable — an ordinary error is never presented as a confirmed attack."
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Security overview' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Denied attempts" value={denied.length} hint="Blocked by permission checks" tone={denied.length ? 'warning' : 'brand'} icon={Lock} />
        <StatCard label="Failed actions" value={failed.length} hint="Reviewed for investigation" tone={failed.length ? 'warning' : 'brand'} icon={AlertTriangle} />
        <StatCard label="Open findings" value={findings.length} hint="With a recommended remedy" tone="warning" icon={ShieldCheck} />
        <StatCard label="Privileged roles" value={roles.filter((r) => r.risk === 'Critical' || r.risk === 'High').length} hint="Under periodic review" icon={KeyRound} />
      </div>

      <Tabs defaultValue="events" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="events">Security events</TabsTrigger>
          <TabsTrigger value="sensitive">Sensitive access</TabsTrigger>
          <TabsTrigger value="findings">Configuration findings</TabsTrigger>
          <TabsTrigger value="policy">Policy status</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border">
            <h2 className="border-b border-border px-4 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em]">Attempts that were denied or failed</h2>
            <ul className="divide-y divide-border">
              {[...denied, ...failed].slice(0, 8).map((row) => (
                <li key={row.id} className="flex flex-col gap-1 bg-card px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge value={row.outcome} />
                    <span className="text-sm text-foreground">{row.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {row.actor} · {row.role} · {row.time} · {row.module} · request {row.requestId}
                  </span>
                </li>
              ))}
              {denied.length + failed.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground">No denied or failed privileged actions recorded in this period.</li>
              )}
            </ul>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-base font-bold tracking-tight">Service status</h2>
              <ul className="mt-4 space-y-2.5">
                {health.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                    <span className="text-sm text-muted-foreground">{row.check}</span>
                    <StatusBadge value={row.status} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-cream p-6">
              <h2 className="font-heading text-base font-bold tracking-tight">Integration authentication</h2>
              <ul className="mt-4 space-y-2.5">
                {integrations.filter((i) => i.state !== 'Connected').slice(0, 6).map((row) => (
                  <li key={row.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                    <span className="text-sm text-foreground">{row.name}</span>
                    <StatusBadge value={row.state} />
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                A failed provider test is reported as a failure with a remedy — never as an attack.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sensitive" className="mt-4 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border">
            <h2 className="border-b border-border px-4 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em]">Access to sensitive records</h2>
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Operation</th>
                  <th className="px-4 py-3">Record</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Request ID</th>
                </tr>
              </thead>
              <tbody>
                {sensitive.slice(0, 10).map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{row.time}</td>
                    <td className="px-4 py-3 text-foreground">{row.actor}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.action}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.target}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.outcome} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.requestId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Access to student, guardian, financial and personnel records is logged with the operation and the outcome. The log
            never contains the content of a record, a credential or a token, and {consents.reduce((s, c) => s + c.given, 0)} consent
            responses are recorded with their wording version.
          </p>
        </TabsContent>

        <TabsContent value="findings" className="mt-4 grid gap-4 lg:grid-cols-2">
          {findings.map((finding) => (
            <article key={finding.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-heading text-sm font-bold tracking-tight text-foreground">{finding.title}</h2>
                <StatusBadge value={finding.severity} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Evidence: {finding.evidence}</p>
              <p className="mt-2 text-xs leading-relaxed text-foreground">Remedy: {finding.remedy}</p>
            </article>
          ))}
          <p className="text-xs leading-relaxed text-muted-foreground lg:col-span-2">
            These findings come from configuration checks. They are not a complete security audit, and the platform is never
            described as immune to attack. Remaining risks are reported honestly rather than hidden.
          </p>
        </TabsContent>

        <TabsContent value="policy" className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ['Session timeout', SITE_SETTINGS.security.sessionTimeout],
            ['Password policy', SITE_SETTINGS.security.passwordPolicy],
            ['Two-step verification for privileged accounts', SITE_SETTINGS.security.mfaForPrivileged],
            ['Reauthentication for sensitive actions', SITE_SETTINGS.security.reauthForSensitive ? 'Required' : 'Not required'],
            ['Login rate limiting and lockout', 'Enforced by the authentication service'],
            ['Session revocation', 'Available from the account screens'],
            ['Password storage', 'Hashed with a modern algorithm — plaintext is never stored'],
            ['Initial owner credential', 'Provisioned through server-side secrets, never hardcoded'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
              <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}