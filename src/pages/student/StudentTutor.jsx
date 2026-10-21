import { useState } from 'react';
import { AlertTriangle, BookOpen, Send, Sparkles, Timer } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const PROMPTS = [
  'Explain quadratic equations in simple steps',
  'Give me three practice questions on Newton\'s laws',
  'Summarise the periodic table trends for revision',
  'Help me understand the difference between an atom and an ion',
];

export default function StudentTutor() {
  const { account } = useSession();
  const students = useCollection('students');
  const providers = useCollection('aiProviders');
  const usage = useCollection('aiUsage');
  const student = students.find((s) => s.name === account?.name) || students[9];
  const provider = providers.find((row) => row.state === 'Connected');

  const [thread, setThread] = useState([
    { role: 'tutor', text: `Hello ${student.name.split(' ')[0]}. Ask about any topic from ${student.className} and I will explain it step by step. I will not do your assignments for you.` },
  ]);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    const question = draft.trim();
    setThread((prev) => [
      ...prev,
      { role: 'student', text: question },
      {
        role: 'system',
        text: provider
          ? 'The AI provider is connected, so answers are generated and recorded against your daily usage limit.'
          : 'No AI provider is connected yet, so an answer could not be generated. Your question has been saved and shared with your subject teacher, who can respond in class.',
      },
    ]);
    setDraft('');
  };

  return (
    <div>
      <PageHeader
        title="AI study tutor"
        description="Ask for explanations, hints and practice questions for your class. The tutor explains concepts — it does not complete graded work for you."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'AI tutor' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Provider" value={provider?.name || 'Not connected'} hint={provider ? 'Answers are generated live' : 'Question routed to your teacher'} tone={provider ? 'brand' : 'warning'} icon={Sparkles} />
        <StatCard label="Daily limit" value="20 questions" hint="Set by the academic office" icon={Timer} />
        <StatCard label="Used today" value={`${thread.filter((t) => t.role === 'student').length} of 20`} hint="Resets at midnight" />
        <StatCard label="Subject focus" value={student.className} hint="Class-level difficulty applied" />
      </div>

      {!provider && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            The academy has not connected an AI provider yet, so generated answers are unavailable. Your questions are
            still recorded and shared with your subject teacher. The tutor is also disabled during examinations.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex h-[560px] flex-col rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-sm font-bold tracking-tight">Conversation</h2>
            <span className="ml-auto text-xs text-muted-foreground">History kept for 90 days</span>
          </div>

          <div className="ta-scroll flex-1 space-y-3 overflow-y-auto p-5">
            {thread.map((entry, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  entry.role === 'student'
                    ? 'ml-auto bg-brand text-primary-foreground'
                    : entry.role === 'system'
                    ? 'border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200'
                    : 'border border-border bg-background text-foreground'
                }`}
              >
                {entry.text}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') send(); }}
                placeholder="Ask about a topic, or request a hint…"
                aria-label="Ask the tutor a question"
                className="h-11 flex-1 rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary/50"
              />
              <button
                type="button"
                onClick={send}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
              >
                <Send className="h-4 w-4" /> Ask
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Do not paste private information into the tutor. Answers are study support and may contain mistakes — always
              check against your approved course notes.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Try asking</h2>
            <ul className="mt-4 space-y-2">
              {PROMPTS.map((prompt) => (
                <li key={prompt}>
                  <button
                    type="button"
                    onClick={() => setDraft(prompt)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/40"
                  >
                    {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">How the tutor is used</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Explains a concept with a worked example rather than giving the final answer.',
                'Offers a hint first and reveals a full method only when you ask again.',
                'Uses the difficulty level of your class and the approved curriculum.',
                'Is disabled during graded assessments so it cannot be used to answer an exam paper.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Usage this month</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {usage.slice(0, 4).map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{row.feature}</span>
                  <StatusBadge value={row.status} />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}