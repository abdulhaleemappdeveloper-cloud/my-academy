import { useState } from 'react';
import { Database, Plus, Sparkles } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import RecordDrawer from '@/components/common/RecordDrawer';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { QUESTION_TYPES, DIFFICULTY } from '@/data/records';

export default function TeacherQuestions() {
  const { account } = useSession();
  const questions = useCollection('questions');
  const subjects = useCollection('subjects');
  const blueprints = useCollection('blueprints');
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ text: '', subject: 'Mathematics', className: 'Class 9', type: QUESTION_TYPES[0], difficulty: 'Medium', marks: 2, chapter: '', answer: '' });
  const [errors, setErrors] = useState({});

  const save = () => {
    const next = {};
    if (draft.text.trim().length < 10) next.text = 'Write the full question (at least 10 characters).';
    if (!draft.answer.trim()) next.answer = 'Enter the model answer or marking guidance.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const record = insert('questions', {
      ...draft,
      code: `Q-${draft.subject.slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      topic: draft.chapter || 'General',
      language: 'English',
      curriculum: 'Punjab Board',
      explanation: 'Marking guidance recorded with the question.',
      status: 'Draft',
      usage: 0,
      author: account?.name,
      updated: new Date().toISOString().slice(0, 10),
    });
    logAction({ actor: account?.name, role: 'Teacher', action: 'Created question', module: 'Question bank', target: record.code });
    toast({ title: 'Question added to the bank', description: 'It stays in draft until an authorised reviewer approves it.' });
    setOpen(false);
    setDraft({ ...draft, text: '', answer: '', chapter: '' });
  };

  return (
    <div>
      <PageHeader
        title="Question bank"
        description="Reusable questions tagged by class, subject, chapter, difficulty and type. Answer keys stay hidden from students until the release time."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Question bank' }]}
        actions={
          <>
            <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> Add question
            </button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Questions in bank" value={questions.length} hint="Across classes and subjects" icon={Database} />
        <StatCard label="Approved" value={questions.filter((q) => q.status === 'Approved').length} hint="Usable in assessments" tone="brand" />
        <StatCard label="Awaiting review" value={questions.filter((q) => q.status === 'Under review' || q.status === 'Draft').length} hint="Reviewed before use in exams" tone="warning" />
        <StatCard label="Blueprints" value={blueprints.length} hint="Paper structure templates" icon={Sparkles} />
      </div>

      <div className="mt-6">
        <DataTable
          rows={questions}
          searchKeys={['text', 'code', 'subject', 'chapter', 'topic']}
          searchPlaceholder="Search questions…"
          filters={[
            { key: 'subject', label: 'Subject', options: [...new Set(questions.map((q) => q.subject))] },
            { key: 'type', label: 'Type', options: QUESTION_TYPES },
            { key: 'difficulty', label: 'Difficulty', options: DIFFICULTY },
            { key: 'status', label: 'Status', options: ['Draft', 'Under review', 'Approved', 'Archived'] },
          ]}
          columns={[
            { key: 'code', label: 'Code' },
            { key: 'text', label: 'Question', render: (row) => <span className="line-clamp-1">{row.text}</span> },
            { key: 'subject', label: 'Subject' },
            { key: 'type', label: 'Type' },
            { key: 'difficulty', label: 'Difficulty', render: (row) => <StatusBadge value={row.difficulty} /> },
            { key: 'marks', label: 'Marks', align: 'right' },
            { key: 'usage', label: 'Used', align: 'right' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          selectable={false}
          footerNote="Answer keys are never shown to students before the configured release"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blueprints.map((blueprint) => (
          <article key={blueprint.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-heading text-sm font-bold text-foreground">{blueprint.title}</h2>
              <StatusBadge value={blueprint.status} />
            </div>
            <dl className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Total marks</dt><dd className="font-semibold text-foreground">{blueprint.totalMarks}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Duration</dt><dd className="font-semibold text-foreground">{blueprint.duration}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">MCQ</dt><dd className="font-semibold text-foreground">{blueprint.mcq}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Short</dt><dd className="font-semibold text-foreground">{blueprint.shortAnswer}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Long</dt><dd className="font-semibold text-foreground">{blueprint.longAnswer}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">{blueprint.difficulty}</p>
          </article>
        ))}
      </div>

      <RecordDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Add a question"
        subtitle="Saved as a draft until approved"
        footer={
          <>
            <button type="button" onClick={save} className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              Save question
            </button>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Cancel
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-muted-foreground">
            Question text *
            <textarea
              rows={3}
              value={draft.text}
              onChange={(event) => setDraft((prev) => ({ ...prev, text: event.target.value }))}
              className={textareaClass}
              placeholder="Write the full question including any data the student needs."
            />
            {errors.text && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.text}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Subject
              <select value={draft.subject} onChange={(event) => setDraft((prev) => ({ ...prev, subject: event.target.value }))} className={inputClass}>
                {subjects.map((subject) => <option key={subject.id}>{subject.name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Class
              <select value={draft.className} onChange={(event) => setDraft((prev) => ({ ...prev, className: event.target.value }))} className={inputClass}>
                {['Class 7', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Question type
              <select value={draft.type} onChange={(event) => setDraft((prev) => ({ ...prev, type: event.target.value }))} className={inputClass}>
                {QUESTION_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Difficulty
              <select value={draft.difficulty} onChange={(event) => setDraft((prev) => ({ ...prev, difficulty: event.target.value }))} className={inputClass}>
                {DIFFICULTY.map((level) => <option key={level}>{level}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Chapter or topic
              <input value={draft.chapter} onChange={(event) => setDraft((prev) => ({ ...prev, chapter: event.target.value }))} className={inputClass} placeholder="Chapter 4 · Trigonometry" />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Marks
              <input value={draft.marks} onChange={(event) => setDraft((prev) => ({ ...prev, marks: Number(event.target.value) || 1 }))} className={inputClass} inputMode="numeric" />
            </label>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            Answer key and marking guidance *
            <textarea
              rows={3}
              value={draft.answer}
              onChange={(event) => setDraft((prev) => ({ ...prev, answer: event.target.value }))}
              className={textareaClass}
              placeholder="Expected steps and marks awarded per step."
            />
            {errors.answer && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.answer}</span>}
          </label>
        </div>
      </RecordDrawer>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';