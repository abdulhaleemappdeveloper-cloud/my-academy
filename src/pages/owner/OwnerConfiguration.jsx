import { useState } from 'react';
import { KeyRound, Save, Settings2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { SITE_SETTINGS } from '@/data/records';
import { ACADEMY } from '@/data/academy';

/** Owner-only configuration: campus, academic policy, credentials, privacy and retention. */
export default function OwnerConfiguration() {
  const pages = useCollection('pages');
  const integrations = useCollection('integrations');
  const providers = useCollection('aiProviders');
  const roles = useCollection('roles');
  const { account } = useSession();
  const { toast } = useToast();

  const [config, setConfig] = useState({
    campus: ACADEMY.campus,
    city: ACADEMY.city,
    activeYear: SITE_SETTINGS.academics.activeYear,
    sections: SITE_SETTINGS.academics.sections,
    promotion: SITE_SETTINGS.academics.promotion,
    academicRetention: SITE_SETTINGS.retention.academic,
    financialRetention: SITE_SETTINGS.retention.financial,
    auditRetention: SITE_SETTINGS.retention.audit,
  });

  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const save = (section) => {
    logAction({ actor: account?.name, role: account?.label, action: `Updated ${section}`, module: 'Ownership', target: section, reason: 'Owner configuration change' });
    toast({
      title: `${section} saved`,
      description: 'Ownership-level configuration is recorded in the audit log with your account and the reason.',
    });
  };

  return (
    <div>
      <PageHeader
        title="Platform configuration"
        description="Ownership-level settings: campus details, academic policy, integration credentials, privacy and retention. Ordinary administrators can view some of these values but cannot change them."
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Configuration' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Owner-only settings" value={12} hint="Marked throughout the interface" tone="danger" icon={KeyRound} />
        <StatCard label="Integrations" value={integrations.length} hint={`${integrations.filter((i) => i.state === 'Connected').length} connected`} icon={Settings2} />
        <StatCard label="AI providers" value={providers.length} hint={`${providers.filter((p) => p.state === 'Connected').length} connected`} />
        <StatCard label="Published pages" value={pages.filter((p) => p.status === 'Published').length} hint="Website content under content approval" />
      </div>

      <Tabs defaultValue="institution" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="institution">Institution</TabsTrigger>
          <TabsTrigger value="academic">Academic policy</TabsTrigger>
          <TabsTrigger value="credentials">Credentials and secrets</TabsTrigger>
          <TabsTrigger value="privacy">Privacy and retention</TabsTrigger>
          <TabsTrigger value="roles">Role templates</TabsTrigger>
        </TabsList>

        <TabsContent value="institution" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Campus and institution</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted-foreground">
                Campus name
                <input value={config.campus} onChange={(event) => update('campus', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                City
                <input value={config.city} onChange={(event) => update('city', event.target.value)} className={inputClass} />
              </label>
            </div>
            <button type="button" onClick={() => save('Institution settings')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save institution settings
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Owner {ACADEMY.owner} · developer {ACADEMY.developer} · the two identities are recorded separately on every
              document and report.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Academic policy</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted-foreground">
                Active academic year
                <input value={config.activeYear} onChange={(event) => update('activeYear', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Section structure
                <input value={config.sections} onChange={(event) => update('sections', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
                Promotion rule
                <input value={config.promotion} onChange={(event) => update('promotion', event.target.value)} className={inputClass} />
              </label>
            </div>
            <button type="button" onClick={() => save('Academic policy')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save academic policy
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Changing the active year creates a new year rather than overwriting the previous one. Historic results,
              attendance and payments remain attached to their own year, and a completed year can be locked against
              ordinary edits.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Stored credentials</h2>
            <ul className="mt-4 space-y-2.5">
              {[...integrations, ...providers].slice(0, 10).map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{row.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {row.state === 'Connected' ? 'Key stored server-side · last rotated this session' : row.required || 'No key stored'}
                    </span>
                  </span>
                  <StatusBadge value={row.state} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              A saved secret is never displayed again — it can only be replaced or rotated. Values are never written to logs,
              returned to the browser or included in an export.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Rotation procedure</h2>
            <ol className="mt-4 space-y-2.5">
              {[
                'Generate the new credential with the provider.',
                'Replace it here and run the connection test.',
                'Confirm the test succeeded before deactivating the old credential.',
                'Record what changed and why — the reason is stored with the change.',
                'Revoke the previous credential at the provider once traffic has moved.',
              ].map((line, index) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                  {line}
                </li>
              ))}
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Retention policy</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Academic records
                <input value={config.academicRetention} onChange={(event) => update('academicRetention', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Financial records
                <input value={config.financialRetention} onChange={(event) => update('financialRetention', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Audit records
                <input value={config.auditRetention} onChange={(event) => update('auditRetention', event.target.value)} className={inputClass} />
              </label>
            </div>
            <button type="button" onClick={() => save('Retention policy')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save retention policy
            </button>
            <ul className="mt-5 space-y-2.5">
              {[
                'Records subject to a legal retention obligation are never deleted.',
                'Records involved in an unresolved academic or financial process are never deleted.',
                'Deletion is a controlled operation with a review step, not a side effect of archiving.',
                'Private documents are excluded from public search indexes.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Role template</th>
                  <th className="px-4 py-3">Accounts</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Scope</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{role.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{role.users}</td>
                    <td className="px-4 py-3"><StatusBadge value={role.risk} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{role.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            A role template can never grant access beyond the assigning administrator's own authority, and owner-only
            controls remain owner-only regardless of any template.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';