import { useState } from 'react';
import { FileText, Plus, Send, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import RecordDrawer from '@/components/common/RecordDrawer';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function TeacherAssignments() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const assignments = useCollection('assignments');
  const submissions = useCollection('submissions');
  const { toast } = useToast();

  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const mine = assignments.filter((row) => row.teacher === teacher.name);
  const related = submissions.filter((row) => mine.some((a) => a.id === row.assignmentId));

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', subject: teacher.subject, className: teacher.classes[0], section: 'A & B', dueOn: '', marks: 20, lateAllowed: 'Not allowed', brief: '' });
  const [errors, setErrors] = useState({});

  const save = () => {
    const next = {};
    if (!draft.title.trim()) next.title = 'Enter a title for the assignment.';
    if (!draft.dueOn) next.dueOn = 'Choose a due date.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const record = insert('assignments', {
      ...draft,
      teacher: teacher.name,
      assignedOn: new Date().toISOString().slice(0, 10),
      submissions: 0,
      expected: 35,
      rubric: 'Rubric v2',
      status: 'Open',
    });
    logAction({ actor: teacher.name, role: 'Teacher', action: 'Created assignment', module: 'Assignments', target: record.title });
    toast({ title: 'Assignment created', description: `${record.title} is open to students until ${record.dueOn}.` });
    setOpen(false);
    setDraft({ ...draft, title: '', dueOn: '', brief: '' });
  };

  return (
    <div>
      <PageHeader
        title="Assignments"
        description="Set tasks, track submissions and mark work with a rubric. Late work follows the rule you choose here."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Assignments' }]}
        actions={
          <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Create assignment
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My assignments" value={mine.length} hint="Across your classes" icon={FileText} />
        <StatCard label="Open" value={mine.filter((a) => a.status === 'Open').length} hint="Students can submit" tone="brand" />
        <StatCard label="Submissions received" value={related.length} hint="All assignments" icon={Users} />
        <StatCard label="Awaiting marking" value={related.filter((s) => s.status === 'Submitted').length} hint="Feedback outstanding" tone="warning" />
      </div>

      <div className="mt-6">
        <DataTable
          rows={mine}
          searchKeys={['title', 'subject', 'className']}
          searchPlaceholder="Search assignments…"
          filters={[
            { key: 'className', label: 'Class', options: teacher.classes },
            { key: 'status', label: 'Status', options: ['Open', 'Closed', 'Marking', 'Published'] },
          ]}
          columns={[
            { key: 'title', label: 'Assignment', render: (row) => <span className="font-medium">{row.title}</span> },
            { key: 'className', label: 'Class' },
            { key: 'section', label: 'Section' },
            { key: 'assignedOn', label: 'Set on' },
            { key: 'dueOn', label: 'Due' },
            { key: 'marks', label: 'Marks', align: 'right' },
            { key: 'submissions', label: 'Received', align: 'right', render: (row) => `${row.submissions} / ${row.expected}` },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          selectable={false}
          footerNote="Submissions are marked from the grading screen"
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Recent submissions</h2>
        <DataTable
          rows={related}
          searchKeys={['studentName', 'assignment']}
          searchPlaceholder="Search submissions…"
          filters={[{ key: 'status', label: 'Status', options: ['Submitted', 'Marked', 'Resubmit requested'] }]}
          pageSize={5}
          selectable={false}
          columns={[
            { key: 'studentName', label: 'Student' },
            { key: 'assignment', label: 'Assignment' },
            { key: 'submittedOn', label: 'Submitted' },
            { key: 'late', label: 'Timing', render: (row) => <StatusBadge value={row.late ? 'Late' : 'On time'} /> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          footerNote="Resubmissions are allowed only where the assignment permits them"
        />
      </div>

      <RecordDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Create an assignment"
        subtitle="Published to your assigned classes"
        footer={
          <>
            <button type="button" onClick={save} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Send className="h-4 w-4" /> Create and publish
            </button>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Cancel
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-muted-foreground">
            Title *
            <input value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} className={inputClass} placeholder="Trigonometry practice set" />
            {errors.title && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.title}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
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
              Due date *
              <input type="date" value={draft.dueOn} onChange={(event) => setDraft((prev) => ({ ...prev, dueOn: event.target.value }))} className={inputClass} />
              {errors.dueOn && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.dueOn}</span>}
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Marks
              <input value={draft.marks} onChange={(event) => setDraft((prev) => ({ ...prev, marks: Number(event.target.value) || 0 }))} className={inputClass} inputMode="numeric" />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
              Late submission rule
              <select value={draft.lateAllowed} onChange={(event) => setDraft((prev) => ({ ...prev, lateAllowed: event.target.value }))} className={inputClass}>
                {['Not allowed', 'Allowed with 10% deduction', 'Allowed with a note'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            Brief for students
            <textarea
              rows={4}
              value={draft.brief}
              onChange={(event) => setDraft((prev) => ({ ...prev, brief: event.target.value }))}
              className={textareaClass}
              placeholder="What to complete, how to present it and how it will be marked."
            />
          </label>
        </div>
      </RecordDrawer>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';