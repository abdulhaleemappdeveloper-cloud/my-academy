import { useState } from 'react';
import { AlertTriangle, CalendarClock, ClipboardCheck, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const NEXT = {
  Draft: 'Teacher review',
  'Teacher review': 'Approved',
  Approved: 'Scheduled',
  Scheduled: 'Completed',
  Completed: 'Grading',
  Grading: 'Result approval',
  'Result approval': 'Published',
};

export default function AdminExams() {
  const { account } = useSession();
  const exams = useCollection('exams');
  const moderation = useCollection('moderation');
  const accommodations = useCollection('accommodations');
  const rooms = useCollection('rooms');
  const { toast } = useToast();
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');

  const advancing = exams.filter((e) => NEXT[e.status]);
  const awaitingApproval = exams.filter((e) => e.status === 'Teacher review');
  const conflicts = exams.filter((e) => rooms.every((r) => r.name !== e.room)) ;

  const advance = (row, status) => {
    if (status === 'Published' && reason.trim().length < 5) {
      toast({ title: 'Add an approval note', description: 'Publishing results requires a recorded approval note.', variant: 'destructive' });
      return;
    }
    patch('exams', row.id, { status, approvedBy: account?.name });
    logAction({
      actor: account?.name,
      role: account?.label,
      action: `Examination moved to ${status}`,
      module: 'Examinations',
      target: row.title,
      reason: reason || 'Workflow step',
      before: `status: ${row.status}`,
      after: `status: ${status}`,
    });
    toast({ title: `Examination ${status.toLowerCase()}`, description: 'The change and its reason are recorded in the audit log.' });
    setReason('');
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Examination operations"
        description="Scheduling, approval, moderation, accommodations and integrity controls. Students never see a paper or a result before the configured stage."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Examinations' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Examinations" value={exams.length} hint={`${advancing.length} in an active stage`} icon={ClipboardCheck} />
        <StatCard label="Awaiting approval" value={awaitingApproval.length} hint="Teacher review before scheduling" tone="warning" />
        <StatCard label="Moderation cases" value={moderation.filter((m) => m.status !== 'Completed').length} hint="Second-marker review" icon={ShieldCheck} />
        <StatCard label="Accommodations" value={accommodations.filter((a) => a.status === 'Active').length} hint="Extra time, separate room or rest breaks" icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="schedule" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="schedule">Schedule and status</TabsTrigger>
          <TabsTrigger value="approval">Approval and change control</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="integrity">Integrity and conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <DataTable
            rows={exams}
            searchKeys={['title', 'subject', 'className', 'examiner']}
            searchPlaceholder="Search examinations…"
            filters={[
              { key: 'className', label: 'Class', options: [...new Set(exams.map((e) => e.className))] },
              { key: 'type', label: 'Type', options: [...new Set(exams.map((e) => e.type))] },
              { key: 'status', label: 'Status', options: ['Draft', 'Teacher review', 'Approved', 'Scheduled', 'Completed', 'Grading', 'Result approval', 'Published'] },
            ]}
            columns={[
              { key: 'title', label: 'Examination', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'className', label: 'Class' },
              { key: 'section', label: 'Section' },
              { key: 'date', label: 'Date' },
              { key: 'start', label: 'Start' },
              { key: 'duration', label: 'Duration' },
              { key: 'room', label: 'Room' },
              { key: 'candidates', label: 'Candidates', align: 'right' },
              { key: 'examiner', label: 'Examiner' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
                Manage
              </button>
            )}
            footerNote="Each stage change records the actor and the reason"
          />
        </TabsContent>

        <TabsContent value="approval" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Approval workflow</h2>
            <ol className="mt-4 space-y-3">
              {['Draft', 'Teacher review', 'Approved', 'Scheduled', 'Completed', 'Grading', 'Result approval', 'Published'].map((stage, index) => (
                <li key={stage} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                  <span className="text-sm text-muted-foreground">{stage}</span>
                  <StatusBadge className="ml-auto" value={`${exams.filter((e) => e.status === stage).length} paper(s)`} tone="neutral" />
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Change control on published papers</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Once a paper is published, changes to its schedule, duration, marks, eligibility or accommodations require a
              reason, authorisation and notifications to affected students. The original published version stays in the
              audit history.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Schedule changes', 'Reason + authorisation + notification'],
                ['Paper revisions', 'New version, previous version retained'],
                ['Mark allocation', 'Approval by the examination controller'],
                ['Cancellation or rescheduling', 'Affected candidates notified'],
              ].map(([item, rule]) => (
                <li key={item} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-3">
                  <span className="text-sm text-foreground">{item}</span>
                  <span className="text-right text-xs text-muted-foreground">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="mt-4">
          <DataTable
            rows={moderation}
            searchKeys={['assessment', 'secondMarker', 'variance']}
            searchPlaceholder="Search moderation records…"
            filters={[{ key: 'status', label: 'Status', options: ['Pending', 'In progress', 'Completed'] }]}
            columns={[
              { key: 'assessment', label: 'Assessment', render: (row) => <span className="font-medium">{row.assessment}</span> },
              { key: 'secondMarker', label: 'Second marker' },
              { key: 'scripts', label: 'Scripts', align: 'right' },
              { key: 'sampled', label: 'Sampled', align: 'right' },
              { key: 'variance', label: 'Outcome', render: (row) => <StatusBadge value={row.variance} /> },
              { key: 'comment', label: 'Comment' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'completedOn', label: 'Completed' },
            ]}
            selectable={false}
            footerNote="Second marking is required before publication on flagged papers"
          />
        </TabsContent>

        <TabsContent value="accommodations" className="mt-4">
          <DataTable
            rows={accommodations}
            searchKeys={['studentName', 'className', 'type']}
            searchPlaceholder="Search accommodations…"
            filters={[
              { key: 'type', label: 'Type', options: [...new Set(accommodations.map((a) => a.type))] },
              { key: 'status', label: 'Status', options: ['Active', 'Expired'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'type', label: 'Accommodation' },
              { key: 'approvedBy', label: 'Approved by' },
              { key: 'validUntil', label: 'Valid until' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Accommodation records are separate from the student profile and visible only to examination staff"
          />
        </TabsContent>

        <TabsContent value="integrity" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Integrity controls in use</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Question order may vary between candidates while difficulty and total marks stay comparable.',
                'Time limits and attempt limits are enforced when the paper opens.',
                'Submission timestamps and session status are recorded for review.',
                'Suspicious activity flags prompt a review by staff — they never change a result automatically.',
                'Proportionate and disclosed controls only; no hidden recording of students.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <CalendarClock className="h-4 w-4 text-primary" /> Scheduling checks
            </h2>
            <ul className="mt-4 space-y-3">
              {[
                ['Room allocation', `${rooms.length} rooms available for allocation`],
                ['Papers without a room', `${conflicts.length} awaiting a room`],
                ['Teacher double-booking', `${exams.filter((e) => e.status === 'Scheduled').length} scheduled papers to check`],
                ['Overlapping examinations', 'Checked per class and section'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-right text-xs font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Conflicts are warnings, not automatic blocks — an authorised override with a recorded reason is allowed.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => { setSelected(null); setReason(''); }}
        title={selected?.title}
        subtitle={selected ? `${selected.className} · ${selected.date} · ${selected.start}` : ''}
        badge={selected?.status}
        rows={
          selected
            ? [
                { key: 'type', label: 'Type', value: selected.type },
                { key: 'duration', label: 'Duration', value: selected.duration },
                { key: 'totalMarks', label: 'Total marks', value: `${selected.totalMarks} · passing ${selected.passing}%` },
                { key: 'examiner', label: 'Examiner', value: selected.examiner },
                { key: 'room', label: 'Room', value: selected.room },
                { key: 'candidates', label: 'Candidates', value: selected.candidates },
                { key: 'approvedBy', label: 'Approved by', value: selected.approvedBy },
              ]
            : []
        }
        footer={
          <>
            {NEXT[selected?.status] && (
              <button type="button" onClick={() => advance(selected, NEXT[selected.status])} className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                Move to {NEXT[selected.status]}
              </button>
            )}
            <button type="button" onClick={() => advance(selected, 'Teacher review')} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Return for correction
            </button>
          </>
        }
      >
        <label className="block text-xs font-semibold text-muted-foreground">
          Approval or change note
          <textarea
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
            placeholder="Required when returning a paper or publishing results."
          />
        </label>
      </RecordDrawer>
    </div>
  );
}