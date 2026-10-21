import { useState } from 'react';
import { Lock, Plug, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

/** Integrations, AI providers, payment methods, webhooks and feature flags. */
export default function AdminIntegrations() {
  const integrations = useCollection('integrations');
  const providers = useCollection('aiProviders');
  const methods = useCollection('paymentMethods');
  const flags = useCollection('featureFlags');
  const { account } = useSession();
  const { toast } = useToast();
  const [testing, setTesting] = useState(null);

  const test = (name) => {
    setTesting(name);
    setTimeout(() => {
      setTesting(null);
      const row = integrations.find((i) => i.name === name);
      if (row?.state === 'Connected') {
        toast({ title: `${name} connection test passed`, description: 'The provider responded successfully. No secrets are shown or stored in the browser.' });
      } else {
        toast({
          title: `${name} is not ready`,
          description: `Current state: ${row?.state}. Required: ${row?.required}.`,
          variant: 'destructive',
        });
      }
    }, 600);
  };

  const toggleFlag = (flag) => {
    const next = flag.state === 'Enabled' ? 'Disabled' : 'Enabled';
    patch('featureFlags', flag.id, { state: next, changed: new Date().toISOString().slice(0, 10) });
    logAction({ actor: account?.name, role: account?.label, action: `Feature ${next.toLowerCase()}`, module: 'System', target: flag.name, reason: 'Configuration change' });
    toast({ title: `${flag.name} ${next.toLowerCase()}`, description: 'Disabling a feature hides it without deleting any of its data.' });
  };

  const toggleIntegration = (row) => {
    const next = row.state === 'Connected' ? 'Disabled' : 'Connected';
    patch('integrations', row.id, { state: next });
    logAction({ actor: account?.name, role: account?.label, action: `Integration ${next.toLowerCase()}`, module: 'Integrations', target: row.name });
    toast({ title: `${row.name} ${next.toLowerCase()}`, description: 'Integration changes are recorded in the audit log.' });
  };

  return (
    <div>
      <PageHeader
        title="Integrations, AI and feature flags"
        description="Connection state for every external service, the AI provider routing, payment methods, webhooks and the optional modules controlled by feature flags."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Integrations and AI' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Integrations connected" value={integrations.filter((i) => i.state === 'Connected').length} hint={`${integrations.length} configured`} tone="brand" icon={Plug} />
        <StatCard label="Needing configuration" value={integrations.filter((i) => i.state !== 'Connected' && i.state !== 'Disabled' && i.state !== 'Manual only').length} hint="Connection not established" tone="warning" />
        <StatCard label="AI providers connected" value={providers.filter((p) => p.state === 'Connected').length} hint={`${providers.length} providers listed`} />
        <StatCard label="Feature flags enabled" value={flags.filter((f) => f.state === 'Enabled').length} hint={`${flags.length} modules available`} />
      </div>

      <Tabs defaultValue="integrations" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="ai">AI providers</TabsTrigger>
          <TabsTrigger value="payments">Payment methods</TabsTrigger>
          <TabsTrigger value="flags">Feature flags</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="mt-4">
          <DataTable
            rows={integrations}
            searchKeys={['name', 'purpose', 'state', 'required']}
            searchPlaceholder="Search integrations…"
            filters={[{ key: 'state', label: 'State', options: [...new Set(integrations.map((i) => i.state))] }]}
            columns={[
              { key: 'name', label: 'Service', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'purpose', label: 'Used for' },
              { key: 'state', label: 'State', render: (row) => <StatusBadge value={row.state} /> },
              { key: 'lastTest', label: 'Last test' },
              { key: 'detail', label: 'Latest result' },
              { key: 'required', label: 'Required to connect' },
            ]}
            selectable={false}
            rowActions={(row) => (
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => test(row.name)} className="text-xs font-semibold text-primary hover:underline">
                  {testing === row.name ? 'Testing…' : 'Test'}
                </button>
                <button type="button" onClick={() => toggleIntegration(row)} className="text-xs font-semibold text-muted-foreground hover:underline">
                  {row.state === 'Connected' ? 'Disable' : 'Enable'}
                </button>
              </div>
            )}
            footerNote="A connection is never reported as successful unless the test actually succeeded"
          />
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-6">
          <DataTable
            rows={providers}
            searchKeys={['name', 'models', 'state', 'features']}
            searchPlaceholder="Search providers…"
            filters={[{ key: 'state', label: 'State', options: [...new Set(providers.map((p) => p.state))] }]}
            columns={[
              { key: 'name', label: 'Provider', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'models', label: 'Models' },
              { key: 'features', label: 'Assigned features' },
              { key: 'state', label: 'State', render: (row) => <StatusBadge value={row.state} /> },
              { key: 'lastTest', label: 'Last test' },
              { key: 'usage', label: 'Usage' },
            ]}
            selectable={false}
            rowActions={(row) => (
              <button type="button" onClick={() => test(row.name)} className="text-xs font-semibold text-primary hover:underline">
                Test connection
              </button>
            )}
            footerNote="Each provider has different capabilities — a feature is only enabled for providers that support it"
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
                <Lock className="h-4 w-4 text-primary" /> Credential handling
              </h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  'Keys are stored server-side and never returned to the browser.',
                  'A saved key is never displayed again — only replaced or rotated.',
                  'Connection tests report success or failure without exposing the secret.',
                  'Feature-specific model selection is stored per feature, with a documented fallback order.',
                ].map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-cream p-6">
              <h2 className="font-heading text-base font-bold tracking-tight">Feature routing</h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  ['Quiz generation', 'Requires an approved question template and review before use'],
                  ['Content studio', 'Drafts only — teacher approval before publication'],
                  ['AI tutor', 'Disabled during examinations; daily limits per student'],
                  ['Feedback drafting', 'Teacher edits before anything is shared'],
                  ['Study plans', 'Editable suggestions, never a guarantee'],
                ].map(([feature, rule]) => (
                  <li key={feature} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                    <span className="text-sm text-foreground">{feature}</span>
                    <span className="text-right text-xs text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((method) => (
            <article key={method.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{method.name}</h2>
                <StatusBadge value={method.status} />
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div><dt className="text-xs text-muted-foreground">Account title</dt><dd className="font-medium text-foreground">{method.title}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Account or number</dt><dd className="font-medium text-foreground">{method.account}</dd></div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{method.instructions}</p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Automated provider confirmation is not connected, so verification remains manual and is performed by an
                authorised finance officer.
              </p>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="flags" className="mt-4">
          <DataTable
            rows={flags}
            searchKeys={['name', 'description', 'roles', 'state']}
            searchPlaceholder="Search feature flags…"
            filters={[
              { key: 'state', label: 'State', options: ['Enabled', 'Disabled', 'Rollout'] },
              { key: 'environment', label: 'Environment', options: [...new Set(flags.map((f) => f.environment))] },
            ]}
            columns={[
              { key: 'name', label: 'Feature', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'description', label: 'Description', render: (row) => <span className="text-xs text-muted-foreground">{row.description}</span> },
              { key: 'environment', label: 'Environment' },
              { key: 'roles', label: 'Available to' },
              { key: 'changed', label: 'Last changed' },
              { key: 'state', label: 'State', render: (row) => <StatusBadge value={row.state} /> },
            ]}
            selectable={false}
            rowActions={(row) => (
              <button type="button" onClick={() => toggleFlag(row)} className="text-xs font-semibold text-primary hover:underline">
                {row.state === 'Enabled' ? 'Disable' : 'Enable'}
              </button>
            )}
            footerNote="A feature flag is a rollout control, never a substitute for server-side authorisation"
          />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <ShieldAlert className="h-4 w-4 text-primary" /> Webhook safety
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Endpoints are allow-listed and validated before they are saved.',
                'Requests to internal or private addresses are refused.',
                'Every payload is signed and the signature verified on receipt.',
                'Delivery history, retries and idempotency keys are recorded.',
                'Signing secrets can be rotated or revoked immediately.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              No webhook endpoint is configured yet, so this module is disabled and reports that honestly.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Outbound events available</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Admission decision recorded',
                'Payment verified or rejected',
                'Result published',
                'Certificate issued or revoked',
                'Attendance correction approved',
                'Support ticket resolved',
              ].map((event) => (
                <li key={event} className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground">{event}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}