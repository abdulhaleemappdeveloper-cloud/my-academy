import { Link } from 'react-router-dom';
import {
  ArrowRight, Blocks, BookOpen, Briefcase, Building2, FlaskConical, GraduationCap,
} from 'lucide-react';
import SectionHeading from '@/components/site/SectionHeading';
import { LEVELS } from '@/data/academy';

const ICONS = { Blocks, BookOpen, FlaskConical, GraduationCap, Building2, Briefcase };

export default function LevelsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Academic levels"
        title="A complete path, from first class to professional certification"
        description="Every level follows a defined curriculum with chapter-wise resources, regular assessments and parent visibility."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEVELS.map((level) => {
          const Icon = ICONS[level.icon] || BookOpen;
          return (
            <article
              key={level.name}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-brand/5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-tint text-primary transition-colors group-hover:bg-brand group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold tracking-tight text-foreground">{level.name}</h3>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold">{level.range}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{level.desc}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-10">
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-soft"
        >
          View all classes and sections
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}