import { Link } from 'react-router-dom';

/** Compact teacher card used in the directory and on section summaries. */
export default function TeacherCard({ teacher }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5">
      <div className="h-48 overflow-hidden">
        <img
          src={teacher.image}
          alt={teacher.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{teacher.name}</h2>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{teacher.role}</p>
        <p className="mt-2.5 flex-1 text-xs leading-relaxed text-muted-foreground">{teacher.qualification}</p>
        <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex justify-between gap-3"><dt>Subject</dt><dd className="font-medium text-foreground">{teacher.subject}</dd></div>
          <div className="flex justify-between gap-3"><dt>Experience</dt><dd className="font-medium text-foreground">{teacher.experience}</dd></div>
          <div className="flex justify-between gap-3"><dt>Classes</dt><dd className="text-right font-medium text-foreground">{teacher.classes}</dd></div>
        </dl>
        <Link to={`/teachers/${teacher.id}`} className="mt-4 text-sm font-semibold text-primary hover:underline">
          View profile
        </Link>
      </div>
    </article>
  );
}