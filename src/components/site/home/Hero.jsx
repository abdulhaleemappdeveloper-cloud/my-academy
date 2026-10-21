import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { ACADEMY, STATS, img } from '@/data/academy';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-cream">
      <div className="ta-grid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="ta-glow pointer-events-none absolute inset-x-0 top-0 h-72" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Admissions open for session 2026
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Learn deeply.
            <br />
            <span className="ta-underline">Grow steadily.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {ACADEMY.brand}, {ACADEMY.campus} in {ACADEMY.city} — expert teaching, chapter-wise
            notes, past-paper practice and live progress tracking for students, teachers and parents.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admissions/apply"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 hover:opacity-95"
            >
              Apply for admission
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              Explore courses
            </Link>
          </div>

          <form
            action="/search"
            className="mt-8 flex max-w-lg items-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-sm"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-tint">
              <Search className="h-4 w-4 text-primary" />
            </span>
            <input
              name="q"
              type="search"
              placeholder="Search notes, past papers or courses…"
              aria-label="Search notes, past papers or courses"
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>

          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Results are published only after academic approval and verification.
          </p>
        </div>

        <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl shadow-brand/10">
            <img
              src={img('1523240795612-9a054b0db644', 1200)}
              alt="Students working together in a Tips Academy classroom"
              className="h-[340px] w-full object-cover sm:h-[420px]"
              loading="eager"
            />
          </div>

          <div className="absolute -bottom-6 -left-4 hidden w-56 rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Board pass rate</p>
            <p className="mt-1 font-display text-3xl font-semibold text-foreground">96%</p>
            <p className="mt-1 text-xs text-muted-foreground">Class 9–12, session 2025</p>
          </div>

          <div className="absolute -right-3 top-6 hidden rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-xl backdrop-blur md:block">
            <p className="text-xs font-semibold text-foreground">Two sections per class</p>
            <p className="text-[11px] text-muted-foreground">Section A &amp; supported Section B</p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border bg-background/70">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-border px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="px-1 py-6 lg:px-6">
              <dd className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{s.value}</dd>
              <dt className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}