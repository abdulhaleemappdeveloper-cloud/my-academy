import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star, Users } from 'lucide-react';
import SectionHeading from '@/components/site/SectionHeading';
import { COURSES, formatPKR } from '@/data/academy';

export default function CoursesSection() {
  const featured = COURSES.slice(0, 3);
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured courses"
          title="Structured courses with chapters, lessons and assessments"
          description="Each course lists its chapters, downloadable notes and assessment plan so students always know what comes next."
          action={
            <Link
              to="/courses"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              All courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <article
              key={course.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm">
                  {course.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{course.subject}</p>
                <h3 className="mt-2 font-heading text-lg font-bold leading-snug tracking-tight text-foreground">
                  {course.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{course.summary}</p>

                <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {course.students} students
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-gold" /> {course.rating}
                  </div>
                </dl>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-semibold text-foreground">{formatPKR(course.fee)}<span className="text-xs font-normal text-muted-foreground"> / term</span></span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-brand-soft"
                  >
                    Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}