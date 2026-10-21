import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, School, Star } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import { COURSES, NOTES, TEACHERS } from '@/data/academy';

export default function TeacherProfile() {
  const { id } = useParams();
  const teacher = TEACHERS.find((item) => item.id === id);

  if (!teacher) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <EmptyState
          title="Teacher profile not found"
          description="This profile may have been moved. Browse the teacher directory instead."
          action={<Link to="/teachers" className="text-sm font-semibold text-primary hover:underline">Back to directory</Link>}
        />
      </div>
    );
  }

  const courses = COURSES.filter((course) => course.teacher === teacher.name);
  const notes = NOTES.filter((note) => note.author === teacher.name).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/teachers" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Teacher directory
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <aside className="rounded-2xl border border-border bg-card p-6">
          <img src={teacher.image} alt={teacher.name} className="h-64 w-full rounded-xl object-cover" />
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">{teacher.name}</h1>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{teacher.role}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{teacher.bio}</p>

          <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
            {[
              ['Subject', teacher.subject],
              ['Qualification', teacher.qualification],
              ['Experience', teacher.experience],
              ['Classes', teacher.classes],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 rounded-xl border border-primary/20 bg-brand-tint p-4">
            <p className="text-xs font-semibold text-primary">Contact through the campus office</p>
            <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> Reach the teacher via the office or the portal messaging system.
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> Personal contact details are not published for privacy.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Teaching responsibilities</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Subjects', value: `${teacher.subject}${teacher.secondarySubject ? `, ${teacher.secondarySubject}` : ''}` },
                { label: 'Periods per week', value: teacher.periodsPerWeek },
                { label: 'Class teacher of', value: teacher.classTeacherOf },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-background p-4">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <School className="h-3.5 w-3.5" /> {item.label}
                  </p>
                  <p className="mt-1.5 font-heading text-sm font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {courses.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Courses taught</h2>
              <ul className="mt-4 divide-y divide-border">
                {courses.map((course) => (
                  <li key={course.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-foreground hover:text-primary">
                        {course.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{course.chapters} chapters · {course.lessons} lessons</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-gold" /> {course.rating}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {notes.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Material prepared</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {notes.map((note) => (
                  <li key={note.id}>
                    <Link to={`/notes/${note.id}`} className="block rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/30">
                      <p className="text-sm font-semibold text-foreground">{note.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{note.classLabel} · {note.type}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}