import { useState } from 'react';
import { MessageSquare, Send, TrendingUp, Wand2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function TeacherFeedback() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const students = useCollection('students');
  const feedback = useCollection('feedback');
  const reportCards = useCollection('reportCards');
  const providers = useCollection('aiProviders');
  const { toast } = useToast();

  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const myStudents = students.filter((row) => teacher.classes.includes(row.className));
  const provider = providers.find((row) => row.state === 'Connected');

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ studentName: '', subject: teacher.subject, term: 'First term', strengths: '', improvement: '', nextSteps: '' });
  const [errors, setErrors] = useState({});

  const draftWithAI = () => {
    if (!provider) {
      toast({
        title: 'No AI provider connected',
        description: 'Feedback drafting needs an AI provider. Write the feedback manually until one is connected.',
        variant: 'destructive',
      });
      return;
    }
    setDraft((prev) => ({
      ...prev,
      strengths: 'Consistent practice; written answers show clear working steps.',
      improvement: 'Numerical questions lose marks when units are omitted.',
      nextSteps: 'Complete the practice set for chapter 4 and revise the units rule before the next assessment.',
    }));
    toast({ title: 'Draft suggestions added', description: 'Edit them before sharing — generated text is never published automatically.' });
  };

  const save = () => {
    const next = {};
    if (!draft.studentName) next.studentName = 'Select the student.';
    if (draft.improvement.trim().length < 10) next.improvement = 'Describe the area for improvement.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const record = insert('feedback', {
      ...draft,
      className: myStudents.find((s) => s.name === draft.studentName)?.className || '—',
      teacher: teacher.name,
      status: 'Draft',
      sharedOn: '—',
    });
    logAction({ actor: teacher.name, role: 'Teacher', action: 'Recorded subject feedback', module: 'Feedback', target: record.studentName });
    toast({ title: 'Feedback saved as a draft', description: 'Share it with the student or guardian when you are ready.' });
    setOpen(false);
    setDraft({ ...draft, studentName: '', strengths: '', improvement: '', nextSteps: '' });
  };

  return (
    <div>
      <PageHeader
        title="Feedback and reports"
        description="Record structured feedback per subject and review the report cards generated for your classes."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Feedback and reports' }]}
        actions={
          <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
            <MessageSquare className="h-4 w-4" /> Write feedback
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Feedback records" value={feedback.length} hint="Across your classes" icon={MessageSquare} />
        <StatCard label="Shared" value={feedback.filter((f) => f.status !== 'Draft').length} hint="Visible to student or guardian" tone="brand" />
        <StatCard label="Drafts" value={feedback.filter((f) => f.status === 'Draft').length} hint="Not yet shared" tone="warning" />
        <StatCard label="Report cards" value={reportCards.length} hint="Generated for your classes" icon={TrendingUp} />
      </div>

      <Tabs defaultValue="feedback" className="mt-6">
        <TabsList>
          <TabsTrigger value="feedback">Subject feedback</TabsTrigger>
          <TabsTrigger value="reports">Report cards</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="mt-4">
          <DataTable
            rows={feedback}
            searchKeys={['studentName', 'subject', 'term']}
            searchPlaceholder="Search feedback…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(feedback.map((f) => f.subject))] },
              { key: 'status', label: 'Status', options: ['Draft', 'Shared with guardian', 'Shared with student and guardian'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'subject', label: 'Subject' },
              { key: 'term', label: 'Term' },
              { key: 'improvement', label: 'Area for improvement', render: (row) => <span className="line-clamp-1 text-xs text-muted-foreground">{row.improvement}</span> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'sharedOn', label: 'Shared' },
            ]}
            selectable={false}
            footerNote="Feedback is reviewed by you before it reaches a student or guardian"
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <DataTable
            rows={reportCards}
            searchKeys={['studentName', 'className', 'term']}
            searchPlaceholder="Search report cards…"
            filters={[{ key: 'status', label: 'Status', options: ['Draft', 'Awaiting approval', 'Approved', 'Published'] }]}
            columns={[
              { key: 'studentName', label: 'Student' },
              { key: 'className', label: 'Class' },
              { key: 'term', label: 'Term' },
              { key: 'percent', label: 'Percent', align: 'right', render: (row) => `${row.percent}%` },
              { key: 'grade', label: 'Grade' },
              { key: 'attendance', label: 'Attendance', align: 'right', render: (row) => `${row.attendance}%` },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Report cards are generated from verified marks only"
          />
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Write subject feedback"
        subtitle="Saved as a draft for your review"
        footer={
          <>
            <button type="button" onClick={draftWithAI} className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              <Wand2 className="h-4 w-4" /> Suggest wording
            </button>
            <button type="button" onClick={save} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Send className="h-4 w-4" /> Save feedback
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Student *
              <select value={draft.studentName} onChange={(event) => setDraft((prev) => ({ ...prev, studentName: event.target.value }))} className={inputClass}>
                <option value="">Select a student…</option>
                {myStudents.map((student) => (
                  <option key={student.id} value={student.name}>{student.name} · {student.className} {student.section}</option>
                ))}
              </select>
              {errors.studentName && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.studentName}</span>}
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Term
              <select value={draft.term} onChange={(event) => setDraft((prev) => ({ ...prev, term: event.target.value }))} className={inputClass}>
                {['First term', 'Second term'].map((term) => <option key={term}>{term}</option>)}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            What the student did well
            <textarea rows={2} value={draft.strengths} onChange={(event) => setDraft((prev) => ({ ...prev, strengths: event.target.value }))} className={textareaClass} />
          </label>

          <label className="block text-xs font-semibold text-muted-foreground">
            Area for improvement *
            <textarea rows={2} value={draft.improvement} onChange={(event) => setDraft((prev) => ({ ...prev, improvement: event.target.value }))} className={textareaClass} />
            {errors.improvement && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.improvement}</span>}
          </label>

          <label className="block text-xs font-semibold text-muted-foreground">
            Next steps
            <textarea rows={2} value={draft.nextSteps} onChange={(event) => setDraft((prev) => ({ ...prev, nextSteps: event.target.value }))} className={textareaClass} />
          </label>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Feedback describes work, not character. Avoid assumptions about a student's circumstances, motivation or
            ability, and keep the language specific and encouraging.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';