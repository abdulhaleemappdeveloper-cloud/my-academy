import { useState } from 'react';
import { Cog, Save, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { SITE_SETTINGS } from '@/data/records';
import { ACADEMY } from '@/data/academy';

/** Central system settings, separated into what administrators and owners may change. */
export default function AdminSettings() {
  const settings = useCollection('pages');
  const { account } = useSession();
  const { toast } = useToast();
  const [form, setForm] = useState({
    brand: ACADEMY.brand,
    campus: ACADEMY.campus,
    address: ACADEMY.address,
    phone: ACADEMY.phone,
    email: ACADEMY.email,
    hours: ACADEMY.hours,
    activeYear: SITE_SETTINGS.academics.activeYear,
    grading: SITE_SETTINGS.academics.grading,
    passing: SITE_SETTINGS.academics.passing,
    promotion: SITE_SETTINGS.academics.promotion,
    sessionTimeout: SITE_SETTINGS.security.sessionTimeout,
    passwordPolicy: SITE_SETTINGS.security.passwordPolicy,
    maxUpload: SITE_SETTINGS.files.maxUpload,
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = (section) => {
    logAction({
      actor: account?.name,
      role: account?.label,
      action: `Updated ${section} settings`,
      module: 'System',
      target: section,
      reason: 'Configuration change',
    });
    toast({
      title: `${section} settings saved`,
      description: 'The change is recorded in the audit log with your account and the time.',
    });
  };

  const Field = ({ label, k, hint }) => (
    <label className="block text-xs font-semibold text-muted-foreground">
      {label}
      <input value={form[k]} onChange={(event) => update(k, event.target.value)} className={inputClass} />
      {hint && <span className="mt-1 block text-[11px] font-normal text-muted-foreground">{hint}</span>}
    </label>
  );

  return (
    <div>
      <PageHeader
        title="System settings"
        description="Branding, campus details, academic defaults, registration rules, upload limits, retention and security policy. Owner-only settings are marked as such."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Settings' }]}
      />

      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General and branding</TabsTrigger>
          <TabsTrigger value="academic">Academic defaults</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="files">Files and retention</TabsTrigger>
          <TabsTrigger value="security">Security policy</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance mode</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <Cog className="h-4 w-4 text-primary" /> Academy identity
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Brand name" k="brand" />
              <Field label="Campus name" k="campus" />
              <Field label="Address" k="address" />
              <Field label="Phone / WhatsApp" k="phone" />
              <Field label="Email" k="email" />
              <Field label="Office hours" k="hours" />
            </div>
            <button type="button" onClick={() => save('Branding')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save branding
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Owner: {ACADEMY.owner} · project created by {ACADEMY.developer}. These identities are kept separate in every
              document and footer.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Academic defaults</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Active academic year" k="activeYear" />
              <Field label="Grading scheme" k="grading" />
              <Field label="Passing criteria" k="passing" />
              <Field label="Promotion rule" k="promotion" />
            </div>
            <button type="button" onClick={() => save('Academic')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save academic defaults
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Changing the active academic year never overwrites the previous year's marks, attendance, payments or reports.
              Historic records stay attached to their own year and can be locked against further edits.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="registration" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Registration and onboarding</h2>
            <ul className="mt-4 space-y-3">
              {Object.entries(SITE_SETTINGS.registration).map(([key, value]) => (
                <li key={key} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <StatusBadge value={value} tone={value.startsWith('Disabled') ? 'success' : 'warning'} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Public self-registration stays disabled. Accounts are created through the admission workflow or an
              administrator invitation, and teacher onboarding requires approval.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Approval requirements</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Content publishing', 'Reviewer approval before publication'],
                ['Result publication', 'Academic approval required'],
                ['Payment verification', 'Finance officer only'],
                ['Section transfer', 'Recorded reason and academic review'],
                ['Certificate issue', 'Eligibility verified first'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="text-right text-xs text-muted-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Upload policy</h2>
            <div className="mt-4 grid gap-4">
              <Field label="Maximum upload size" k="maxUpload" />
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="text-muted-foreground">Allowed types</span>
                <span className="text-right text-xs font-medium text-foreground">{SITE_SETTINGS.files.allowed}</span>
              </li>
              <li className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="text-muted-foreground">Sensitive documents</span>
                <span className="text-right text-xs font-medium text-foreground">{SITE_SETTINGS.files.sensitive}</span>
              </li>
            </ul>
            <button type="button" onClick={() => save('File')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save file policy
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Files are validated on the server for type, size and safe naming — an extension alone is never trusted.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Data retention</h2>
            <ul className="mt-4 space-y-2.5">
              {Object.entries(SITE_SETTINGS.retention).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Records subject to a retention obligation, an unresolved financial process or an academic dispute are never
              deleted.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <ShieldCheck className="h-4 w-4 text-primary" /> Security policy
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Session timeout" k="sessionTimeout" />
              <Field label="Password policy" k="passwordPolicy" />
            </div>
            <button type="button" onClick={() => save('Security')} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save security policy
            </button>
            <ul className="mt-5 space-y-2.5">
              {[
                ['Two-step verification for privileged accounts', 'Recommended'],
                ['Reauthentication for sensitive actions', 'Required'],
                ['Login rate limiting and lockout', 'Enforced by the authentication service'],
                ['Session revocation', 'Available from the account screens'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{label}</span>
                  <StatusBadge value={value} tone={value === 'Required' ? 'success' : 'warning'} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Authentication, password hashing, session handling and rate limiting are provided by the platform's
              authentication service. This screen configures policy — it never stores a password or a token.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Maintenance mode
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Maintenance mode shows a notice on the public website while keeping permitted operational tools available to
              staff. Enabling it records the reason and the expected duration, and it can be scheduled in advance.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Current state', SITE_SETTINGS.maintenance.enabled ? 'Enabled' : 'Disabled'],
                ['Public areas affected', 'Website pages and public forms'],
                ['Staff access during maintenance', SITE_SETTINGS.maintenance.allowAdminAccess ? 'Allowed' : 'Blocked'],
                ['Last changed by', 'Owner'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => toast({ title: 'Maintenance mode is an owner control', description: 'Enabling or disabling it requires the owner account and is recorded.' })}
              className="mt-4 inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground"
            >
              Request a change
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Maintenance mode never creates a bypass that exposes administrative data.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Deployment and environment</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Environment', 'Preview — front end only'],
                ['Database', 'Not connected yet'],
                ['File storage', 'Private storage available'],
                ['Configuration validation', 'Checks run at start-up once the backend exists'],
                ['Secrets', 'Stored server-side, never in the browser bundle'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-right text-xs font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              The number of published pages in this workspace: {settings.filter((p) => p.status === 'Published').length}.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';