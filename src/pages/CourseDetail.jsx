import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, FileText, GraduationCap, Users } from 'lucide-react';
import { COURSES, NOTES, PAPERS, TEACHERS, formatPKR } from '@/data/academy';
import EmptyState from '@/components/common/EmptyState';

export default function CourseDetail() {
  const { id } = useParams();
  const course = COURSES.find((item) => item.id === id);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <EmptyState
          title="Course not found"
          description="This course may have been renamed or removed. Browse the course list to find the right programme."
          action={<Link to="/courses" className="text-sm font-semibold text-primary hover:underline">Back to courses</Link>}
        />
      </div>
    );
  }

  const teacher = TEACHERS.find((item) => item.name === course.teacher);
  const notes = NOTES.filter((note) => note.subject === course.subject).slice(0, 4);
  const papers = PAPERS.filter((paper) => paper.subject === course.subject).slice(0, 3);
  const chapters = Array.from({ length: course.chapters }, (_, index) => ({
    order: index + 1,
    title: `Chapter ${index + 1}`,
    lessons: Math.max(2, Math.round(course.lessons / course.chapters)),
    topics: 3 + (index % 3),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> All courses
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{course.subject} · {course.level}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">{course.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{course.summary}</p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <img src={course.image} alt={course.title} className="h-64 w-full object-cover sm:h-80" />
          </div>

          <section className="mt-10">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">What students will achieve</h2>
            <ul className="mt-4 space-y-2.5">
              {course.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {outcome}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Chapter plan</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Chapter</th>
                    <th className="px-4 py-3">Topics</th>
                    <th className="px-4 py-3 text-right">Lessons</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter) => (
                    <tr key={chapter.order} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">{chapter.order}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{chapter.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{chapter.topics}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{chapter.lessons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {(notes.length > 0 || papers.length > 0) && (
            <section className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">
                  <FileText className="h-4 w-4 text-primary" /> Notes for this subject
                </h2>
                <ul className="mt-4 space-y-3">
                  {notes.map((note) => (
                    <li key={note.id}>
                      <Link to={`/notes/${note.id}`} className="text-sm font-medium text-foreground hover:text-primary">{note.title}</Link>
                      <p className="text-xs text-muted-foreground">{note.classLabel} · {note.type}</p>
                    </li>
                  ))}
                  {notes.length === 0 && <li className="text-xs text-muted-foreground">Notes will be published shortly.</li>}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" /> Past papers
                </h2>
                <ul className="mt-4 space-y-3">
                  {papers.map((paper) => (
                    <li key={paper.id}>
                      <Link to="/past-papers" className="text-sm font-medium text-foreground hover:text-primary">{paper.title}</Link>
                      <p className="text-xs text-muted-foreground">{paper.marks} marks · {paper.pages} pages</p>
                    </li>
                  ))}
                  {papers.length === 0 && <li className="text-xs text-muted-foreground">Papers for this subject will be added closer to the examination.</li>}
                </ul>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Term fee</p>
            <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">{formatPKR(course.fee)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Installments available on request.</p>

            <Link
              to="/admissions/apply"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground"
            >
              Apply for this class <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/payment-instructions"
              className="mt-2.5 inline-flex h-11 w-full items-center justify-center rounded-xl border border-input text-sm font-semibold text-foreground"
            >
              Fee payment instructions
            </Link>

            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Duration</dt>
                <dd className="font-medium text-foreground">{course.duration}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-3.5 w-3.5" /> Chapters</dt>
                <dd className="font-medium text-foreground">{course.chapters}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground"><Users className="h-3.5 w-3.5" /> Students</dt>
                <dd className="font-medium text-foreground">{course.students}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" /> Class</dt>
                <dd className="text-right font-medium text-foreground">{course.classLabel}</dd>
              </div>
            </dl>
          </div>

          {teacher && (
            <div className="rounded-2xl border border-border bg-cream p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Course teacher</p>
              <div className="mt-4 flex items-center gap-3">
                <img src={teacher.image} alt={teacher.name} className="h-14 w-14 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.qualification}</p>
                </div>
              </div>
              <Link to={`/teachers/${teacher.id}`} className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">
                View teacher profile
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}