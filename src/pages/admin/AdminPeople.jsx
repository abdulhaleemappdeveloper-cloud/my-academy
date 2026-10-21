import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, UserPlus, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/**
 * People directory: teachers, guardians, staff and portal accounts.
 * Each tab is searchable and filterable; restricted columns are only shown where the
 * signed-in role is permitted to read them.
 */
export default function AdminPeople() {
  const teachers = useCollection('teachers');
  const guardians = useCollection('guardians');
  const staff = useCollection('staff');
  const students = useCollection('students');
  const [tab, setTab] = useState('teachers');

  const accounts = [
    ...teachers.map((t) => ({ id: t.id, name: t.name, email: t.email, role: 'Teacher', status: t.status, campus: 'Al Mursusb', created: t.joined, lastActive: '—', permissions: `${t.subject} · ${t.classes.length} classes` })),
    ...staff.map((s) => ({ id: s.id, name: s.name, email: s.email, role: s.role, status: s.status, campus: 'Al Mursusb', created: s.joined, lastActive: '—', permissions: s.department })),
    ...guardians.map((g) => ({ id: g.id, name: g.name, email: g.email, role: 'Parent', status: g.status === 'Verified' ? 'Active' : 'Pending verification', campus: 'Al Mursusb', created: g.lastContact, lastActive: g.lastContact, permissions: `${(g.linkedChildren || []).length} linked child(ren)` })),
  ];

  return (
    <div>
      <PageHeader
        title="Teachers, staff and accounts"
        description="Teaching and non-teaching staff records, guardian links and portal accounts. Role changes are recorded and can be reviewed from the permissions screen."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'People' }]}
        actions={
          <>
            <Link to="/admin/roles" className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4" /> Roles and permissions
            </Link>
            <Link to="/admin/admissions" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <UserPlus className="h-4 w-4" /> Onboard staff
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Teachers" value={teachers.length} hint={`${teachers.filter((t) => t.status === 'Active').length} active`} icon={Users} />
        <StatCard label="Guardians" value={guardians.length} hint={`${guardians.filter((g) => g.status === 'Verified').length} verified links`} tone="brand" icon={Users} />
        <StatCard label="Staff" value={staff.length} hint="Administration, finance and operations" />
        <StatCard label="Portal accounts" value={accounts.length} hint="Teacher, staff and guardian logins" tone="gold" />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="accounts">Portal accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="mt-4">
          <DataTable
            rows={teachers}
            searchKeys={['name', 'code', 'subject', 'email']}
            searchPlaceholder="Search teachers…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(teachers.map((t) => t.subject))] },
              { key: 'status', label: 'Status', options: ['Active', 'On leave'] },
            ]}
            columns={[
              { key: 'name', label: 'Teacher', render: (row) => (
                <span className="flex items-center gap-2.5">
                  <img src={row.photo} alt="" className="h-8 w-8 rounded-lg object-cover" loading="lazy" />
                  <span>
                    <span className="block font-medium text-foreground">{row.name}</span>
                    <span className="block text-xs text-muted-foreground">{row.code}</span>
                  </span>
                </span>
              ) },
              { key: 'subject', label: 'Subject' },
              { key: 'classes', label: 'Classes', render: (row) => row.classes.join(', ') },
              { key: 'periodsPerWeek', label: 'Periods', align: 'right' },
              { key: 'pendingMarking', label: 'To mark', align: 'right' },
              { key: 'classTeacherOf', label: 'Class teacher' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Active', 'On leave'] }}
            footerNote="A teacher only sees the classes assigned here"
          />
        </TabsContent>

        <TabsContent value="guardians" className="mt-4">
          <DataTable
            rows={guardians}
            searchKeys={['name', 'phone', 'email']}
            searchPlaceholder="Search guardians…"
            filters={[
              { key: 'status', label: 'Verification', options: ['Verified', 'Pending verification', 'Link revoked'] },
              { key: 'relation', label: 'Relationship', options: ['Father', 'Mother'] },
            ]}
            columns={[
              { key: 'name', label: 'Guardian', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'relation', label: 'Relationship' },
              { key: 'phone', label: 'Mobile' },
              { key: 'linkedChildren', label: 'Linked children', render: (row) => (row.linkedChildren || []).join(', ') || '—' },
              { key: 'occupation', label: 'Occupation' },
              { key: 'lastContact', label: 'Last contact' },
              { key: 'status', label: 'Verification', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Verified', 'Pending verification', 'Link revoked'] }}
            footerNote="Guardian links are verified before any access is granted"
          />
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <DataTable
            rows={staff}
            searchKeys={['name', 'role', 'department', 'email']}
            searchPlaceholder="Search staff…"
            filters={[
              { key: 'department', label: 'Department', options: [...new Set(staff.map((s) => s.department))] },
              { key: 'status', label: 'Status', options: ['Active', 'On leave'] },
            ]}
            columns={[
              { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'role', label: 'Role' },
              { key: 'department', label: 'Department' },
              { key: 'phone', label: 'Mobile' },
              { key: 'joined', label: 'Joined' },
              { key: 'contractExpiry', label: 'Contract expiry' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
        </TabsContent>

        <TabsContent value="accounts" className="mt-4">
          <DataTable
            rows={accounts}
            searchKeys={['name', 'email', 'role', 'permissions']}
            searchPlaceholder="Search accounts…"
            filters={[
              { key: 'role', label: 'Role', options: [...new Set(accounts.map((a) => a.role))] },
              { key: 'status', label: 'Status', options: ['Active', 'On leave', 'Pending verification'] },
            ]}
            columns={[
              { key: 'name', label: 'Account', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} /> },
              { key: 'permissions', label: 'Scope' },
              { key: 'campus', label: 'Campus' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Account status changes are written to the audit log"
          />
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {students.length} student accounts are managed from the
            student directory, not from this list.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}