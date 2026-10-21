import { useState } from 'react';
import { Cog, ToggleLeft, ToggleRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

/** Feature flags: controlled rollout of optional modules, with change history. */
export default function OwnerFeatures() {
  const flags = useCollection('featureFlags');
  const { account } = useSession();
  const { toast } = useToast();
  const [selected, setSelected] = useState(null);

  const setState = (flag, state) => {
    if (state === 'Disabled' && flag.name === 'Online fee payment') {
      toast({
        title: 'Finance safeguard',
        description: 'Disabling online payment does not change existing invoices or verified payments. Manual verification remains available.',
      });
    }
    patch('featureFlags', flag.id, { state, changed: new Date().toISOString().slice(0, 10) });
    logAction({ actor: account?.name, role: account?.label, action: `Feature ${state.toLowerCase()}`, module: 'Ownership', target: flag.name, reason: 'Feature flag change' });
    toast({ title: `${flag.name} set to ${state.toLowerCase()}`, description: 'The change is recorded with your account and the time.' });
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Feature flags"
        description="Optional modules can be rolled out gradually, limited to certain roles or environments, and disabled immediately if something goes wrong."
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Feature flags' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Enabled" value={flags.filter((f) => f.state === 'Enabled').length} hint="Live for the selected roles" tone="brand" icon={ToggleRight} />
        <StatCard label="In rollout" value={flags.filter((f) => f.state === 'Rollout').length} hint="Limited availability" tone="warning" />
        <StatCard label="Disabled" value={flags.filter((f) => f.state === 'Disabled').length} hint="Hidden, data retained" icon={ToggleLeft} />
        <StatCard label="Total modules" value={flags.length} hint="Optional modules registered" icon={Cog} />
      </div>

      <div className="mt-6">
        <DataTable
          rows={flags}
          searchKeys={['name', 'description', 'roles', 'environment']}
          searchPlaceholder="Search modules…"
          filters={[
            { key: 'state', label: 'State', options: ['Enabled', 'Disabled', 'Rollout'] },
            { key: 'environment', label: 'Environment', options: [...new Set(flags.map((f) => f.environment))] },
          ]}
          columns={[
            { key: 'name', label: 'Module', render: (row) => <span className="font-medium">{row.name}</span> },
            { key: 'description', label: 'Description', render: (row) => <span className="text-xs text-muted-foreground">{row.description}</span> },
            { key: 'environment', label: 'Environment' },
            { key: 'roles', label: 'Available to' },
            { key: 'changed', label: 'Last changed' },
            { key: 'state', label: 'State', render: (row) => <StatusBadge value={row.state} /> },
          ]}
          selectable={false}
          onRowClick={(row) => setSelected(row)}
          rowActions={(row) => (
            <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
              Manage
            </button>
          )}
          footerNote="A feature flag controls availability only — server-side authorisation is enforced independently"
        />
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">{selected.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{selected.description}</p>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ['Environment', selected.environment],
                ['Available to', selected.roles],
                ['Current state', selected.state],
                ['Last changed', selected.changed],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setState(selected, 'Enabled')} className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                Enable for everyone
              </button>
              <button type="button" onClick={() => setState(selected, 'Rollout')} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
                Limited rollout
              </button>
              <button type="button" onClick={() => setState(selected, 'Disabled')} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
                Disable
              </button>
              <button type="button" onClick={() => setSelected(null)} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-muted-foreground">
                Cancel
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Disabling a module hides it from the interface but never deletes its data, and any necessary cleanup procedure
              is documented before the flag is turned off.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Rollout guidance</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              'Enable a module for a single role first, verify the workflow, then widen it.',
              'Keep AI-dependent modules disabled until a provider test succeeds.',
              'Enable fee automation only after manual verification has been proven.',
              'Record who changed a flag and why; a flag change is not a substitute for a permission change.',
            ].map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-cream p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Modules awaiting configuration</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              ['Payroll and compensation', 'Requires verified statutory rules before enabling'],
              ['Online fee payment', 'Requires a provider merchant account'],
              ['Library module', 'Functional in manual mode; barcode scanning needs hardware'],
              ['Transport module', 'Routes and fees work; live tracking needs a GPS provider'],
              ['Alumni directory', 'Enabled; visibility limited to consented contacts'],
            ].map(([label, note]) => (
              <li key={label} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                <span className="text-sm text-foreground">{label}</span>
                <span className="text-right text-xs text-muted-foreground">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}