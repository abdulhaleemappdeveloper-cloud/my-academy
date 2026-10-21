import { useState } from 'react';
import { Award, BarChart3, ClipboardCheck, Send } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function StudentResults() {
  const { account } = useSession();
  const students = useCollection('students');
  const results = useCollection('results');
  const reportCards = useCollection('reportCards');
  const student = students.find((s) => s.name === account?.name) || students[9];
  const { toast } = useToast();
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');

  const mine = results.filter((row) => row.studentId === student.id);
  const published = mine.filter((row) => row.status === 'Published');
  const average = published.length ? Math.round(published.reduce((sum, row) => sum + row.percent, 0) / published.length) : 0;
  const card = reportCards.find((row) => row.studentId === student.id);

  const requestRecheck = () => {
    if (reason.trim().length < 10) {
      toast({ title: 'Add a reason', description: 'Explain what you would like reviewed (at least 10 characters).', variant: 'destructive' });
      return;
    }
    patch('results', selected.id, { status: 'Recheck requested' });
    logAction({
      actor: student.name,
      role: 'Student',
      action: 'Requested result recheck',
      module: 'Results',
      target: selected.exam,
      reason,
      before: `status: ${selected.status}`,
      after: 'status: Recheck requested',
    });
    toast({ title: 'Recheck requested', description: 'The examination controller will review this result and reply through your portal.' });
    setReason('');
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Results and report cards"
        description="Only approved and published results appear here. Published marks are changed solely through the rechecking process, which is recorded."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Results' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assessment average" value={published.length ? `${average}%` : '—'} hint="Across published subjects" tone="brand" icon={BarChart3} />
        <StatCard label="Subjects published" value={published.length} hint="This term" icon={ClipboardCheck} />
        <StatCard label="Awaiting approval" value={mine.filter((r) => r.status === 'Awaiting approval').length} hint="Not released until approved" tone="warning" />
        <StatCard label="Report card" value={card?.status || 'Not issued'} hint={card ? `${card.term} · ${card.grade}` : 'Issued after examinations'} icon={Award} />
      </div>

      <Tabs defaultValue="results" className="mt-6">
        <TabsList>
          <TabsTrigger value="results">Subject results</TabsTrigger>
          <TabsTrigger value="report">Report card</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-4">
          <DataTable
            rows={mine}
            searchKeys={['subject', 'exam']}
            searchPlaceholder="Search results…"
            filters={[
              { key: 'status', label: 'Status', options: ['Published', 'Awaiting approval', 'Pending marking', 'Recheck requested'] },
              { key: 'subject', label: 'Subject', options: [...new Set(mine.map((r) => r.subject))] },
            ]}
            columns={[
              { key: 'exam', label: 'Examination' },
              { key: 'subject', label: 'Subject' },
              { key: 'marks', label: 'Marks', align: 'right', render: (row) => `${row.marks} / ${row.total}` },
              { key: 'percent', label: 'Percent', align: 'right', render: (row) => `${row.percent}%` },
              { key: 'grade', label: 'Grade' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'publishedOn', label: 'Published' },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
                Details
              </button>
            )}
            footerNote="Results stay private until the academic office approves and publishes them"
          />
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          {!card ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                The report card for this term has not been issued yet. It is generated after examinations are marked and
                approved.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight">Report card — {card.term}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.studentName} · {card.className} · Section {card.section} · {card.academicYear}
                  </p>
                </div>
                <StatusBadge value={card.status} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {[
                  ['Marks obtained', `${card.obtained} / ${card.total}`],
                  ['Percentage', `${card.percent}%`],
                  ['Overall grade', card.grade],
                  ['Attendance', `${card.attendance}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-border bg-background p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                    <p className="mt-1.5 font-display text-lg font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                      <th className="py-2.5 pr-4">Subject</th>
                      <th className="py-2.5 pr-4 text-right">Marks</th>
                      <th className="py-2.5 pr-4 text-right">Total</th>
                      <th className="py-2.5 pr-4 text-right">Percent</th>
                      <th className="py-2.5 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {published.slice(0, card.subjects).map((row) => (
                      <tr key={row.id} className="border-b border-border/70 last:border-0">
                        <td className="py-2.5 pr-4 font-medium text-foreground">{row.subject}</td>
                        <td className="py-2.5 pr-4 text-right text-muted-foreground">{row.marks}</td>
                        <td className="py-2.5 pr-4 text-right text-muted-foreground">{row.total}</td>
                        <td className="py-2.5 pr-4 text-right text-muted-foreground">{row.percent}%</td>
                        <td className="py-2.5 text-right font-semibold text-foreground">{row.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Teacher remarks and the position in class are shown only when the academy enables them for the term.
                Report cards are never published on a public page.
              </p>
              <button type="button" className="mt-4 inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
                Print or download report card
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.subject}
        subtitle={selected ? `${selected.exam} · marked by ${selected.marker}` : ''}
        badge={selected?.status}
        rows={
          selected
            ? [
                { key: 'marks', label: 'Marks obtained', value: `${selected.marks} of ${selected.total}` },
                { key: 'percent', label: 'Percentage', value: `${selected.percent}%` },
                { key: 'grade', label: 'Grade', value: selected.grade },
                { key: 'validated', label: 'Totals validated', value: selected.validated ? 'Yes' : 'Pending validation' },
                { key: 'publishedOn', label: 'Published on', value: selected.publishedOn },
              ]
            : []
        }
        footer={
          selected?.status === 'Published' ? (
            <div className="w-full space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Reason for the recheck request
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="For example: the total for question 4 does not appear to be included."
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
                />
              </label>
              <button type="button" onClick={requestRecheck} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                <Send className="h-4 w-4" /> Request a recheck
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {selected?.status === 'Recheck requested'
                ? 'A recheck request is already open for this result.'
                : 'A recheck can be requested once the result is published.'}
            </p>
          )
        }
      >
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Marking</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Objective answers are marked automatically. Written answers are marked by the subject teacher against the
            marking scheme, and totals are validated before the result is published.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}