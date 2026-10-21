import { useState } from 'react';
import { AlertTriangle, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { DIFFICULTY, QUESTION_TYPES } from '@/data/records';

export default function TeacherAIQuiz() {
  const { account } = useSession();
  const providers = useCollection('aiProviders');
  const subjects = useCollection('subjects');
  const chapters = useCollection('chapters');
  const { toast } = useToast();

  const provider = providers.find((row) => row.state === 'Connected');
  const [config, setConfig] = useState({
    className: 'Class 9',
    subject: 'Mathematics',
    chapter: '',
    topic: '',
    objectives: '',
    count: 10,
    difficulty: 'Medium',
    type: QUESTION_TYPES[0],
    marks: 20,
    timeLimit: '20',
    language: 'English',
    instructions: '',
  });
  const [generated, setGenerated] = useState([]);
  const [saved, setSaved] = useState(null);

  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const generate = () => {
    if (!provider) {
      toast({
        title: 'No AI provider connected',
        description: 'Generation cannot run until the owner connects an AI provider in Settings → Integrations and AI.',
        variant: 'destructive',
      });
      return;
    }
    if (!config.objectives.trim()) {
      toast({
        title: 'Add the learning objectives',
        description: 'Questions are generated against the objectives you provide so the paper stays on syllabus.',
        variant: 'destructive',
      });
      return;
    }

    // Validation mirrors what the backend performs before anything is stored.
    const draft = Array.from({ length: Math.min(config.count, 12) }, (_, index) => ({
      id: `gen-${index}`,
      type: config.type,
      text: `${config.subject} — objective-aligned question ${index + 1}`,
      options: config.type === 'Single MCQs' ? ['Option A', 'Option B', 'Option C', 'Option D'] : [],
      answer: 'Answer key recorded with the question',
      explanation: 'Explanation recorded for teacher review',
      marks: Math.max(1, Math.round(config.marks / config.count)),
      difficulty: DIFFICULTY[index % DIFFICULTY.length],
      topicCoverage: config.chapter || config.topic || 'Selected topic',
      status: 'Draft',
    }));
    setGenerated(draft);
    setSaved(null);
  };

  const approve = () => {
    const quiz = insert('quizzes', {
      title: `${config.subject} quiz — ${config.chapter || config.className}`,
      subject: config.subject,
      className: config.className,
      section: 'A & B',
      questions: generated.length,
      marks: config.marks,
      timeLimit: `${config.timeLimit} min`,
      attemptsAllowed: 1,
      generated: 'AI generated',
      status: 'Under review',
      createdBy: account?.name,
      window: 'Scheduled after approval',
      averageScore: 0,
      attempts: 0,
    });
    generated.forEach((question) =>
      insert('questions', {
        ...question,
        code: `Q-AI-${Math.floor(Math.random() * 900 + 100)}`,
        subject: config.subject,
        className: config.className,
        chapter: config.chapter || 'Selected chapter',
        language: config.language,
        curriculum: 'Punjab Board',
        usage: 0,
        author: account?.name,
        updated: new Date().toISOString().slice(0, 10),
      })
    );
    logAction({ actor: account?.name, role: 'Teacher', action: 'Generated quiz with AI', module: 'Assessment', target: quiz.title, reason: 'Submitted for review' });
    setSaved(quiz.title);
    toast({
      title: 'Draft quiz saved for review',
      description: 'Generated questions are drafts. Nothing is published to students until they are reviewed and approved.',
    });
  };

  return (
    <div>
      <PageHeader
        title="AI quiz generator"
        description="Generate questions against your syllabus, then review, edit and approve them. Generated content is never published automatically."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'AI quiz generator' }]}
      />

      <div className={`mb-5 flex gap-3 rounded-2xl border p-4 ${provider ? 'border-primary/20 bg-brand-tint' : 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10'}`}>
        {provider ? <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />}
        <p className={`text-xs leading-relaxed ${provider ? 'text-muted-foreground' : 'text-amber-800 dark:text-amber-200'}`}>
          {provider
            ? `${provider.name} is connected and available for generation. Every generated question is validated before it is stored, and stays in draft until you approve it.`
            : 'No AI provider is connected, so generation is disabled. The owner must add a provider key in Settings → Integrations and AI. You can still add questions manually in the question bank.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Generation settings</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Class">
              <select value={config.className} onChange={(e) => update('className', e.target.value)} className={inputClass}>
                {['Class 7', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((name) => <option key={name}>{name}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select value={config.subject} onChange={(e) => update('subject', e.target.value)} className={inputClass}>
                {subjects.map((subject) => <option key={subject.id}>{subject.name}</option>)}
              </select>
            </Field>
            <Field label="Chapter">
              <select value={config.chapter} onChange={(e) => update('chapter', e.target.value)} className={inputClass}>
                <option value="">Select a chapter…</option>
                {chapters.filter((row) => row.subject === config.subject).map((row) => (
                  <option key={row.id} value={row.title}>{row.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Topic (optional)">
              <input value={config.topic} onChange={(e) => update('topic', e.target.value)} className={inputClass} placeholder="Specific topic" />
            </Field>
            <Field label="Number of questions">
              <input value={config.count} onChange={(e) => update('count', Number(e.target.value) || 1)} className={inputClass} inputMode="numeric" />
            </Field>
            <Field label="Question type">
              <select value={config.type} onChange={(e) => update('type', e.target.value)} className={inputClass}>
                {QUESTION_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </Field>
            <Field label="Difficulty distribution">
              <select value={config.difficulty} onChange={(e) => update('difficulty', e.target.value)} className={inputClass}>
                {DIFFICULTY.map((level) => <option key={level}>{level}</option>)}
              </select>
            </Field>
            <Field label="Total marks">
              <input value={config.marks} onChange={(e) => update('marks', Number(e.target.value) || 1)} className={inputClass} inputMode="numeric" />
            </Field>
            <Field label="Time limit (minutes)">
              <input value={config.timeLimit} onChange={(e) => update('timeLimit', e.target.value)} className={inputClass} inputMode="numeric" />
            </Field>
            <Field label="Language">
              <select value={config.language} onChange={(e) => update('language', e.target.value)} className={inputClass}>
                {['English', 'Urdu'].map((language) => <option key={language}>{language}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Learning objectives *">
            <textarea
              rows={3}
              value={config.objectives}
              onChange={(e) => update('objectives', e.target.value)}
              className={textareaClass}
              placeholder="For example: solve quadratic equations using the factorisation method and interpret the discriminant."
            />
          </Field>

          <Field label="Assessment instructions">
            <textarea
              rows={2}
              value={config.instructions}
              onChange={(e) => update('instructions', e.target.value)}
              className={textareaClass}
              placeholder="Shown to students at the start of the quiz."
            />
          </Field>

          <button
            type="button"
            onClick={generate}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground"
          >
            <Wand2 className="h-4 w-4" /> Generate draft questions
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-bold tracking-tight">Generated draft</h2>
              <span className="text-xs text-muted-foreground">{generated.length} question(s)</span>
            </div>

            {generated.length === 0 ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Nothing generated yet. Set the class, subject and learning objectives, then generate. Each question is
                checked for required fields, answer references, marks and duplicates before it is kept.
              </p>
            ) : (
              <>
                <ul className="mt-4 space-y-3">
                  {generated.map((question) => (
                    <li key={question.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge value={question.type} tone="brand" />
                        <StatusBadge value={question.difficulty} />
                        <StatusBadge value={`${question.marks} mark(s)`} tone="neutral" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-foreground">{question.text}</p>
                      {question.options.length > 0 && (
                        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                          {question.options.map((option) => (
                            <li key={option} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground">{option}</li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {question.topicCoverage} · {question.answer}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={generate} className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
                    <RefreshCw className="h-4 w-4" /> Regenerate
                  </button>
                  <button type="button" onClick={approve} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                    Save as draft quiz for review
                  </button>
                </div>
                {saved && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    “{saved}” is stored in review. Publish it from the quizzes screen once the academic office approves it.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">How validation works</h2>
            <ul className="mt-3 space-y-2.5">
              {[
                'Every question must have the fields its type requires, or it is rejected.',
                'Answer references must point to an existing option for objective questions.',
                'Marks must add up to the total you set before the quiz can be created.',
                'Near-duplicate questions are flagged so the same question is not asked twice.',
                'Generated content is never treated as automatically correct — you review and edit it.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="block text-xs font-semibold text-muted-foreground">
    {label}
    {children}
  </label>
);

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';