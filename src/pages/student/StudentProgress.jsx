import { useState } from 'react';
import { BookOpen, Layers, Target, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function StudentProgress() {
  const { account } = useSession();
  const students = useCollection('students');
  const mastery = useCollection('mastery');
  const paths = useCollection('learningPaths');
  const plans = useCollection('studyPlans');
  const flashcards = useCollection('flashcards');
  const student = students.find((s) => s.name === account?.name) || students[9];

  const mine = mastery.filter((row) => row.studentId === student.id || row.className === student.className);
  const [deck, setDeck] = useState(flashcards[0]?.deck || '');
  const [flipped, setFlipped] = useState({});

  const secure = mine.filter((row) => row.level === 'Secure' || row.level === 'Mastered').length;
  const needsWork = mine.filter((row) => row.level === 'Emerging' || row.level === 'Developing').length;
  const deckCards = flashcards.filter((card) => card.deck === deck);

  return (
    <div>
      <PageHeader
        title="Progress and mastery"
        description="Topic-level mastery based on assessment evidence and teacher review, plus the learning path and study plan assigned to you."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Progress' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Topics secure" value={secure} hint="Secure or mastered after review" tone="brand" icon={TrendingUp} />
        <StatCard label="Needs more work" value={needsWork} hint="Revision material assigned" tone="warning" />
        <StatCard label="Learning path steps" value={paths[0]?.steps || 0} hint={`${paths[0]?.completed || 0} completed`} icon={Target} />
        <StatCard label="Flashcard decks" value={new Set(flashcards.map((c) => c.deck)).size} hint="Revise a deck at a time" icon={Layers} />
      </div>

      <Tabs defaultValue="mastery" className="mt-6">
        <TabsList>
          <TabsTrigger value="mastery">Mastery by topic</TabsTrigger>
          <TabsTrigger value="path">Learning path</TabsTrigger>
          <TabsTrigger value="plans">Study plans</TabsTrigger>
          <TabsTrigger value="cards">Flashcards</TabsTrigger>
        </TabsList>

        <TabsContent value="mastery" className="mt-4">
          <DataTable
            rows={mine}
            searchKeys={['subject', 'topic', 'level', 'evidence']}
            searchPlaceholder="Search topics…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(mine.map((m) => m.subject))] },
              { key: 'level', label: 'Mastery', options: ['Emerging', 'Developing', 'Secure', 'Mastered'] },
            ]}
            columns={[
              { key: 'subject', label: 'Subject', render: (row) => <span className="font-medium">{row.subject}</span> },
              { key: 'topic', label: 'Topic' },
              { key: 'level', label: 'Mastery', render: (row) => <StatusBadge value={row.level} /> },
              { key: 'evidence', label: 'Evidence' },
              { key: 'reviewedBy', label: 'Reviewed by' },
              { key: 'reviewedOn', label: 'Reviewed' },
            ]}
            selectable={false}
            footerNote="Mastery levels are set by teachers after reviewing assessment evidence"
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Mastery is recorded with transparent rules and reviewed by teachers. It is a learning guide, not a formal
            grade and never a fixed judgement about ability.
          </p>
        </TabsContent>

        <TabsContent value="path" className="mt-4 space-y-4">
          {paths.map((path) => {
            const percent = Math.round((path.completed / path.steps) * 100);
            return (
              <div key={path.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{path.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{path.subject} · {path.className} · {path.prerequisites} prerequisite topic(s)</p>
                  </div>
                  <StatusBadge value={path.status} />
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{path.completed} of {path.steps} steps complete</span>
                    <span className="font-semibold text-foreground">{percent}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
                  </div>
                </div>
                <ol className="mt-5 space-y-2.5">
                  {Array.from({ length: path.steps }, (_, index) => (
                    <li key={index} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold ${index < path.completed ? 'bg-brand text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground">Step {index + 1}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{index < path.completed ? 'Completed' : 'Next'}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="plans" className="mt-4 grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{plan.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {plan.weeks} weeks · {plan.hoursPerWeek} hours per week · set by {plan.createdBy}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand" style={{ width: `${plan.progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {plan.progress}% complete · next milestone {plan.nextMilestone}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <StatusBadge value={plan.status} />
                <span className="text-xs text-muted-foreground">You can ask your teacher to adjust this plan.</span>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="cards" className="mt-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Deck</span>
            <select
              value={deck}
              onChange={(event) => { setDeck(event.target.value); setFlipped({}); }}
              className="h-9 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none"
            >
              {[...new Set(flashcards.map((c) => c.deck))].map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">{deckCards.length} cards</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deckCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setFlipped((prev) => ({ ...prev, [card.id]: !prev[card.id] }))}
                className="flex h-40 flex-col justify-between rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40"
              >
                <div>
                  <StatusBadge value={card.mastered} />
                  <p className="mt-3 text-sm font-medium text-foreground">{card.front}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {flipped[card.id] ? card.back : 'Tap to reveal the answer'}
                </p>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}