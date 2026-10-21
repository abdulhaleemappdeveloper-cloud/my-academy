import { useState } from 'react';
import { AlertTriangle, KeyRound, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const SENSITIVE = ['Manage users', 'Manage permissions', 'Access financial records', 'Manage security settings', 'Access audit logs'];

export default function AdminRoles() {
  const roles = useCollection('roles');
  const permissions = useCollection('permissions');
  const auditLogs = useCollection('auditLogs');
  const { role } = useSession();

  const [draft, setDraft] = useState({ role: 'Academic administrator', module: 'Results', permission: 'Approve & publish' });
  const [confirmed, setConfirmed] = useState(false);

  const privileged = roles.filter((r) => r.risk === 'Critical' || r.risk === 'High');

  return (
    <div>
      <PageHeader
        title="Accounts, roles and permissions"
        description="Role templates, the permission matrix and the access review. A role template can never grant more than the assigning administrator holds, and owner-only settings stay owner-only."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Roles and permissions' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Role templates" value={roles.length} hint="Including owner and auditor" icon={ShieldCheck} />
        <StatCard label="Privileged roles" value={privileged.length} hint="Critical or high risk" tone="danger" icon={KeyRound} />
        <StatCard label="Accounts in roles" value={roles.reduce((sum, r) => sum + r.users, 0)} hint="Across the platform" icon={Users} />
        <StatCard label="Signed-in role" value={role} hint="Your current permissions" tone="brand" />
      </div>

      <Tabs defaultValue="roles" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="roles">Role templates</TabsTrigger>
          <TabsTrigger value="matrix">Permission matrix</TabsTrigger>
          <TabsTrigger value="simulator">Change review</TabsTrigger>
          <TabsTrigger value="review">Access review</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <article key={role.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{role.name}</h2>
                <StatusBadge value={role.risk} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role.description}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {role.users} account(s)
              </p>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="matrix" className="mt-4">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Module</th>
                  {['Owner', 'Super admin', 'Academic', 'Finance', 'Editor', 'Teacher', 'Student', 'Parent'].map((col) => (
                    <th key={col} className="px-4 py-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((row) => (
                  <tr key={row.module} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.module}</td>
                    {[row.owner, row.admin, row.academic, row.finance, row.editor, row.teacher, row.student, row.parent].map((value, index) => (
                      <td key={index} className="px-4 py-3 text-muted-foreground">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-primary" /> Hiding a button is not security — every protected
            operation is authorised again on the server.
          </p>
        </TabsContent>

        <TabsContent value="simulator" className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Review a permission change</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Role
                <select value={draft.role} onChange={(event) => { setDraft((prev) => ({ ...prev, role: event.target.value })); setConfirmed(false); }} className={inputClass}>
                  {roles.map((role) => <option key={role.id}>{role.name}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Module
                <select value={draft.module} onChange={(event) => { setDraft((prev) => ({ ...prev, module: event.target.value })); setConfirmed(false); }} className={inputClass}>
                  {permissions.map((row) => <option key={row.module}>{row.module}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Proposed permission
                <select value={draft.permission} onChange={(event) => { setDraft((prev) => ({ ...prev, permission: event.target.value })); setConfirmed(false); }} className={inputClass}>
                  {['View', 'Create', 'Edit', 'Approve', 'Publish', 'Suspend', 'Archive', 'Restore', 'Export', 'Manage', '—'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Impact preview</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="text-muted-foreground">Current permission</span>
                <span className="font-medium text-foreground">{permissions.find((p) => p.module === draft.module)?.academic || '—'}</span>
              </li>
              <li className="flex justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="text-muted-foreground">Proposed permission</span>
                <span className="font-medium text-foreground">{draft.permission}</span>
              </li>
              <li className="flex justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="text-muted-foreground">Accounts affected</span>
                <span className="font-medium text-foreground">{roles.find((r) => r.name === draft.role)?.users || 0}</span>
              </li>
              <li className="flex justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <span className="text-muted-foreground">Risk level</span>
                <StatusBadge value={SENSITIVE.includes(draft.module) || draft.permission === 'Manage' ? 'High' : 'Medium'} />
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
            >
              Record this change
            </button>
            {confirmed && (
              <p className="mt-3 text-xs text-muted-foreground">
                Change recorded for review. Applying a permission change requires the owner's approval and is written to
                the audit log with the actor, target and reason.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Privileged role</th>
                  <th className="px-4 py-3">Accounts</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Review status</th>
                </tr>
              </thead>
              <tbody>
                {privileged.map((role) => (
                  <tr key={role.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{role.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{role.users}</td>
                    <td className="px-4 py-3"><StatusBadge value={role.risk} /></td>
                    <td className="px-4 py-3"><StatusBadge value="Reviewed this term" tone="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <h2 className="border-b border-border px-4 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em]">Recent permission activity</h2>
            <ul className="divide-y divide-border">
              {auditLogs.filter((row) => row.module === 'Security' || row.action.includes('permission')).slice(0, 8).map((row) => (
                <li key={row.id} className="flex flex-col gap-1 bg-card px-4 py-3">
                  <p className="text-sm text-foreground">{row.action}</p>
                  <p className="text-xs text-muted-foreground">{row.actor} · {row.time} · {row.outcome}</p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';