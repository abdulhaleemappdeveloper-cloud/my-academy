import { ClipboardList, Sparkles, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function TeacherQuizzes() {
  const { account } = useSession();
  const quizzes = useCollection('quizzes');
  const { toast } = useToast();

  const setStatus = (quiz, status) => {
    patch('quizzes', quiz.id, { status });
    logAction({ actor: account?.name, role: 'Teacher', action: `Quiz ${status.toLowerCase()}`, module: 'Quizzes', target: quiz.title });
    toast({ title: `Quiz ${status.toLowerCase()}`, description: `${quiz.title} was updated and the change was recorded.` });
  };

  return (
    <div>
      <PageHeader
        title="Quizzes"
        description="Publish reviewed quizzes, close them when the window ends and review attempt statistics for your classes."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Quizzes' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My quizzes" value={quizzes.length} hint="Draft, review, published and closed" icon={ClipboardList} />
        <StatCard label="Published" value={quizzes.filter((q) => q.status === 'Published').length} hint="Open to students" tone="brand" />
        <StatCard label="Awaiting review" value={quizzes.filter((q) => q.status === 'Under review').length} hint="Approved by the academic office" tone="warning" />
        <StatCard label="AI generated" value={quizzes.filter((q) => q.generated === 'AI generated').length} hint="Reviewed before publication" icon={Sparkles} />
      </div>

      <div className="mt-6">
        <DataTable
          rows={quizzes}
          searchKeys={['title', 'subject', 'className', 'createdBy']}
          searchPlaceholder="Search quizzes…"
          filters={[
            { key: 'subject', label: 'Subject', options: [...new Set(quizzes.map((q) => q.subject))] },
            { key: 'status', label: 'Status', options: ['Draft', 'Under review', 'Published', 'Closed'] },
            { key: 'generated', label: 'Source', options: ['AI generated', 'Teacher authored'] },
          ]}
          columns={[
            { key: 'title', label: 'Quiz', render: (row) => <span className="font-medium">{row.title}</span> },
            { key: 'subject', label: 'Subject' },
            { key: 'className', label: 'Class' },
            { key: 'questions', label: 'Questions', align: 'right' },
            { key: 'marks', label: 'Marks', align: 'right' },
            { key: 'attempts', label: 'Attempts', align: 'right' },
            { key: 'averageScore', label: 'Average', align: 'right', render: (row) => `${row.averageScore}%` },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          selectable
          bulkStatus={{ key: 'status', options: ['Draft', 'Under review', 'Published', 'Closed'] }}
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              {row.status !== 'Published' && (
                <button type="button" onClick={() => setStatus(row, 'Published')} className="text-xs font-semibold text-primary hover:underline">
                  Publish
                </button>
              )}
              {row.status === 'Published' && (
                <button type="button" onClick={() => setStatus(row, 'Closed')} className="text-xs font-semibold text-muted-foreground hover:underline">
                  Close
                </button>
              )}
            </div>
          )}
          footerNote="Attempt limits and time limits apply to every published quiz"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-cream p-5">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">
            <Users className="h-4 w-4 text-primary" /> Attempt summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Objective questions are marked automatically and stored on the server. Written answers appear in the marking
            queue. Different papers keep comparable difficulty and total marks so results stay fair.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Answer release</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Correct answers are released only after the quiz window closes. Students never receive answer keys through
            the interface before that point.
          </p>
        </div>
      </div>
    </div>
  );
}