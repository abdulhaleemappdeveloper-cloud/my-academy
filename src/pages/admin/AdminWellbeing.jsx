import { AlertTriangle, HeartPulse, Phone, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/** Wellbeing, discipline, incident register and emergency safety information. */
export default function AdminWellbeing() {
  const wellbeing = useCollection('wellbeing');
  const incidents = useCollection('incidents');
  const contacts = useCollection('emergencyContacts');
  const visitors = useCollection('visitors');

  return (
    <div>
      <PageHeader
        title="Wellbeing, incidents and safety"
        description="Confidential student support referrals, the institutional risk register, discipline records and verified emergency contact information. Access to these records is restricted and logged."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Wellbeing and incidents' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Support referrals open" value={wellbeing.filter((w) => w.status !== 'Closed').length} hint="Counsellor and academic support" tone="warning" icon={HeartPulse} />
        <StatCard label="Risk register open" value={incidents.filter((i) => i.status !== 'Closed').length} hint={`${incidents.filter((i) => i.severity === 'Critical' || i.severity === 'High').length} high or critical`} tone="danger" icon={ShieldAlert} />
        <StatCard label="Emergency contacts verified" value={contacts.filter((c) => c.verified).length} hint={`${contacts.filter((c) => !c.verified).length} needing verification`} icon={Phone} />
        <StatCard label="Visitors on campus" value={visitors.filter((v) => v.status === 'On campus').length} hint="Currently signed in" />
      </div>

      <Tabs defaultValue="wellbeing" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="wellbeing">Student wellbeing</TabsTrigger>
          <TabsTrigger value="incidents">Incident register</TabsTrigger>
          <TabsTrigger value="contacts">Emergency contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="wellbeing" className="mt-4 space-y-6">
          <div className="flex gap-3 rounded-2xl border border-border bg-cream p-5">
            <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Counselling notes and referrals are restricted to the counsellor and the principal, are never included in
              general student lists, exports or AI prompts, and every access to these records is logged.
            </p>
          </div>

          <DataTable
            rows={wellbeing}
            searchKeys={['studentName', 'className', 'referralType', 'counsellor']}
            searchPlaceholder="Search referrals…"
            filters={[
              { key: 'referralType', label: 'Type', options: [...new Set(wellbeing.map((w) => w.referralType))] },
              { key: 'status', label: 'Status', options: ['Open', 'In progress', 'Follow-up scheduled', 'Closed'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'referralType', label: 'Referral type' },
              { key: 'openedOn', label: 'Opened' },
              { key: 'counsellor', label: 'Responsible staff' },
              { key: 'nextReview', label: 'Next review' },
              { key: 'accessLog', label: 'Access' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Guardian communication is recorded and approved before it is sent"
          />
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <DataTable
            rows={incidents}
            searchKeys={['reference', 'category', 'location', 'assigned', 'department']}
            searchPlaceholder="Search incident and risk records…"
            filters={[
              { key: 'category', label: 'Category', options: [...new Set(incidents.map((i) => i.category))] },
              { key: 'severity', label: 'Severity', options: ['Low', 'Medium', 'High', 'Critical'] },
              { key: 'status', label: 'Status', options: ['Open', 'In progress', 'Monitoring', 'Closed'] },
            ]}
            columns={[
              { key: 'reference', label: 'Reference' },
              { key: 'category', label: 'Category' },
              { key: 'severity', label: 'Severity', render: (row) => <StatusBadge value={row.severity} /> },
              { key: 'date', label: 'Date' },
              { key: 'location', label: 'Location' },
              { key: 'department', label: 'Department' },
              { key: 'assigned', label: 'Assigned to' },
              { key: 'due', label: 'Due' },
              { key: 'restricted', label: 'Access', render: (row) => <StatusBadge value={row.restricted ? 'Restricted' : 'Staff'} tone="neutral" /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Restricted incidents are visible only to the assigned reviewer and the owner"
          />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-primary" /> Incident statistics are published as aggregates so
            individuals are not identified.
          </p>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <DataTable
            rows={contacts}
            searchKeys={['studentName', 'className', 'pickupAuthorized']}
            searchPlaceholder="Search emergency contacts…"
            filters={[{ key: 'verified', label: 'Verification', options: ['true', 'false'] }]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'contact1', label: 'Primary contact' },
              { key: 'contact2', label: 'Second contact' },
              { key: 'pickupAuthorized', label: 'Authorised pickup' },
              { key: 'medicalNote', label: 'Safety note', render: (row) => <span className="text-xs text-muted-foreground">{row.medicalNote}</span> },
              { key: 'verified', label: 'Verified', render: (row) => <StatusBadge value={row.verified ? 'Verified' : 'Needs verification'} /> },
            ]}
            selectable
            bulkStatus={{ key: 'verified', options: ['true'] }}
            footerNote="Only the minimum information needed for a task is provided during an emergency"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Verified pickup permissions are followed at the gate. Medical notes are visible only to staff who need them for
            a student's safety.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}