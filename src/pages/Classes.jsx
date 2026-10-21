import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { ACADEMY, CLASSES, LEVELS } from '@/data/academy';

export default function Classes() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Academics</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Classes and academic levels
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          {ACADEMY.brand} teaches from class 1 through intermediate, with college-level support and professional
          certification. Every class runs two sections and follows a defined chapter sequence per subject.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-primary/20 bg-brand-tint p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Section A and Section B</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Both sections follow the same syllabus and sit the same assessments. Section B is an academic-support
          arrangement with smaller groups and additional revision time. Placement is decided by the academic team
          after reviewing performance across the term — never from a single score — and students may be reassessed and
          moved between sections.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>Class teachers and subject teachers are assigned to each section.</li>
          <li>Every section transfer records the reason and keeps the previous section history.</li>
        </ul>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CLASSES.map((cls) => (
          <article key={cls.id} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-brand/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">{cls.name}</h2>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold">{cls.level}</p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint text-primary">
                <Users className="h-4 w-4" />
              </span>
            </div>

            <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between gap-3"><dt>Students</dt><dd className="font-semibold text-foreground">{cls.students}</dd></div>
              <div className="flex justify-between gap-3"><dt>Sections</dt><dd className="font-semibold text-foreground">A, B</dd></div>
              <div className="flex justify-between gap-3"><dt>Class teacher</dt><dd className="text-right font-medium text-foreground">{cls.teacher}</dd></div>
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Subjects: </span>
              {cls.subjects.join(', ')}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-cream p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Academic levels offered</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((level) => (
            <div key={level.name} className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">{level.name}</h3>
              <p className="text-xs text-gold">{level.range}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{level.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/subjects" className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
            Subjects offered <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/admissions" className="inline-flex h-11 items-center rounded-xl border border-input px-5 text-sm font-semibold text-foreground">
            Admission process
          </Link>
        </div>
      </section>
    </div>
  );
}