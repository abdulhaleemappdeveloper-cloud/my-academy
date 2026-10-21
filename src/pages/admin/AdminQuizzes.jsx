import { Link } from 'react-router-dom';
import { Plug, Sparkles } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

export default function AdminQuizzes() {
  const quizzes = useCollection('quizzes');
  const questions = useCollection('questions');
  const usage = useCollection('aiUsage');
  const providers = useCollection('aiProviders');
  const blueprints = useCollection('blueprints');

  const connected = providers.filter((p) => p.state === 'Connected');

  return (
    <div>
      <PageHeader
        title="Quizzes and AI tools"
        description="Quizzes across all classes with attempt statistics, plus the AI generation tools and their usage against the configured budget."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Quizzes and AI tools' }]}
        actions={
          <Link to="/admin/integrations" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
            <Plug className="h-4 w-4" /> Manage AI providers
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Quizzes" value={quizzes.length} hint={`${quizzes.filter((q) => q.status === 'Published').length} published`} />
        <StatCard label="AI generated" value={quizzes.filter((q) => q.generated === 'AI generated').length} hint="Reviewed before publication" icon={Sparkles} />
        <StatCard label="AI providers connected" value={connected.length} hint={connected.map((c) => c.name).join(', ') || 'None yet'} tone={connected.length ? 'brand' : 'warning'} />
        <StatCard label="Questions available" value={questions.length} hint={`${blueprints.length} paper blueprints`} />
      </div>

      <Tabs defaultValue="quizzes" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="quizzes">All quizzes</TabsTrigger>
          <TabsTrigger value="usage">AI usage and cost</TabsTrigger>
          <TabsTrigger value="governance">AI governance</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-4">
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
              { key: 'timeLimit', label: 'Time' },
              { key: 'attempts', label: 'Attempts', align: 'right' },
              { key: 'averageScore', label: 'Average', align: 'right', render: (row) => `${row.averageScore}%` },
              { key: 'createdBy', label: 'Created by' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Under review', 'Published', 'Closed'] }}
            footerNote="Answer keys are released only after the quiz window closes"
          />
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <DataTable
            rows={usage}
            searchKeys={['feature', 'provider', 'status']}
            searchPlaceholder="Search AI usage…"
            filters={[{ key: 'provider', label: 'Provider', options: [...new Set(usage.map((u) => u.provider))] }]}
            columns={[
              { key: 'feature', label: 'Feature', render: (row) => <span className="font-medium">{row.feature}</span> },
              { key: 'provider', label: 'Provider' },
              { key: 'requests', label: 'Requests', align: 'right' },
              { key: 'estimatedCost', label: 'Estimated cost', align: 'right' },
              { key: 'limit', label: 'Budget' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Costs are estimates from provider usage data, never invented figures"
          />
        </TabsContent>

        <TabsContent value="governance" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">AI governance</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Generated educational content is marked as AI-assisted and requires review before publication.',
                'Model and configuration are recorded for important generated outputs.',
                'Teachers and students can report an incorrect or inappropriate response.',
                'AI cannot change results, verify payments, admit students or alter permissions.',
                'Rate limits and usage budgets apply per role, and expensive features can be disabled.',
                'Uploaded documents are treated as untrusted content to protect against prompt injection.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Provider status</h2>
            <ul className="mt-4 space-y-3">
              {providers.map((provider) => (
                <li key={provider.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{provider.name}</span>
                    <span className="block text-xs text-muted-foreground">{provider.features}</span>
                  </span>
                  <StatusBadge value={provider.state} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              A provider is only shown as connected after a successful configuration test. Keys are stored server-side and
              are never returned to the browser.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}