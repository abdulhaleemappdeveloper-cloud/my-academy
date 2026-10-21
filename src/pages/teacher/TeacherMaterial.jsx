import { useState } from 'react';
import { CheckCircle2, FileText, Send, Upload } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const TYPES = ['Text notes', 'PDF notes', 'Revision notes', 'Worksheet', 'Practice questions', 'Chapter summary', 'Solved examples', 'Flashcards'];

export default function TeacherMaterial() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const notes = useCollection('notes');
  const lessons = useCollection('lessons');
  const papers = useCollection('papers');
  const chapters = useCollection('chapters');
  const subjects = useCollection('subjects');
  const lessonPlans = useCollection('lessonPlans');
  const { toast } = useToast();

  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const mySubjects = subjects.filter((row) => row.teachers.includes(teacher.name));
  const myNotes = notes.filter((row) => row.author === teacher.name);
  const myPapers = papers.filter((row) => row.uploadedBy === teacher.name);
  const myPlans = lessonPlans.filter((row) => row.teacher === teacher.name);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', subject: teacher.subject, className: teacher.classes[0], chapter: '', type: TYPES[0] });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const save = () => {
    const next = {};
    if (!draft.title.trim()) next.title = 'Enter a title for the material.';
    if (!draft.className) next.className = 'Select the class this material is for.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const record = insert('notes', {
      ...draft,
      pages: 6,
      downloads: 0,
      author: teacher.name,
      status: 'In review',
      visibility: 'Students and staff',
      updated: new Date().toISOString().slice(0, 10),
      summary: 'Submitted by the subject teacher and awaiting academic review before publication.',
    });
    logAction({
      actor: teacher.name,
      role: 'Teacher',
      action: 'Submitted learning material',
      module: 'Content',
      target: record.title,
      reason: 'Awaiting review',
    });
    toast({
      title: 'Material submitted for review',
      description: 'The academic office reviews new material before students can open it.',
    });
    setOpen(false);
    setDraft({ title: '', subject: teacher.subject, className: teacher.classes[0], chapter: '', type: TYPES[0] });
    setFile(null);
  };

  return (
    <div>
      <PageHeader
        title="Course material"
        description="Create notes, worksheets and lesson plans for your assigned subjects. New material is submitted for review before students can open it."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Course material' }]}
        actions={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
          >
            <Upload className="h-4 w-4" /> Add material
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My notes" value={myNotes.length} hint="Drafts, reviews and published" icon={FileText} />
        <StatCard label="Published" value={myNotes.filter((n) => n.status === 'Published').length} hint="Visible to students" tone="brand" icon={CheckCircle2} />
        <StatCard label="Awaiting review" value={myNotes.filter((n) => n.status === 'In review').length} hint="Checked by the academic office" tone="warning" />
        <StatCard label="Papers uploaded" value={myPapers.length} hint="Past, solved and sample" />
      </div>

      <Tabs defaultValue="notes" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="notes">Notes and worksheets</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="chapters">Chapters and topics</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="plans">Lesson plans</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4">
          <DataTable
            rows={myNotes}
            searchKeys={['title', 'subject', 'className', 'type']}
            searchPlaceholder="Search your material…"
            filters={[
              { key: 'status', label: 'Status', options: ['Draft', 'In review', 'Approved', 'Published', 'Archived'] },
              { key: 'type', label: 'Type', options: TYPES },
            ]}
            columns={[
              { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'subject', label: 'Subject' },
              { key: 'className', label: 'Class' },
              { key: 'type', label: 'Type' },
              { key: 'downloads', label: 'Downloads', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Teachers may edit their own material until it is published"
          />
        </TabsContent>

        <TabsContent value="lessons" className="mt-4">
          <DataTable
            rows={lessons.filter((row) => row.author === teacher.name || teacher.classes.includes(row.className))}
            searchKeys={['title', 'subject', 'chapter', 'type']}
            searchPlaceholder="Search lessons…"
            filters={[{ key: 'status', label: 'Status', options: ['Draft', 'In review', 'Published'] }]}
            columns={[
              { key: 'title', label: 'Lesson', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'className', label: 'Class' },
              { key: 'chapter', label: 'Chapter' },
              { key: 'type', label: 'Type' },
              { key: 'duration', label: 'Duration' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
        </TabsContent>

        <TabsContent value="chapters" className="mt-4">
          <DataTable
            rows={chapters.filter((row) => mySubjects.some((s) => s.name === row.subject))}
            searchKeys={['title', 'subject', 'className']}
            searchPlaceholder="Search chapters…"
            filters={[{ key: 'className', label: 'Class', options: teacher.classes }]}
            columns={[
              { key: 'title', label: 'Chapter', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'className', label: 'Class' },
              { key: 'topics', label: 'Topics', align: 'right' },
              { key: 'materials', label: 'Materials', align: 'right' },
              { key: 'covered', label: 'Covered', render: (row) => <StatusBadge value={row.covered ? 'Covered' : 'Not covered'} /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Marking a chapter as covered records that teaching took place"
          />
        </TabsContent>

        <TabsContent value="papers" className="mt-4">
          <DataTable
            rows={myPapers}
            searchKeys={['title', 'subject', 'className']}
            searchPlaceholder="Search papers…"
            filters={[{ key: 'type', label: 'Type', options: ['Past paper', 'Solved paper', 'Sample paper'] }]}
            columns={[
              { key: 'title', label: 'Paper', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'type', label: 'Type' },
              { key: 'className', label: 'Class' },
              { key: 'marks', label: 'Marks', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
        </TabsContent>

        <TabsContent value="plans" className="mt-4 grid gap-4 lg:grid-cols-2">
          {myPlans.map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{plan.title}</h2>
                <StatusBadge value={plan.status} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{plan.className} · {plan.subject} · updated {plan.updated}</p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Objectives</dt><dd className="font-semibold text-foreground">{plan.objectives}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Main activity</dt><dd className="text-right font-semibold text-foreground">{plan.activities}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Resources</dt><dd className="text-right font-semibold text-foreground">{plan.resources}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Observation</dt><dd className="font-semibold text-foreground">{plan.observation}</dd></div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Homework: {plan.homework}</p>
            </article>
          ))}
          {myPlans.length === 0 && (
            <p className="text-sm text-muted-foreground">No lesson plans created yet. Plans can be added from the lesson planner.</p>
          )}
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Add learning material"
        subtitle="Submitted for academic review before publication"
        footer={
          <>
            <button type="button" onClick={save} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Send className="h-4 w-4" /> Submit for review
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
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              className={inputClass}
              placeholder="For example: Trigonometry revision sheet"
            />
            {errors.title && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.title}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Subject
              <select value={draft.subject} onChange={(event) => setDraft((prev) => ({ ...prev, subject: event.target.value }))} className={inputClass}>
                {mySubjects.map((subject) => <option key={subject.id}>{subject.name}</option>)}
                {!mySubjects.length && <option>{teacher.subject}</option>}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Class *
              <select value={draft.className} onChange={(event) => setDraft((prev) => ({ ...prev, className: event.target.value }))} className={inputClass}>
                {teacher.classes.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Chapter
              <input value={draft.chapter} onChange={(event) => setDraft((prev) => ({ ...prev, chapter: event.target.value }))} className={inputClass} placeholder="Chapter 4 · Trigonometry" />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Content type
              <select value={draft.type} onChange={(event) => setDraft((prev) => ({ ...prev, type: event.target.value }))} className={inputClass}>
                {TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
          </div>

          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center">
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{file ? file.name : 'Attach the document or media file'}</span>
            <span className="text-xs text-muted-foreground">PDF, image, audio or video. Stored privately until published.</span>
            <input type="file" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Material you submit stays in review until the academic office approves it. You can edit it while it is in
            review, and rejected material returns with the reviewer's reason.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';