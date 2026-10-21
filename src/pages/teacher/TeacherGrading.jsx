import { useState } from 'react';
import { CheckCircle2, PenLine, Save } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import RecordDrawer from '@/components/common/RecordDrawer';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const RUBRIC = ['Correct method', 'Working steps shown', 'Units and notation', 'Final answer', 'Presentation'];

export default function TeacherGrading() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const results = useCollection('results');
  const submissions = useCollection('submissions');
  const assignments = useCollection('assignments');
  const { toast } = useToast();

  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const myResults = results.filter((row) => row.marker === teacher.name);
  const myAssignments = assignments.filter((row) => row.teacher === teacher.name);
  const mySubmissions = submissions.filter((row) => myAssignments.some((a) => a.id === row.assignmentId));

  const [open, setOpen] = useState(null);
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState('');
  const [rubric, setRubric] = useState({});

  const total = Object.values(rubric).reduce((sum, value) => sum + Number(value || 0), 0);

  const saveScript = () => {
    if (marks.earned === undefined || marks.earned === '' || Number(marks.earned) < 0 || Number(marks.earned) > open.total) {
      toast({
        title: 'Check the marks',
        description: `Enter marks between 0 and ${open.total}. Marks above the paper total are rejected.`,
        variant: 'destructive',
      });
      return;
    }
    patch('results', open.id, {
      marks: Number(marks.earned),
      percent: Math.round((Number(marks.earned) / open.total) * 100),
      status: 'Awaiting approval',
      validated: true,
    });
    logAction({
      actor: teacher.name,
      role: 'Teacher',
      action: 'Marked written answers',
      module: 'Results',
      target: `${open.studentName} · ${open.subject}`,
      reason: feedback || 'Standard marking',
      before: `marks: ${open.marks}`,
      after: `marks: ${marks.earned}`,
    });
    toast({ title: 'Marks saved', description: 'The result is now awaiting approval before publication.' });
    setOpen(null);
    setMarks({});
    setFeedback('');
    setRubric({});
  };

  const saveSubmission = () => {
    if (marks.earned === undefined || marks.earned === '' || Number(marks.earned) < 0 || Number(marks.earned) > (open.outOf || 0)) {
      toast({
        title: 'Check the marks',
        description: `Enter marks between 0 and ${open.outOf}.`,
        variant: 'destructive',
      });
      return;
    }
    patch('submissions', open.id, {
      marks: Number(marks.earned),
      status: 'Marked',
      feedback: feedback || 'Marked against the rubric.',
    });
    logAction({ actor: teacher.name, role: 'Teacher', action: 'Marked assignment', module: 'Assignments', target: open.assignment });
    toast({ title: 'Assignment marked', description: 'Feedback is now visible to the student.' });
    setOpen(null);
    setMarks({});
    setFeedback('');
    setRubric({});
  };

  return (
    <div>
      <PageHeader
        title="Grading"
        description="Objective answers are marked automatically. Written answers and assignments are marked here against the rubric, then sent for approval before publication."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Grading' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Scripts to mark" value={myResults.filter((r) => r.status !== 'Published').length} hint="Written answers waiting" tone="warning" icon={PenLine} />
        <StatCard label="Awaiting approval" value={myResults.filter((r) => r.status === 'Awaiting approval').length} hint="Sent to the examination controller" />
        <StatCard label="Published results" value={myResults.filter((r) => r.status === 'Published').length} hint="Approved and released" tone="brand" icon={CheckCircle2} />
        <StatCard label="Assignments to mark" value={mySubmissions.filter((s) => s.status === 'Submitted').length} hint="Submissions awaiting feedback" tone="warning" />
      </div>

      <div className="mt-6 space-y-8">
        <section>
          <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Examination scripts</h2>
          <DataTable
            rows={myResults}
            searchKeys={['studentName', 'subject', 'exam']}
            searchPlaceholder="Search scripts…"
            filters={[
              { key: 'status', label: 'Status', options: ['Pending marking', 'Awaiting approval', 'Published', 'Recheck requested'] },
              { key: 'subject', label: 'Subject', options: [...new Set(myResults.map((r) => r.subject))] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'subject', label: 'Subject' },
              { key: 'exam', label: 'Examination' },
              { key: 'marks', label: 'Current', align: 'right', render: (row) => `${row.marks} / ${row.total}` },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            rowActions={(row) => (
              <button
                type="button"
                onClick={() => setOpen({ kind: 'result', ...row })}
                disabled={row.status === 'Published'}
                className="text-xs font-semibold text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
              >
                {row.status === 'Published' ? 'Locked' : 'Mark'}
              </button>
            )}
            footerNote="Published marks cannot be edited — use the rechecking process"
          />
        </section>

        <section>
          <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Assignment submissions</h2>
          <DataTable
            rows={mySubmissions}
            searchKeys={['studentName', 'assignment']}
            searchPlaceholder="Search submissions…"
            filters={[{ key: 'status', label: 'Status', options: ['Submitted', 'Marked', 'Resubmit requested'] }]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'assignment', label: 'Assignment' },
              { key: 'type', label: 'Submitted as' },
              { key: 'submittedOn', label: 'Submitted' },
              { key: 'late', label: 'Late', render: (row) => <StatusBadge value={row.late ? 'Late' : 'On time'} /> },
              { key: 'marks', label: 'Marks', align: 'right', render: (row) => (row.marks === '—' ? '—' : `${row.marks} / ${row.outOf}`) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            rowActions={(row) => (
              <button type="button" onClick={() => setOpen({ kind: 'submission', ...row })} className="text-xs font-semibold text-primary hover:underline">
                {row.status === 'Submitted' ? 'Mark' : 'Review'}
              </button>
            )}
          />
        </section>
      </div>

      <RecordDrawer
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open?.studentName}
        subtitle={open?.kind === 'result' ? `${open?.subject} · ${open?.exam}` : open?.assignment}
        badge={open?.status}
        footer={
          <>
            <button
              type="button"
              onClick={open?.kind === 'result' ? saveScript : saveSubmission}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
            >
              <Save className="h-4 w-4" /> Save marks
            </button>
            <button type="button" onClick={() => setOpen(null)} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Close
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Marks awarded
              <input
                value={marks.earned ?? ''}
                onChange={(event) => setMarks({ earned: event.target.value })}
                className={inputClass}
                inputMode="numeric"
                placeholder={`Out of ${open?.kind === 'result' ? open?.total : open?.outOf}`}
              />
            </label>
            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rubric total</p>
              <p className="mt-1 font-display text-lg font-semibold text-foreground">{total}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rubric</p>
            <ul className="mt-2 space-y-2">
              {RUBRIC.map((criterion) => (
                <li key={criterion} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{criterion}</span>
                  <input
                    value={rubric[criterion] ?? ''}
                    onChange={(event) => setRubric((prev) => ({ ...prev, [criterion]: event.target.value }))}
                    aria-label={`${criterion} marks`}
                    className="h-8 w-16 rounded-lg border border-input bg-background px-2 text-center text-sm outline-none focus:border-primary/50"
                    inputMode="numeric"
                    placeholder="0"
                  />
                </li>
              ))}
            </ul>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            Feedback for the student
            <textarea
              rows={4}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              className={textareaClass}
              placeholder="Describe what was done well and the specific next step."
            />
          </label>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Feedback is shared with the student and, where the academy enables it, with the guardian. It is reviewed by
            you before it is published and must not infer anything about a student's personal circumstances.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';