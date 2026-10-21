import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, Lock, Printer } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import { NOTES } from '@/data/academy';

export default function NoteDetail() {
  const { id } = useParams();
  const note = NOTES.find((item) => item.id === id);

  if (!note) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <EmptyState
          title="Note not found"
          description="This note may have been renamed or archived. Browse the notes library to find the chapter you need."
          action={<Link to="/notes" className="text-sm font-semibold text-primary hover:underline">Back to notes library</Link>}
        />
      </div>
    );
  }

  const related = NOTES.filter((item) => item.subject === note.subject && item.id !== note.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/notes" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Notes library
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <article>
          <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-primary">{note.type}</span>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">{note.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {note.subject} · {note.classLabel} · {note.chapter} · Prepared by {note.author}
          </p>

          <div className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">About these notes</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{note.summary}</p>

            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">What is covered</h3>
            <ul className="space-y-2">
              {[
                'Definitions and key formulas for the chapter.',
                'Worked examples with each step shown.',
                'Common mistakes students make in the examination.',
                'Practice questions with an answer key at the end.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-primary/20 bg-brand-tint p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Lock className="h-3.5 w-3.5" /> Full document for enrolled students
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                The complete {note.pages}-page document opens from the student portal so downloads can be tracked and
                only enrolled students of this class can access it.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/portal" className="inline-flex h-9 items-center rounded-lg bg-brand px-3.5 text-xs font-semibold text-primary-foreground">
                  Sign in to the portal
                </Link>
                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-input px-3.5 text-xs font-semibold text-foreground">
                  <Printer className="h-3.5 w-3.5" /> Print outline
                </button>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Preview</h2>
            <div className="mt-4 space-y-3 rounded-xl bg-muted/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Chapter outline</p>
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg bg-background p-3">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-tint text-[11px] font-bold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Section {index + 1}</p>
                    <p className="text-xs text-muted-foreground">Definitions, examples and practice questions</p>
                  </div>
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-cream p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Document details</p>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Subject', note.subject],
                ['Class', note.classLabel],
                ['Chapter', note.chapter],
                ['Type', note.type],
                ['Pages', note.pages],
                ['Downloads', note.downloads],
                ['Updated', note.updated],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {related.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Related notes</p>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link to={`/notes/${item.id}`} className="flex items-start gap-2 text-sm font-medium text-foreground hover:text-primary">
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Revision support</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/past-papers" className="text-muted-foreground hover:text-primary">Past papers for this subject</Link></li>
              <li><Link to="/solved-papers" className="text-muted-foreground hover:text-primary">Solved papers with marking guidance</Link></li>
              <li><Link to="/exam-preparation" className="text-muted-foreground hover:text-primary">Exam preparation plan</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}