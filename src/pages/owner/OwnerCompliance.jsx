import { FileCheck2, ScrollText, ShieldCheck, UserCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/** Compliance, accreditation documents, policy versions, consent and the risk register. */
export default function OwnerCompliance() {
  const accreditation = useCollection('accreditation');
  const policies = useCollection('policies');
  const consents = useCollection('consents');
  const incidents = useCollection('incidents');
  const dictionary = useCollection('dictionary');

  return (
    <div>
      <PageHeader
        title="Compliance and accreditation"
        description="Institutional documents with their renewal dates, policy versions and acknowledgements, consent coverage and the restricted risk register."
        breadcrumbs={[{ label: 'Ownership', path: '/owner' }, { label: 'Compliance' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Documents valid" value={accreditation.filter((a) => a.status === 'Valid').length} hint={`${accreditation.filter((a) => a.status === 'Renewal due soon').length} due for renewal`} tone={accreditation.some((a) => a.status === 'Renewal due soon') ? 'warning' : 'brand'} icon={FileCheck2} />
        <StatCard label="Policies in force" value={policies.filter((p) => p.status === 'Active').length} hint={`${policies.filter((p) => p.status === 'Under review').length} under review`} icon={ScrollText} />
        <StatCard label="Consent responses" value={consents.reduce((s, c) => s + c.given, 0)} hint={`${consents.reduce((s, c) => s + c.pending, 0)} still pending`} icon={UserCheck} />
        <StatCard label="Risk items open" value={incidents.filter((i) => i.status !== 'Closed').length} hint="Restricted access register" tone="warning" icon={ShieldCheck} />
      </div>

      <Tabs defaultValue="accreditation" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="accreditation">Accreditation documents</TabsTrigger>
          <TabsTrigger value="policies">Policies and acknowledgements</TabsTrigger>
          <TabsTrigger value="consent">Consent coverage</TabsTrigger>
          <TabsTrigger value="risk">Risk register</TabsTrigger>
          <TabsTrigger value="processing">Data processing</TabsTrigger>
        </TabsList>

        <TabsContent value="accreditation" className="mt-4">
          <DataTable
            rows={accreditation}
            searchKeys={['document', 'authority', 'responsible', 'status']}
            searchPlaceholder="Search compliance documents…"
            filters={[{ key: 'status', label: 'Status', options: ['Valid', 'Renewal due soon'] }]}
            columns={[
              { key: 'document', label: 'Document', render: (row) => <span className="font-medium">{row.document}</span> },
              { key: 'authority', label: 'Issuing authority' },
              { key: 'issued', label: 'Issued' },
              { key: 'expires', label: 'Expires' },
              { key: 'responsible', label: 'Responsible staff' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="The academy is never described as accredited or legally compliant unless the evidence has been reviewed"
          />
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <DataTable
            rows={policies}
            searchKeys={['name', 'category', 'version', 'status']}
            searchPlaceholder="Search policies…"
            filters={[
              { key: 'category', label: 'Category', options: [...new Set(policies.map((p) => p.category))] },
              { key: 'status', label: 'Status', options: ['Active', 'Under review'] },
            ]}
            columns={[
              { key: 'name', label: 'Policy', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'category', label: 'Category' },
              { key: 'version', label: 'Version' },
              { key: 'effective', label: 'Effective from' },
              { key: 'review', label: 'Next review' },
              { key: 'acknowledgements', label: 'Acknowledged', align: 'right', render: (row) => `${row.acknowledgements} / ${row.required}` },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="The version in force at any past date can be identified from the version history"
          />
        </TabsContent>

        <TabsContent value="consent" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {consents.map((item) => {
            const total = item.given + item.pending;
            const percent = total ? Math.round((item.given / total) * 100) : 0;
            return (
              <article key={item.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-heading text-sm font-bold tracking-tight text-foreground">{item.purpose}</h2>
                  <StatusBadge value={item.version} tone="neutral" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.audience} · {item.given} given · {item.pending} pending · {item.withdrawn} withdrawn</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{percent}% of responses received</p>
              </article>
            );
          })}
        </TabsContent>

        <TabsContent value="risk" className="mt-4">
          <DataTable
            rows={incidents}
            searchKeys={['reference', 'category', 'location', 'assigned', 'status']}
            searchPlaceholder="Search the risk register…"
            filters={[
              { key: 'severity', label: 'Severity', options: ['Low', 'Medium', 'High', 'Critical'] },
              { key: 'status', label: 'Status', options: ['Open', 'In progress', 'Monitoring', 'Closed'] },
            ]}
            columns={[
              { key: 'reference', label: 'Reference' },
              { key: 'category', label: 'Category' },
              { key: 'severity', label: 'Severity', render: (row) => <StatusBadge value={row.severity} /> },
              { key: 'date', label: 'Date' },
              { key: 'department', label: 'Department' },
              { key: 'assigned', label: 'Assigned to' },
              { key: 'mitigation', label: 'Mitigation', render: (row) => <span className="line-clamp-1 text-xs text-muted-foreground">{row.mitigation}</span> },
              { key: 'due', label: 'Due' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Aggregate reporting only — individuals are not identified in statistics"
          />
        </TabsContent>

        <TabsContent value="processing" className="mt-4">
          <DataTable
            rows={dictionary}
            searchKeys={['entity', 'purpose', 'retention', 'owner']}
            searchPlaceholder="Search data processing records…"
            columns={[
              { key: 'entity', label: 'Data category', render: (row) => <span className="font-medium">{row.entity}</span> },
              { key: 'purpose', label: 'Purpose' },
              { key: 'key', label: 'Record key' },
              { key: 'retention', label: 'Retention' },
              { key: 'owner', label: 'Data owner' },
            ]}
            selectable={false}
            footerNote="Identifiable student data is never sent to an external AI provider without authorisation and protection"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-base font-bold tracking-tight">Internal audit and corrective actions</h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  ['Last internal audit', 'Completed — findings recorded'],
                  ['Corrective actions open', incidents.filter((i) => i.status !== 'Closed').length],
                  ['Evidence attached', 'Per item in the register'],
                  ['Next review', 'Scheduled per document'],
                ].map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-cream p-6">
              <h2 className="font-heading text-base font-bold tracking-tight">Consent and acknowledgement handling</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Each consent stores the wording version, the date and the account that responded. Withdrawals are recorded
                with their date, and a withdrawal of an optional consent never affects enrolment. Records that must be
                retained for academic or financial history are held as described in the privacy policy.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}