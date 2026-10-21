import { FolderOpen, Lock, ScrollText, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/** Student documents, consent records, document templates and generation. */
export default function AdminDocuments() {
  const documents = useCollection('documents');
  const consents = useCollection('consents');
  const templates = useCollection('documentTemplates');
  const ids = useCollection('emergencyContacts');

  return (
    <div>
      <PageHeader
        title="Documents and consent"
        description="Student documents with their review state, guardian consents, the template centre for official letters and cards, and emergency contact verification."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Documents' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Documents on file" value={documents.length} hint={`${documents.filter((d) => d.status === 'Approved').length} approved`} icon={FolderOpen} />
        <StatCard label="Awaiting review" value={documents.filter((d) => d.status === 'Pending review').length} hint="Reviewed by the admissions office" tone="warning" />
        <StatCard label="Consent records" value={consents.length} hint={`${consents.reduce((s, c) => s + c.pending, 0)} responses pending`} icon={ShieldCheck} />
        <StatCard label="Document templates" value={templates.length} hint="Letters, cards and certificates" icon={ScrollText} />
      </div>

      <Tabs defaultValue="documents" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="documents">Student documents</TabsTrigger>
          <TabsTrigger value="consents">Consents</TabsTrigger>
          <TabsTrigger value="templates">Template centre</TabsTrigger>
          <TabsTrigger value="safety">Emergency contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          <DataTable
            rows={documents}
            searchKeys={['studentName', 'category', 'className', 'reviewedBy']}
            searchPlaceholder="Search documents…"
            filters={[
              { key: 'category', label: 'Category', options: [...new Set(documents.map((d) => d.category))] },
              { key: 'status', label: 'Status', options: ['Approved', 'Pending review', 'Rejected - reupload requested'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'category', label: 'Document' },
              { key: 'uploadedOn', label: 'Uploaded' },
              { key: 'size', label: 'Size', align: 'right' },
              { key: 'reviewedBy', label: 'Reviewed by' },
              { key: 'expiry', label: 'Expiry' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Approved', 'Pending review', 'Rejected - reupload requested'] }}
            footerNote="Documents are stored privately — downloads are logged and permission checked"
          />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-primary" /> Identity documents are never published through a public URL and never
            appear in general exports.
          </p>
        </TabsContent>

        <TabsContent value="consents" className="mt-4">
          <DataTable
            rows={consents}
            searchKeys={['purpose', 'audience', 'version']}
            searchPlaceholder="Search consent records…"
            filters={[{ key: 'audience', label: 'Audience', options: [...new Set(consents.map((c) => c.audience))] }]}
            columns={[
              { key: 'purpose', label: 'Purpose', render: (row) => <span className="font-medium">{row.purpose}</span> },
              { key: 'audience', label: 'Audience' },
              { key: 'version', label: 'Wording version' },
              { key: 'given', label: 'Given', align: 'right' },
              { key: 'pending', label: 'Pending', align: 'right' },
              { key: 'withdrawn', label: 'Withdrawn', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Silence is never treated as consent; each response stores the version and the date"
          />
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <DataTable
            rows={templates}
            searchKeys={['name', 'category', 'numbering']}
            searchPlaceholder="Search templates…"
            filters={[
              { key: 'category', label: 'Category', options: [...new Set(templates.map((t) => t.category))] },
              { key: 'status', label: 'Status', options: ['Active', 'Draft'] },
            ]}
            columns={[
              { key: 'name', label: 'Document', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'category', label: 'Category' },
              { key: 'numbering', label: 'Numbering rule', render: (row) => <span className="font-mono text-xs">{row.numbering}</span> },
              { key: 'signature', label: 'Signed by' },
              { key: 'generated', label: 'Generated', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Documents are generated from verified records only, with a preview before generation"
          />
        </TabsContent>

        <TabsContent value="safety" className="mt-4">
          <DataTable
            rows={ids}
            searchKeys={['studentName', 'className', 'pickupAuthorized']}
            searchPlaceholder="Search emergency contacts…"
            filters={[{ key: 'verified', label: 'Verification', options: ['true', 'false'] }]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'contact1', label: 'Primary contact' },
              { key: 'contact2', label: 'Second contact' },
              { key: 'pickupAuthorized', label: 'Authorised pickup' },
              { key: 'verified', label: 'Verified', render: (row) => <StatusBadge value={row.verified ? 'Verified' : 'Needs verification'} /> },
            ]}
            selectable={false}
            footerNote="Emergency access is limited to the minimum information needed for the task"
          />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Medical notes on this list are visible only to staff who need them for a student's safety. The full student
            directory is never made available during an emergency.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}