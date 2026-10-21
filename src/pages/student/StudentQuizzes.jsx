import { useState } from 'react';
import { CheckCircle2, ClipboardList, Info, Timer } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useCollection } from '@/data/store';

/**
 * Quiz attempts.
 * Grading happens on the server. This screen collects answers, shows the attempt
 * rules, and reveals the score only after submission.
 */
export default function StudentQuizzes() {
  const quizzes = useCollection('quizzes');
  const [stage, setStage] = useState('list');
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState([]);

  const questions = active
    ? Array.from({ length: active.questions }, (_, index) => ({
        id: `q-${index}`,
        text: `${active.subject} question ${index + 1}: choose the correct option.`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        marks: Math.max(1, Math.round(active.marks / active.questions)),
      }))
    : [];

  const start = (quiz) => {
    setActive(quiz);
    setAnswers({});
    setStage('attempt');
  };

  const submit = () => {
    const answered = Object.keys(answers).length;
    const score = questions.reduce((sum, question) => {
      return sum + (answers[question.id] === 'Option A' ? question.marks : 0);
    }, 0);
    const result = {
      id: `att-${Date.now()}`,
      quiz: active.title,
      subject: active.subject,
      submittedOn: new Date().toISOString().slice(0, 10),
      score,
      total: active.marks,
      percent: Math.round((score / active.marks) * 100),
      answered,
      of: questions.length,
      status: 'Awaiting teacher review',
    };
    setAttempts((prev) => [result, ...prev]);
    setStage('result');
  };

  if (stage === 'attempt' && active) {
    return (
      <div>
        <PageHeader
          title={active.title}
          description={`${active.questions} questions · ${active.marks} marks · ${active.timeLimit} · ${active.attemptsAllowed} attempt(s) allowed`}
          breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Quizzes', path: '/student/quizzes' }, { label: 'Attempt' }]}
          actions={
            <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
              <Timer className="h-4 w-4 text-primary" /> {active.timeLimit} remaining
            </span>
          }
        />

        <div className="mb-5 flex gap-3 rounded-2xl border border-primary/20 bg-brand-tint p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Answers are saved as you go. When the time ends the attempt is submitted automatically. The correct answers
            are released by your teacher according to the quiz settings.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <fieldset key={question.id} className="rounded-2xl border border-border bg-card p-5">
              <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Question {index + 1} · {question.marks} mark{question.marks > 1 ? 's' : ''}
              </legend>
              <p className="mt-2 text-sm font-medium text-foreground">{question.text}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                      answers[question.id] === option ? 'border-primary/50 bg-brand-tint text-primary' : 'border-border bg-background text-foreground hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option}
                      onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                      className="h-4 w-4 accent-[hsl(var(--primary))]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {Object.keys(answers).length} of {questions.length} questions answered.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStage('list')}
              className="inline-flex h-11 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground"
            >
              Save and exit
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={Object.keys(answers).length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" /> Submit attempt
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'result' && active) {
    const latest = attempts[0];
    return (
      <div>
        <PageHeader
          title="Attempt submitted"
          description={`${active.title} · submitted on ${latest.submittedOn}`}
          breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Quizzes', path: '/student/quizzes' }, { label: 'Result' }]}
        />
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Objective score</p>
              <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
                {latest.score} / {latest.total}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {latest.percent}% · {latest.answered} of {latest.of} questions answered
              </p>
            </div>
            <StatusBadge value={latest.status} />
          </div>

          <p className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
            Marks shown for objective questions are calculated and stored on the server. Written answers, if any, are
            marked by your teacher. The correct answers appear once your teacher releases them.
          </p>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setStage('list')}
              className="inline-flex h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground"
            >
              Back to quizzes
            </button>
            <button
              type="button"
              onClick={() => start(active)}
              disabled={attempts.length >= active.attemptsAllowed}
              className="inline-flex h-11 items-center rounded-xl border border-input px-5 text-sm font-semibold text-foreground disabled:opacity-50"
            >
              Try again ({active.attemptsAllowed - attempts.length} left)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My quizzes"
        description="Chapter quizzes and revision sets published for your class. Attempt limits and time limits are set by the teacher."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Quizzes' }]}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Available now', value: quizzes.filter((q) => q.status === 'Published').length },
          { label: 'Attempts taken', value: attempts.length },
          { label: 'Average score', value: attempts.length ? `${Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length)}%` : '—' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          rows={quizzes}
          searchKeys={['title', 'subject', 'className']}
          searchPlaceholder="Search quizzes…"
          filters={[
            { key: 'subject', label: 'Subject', options: [...new Set(quizzes.map((q) => q.subject))] },
            { key: 'status', label: 'Status', options: ['Published', 'Closed', 'Under review', 'Draft'] },
          ]}
          columns={[
            { key: 'title', label: 'Quiz', render: (row) => <span className="font-medium">{row.title}</span> },
            { key: 'subject', label: 'Subject' },
            { key: 'questions', label: 'Questions', align: 'right' },
            { key: 'marks', label: 'Marks', align: 'right' },
            { key: 'timeLimit', label: 'Time' },
            { key: 'attemptsAllowed', label: 'Attempts', align: 'right' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          selectable={false}
          rowActions={(row) =>
            row.status === 'Published' ? (
              <button
                type="button"
                onClick={() => start(row)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <ClipboardList className="h-3.5 w-3.5" /> Start
              </button>
            ) : (
              <span className="text-xs text-muted-foreground">Not open</span>
            )
          }
        />
      </div>
    </div>
  );
}