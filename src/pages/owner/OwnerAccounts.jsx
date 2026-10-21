import { KeyRound, ShieldAlert, UserCog } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/** Administrator account lifecycle and periodic access review. */
export default function OwnerAccounts() {
  const roles = useCollection('roles');
  const teachers = useCollection('teachers');
  const staff = useCollection('staff');
  const audits = useCollection('auditLogs');

  const privileged = roles.filter((r) => r.risk === 'Critical' || r.risk === 'High');

  const accounts = [
    { id: 'own-1', name: 'Muhammad Aamir Sohail', role: 'Owner', scope: 'All campuses', status: 'Active', created: '—', lastActive: 'Today', permissions: 'Ownership controls' },
    ...privileged.flatMap((role) =>
      Array.from({ length: Math.min(role.users, 3) }, (_, index) => ({
        id: `${role.id}-${index}`,
        name: `${role.name} account ${index + 1}`,
        role: role.name,
        scope: 'Al Mursusb Campus',
        status: 'Active',
        created: '2024-08-01',
        lastActive: index === 0 ? 'Today' : 'This week',
        permissions: role.description,
      }))
    ),
  ];

  return (
    <div>
      <PageHeader
        title="Privileged accounts"
        description="Administrator accounts, their scope and their lifecycle. Password resets use a secure workflow — no administrator can read another account's password."
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Privileged accounts' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Privileged roles" value={privileged.length} hint="Critical and high risk" tone="danger" icon={KeyRound} />
        <StatCard label="Privileged accounts" value={privileged.reduce((s, r) => s + r.users, 0)} hint="Excluding students and guardians" />
        <StatCard label="Teaching accounts" value={teachers.length} hint="Assigned-class access only" icon={UserCog} />
        <StatCard label="Staff accounts" value={staff.length} hint="Operational scope only" />
      </div>

      <Tabs defaultValue="accounts" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="lifecycle">Account lifecycle</TabsTrigger>
          <TabsTrigger value="review">Access review</TabsTrigger>
          <TabsTrigger value="protection">Privileged action protection</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-4">
          <DataTable
            rows={accounts}
            searchKeys={['name', 'role', 'scope', 'permissions']}
            searchPlaceholder="Search privileged accounts…"
            filters={[
              { key: 'role', label: 'Role', options: [...new Set(accounts.map((a) => a.role))] },
              { key: 'status', label: 'Status', options: ['Active', 'Suspended'] },
            ]}
            columns={[
              { key: 'name', label: 'Account', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} /> },
              { key: 'scope', label: 'Campus scope' },
              { key: 'permissions', label: 'Permissions', render: (row) => <span className="line-clamp-1 text-xs text-muted-foreground">{row.permissions}</span> },
              { key: 'lastActive', label: 'Last activity' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Account changes require the owner account and are recorded with a reason"
          />
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Administrator lifecycle</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Create an administrator account and assign an approved role.',
                'Set the campus scope the account may operate within.',
                'Grant or revoke individual permissions within your own authority.',
                'Suspend an account, or reactivate it after review.',
                'Require a password reset through the secure workflow.',
                'Revoke active sessions immediately.',
                'Record an account expiry date where the appointment is temporary.',
                'Disable former staff accounts and transfer ownership of their records.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Emergency access (break-glass)</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If emergency administrative access is ever required, it is granted explicitly, limited in time, restricted to
              the minimum privileges, logged immediately and reported to oversight. There are no hidden backdoors,
              undocumented master passwords or permanent unrestricted accounts.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Current emergency grants', 0],
                ['Break-glass events this year', 0],
                ['Post-event reviews outstanding', 0],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <DataTable
            rows={accounts}
            searchKeys={['name', 'role', 'scope']}
            searchPlaceholder="Search accounts for review…"
            filters={[{ key: 'role', label: 'Role', options: [...new Set(accounts.map((a) => a.role))] }]}
            columns={[
              { key: 'name', label: 'Account' },
              { key: 'role', label: 'Role' },
              { key: 'scope', label: 'Scope' },
              { key: 'lastActive', label: 'Last activity' },
              { key: 'review', label: 'Review', render: (row) => <StatusBadge value={row.lastActive === 'Today' ? 'Reviewed this term' : 'Due for review'} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Suspended'] }}
            footerNote="Permissions are never removed automatically for low activity without a documented policy"
          />
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <ShieldAlert className="h-4 w-4 text-primary" /> Recent privilege changes
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {audits.filter((row) => row.action.toLowerCase().includes('permission') || row.module === 'Security').slice(0, 6).map((row) => (
                <li key={row.id} className="flex flex-col gap-1 py-3">
                  <span className="text-sm text-foreground">{row.action}</span>
                  <span className="text-xs text-muted-foreground">{row.actor} · {row.time} · {row.outcome} · {row.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="protection" className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Change a privileged role', rule: 'Reauthentication and an approval record' },
            { title: 'Change authentication settings', rule: 'Owner account only' },
            { title: 'Restore a backup', rule: 'Strong authorisation and explicit confirmation' },
            { title: 'Delete or merge important records', rule: 'Owner approval with a reason' },
            { title: 'Issue a refund', rule: 'Finance review plus approval' },
            { title: 'Change financial configuration', rule: 'Owner account only' },
            { title: 'Change published examination results', rule: 'Rechecking process with a recorded reason' },
            { title: 'Disable a security control', rule: 'Owner approval and immediate audit entry' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.rule}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}