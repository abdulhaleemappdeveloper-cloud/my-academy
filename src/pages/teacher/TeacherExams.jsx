import { useState } from 'react';
import { AlertTriangle, CalendarClock, ClipboardCheck, Plus, Save } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const TYPES = ['First term', 'Mid term', 'Final term', 'Monthly test', 'Mock board', 'Practical', 'Oral'];

export default function TeacherExams() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const exams = useCollection('exams');
  const moderation = useCollection('moderation');
  const substitutes = useCollection('substitutes');
  const { toast } = useToast();

  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const myExams = exams.filter((row) => row.examiner === teacher.name);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: '', type: TYPES[0], className: teacher.classes[0], section: 'A & B', subject: teacher.subject,
    date: '', start: '09:00', end: '10:30', duration: '90 min', totalMarks: 75, instructions: '',
  });
  const [errors, setErrors] = useState({});

  const save = () => {
    const next = {};
    if (!draft.title.trim()) next.title = 'Enter the examination title.';
    if (!draft.date) next.date = 'Choose the examination date.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const record = insert('exams', {
      ...draft,
      passing: 33,
      examiner: teacher.name,
      approvedBy: 'Pending',
      status: 'Teacher review',
      candidates: 0,
      room: 'To be allotted',
    });
    logAction({ actor: teacher.name, role: 'Teacher', action: 'Created examination', module: 'Examinations', target: record.title, reason: 'Sent for approval' });
    toast({
      title: 'Examination created',
      description: 'It moves to review. Nothing is scheduled or visible to students until an authorised administrator approves it.',
    });
    setOpen(false);
    setDraft({ ...draft, title: '', date: '', instructions: '' });
  };

  const conflicts = myExams.filter((row) => substitutes.some((s) => s.absentTeacher === teacher.name && s.date === row.date));

  return (
    <div>
      <PageHeader
        title="Examinations"
        description="Draft papers, send them for approval and track scheduling, moderation and student eligibility."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Examinations' }]}
        actions={
          <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Create examination
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My examinations" value={myExams.length} hint="All statuses" icon={ClipboardCheck} />
        <StatCard label="Awaiting approval" value={myExams.filter((e) => e.status === 'Teacher review' || e.status === 'Draft').length} hint="Not visible to students" tone="warning" />
        <StatCard label="Scheduled" value={myExams.filter((e) => e.status === 'Scheduled' || e.status === 'Approved').length} hint="Confirmed by the office" tone="brand" icon={CalendarClock} />
        <StatCard label="Schedule conflicts" value={conflicts.length} hint="Clashes with leave or other papers" tone={conflicts.length ? 'danger' : 'neutral'} icon={AlertTriangle} />
      </div>

      {conflicts.length > 0 && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            {conflicts.length} examination(s) fall on a day when you are recorded as absent. The office will arrange
            cover or reschedule — an authorised override with a recorded reason is also possible.
          </p>
        </div>
      )}

      <Tabs defaultValue="mine" className="mt-6">
        <TabsList>
          <TabsTrigger value="mine">My examinations</TabsTrigger>
          <TabsTrigger value="workflow">Approval workflow</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="mt-4">
          <DataTable
            rows={myExams}
            searchKeys={['title', 'className', 'subject', 'type']}
            searchPlaceholder="Search examinations…"
            filters={[
              { key: 'className', label: 'Class', options: teacher.classes },
              { key: 'type', label: 'Type', options: TYPES },
              { key: 'status', label: 'Status', options: ['Draft', 'Teacher review', 'Approved', 'Scheduled', 'Completed', 'Grading', 'Result approval', 'Published'] },
            ]}
            columns={[
              { key: 'title', label: 'Examination', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'className', label: 'Class' },
              { key: 'date', label: 'Date' },
              { key: 'start', label: 'Start' },
              { key: 'duration', label: 'Duration' },
              { key: 'totalMarks', label: 'Marks', align: 'right' },
              { key: 'approvedBy', label: 'Approved by' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Draft papers are never accessible to students"
          />
        </TabsContent>

        <TabsContent value="workflow" className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Workflow stages</h2>
            <ol className="mt-4 space-y-3">
              {[
                'Draft — the teacher prepares the paper, marks scheme and instructions.',
                'Teacher review — subject teachers check coverage, marks and duration.',
                'Authorised approval — the academic administrator approves or returns the paper with a reason.',
                'Scheduled or published — the paper becomes visible to students at the window start.',
                'Completed and grading — scripts collected; objective answers marked automatically.',
                'Result approval — totals validated and moderation completed where required.',
                'Result published — students and guardians can view the result.',
              ].map((line, index) => (
                <li key={line} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{line}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Integrity controls</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Question order can vary between students while keeping comparable difficulty and total marks.',
                'Time limits and attempt limits are enforced when the paper opens.',
                'Suspicious activity flags only prompt a review — they never change a result automatically.',
                'Accommodations such as extra time are applied from the examination record, not the student profile.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              A browser-based examination cannot guarantee that cheating is impossible; controls are proportionate,
              disclosed and reviewed by staff.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="moderation" className="mt-4">
          <DataTable
            rows={moderation}
            searchKeys={['assessment', 'secondMarker', 'variance']}
            searchPlaceholder="Search moderation records…"
            filters={[{ key: 'status', label: 'Status', options: ['Pending', 'In progress', 'Completed'] }]}
            columns={[
              { key: 'assessment', label: 'Assessment' },
              { key: 'secondMarker', label: 'Second marker' },
              { key: 'scripts', label: 'Scripts', align: 'right' },
              { key: 'sampled', label: 'Sampled', align: 'right' },
              { key: 'variance', label: 'Outcome', render: (row) => <StatusBadge value={row.variance} /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Create an examination"
        subtitle="Sent for approval before scheduling"
        footer={
          <>
            <button type="button" onClick={save} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Create and send for review
            </button>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Cancel
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-muted-foreground">
            Examination title *
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              className={inputClass}
              placeholder="Physics — First term"
            />
            {errors.title && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.title}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Type
              <select value={draft.type} onChange={(event) => setDraft((prev) => ({ ...prev, type: event.target.value }))} className={inputClass}>
                {TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Class
              <select value={draft.className} onChange={(event) => setDraft((prev) => ({ ...prev, className: event.target.value }))} className={inputClass}>
                {teacher.classes.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Section
              <select value={draft.section} onChange={(event) => setDraft((prev) => ({ ...prev, section: event.target.value }))} className={inputClass}>
                {['A', 'B', 'A & B'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Date *
              <input type="date" value={draft.date} onChange={(event) => setDraft((prev) => ({ ...prev, date: event.target.value }))} className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Start time
              <input type="time" value={draft.start} onChange={(event) => setDraft((prev) => ({ ...prev, start: event.target.value }))} className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Duration
              <input value={draft.duration} onChange={(event) => setDraft((prev) => ({ ...prev, duration: event.target.value }))} className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Total marks
              <input value={draft.totalMarks} onChange={(event) => setDraft((prev) => ({ ...prev, totalMarks: Number(event.target.value) || 0 }))} className={inputClass} inputMode="numeric" />
            </label>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            Instructions for students
            <textarea
              rows={3}
              value={draft.instructions}
              onChange={(event) => setDraft((prev) => ({ ...prev, instructions: event.target.value }))}
              className={textareaClass}
              placeholder="Reporting time, stationery allowed, section structure."
            />
          </label>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            The paper, marking rubric and answer key are attached from the question bank. Marks are validated before the
            result can be published.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';