import { useState } from 'react';
import { Award, BadgeCheck, ScrollText } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { DOCUMENT_TEMPLATES } from '@/data/records';

export default function AdminCertificates() {
  const { account } = useSession();
  const certificates = useCollection('certificates');
  const documentTemplates = useCollection('documentTemplates');
  const awards = useCollection('awards');
  const { toast } = useToast();

  const [verifyCode, setVerifyCode] = useState('');
  const [verified, setVerified] = useState(undefined);

  const ineligible = certificates.filter((c) => c.eligibility !== 'Verified');
  const templates = documentTemplates.length ? documentTemplates : DOCUMENT_TEMPLATES;

  const issue = (row) => {
    if (row.eligibility !== 'Verified') {
      toast({
        title: 'Eligibility not confirmed',
        description: 'Attendance and result requirements must be verified before a certificate is issued.',
        variant: 'destructive',
      });
      return;
    }
    patch('certificates', row.id, { status: 'Issued', issuedOn: new Date().toISOString().slice(0, 10) });
    logAction({ actor: account?.name, role: account?.label, action: 'Issued certificate', module: 'Certificates', target: row.code, reason: 'Eligibility verified' });
    toast({ title: 'Certificate issued', description: `${row.code} can now be printed or downloaded by the recipient.` });
  };

  const revoke = (row) => {
    patch('certificates', row.id, { status: 'Revoked' });
    logAction({ actor: account?.name, role: account?.label, action: 'Revoked certificate', module: 'Certificates', target: row.code, reason: 'Recorded correction' });
    toast({ title: 'Certificate revoked', description: 'Verification of this identifier will now report it as revoked.' });
  };

  const lookup = () => {
    const term = verifyCode.trim().toUpperCase();
    setVerified(certificates.find((c) => String(c.code).toUpperCase() === term) || null);
  };

  return (
    <div>
      <PageHeader
        title="Certificates and documents"
        description="Issue certificates after eligibility is verified, manage templates and numbering, and check what a public verification lookup returns."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Certificates' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Certificates issued" value={certificates.filter((c) => c.status === 'Issued').length} hint="Printable and verifiable" tone="brand" icon={Award} />
        <StatCard label="Awaiting eligibility" value={ineligible.length} hint="Blocked until verified" tone="warning" />
        <StatCard label="Revoked" value={certificates.filter((c) => c.status === 'Revoked').length} hint="Verification reports this" tone="danger" />
        <StatCard label="Templates" value={templates.length} hint="Letters, cards and certificates" icon={ScrollText} />
      </div>

      <Tabs defaultValue="certificates" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="templates">Document templates</TabsTrigger>
          <TabsTrigger value="verify">Verification lookup</TabsTrigger>
          <TabsTrigger value="awards">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="mt-4">
          <DataTable
            rows={certificates}
            searchKeys={['code', 'studentName', 'className', 'type']}
            searchPlaceholder="Search certificates by identifier, student or type…"
            filters={[
              { key: 'type', label: 'Type', options: [...new Set(certificates.map((c) => c.type))] },
              { key: 'status', label: 'Status', options: ['Draft', 'Issued', 'Revoked'] },
              { key: 'eligibility', label: 'Eligibility', options: ['Verified', 'Pending verification'] },
            ]}
            columns={[
              { key: 'code', label: 'Identifier', render: (row) => <span className="font-mono text-xs font-semibold">{row.code}</span> },
              { key: 'studentName', label: 'Recipient', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'type', label: 'Type' },
              { key: 'eligibility', label: 'Eligibility', render: (row) => <StatusBadge value={row.eligibility} /> },
              { key: 'issuedOn', label: 'Issued' },
              { key: 'verifications', label: 'Verified', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Draft', 'Issued', 'Revoked'] }}
            rowActions={(row) => (
              <div className="flex justify-end gap-2">
                {row.status !== 'Issued' && (
                  <button type="button" onClick={() => issue(row)} className="text-xs font-semibold text-primary hover:underline">Issue</button>
                )}
                {row.status === 'Issued' && (
                  <button type="button" onClick={() => revoke(row)} className="text-xs font-semibold text-muted-foreground hover:underline">Revoke</button>
                )}
              </div>
            )}
            footerNote="A certificate cannot be issued until eligibility requirements are confirmed"
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
              { key: 'name', label: 'Template', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'category', label: 'Category' },
              { key: 'numbering', label: 'Numbering rule', render: (row) => <span className="font-mono text-xs">{row.numbering}</span> },
              { key: 'signature', label: 'Signed by' },
              { key: 'generated', label: 'Generated', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Templates use verified student data and configurable numbering"
          />
        </TabsContent>

        <TabsContent value="verify" className="mt-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <BadgeCheck className="h-4 w-4 text-primary" /> What a public verification shows
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Anyone with the certificate identifier can confirm authenticity. The lookup returns only the recipient name,
            certificate type, issue date and current status — never marks, attendance, guardian details or fee records.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={verifyCode}
              onChange={(event) => setVerifyCode(event.target.value)}
              placeholder="For example TA-CERT-2026-1400"
              aria-label="Certificate identifier"
              className="h-11 flex-1 rounded-xl border border-input bg-background px-3.5 text-sm uppercase outline-none focus:border-primary/50"
            />
            <button type="button" onClick={lookup} className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
              Check
            </button>
          </div>

          {verified === null && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              No certificate matches that identifier.
            </p>
          )}

          {verified && (
            <dl className="mt-4 divide-y divide-border rounded-xl border border-border">
              {[
                ['Identifier', verified.code],
                ['Recipient', verified.studentName],
                ['Type', verified.type],
                ['Issued on', verified.issuedOn],
                ['Status', <StatusBadge value={verified.status} />],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-3 px-4 py-2.5">
                  <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                  <dd className="col-span-2 text-sm text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Identifiers are long and non-sequential so they cannot be guessed, verification lookups are rate limited, and
            every lookup is logged.
          </p>
        </TabsContent>

        <TabsContent value="awards" className="mt-4">
          <DataTable
            rows={awards}
            searchKeys={['studentName', 'award', 'activity']}
            searchPlaceholder="Search achievements…"
            filters={[
              { key: 'activity', label: 'Activity', options: [...new Set(awards.map((a) => a.activity))] },
              { key: 'certificate', label: 'Certificate', options: ['Issued', 'Pending generation'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'award', label: 'Award' },
              { key: 'activity', label: 'Activity' },
              { key: 'date', label: 'Awarded' },
              { key: 'awardedBy', label: 'Awarded by' },
              { key: 'certificate', label: 'Certificate', render: (row) => <StatusBadge value={row.certificate} /> },
            ]}
            selectable={false}
            footerNote="Participation certificates are generated from the achievement record"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}