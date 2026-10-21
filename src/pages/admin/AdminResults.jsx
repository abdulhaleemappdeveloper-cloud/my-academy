import { useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, ClipboardCheck, RotateCcw } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function AdminResults() {
  const { account } = useSession();
  const results = useCollection('results');
  const reportCards = useCollection('reportCards');
  const rechecks = useCollection('rechecks');
  const { toast } = useToast();

  const [bulkReason, setBulkReason] = useState('');
  const [selected, setSelected] = useState(null);

  const awaiting = results.filter((r) => r.status === 'Awaiting approval');
  const unvalidated = results.filter((r) => !r.validated);
  const published = results.filter((r) => r.status === 'Published');

  const publishGroup = () => {
    if (bulkReason.trim().length < 5) {
      toast({ title: 'Add an approval note', description: 'Publication needs a recorded approval note.', variant: 'destructive' });
      return;
    }
    if (unvalidated.length > 0) {
      toast({
        title: 'Validation incomplete',
        description: `${unvalidated.length} result(s) have totals that do not reconcile. Fix them before publishing.`,
        variant: 'destructive',
      });
      return;
    }
    awaiting.forEach((row) => patch('results', row.id, { status: 'Published', publishedOn: new Date().toISOString().slice(0, 10) }));
    logAction({
      actor: account?.name,
      role: account?.label,
      action: 'Published approved results',
      module: 'Results',
      target: `${awaiting.length} results`,
      reason: bulkReason,
      before: 'status: Awaiting approval',
      after: 'status: Published',
    });
    toast({ title: 'Results published', description: `${awaiting.length} result(s) are now visible to students and guardians.` });
    setBulkReason('');
  };

  const returnResult = () => {
    patch('results', selected.id, { status: 'Pending marking', validated: false });
    logAction({ actor: account?.name, role: account?.label, action: 'Returned result for correction', module: 'Results', target: selected.studentName, reason: bulkReason || 'Totals need review' });
    toast({ title: 'Returned for correction', description: 'The subject teacher has been notified and the result stays private.' });
    setSelected(null);
    setBulkReason('');
  };

  return (
    <div>
      <PageHeader
        title="Results, report cards and rechecking"
        description="Validate totals, approve results, publish to students and guardians, generate report cards and handle rechecking requests. Unapproved results never reach a portal."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Results' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting approval" value={awaiting.length} hint="Not visible to students" tone="warning" icon={ClipboardCheck} />
        <StatCard label="Published" value={published.length} hint="Visible to students and guardians" tone="brand" icon={CheckCircle2} />
        <StatCard label="Totals to reconcile" value={unvalidated.length} hint="Blocks publication" tone={unvalidated.length ? 'danger' : 'brand'} icon={AlertTriangle} />
        <StatCard label="Rechecking requests" value={rechecks.filter((r) => r.outcome === 'Pending').length} hint="Awaiting a decision" icon={RotateCcw} />
      </div>

      <Tabs defaultValue="approval" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="approval">Approval and publication</TabsTrigger>
          <TabsTrigger value="all">All results</TabsTrigger>
          <TabsTrigger value="reports">Report cards</TabsTrigger>
          <TabsTrigger value="rechecks">Rechecking</TabsTrigger>
        </TabsList>

        <TabsContent value="approval" className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <DataTable
            rows={awaiting}
            searchKeys={['studentName', 'subject', 'exam', 'marker']}
            searchPlaceholder="Search results awaiting approval…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(awaiting.map((r) => r.subject))] },
              { key: 'validated', label: 'Totals', options: ['true', 'false'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'subject', label: 'Subject' },
              { key: 'marks', label: 'Marks', align: 'right', render: (row) => `${row.marks} / ${row.total}` },
              { key: 'percent', label: 'Percent', align: 'right', render: (row) => `${row.percent}%` },
              { key: 'grade', label: 'Grade' },
              { key: 'validated', label: 'Totals', render: (row) => <StatusBadge value={row.validated ? 'Reconciled' : 'Check needed'} /> },
              { key: 'marker', label: 'Marked by' },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
                Review
              </button>
            )}
            emptyTitle="Nothing is waiting for approval"
            footerNote="Publication is blocked while any total fails validation"
          />

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Publish approved results</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Ready to publish</span><span className="font-semibold text-foreground">{awaiting.length}</span></li>
              <li className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Blocked by validation</span><span className="font-semibold text-foreground">{unvalidated.length}</span></li>
              <li className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Moderation outstanding</span><span className="font-semibold text-foreground">Checked per paper</span></li>
            </ul>
            <label className="mt-5 block text-xs font-semibold text-muted-foreground">
              Approval note
              <textarea
                rows={3}
                value={bulkReason}
                onChange={(event) => setBulkReason(event.target.value)}
                className={textareaClass}
                placeholder="For example: moderation complete, totals reconciled, approved for publication."
              />
            </label>
            <button type="button" onClick={publishGroup} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Publish approved results
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Publication is recorded with the approving account and note. After publication, a change is only possible
              through the rechecking process so the correction history stays intact.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <DataTable
            rows={results}
            searchKeys={['studentName', 'subject', 'exam', 'grade']}
            searchPlaceholder="Search results…"
            filters={[
              { key: 'status', label: 'Status', options: ['Pending marking', 'Awaiting approval', 'Published', 'Recheck requested'] },
              { key: 'className', label: 'Class', options: [...new Set(results.map((r) => r.className))] },
              { key: 'grade', label: 'Grade', options: ['A+', 'A', 'B', 'C', 'E', 'F'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student' },
              { key: 'className', label: 'Class' },
              { key: 'section', label: 'Section' },
              { key: 'subject', label: 'Subject' },
              { key: 'marks', label: 'Marks', align: 'right', render: (row) => `${row.marks} / ${row.total}` },
              { key: 'percent', label: 'Percent', align: 'right', render: (row) => `${row.percent}%` },
              { key: 'grade', label: 'Grade' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'publishedOn', label: 'Published' },
            ]}
            selectable={false}
            pageSize={10}
            footerNote="Marks above the paper total or below zero are rejected on entry"
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <DataTable
            rows={reportCards}
            searchKeys={['studentName', 'className', 'term']}
            searchPlaceholder="Search report cards…"
            filters={[
              { key: 'status', label: 'Status', options: ['Draft', 'Awaiting approval', 'Approved', 'Published'] },
              { key: 'term', label: 'Term', options: ['First term', 'Second term'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'section', label: 'Section' },
              { key: 'term', label: 'Term' },
              { key: 'obtained', label: 'Marks', align: 'right', render: (row) => `${row.obtained} / ${row.total}` },
              { key: 'percent', label: 'Percent', align: 'right', render: (row) => `${row.percent}%` },
              { key: 'grade', label: 'Grade' },
              { key: 'attendance', label: 'Attendance', align: 'right', render: (row) => `${row.attendance}%` },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Approved', 'Published'] }}
            footerNote="Report cards are generated from verified marks only — never from a public endpoint"
          />
        </TabsContent>

        <TabsContent value="rechecks" className="mt-4">
          <DataTable
            rows={rechecks}
            searchKeys={['studentName', 'exam', 'subject', 'outcome']}
            searchPlaceholder="Search rechecking requests…"
            filters={[{ key: 'outcome', label: 'Outcome', options: ['Pending', 'No change', 'Marks corrected', 'Forwarded to moderator'] }]}
            columns={[
              { key: 'studentName', label: 'Student' },
              { key: 'className', label: 'Class' },
              { key: 'exam', label: 'Examination' },
              { key: 'subject', label: 'Subject' },
              { key: 'requestedOn', label: 'Requested' },
              { key: 'reason', label: 'Reason', render: (row) => <span className="line-clamp-1 text-xs text-muted-foreground">{row.reason}</span> },
              { key: 'reviewedBy', label: 'Reviewed by' },
              { key: 'outcome', label: 'Outcome', render: (row) => <StatusBadge value={row.outcome} /> },
            ]}
            selectable={false}
            footerNote="Every correction records the actor, the reason and the previous value"
          />
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => { setSelected(null); setBulkReason(''); }}
        title={selected?.studentName}
        subtitle={selected ? `${selected.subject} · ${selected.exam}` : ''}
        badge={selected?.status}
        rows={
          selected
            ? [
                { key: 'marks', label: 'Marks', value: `${selected.marks} of ${selected.total}` },
                { key: 'percent', label: 'Percentage', value: `${selected.percent}%` },
                { key: 'grade', label: 'Grade', value: selected.grade },
                { key: 'marker', label: 'Marked by', value: selected.marker },
                { key: 'validated', label: 'Totals reconciled', value: selected.validated ? 'Yes' : 'No — fix before publishing' },
                { key: 'publishedOn', label: 'Published on', value: selected.publishedOn },
              ]
            : []
        }
        footer={
          <>
            <button type="button" onClick={publishGroup} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              Publish all approved
            </button>
            <button type="button" onClick={returnResult} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Return for correction
            </button>
          </>
        }
      >
        <label className="block text-xs font-semibold text-muted-foreground">
          Approval or correction note
          <textarea
            rows={3}
            value={bulkReason}
            onChange={(event) => setBulkReason(event.target.value)}
            className={textareaClass}
            placeholder="Describe what was checked or what needs correcting."
          />
        </label>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <BarChart3 className="h-3.5 w-3.5 text-primary" /> Percentages use the configured grade boundaries; the academy
          may enable class-position reporting per term.
        </p>
      </RecordDrawer>
    </div>
  );
}

const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';