import { BookOpen, MessageSquare, Target, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function ParentProgress() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const mastery = useCollection('mastery');
  const paths = useCollection('learningPaths');
  const plans = useCollection('studyPlans');
  const feedback = useCollection('feedback');
  const results = useCollection('results');
  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));

  const childRows = (collection, child) =>
    collection.filter((row) => row.studentId === child.id || row.studentName === child.name || row.className === child.className);

  return (
    <div>
      <PageHeader
        title="Learning progress"
        description="Topic-level progress, teacher feedback and study plans for your children. Indicators guide a conversation with the teacher — they are never a formal grade or a fixed judgement."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Progress' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Children" value={children.length} hint={children.map((c) => c.name.split(' ')[0]).join(', ')} icon={TrendingUp} />
        <StatCard label="Topics secure" value={mastery.filter((m) => children.some((c) => c.id === m.studentId) && (m.level === 'Secure' || m.level === 'Mastered')).length} hint="Reviewed by teachers" tone="brand" icon={Target} />
        <StatCard label="Topics needing revision" value={mastery.filter((m) => children.some((c) => c.id === m.studentId) && (m.level === 'Emerging' || m.level === 'Developing')).length} hint="Revision material assigned" tone="warning" />
        <StatCard label="Teacher feedback" value={feedback.filter((f) => children.some((c) => c.name === f.studentName)).length} hint="Shared subject comments" icon={MessageSquare} />
      </div>

      <Tabs defaultValue="mastery" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="mastery">Topic mastery</TabsTrigger>
          <TabsTrigger value="feedback">Teacher feedback</TabsTrigger>
          <TabsTrigger value="plans">Study plans</TabsTrigger>
          <TabsTrigger value="paths">Learning paths</TabsTrigger>
        </TabsList>

        <TabsContent value="mastery" className="mt-4 space-y-8">
          {children.map((child) => (
            <section key={child.id}>
              <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {child.name} · {child.className}
              </h2>
              <DataTable
                rows={childRows(mastery, child)}
                searchKeys={['subject', 'topic', 'level', 'evidence']}
                searchPlaceholder="Search topics…"
                filters={[
                  { key: 'subject', label: 'Subject', options: [...new Set(mastery.map((m) => m.subject))] },
                  { key: 'level', label: 'Mastery', options: ['Emerging', 'Developing', 'Secure', 'Mastered'] },
                ]}
                pageSize={5}
                selectable={false}
                columns={[
                  { key: 'subject', label: 'Subject' },
                  { key: 'topic', label: 'Topic' },
                  { key: 'level', label: 'Mastery', render: (row) => <StatusBadge value={row.level} /> },
                  { key: 'evidence', label: 'Evidence' },
                  { key: 'reviewedBy', label: 'Reviewed by' },
                  { key: 'remediation', label: 'Support in place', render: (row) => <span className="text-xs text-muted-foreground">{row.remediation}</span> },
                ]}
                footerNote="Mastery is recorded from assessment evidence and teacher review"
              />
            </section>
          ))}
        </TabsContent>

        <TabsContent value="feedback" className="mt-4 grid gap-4 lg:grid-cols-2">
          {feedback.filter((f) => children.some((c) => c.name === f.studentName)).map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-sm font-bold text-foreground">{item.subject} · {item.teacher}</h2>
                <StatusBadge value={item.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.studentName} · {item.term}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Strengths</dt>
                  <dd className="mt-1 leading-relaxed text-muted-foreground">{item.strengths}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Area for improvement</dt>
                  <dd className="mt-1 leading-relaxed text-muted-foreground">{item.improvement}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Next steps</dt>
                  <dd className="mt-1 leading-relaxed text-muted-foreground">{item.nextSteps}</dd>
                </div>
              </dl>
            </article>
          ))}
          {feedback.filter((f) => children.some((c) => c.name === f.studentName)).length === 0 && (
            <p className="text-sm text-muted-foreground">No subject feedback has been shared yet this term.</p>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4 grid gap-4 lg:grid-cols-2">
          {plans.filter((p) => children.some((c) => c.name === p.student)).map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-heading text-sm font-bold text-foreground">{plan.title}</h2>
                <StatusBadge value={plan.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {plan.student} · {plan.weeks} weeks · {plan.hoursPerWeek} hours per week · set by {plan.createdBy}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand" style={{ width: `${plan.progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{plan.progress}% complete · next milestone {plan.nextMilestone}</p>
            </article>
          ))}
          {plans.filter((p) => children.some((c) => c.name === p.student)).length === 0 && (
            <p className="text-sm text-muted-foreground">No study plan is assigned at the moment.</p>
          )}
        </TabsContent>

        <TabsContent value="paths" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.filter((p) => children.some((c) => c.className === p.className)).map((path) => (
            <article key={path.id} className="rounded-2xl border border-border bg-card p-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint text-primary">
                <BookOpen className="h-4 w-4" />
              </span>
              <h2 className="mt-3 font-heading text-sm font-bold text-foreground">{path.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{path.subject} · {path.steps} steps</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.round((path.completed / path.steps) * 100)}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{path.completed} of {path.steps} steps complete</p>
            </article>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">How to read this page</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Progress shown here is based on {results.filter((r) => children.some((c) => c.id === r.studentId)).length} assessment
          records and teacher reviews. Recommendations are study support, not official grades. If you would like to discuss
          any of it, book a meeting with the subject teacher from the meetings screen.
        </p>
      </div>
    </div>
  );
}