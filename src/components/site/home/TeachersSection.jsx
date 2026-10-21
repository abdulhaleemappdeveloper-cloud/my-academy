import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/site/SectionHeading';
import { TEACHERS } from '@/data/academy';

export default function TeachersSection() {
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Teaching team"
          title="Teachers who know every student by name"
          description="Subject teachers, class teachers and coordinators work together on each student's progress."
          action={
            <Link
              to="/teachers"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              Teacher directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEACHERS.slice(0, 4).map((teacher) => (
            <Link
              key={teacher.id}
              to={`/teachers/${teacher.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-base font-bold tracking-tight text-foreground">{teacher.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{teacher.subject}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{teacher.qualification}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}