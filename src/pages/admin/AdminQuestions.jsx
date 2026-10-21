import { useState } from 'react';
import { AlertTriangle, Copy, Sparkles } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { DIFFICULTY, QUESTION_TYPES } from '@/data/records';

export default function AdminQuestions() {
  const { account } = useSession();
  const questions = useCollection('questions');
  const blueprints = useCollection('blueprints');
  const { toast } = useToast();
  const [selected, setSelected] = useState(null);

  const decide = (row, status) => {
    patch('questions', row.id, { status });
    logAction({ actor: account?.name, role: account?.label, action: `Question ${status.toLowerCase()}`, module: 'Question bank', target: row.code });
    toast({ title: `Question ${status.toLowerCase()}`, description: 'Answer keys remain hidden from students until the release time.' });
    setSelected(null);
  };

  const duplicates = questions.filter((q) => questions.some((other) => other.id !== q.id && other.text.slice(0, 24) === q.text.slice(0, 24)));

  return (
    <div>
      <PageHeader
        title="Question bank management"
        description="The central question bank with difficulty, topic mapping, review status and usage. Answer keys are stored securely and never shown to students before release."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Question bank' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Questions" value={questions.length} hint="Across all classes and subjects" />
        <StatCard label="Approved" value={questions.filter((q) => q.status === 'Approved').length} hint="Usable in assessments" tone="brand" />
        <StatCard label="Awaiting review" value={questions.filter((q) => q.status === 'Draft' || q.status === 'Under review').length} hint="Checked before use in a paper" tone="warning" />
        <StatCard label="Possible duplicates" value={duplicates.length} hint="Flagged for review" tone={duplicates.length ? 'danger' : 'neutral'} icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="bank" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="bank">Question bank</TabsTrigger>
          <TabsTrigger value="blueprints">Paper blueprints</TabsTrigger>
          <TabsTrigger value="quality">Quality review</TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-4">
          <DataTable
            rows={questions}
            searchKeys={['code', 'text', 'subject', 'chapter', 'topic', 'author']}
            searchPlaceholder="Search questions by code, text, subject or chapter…"
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
              { key: 'className', label: 'Class' },
              { key: 'chapter', label: 'Chapter' },
              { key: 'type', label: 'Type' },
              { key: 'difficulty', label: 'Difficulty', render: (row) => <StatusBadge value={row.difficulty} /> },
              { key: 'marks', label: 'Marks', align: 'right' },
              { key: 'usage', label: 'Used', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Approved', 'Archived'] }}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
                Review
              </button>
            )}
            footerNote="Active examination questions stay confidential until the paper is completed"
          />
        </TabsContent>

        <TabsContent value="blueprints" className="mt-4">
          <DataTable
            rows={blueprints}
            searchKeys={['title', 'className', 'difficulty']}
            searchPlaceholder="Search blueprints…"
            filters={[{ key: 'status', label: 'Status', options: ['Draft', 'Approved', 'Used for paper'] }]}
            columns={[
              { key: 'title', label: 'Blueprint', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'className', label: 'Class' },
              { key: 'totalMarks', label: 'Marks', align: 'right' },
              { key: 'duration', label: 'Duration' },
              { key: 'mcq', label: 'MCQ section' },
              { key: 'shortAnswer', label: 'Short answers' },
              { key: 'longAnswer', label: 'Long answers' },
              { key: 'difficulty', label: 'Difficulty mix' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Blueprints define marks per topic and difficulty so papers stay comparable"
          />
        </TabsContent>

        <TabsContent value="quality" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Quality checks</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Questions with a missing answer key', questions.filter((q) => !q.answer).length],
                ['Questions with a missing explanation', questions.filter((q) => !q.explanation).length],
                ['Possible duplicates flagged', duplicates.length],
                ['Not used in any paper yet', questions.filter((q) => q.usage === 0).length],
                ['Marked for retirement', questions.filter((q) => q.status === 'Archived').length],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <StatusBadge value={String(value)} tone={value > 0 ? 'warning' : 'success'} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">AI-assisted review</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Generated questions are checked for required fields, answer references, mark totals and near-duplicates
              before they are stored. The reviewer remains responsible for accuracy — an AI check is a suggestion, never
              proof that a question is correct.
            </p>
            <button
              type="button"
              onClick={() => toast({ title: 'Review queued', description: 'A quality review will list findings as suggestions for the reviewer.' })}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" /> Run a quality review
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              {questions.filter((q) => q.author === 'AI assisted').length} questions were drafted with AI assistance.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.code}
        subtitle={selected ? `${selected.subject} · ${selected.className} · ${selected.chapter}` : ''}
        badge={selected?.status}
        rows={
          selected
            ? [
                { key: 'text', label: 'Question', value: selected.text },
                { key: 'type', label: 'Type', value: selected.type },
                { key: 'difficulty', label: 'Difficulty', value: selected.difficulty },
                { key: 'marks', label: 'Marks', value: selected.marks },
                { key: 'answer', label: 'Answer key (restricted)', value: selected.answer },
                { key: 'explanation', label: 'Marking guidance', value: selected.explanation },
                { key: 'usage', label: 'Used in papers', value: selected.usage },
                { key: 'author', label: 'Author', value: selected.author },
              ]
            : []
        }
        footer={
          <>
            <button type="button" onClick={() => decide(selected, 'Approved')} className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              Approve for use
            </button>
            <button type="button" onClick={() => decide(selected, 'Under review')} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Return to review
            </button>
            <button type="button" onClick={() => decide(selected, 'Archived')} className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              <Copy className="h-4 w-4" /> Retire question
            </button>
          </>
        }
      />
    </div>
  );
}