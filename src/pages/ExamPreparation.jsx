import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, ClipboardList, FileText, Timer, TrendingUp } from 'lucide-react';
import { EXAM_PREP, PAPERS, SUBJECTS } from '@/data/academy';

const WEEKS = [
  { week: 'Week 1 – 2', focus: 'Chapter-wise revision', tasks: ['Read the notes for each chapter and rewrite key definitions', 'Complete the chapter practice questions', 'Mark the topics you could not explain aloud'] },
  { week: 'Week 3 – 4', focus: 'Past paper practice', tasks: ['Attempt one past paper per subject each week', 'Time yourself exactly as in the exam hall', 'Log every lost mark with the reason'] },
  { week: 'Week 5 – 6', focus: 'Timed mock examinations', tasks: ['Sit full mock papers under examination conditions', 'Ask subject teachers to mark written answers', 'Revise the topics behind the highest mark losses'] },
  { week: 'Week 7 – 8', focus: 'Weak-topic revision', tasks: ['Revise only the flagged topics and formulas', 'Redo the questions you previously got wrong', 'Sleep and routine: keep the same wake time as exam days'] },
];

export default function ExamPreparation() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Revision</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Exam preparation
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          A structure that works for board and school examinations: revise by chapter, practise under time, then
          return to the topics that cost you marks.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Eight-week revision plan</h2>
          <div className="mt-4 space-y-4">
            {WEEKS.map((block) => (
              <article key={block.week} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-tint px-2.5 py-0.5 text-[11px] font-semibold text-primary">{block.week}</span>
                  <h3 className="font-heading text-sm font-bold text-foreground">{block.focus}</h3>
                </div>
                <ul className="mt-3 space-y-2">
                  {block.tasks.map((task) => (
                    <li key={task} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {task}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">
              <Timer className="h-4 w-4 text-primary" /> Subject-wise plans
            </h2>
            <ul className="mt-4 space-y-4">
              {EXAM_PREP.map((plan) => (
                <li key={plan.id} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{plan.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{plan.classLabel} · {plan.subject}</p>
                  <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {plan.steps.map((step, index) => (
                      <li key={step}>{index + 1}. {step}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Practice material</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/past-papers" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><FileText className="h-3.5 w-3.5" /> Past and sample papers ({PAPERS.length})</Link></li>
              <li><Link to="/solved-papers" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><ClipboardList className="h-3.5 w-3.5" /> Solved papers with marking guidance</Link></li>
              <li><Link to="/notes" className="flex items-center gap-2 text-muted-foreground hover:text-primary"><TrendingUp className="h-3.5 w-3.5" /> Chapter-wise notes</Link></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">
              <CalendarCheck className="h-4 w-4 text-primary" /> Examination days
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Arrive thirty minutes before reporting time, carry your admit slip and stationery in a clear pouch, and
              confirm your subject dates from the examination timetable in the portal.
            </p>
            <Link to="/events" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              View examination dates <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Subjects to revise</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <li key={subject} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{subject}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}