import { useState } from 'react';
import { CheckCircle2, Clock, FileText, Upload } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function StudentAssignments() {
  const { account } = useSession();
  const students = useCollection('students');
  const assignments = useCollection('assignments');
  const submissions = useCollection('submissions');
  const student = students.find((s) => s.name === account?.name) || students[9];
  const { toast } = useToast();

  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState(null);

  const myAssignments = assignments.filter((row) => row.className === student.className);
  const mySubmissions = submissions.filter((row) => row.studentId === student.id);

  const submit = () => {
    if (!answer.trim() && !file) {
      toast({
        title: 'Nothing to submit yet',
        description: 'Write your answer or attach a file before submitting.',
        variant: 'destructive',
      });
      return;
    }
    const record = insert('submissions', {
      assignmentId: selected?.id,
      assignment: selected?.title,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      submittedOn: new Date().toISOString().slice(0, 10),
      late: false,
      type: file ? 'File + written' : 'Written answer',
      marks: '—',
      outOf: selected?.marks,
      status: 'Submitted',
      feedback: 'Awaiting marking.',
    });
    logAction({
      actor: student.name,
      role: 'Student',
      action: 'Submitted assignment',
      module: 'Assignments',
      target: selected?.title,
    });
    toast({ title: 'Submission recorded', description: `${record.assignment} was submitted for marking.` });
    setAnswer('');
    setFile(null);
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Assignments"
        description="Tasks set by your subject teachers, with submission, deadlines and feedback in one place."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Assignments' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open assignments" value={myAssignments.filter((a) => a.status === 'Open').length} hint="Submit before the due date" icon={FileText} />
        <StatCard label="Submitted" value={mySubmissions.length} hint="Recorded this term" tone="brand" icon={CheckCircle2} />
        <StatCard label="Awaiting marks" value={mySubmissions.filter((s) => s.status === 'Submitted').length} hint="Being marked by teachers" tone="warning" />
        <StatCard label="Marked" value={mySubmissions.filter((s) => s.status === 'Marked').length} hint="Feedback available" icon={CheckCircle2} />
      </div>

      <Tabs defaultValue="todo" className="mt-6">
        <TabsList>
          <TabsTrigger value="todo">To submit</TabsTrigger>
          <TabsTrigger value="submitted">My submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="todo" className="mt-4">
          <DataTable
            rows={myAssignments}
            searchKeys={['title', 'subject', 'teacher']}
            searchPlaceholder="Search assignments…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(myAssignments.map((a) => a.subject))] },
              { key: 'status', label: 'Status', options: ['Open', 'Closed', 'Marking', 'Published'] },
            ]}
            columns={[
              { key: 'title', label: 'Assignment', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'subject', label: 'Subject' },
              { key: 'teacher', label: 'Teacher' },
              { key: 'dueOn', label: 'Due' },
              { key: 'marks', label: 'Marks', align: 'right' },
              { key: 'lateAllowed', label: 'Late work' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            rowActions={(row) => (
              <button
                type="button"
                onClick={() => setSelected(row)}
                disabled={row.status !== 'Open'}
                className="text-xs font-semibold text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
              >
                {row.status === 'Open' ? 'Submit' : 'Closed'}
              </button>
            )}
          />
        </TabsContent>

        <TabsContent value="submitted" className="mt-4">
          <DataTable
            rows={mySubmissions}
            searchKeys={['assignment', 'className']}
            searchPlaceholder="Search your submissions…"
            filters={[{ key: 'status', label: 'Status', options: ['Submitted', 'Marked', 'Resubmit requested'] }]}
            columns={[
              { key: 'assignment', label: 'Assignment', render: (row) => <span className="font-medium">{row.assignment}</span> },
              { key: 'type', label: 'Submitted as' },
              { key: 'submittedOn', label: 'Submitted on' },
              { key: 'marks', label: 'Marks', align: 'right', render: (row) => (row.marks === '—' ? '—' : `${row.marks} / ${row.outOf}`) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected({ ...row, readOnly: true })}
            rowActions={(row) => (
              <button type="button" onClick={() => setSelected({ ...row, readOnly: true })} className="text-xs font-semibold text-primary hover:underline">
                View feedback
              </button>
            )}
          />
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title || selected?.assignment}
        subtitle={selected?.subject ? `${selected.subject} · ${selected.teacher}` : selected?.className}
        badge={selected?.status}
        footer={
          selected?.readOnly ? (
            <p className="text-xs text-muted-foreground">Feedback is published by your teacher and cannot be edited here.</p>
          ) : (
            <>
              <button type="button" onClick={submit} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                <CheckCircle2 className="h-4 w-4" /> Submit assignment
              </button>
              <button type="button" onClick={() => setSelected(null)} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
                Cancel
              </button>
            </>
          )
        }
      >
        {selected?.readOnly ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Teacher feedback</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.feedback}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Marks</p>
              <p className="mt-1.5 font-display text-xl font-semibold text-foreground">
                {selected.marks === '—' ? 'Awaiting marking' : `${selected.marks} / ${selected.outOf}`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Brief</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Complete the questions from the current chapter. Show your working steps — marks are awarded for method
                as well as the final answer.
              </p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due {selected?.dueOn}</span>
                <span>{selected?.marks} marks</span>
                <span>{selected?.lateAllowed}</span>
              </p>
            </div>

            <label className="block text-xs font-semibold text-muted-foreground">
              Written answer
              <textarea
                rows={5}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your answer here, or attach a file below."
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
              />
            </label>

            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">{file ? file.name : 'Attach a file (PDF, image or document)'}</span>
              <span className="text-xs text-muted-foreground">Maximum 10 MB. Files are stored privately.</span>
              <input
                type="file"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>
          </div>
        )}
      </RecordDrawer>
    </div>
  );
}