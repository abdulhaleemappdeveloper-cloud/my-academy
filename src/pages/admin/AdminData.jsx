import { AlertTriangle, Database, Download, Upload } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, downloadCSV } from '@/data/store';

/** Import, export, bulk operations, data quality and backups. */
export default function AdminData() {
  const students = useCollection('students');
  const dataQuality = useCollection('dataQuality');
  const backups = useCollection('backups');
  const dictionary = useCollection('dictionary');
  const auditLogs = useCollection('auditLogs');

  const exports = [
    { id: 'ex-1', name: 'Student directory (permitted fields)', scope: 'Students', format: 'CSV', runs: 4, owner: 'Academic office' },
    { id: 'ex-2', name: 'Attendance summary', scope: 'Attendance', format: 'CSV', runs: 7, owner: 'Academic office' },
    { id: 'ex-3', name: 'Fee ledger and payments', scope: 'Finance', format: 'CSV', runs: 3, owner: 'Finance officer' },
    { id: 'ex-4', name: 'Published results', scope: 'Results', format: 'CSV', runs: 2, owner: 'Examination controller' },
    { id: 'ex-5', name: 'Audit activity extract', scope: 'Audit logs', format: 'CSV', runs: 1, owner: 'Owner' },
  ];

  const imports = [
    { id: 'im-1', name: 'Student enrolment list', rows: 64, valid: 62, invalid: 2, duplicates: 1, status: 'Validated', date: 'This week' },
    { id: 'im-2', name: 'Teacher records', rows: 18, valid: 18, invalid: 0, duplicates: 0, status: 'Completed', date: 'Last week' },
    { id: 'im-3', name: 'Fee structure update', rows: 12, valid: 10, invalid: 2, duplicates: 0, status: 'Failed validation', date: 'Last week' },
  ];

  return (
    <div>
      <PageHeader
        title="Data tools"
        description="Controlled import and export, bulk operations with a preview, data quality follow-ups and the backup position. Every export records who exported what and when."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Data tools' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students on file" value={students.length} hint="Exportable with permitted fields only" icon={Database} />
        <StatCard label="Data quality issues" value={dataQuality.filter((d) => d.status === 'Open').length} hint="With suggested corrections" tone="warning" icon={AlertTriangle} />
        <StatCard label="Backups completed" value={backups.filter((b) => b.status === 'Completed').length} hint={`${backups.filter((b) => b.integrity === 'Verified').length} integrity verified`} tone="brand" />
        <StatCard label="Audit entries" value={auditLogs.length} hint="Protected and exportable for review" />
      </div>

      <Tabs defaultValue="export" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="export">Export centre</TabsTrigger>
          <TabsTrigger value="import">Import centre</TabsTrigger>
          <TabsTrigger value="bulk">Bulk operations</TabsTrigger>
          <TabsTrigger value="quality">Data quality</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="dictionary">Data dictionary</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="mt-4">
          <DataTable
            rows={exports}
            searchKeys={['name', 'scope', 'owner', 'format']}
            searchPlaceholder="Search export definitions…"
            filters={[{ key: 'scope', label: 'Scope', options: [...new Set(exports.map((e) => e.scope))] }]}
            columns={[
              { key: 'name', label: 'Export', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'scope', label: 'Data source' },
              { key: 'format', label: 'Format' },
              { key: 'owner', label: 'Owned by' },
              { key: 'runs', label: 'Runs', align: 'right' },
            ]}
            selectable={false}
            rowActions={(row) => (
              <button
                type="button"
                onClick={() =>
                  row.scope === 'Students'
                    ? downloadCSV('student-directory', students, [
                        { key: 'name', label: 'Name' },
                        { key: 'code', label: 'Student code' },
                        { key: 'className', label: 'Class' },
                        { key: 'section', label: 'Section' },
                        { key: 'status', label: 'Status' },
                        { key: 'attendancePct', label: 'Attendance %' },
                      ])
                    : downloadCSV(`${row.scope.toLowerCase().replace(/\s+/g, '-')}-export`, auditLogs, [
                        { key: 'time', label: 'Time' },
                        { key: 'actor', label: 'Actor' },
                        { key: 'action', label: 'Action' },
                        { key: 'target', label: 'Target' },
                        { key: 'outcome', label: 'Outcome' },
                      ])
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Download className="h-3.5 w-3.5" /> Generate
              </button>
            )}
            footerNote="Exports exclude credentials, tokens and unnecessary personal identifiers"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {students.filter((s) => s.status === 'Active').length} active students are included in the permitted-field export.
          </p>
        </TabsContent>

        <TabsContent value="import" className="mt-4 space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
                <Upload className="h-4 w-4 text-primary" /> Import workflow
              </h2>
              <ol className="mt-4 space-y-2.5">
                {[
                  'Download the template for the records you want to add.',
                  'Upload a supported file (CSV, Excel or JSON).',
                  'The structure and every row are validated before anything is written.',
                  'Preview the valid and invalid rows, and resolve duplicates.',
                  'Confirm the import — records are processed in batches.',
                  'Download the summary and the error report for any rejected rows.',
                ].map((line, index) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                    {line}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">
                An import never overwrites an existing record without an explicitly chosen update strategy, and formulas in
                uploaded spreadsheets are neutralised so a file cannot execute anything.
              </p>
            </div>

            <DataTable
              rows={imports}
              searchKeys={['name', 'status']}
              searchPlaceholder="Search recent imports…"
              filters={[{ key: 'status', label: 'Status', options: ['Validated', 'Completed', 'Failed validation'] }]}
              pageSize={5}
              columns={[
                { key: 'name', label: 'Import', render: (row) => <span className="font-medium">{row.name}</span> },
                { key: 'rows', label: 'Rows', align: 'right' },
                { key: 'valid', label: 'Valid', align: 'right' },
                { key: 'invalid', label: 'Invalid', align: 'right' },
                { key: 'duplicates', label: 'Duplicates', align: 'right' },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                { key: 'date', label: 'When' },
              ]}
              selectable={false}
              footerNote="Failed imports are reviewed before any retry"
            />
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Bulk operation steps</h2>
            <ol className="mt-4 space-y-2.5">
              {[
                'Identify the target records with a filter.',
                'Verify that your role permits the change.',
                'Validate every requested change before it is applied.',
                'Preview the affected records and the count of valid and invalid ones.',
                'Confirm high-impact actions explicitly.',
                'Process in batches, recording successes and failures.',
                'Download an error report and retry only the failed records.',
              ].map((line, index) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                  {line}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Where bulk actions are available</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Student status and section assignment', 'Administration → Students'],
                ['Payment verification', 'Individual review only'],
                ['Result publication', 'Blocked while validation fails'],
                ['Attendance correction', 'Individual review only'],
                ['Certificate issue and revoke', 'Administration → Certificates'],
              ].map(([action, where]) => (
                <li key={action} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{action}</span>
                  <span className="text-right text-xs text-muted-foreground">{where}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Bulk approval is deliberately unavailable for financial, academic and permission decisions, so no mandatory
              individual review is bypassed.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="mt-4">
          <DataTable
            rows={dataQuality}
            searchKeys={['issue', 'entity', 'suggested', 'status']}
            searchPlaceholder="Search data quality findings…"
            filters={[
              { key: 'severity', label: 'Severity', options: ['Low', 'Medium', 'High'] },
              { key: 'entity', label: 'Module', options: [...new Set(dataQuality.map((d) => d.entity))] },
              { key: 'status', label: 'Status', options: ['Open', 'In review'] },
            ]}
            columns={[
              { key: 'issue', label: 'Finding', render: (row) => <span className="font-medium">{row.issue}</span> },
              { key: 'entity', label: 'Module' },
              { key: 'count', label: 'Records', align: 'right' },
              { key: 'severity', label: 'Severity', render: (row) => <StatusBadge value={row.severity} /> },
              { key: 'suggested', label: 'Suggested correction' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Suggestions are reviewed before anything is changed — corrections are never applied blindly"
          />
        </TabsContent>

        <TabsContent value="backups" className="mt-4">
          <DataTable
            rows={backups}
            searchKeys={['type', 'started', 'storage', 'status']}
            searchPlaceholder="Search backups…"
            filters={[
              { key: 'type', label: 'Type', options: ['Automatic', 'Manual'] },
              { key: 'status', label: 'Status', options: ['Completed', 'Failed'] },
            ]}
            columns={[
              { key: 'started', label: 'Started' },
              { key: 'type', label: 'Type' },
              { key: 'size', label: 'Size', align: 'right' },
              { key: 'storage', label: 'Storage' },
              { key: 'retention', label: 'Retention' },
              { key: 'integrity', label: 'Integrity', render: (row) => <StatusBadge value={row.integrity} /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="A backup is not treated as reliable until a restoration has been tested"
          />
          <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              Scheduled backups and restoration run from the backend and the database service. Until the backend is
              connected, this screen shows the configured schedule and policy only — it does not claim a backup exists that
              has not run.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="dictionary" className="mt-4">
          <DataTable
            rows={dictionary}
            searchKeys={['entity', 'purpose', 'key', 'owner']}
            searchPlaceholder="Search the data dictionary…"
            columns={[
              { key: 'entity', label: 'Collection', render: (row) => <span className="font-medium">{row.entity}</span> },
              { key: 'purpose', label: 'Purpose' },
              { key: 'key', label: 'Record key' },
              { key: 'retention', label: 'Retention' },
              { key: 'owner', label: 'Data owner' },
            ]}
            selectable={false}
            footerNote="The dictionary describes what is actually implemented, not a planned design"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}