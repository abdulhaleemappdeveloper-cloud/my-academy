import { Link } from 'react-router-dom';
import { Clock, Star, Users } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { CLASSES, COURSES, SUBJECTS, formatPKR } from '@/data/academy';

export default function Courses() {
  return (
    <DirectoryPage
      eyebrow="Courses"
      title="Courses and programmes"
      description="Each course lists its chapters, downloadable notes, assessment plan and teacher, so students and parents know exactly what the term covers."
      items={COURSES}
      searchKeys={['title', 'subject', 'className', 'teacher']}
      filters={[
        { key: 'subject', label: 'Subject', options: SUBJECTS },
        { key: 'level', label: 'Level', options: ['Primary', 'Middle', 'Matric', 'Intermediate', 'Professional'] },
        { key: 'className', label: 'Class', options: CLASSES.map((c) => c.name).concat(['Open to all levels']) },
      ]}
      renderCard={(course) => (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5">
          <div className="relative h-40 overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm">
              {course.badge}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{course.subject}</p>
            <h2 className="mt-1.5 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{course.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{course.summary}</p>
            <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {course.duration}</div>
              <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {course.students}</div>
              <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-gold" /> {course.rating}</div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-foreground">
                {formatPKR(course.fee)}<span className="text-xs font-normal text-muted-foreground"> / term</span>
              </span>
              <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-primary hover:underline">Details</Link>
            </div>
          </div>
        </article>
      )}
    />
  );
}