import { Link } from 'react-router-dom';
import {
  CheckCircle2, ClipboardCheck, ClipboardList, FileText, PenLine, School, Timer, TrendingUp, Users,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function TeacherDashboard() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const classes = useCollection('classes');
  const timetable = useCollection('timetable');
  const assignments = useCollection('assignments');
  const submissions = useCollection('submissions');
  const exams = useCollection('exams');
  const quizzes = useCollection('quizzes');
  const results = useCollection('results');
  const announcements = useCollection('announcements');

  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const myClasses = classes.filter((row) => teacher.classes.includes(row.name));
  const today = timetable.filter((row) => row.teacher === teacher.name);
  const pendingMarking = results.filter((row) => row.marker === teacher.name && row.status !== 'Published');
  const myAssignments = assignments.filter((row) => row.teacher === teacher.name);
  const awaitingReview = submissions.filter((row) => myAssignments.some((a) => a.id === row.assignmentId) && row.status === 'Submitted');
  const myExams = exams.filter((row) => row.examiner === teacher.name);

  return (
    <div>
      <PageHeader
        title={`Good day, ${teacher.name.split(' ')[0]}`}
        description={`${teacher.subject} · ${teacher.classes.join(', ')} · ${teacher.periodsPerWeek} periods per week${teacher.classTeacherOf !== '—' ? ` · class teacher of ${teacher.classTeacherOf}` : ''}`}
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Dashboard' }]}
        actions={
          <>
            <Link to="/teacher/attendance" className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4" /> Mark attendance
            </Link>
            <Link to="/teacher/ai-quiz" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <ClipboardList className="h-4 w-4" /> Generate a quiz
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned classes" value={myClasses.length} hint={teacher.classes.join(', ')} icon={School} to="/teacher/classes" />
        <StatCard label="Awaiting marking" value={pendingMarking.length} hint="Written answers and scripts" tone={pendingMarking.length ? 'warning' : 'brand'} icon={PenLine} to="/teacher/grading" />
        <StatCard label="Submissions to review" value={awaitingReview.length} hint="Assignments awaiting feedback" tone={awaitingReview.length ? 'warning' : 'brand'} icon={FileText} to="/teacher/assignments" />
        <StatCard label="Examinations prepared" value={myExams.length} hint="Draft, review or approved" icon={ClipboardCheck} to="/teacher/exams" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <Timer className="h-4 w-4 text-primary" /> My teaching day
            </h2>
            <Link to="/teacher/timetable" className="text-xs font-semibold text-primary hover:underline">Full schedule</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {today.slice(0, 6).map((slot) => (
              <li key={slot.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{slot.subject} · {slot.className} {slot.section}</p>
                  <p className="text-xs text-muted-foreground">{slot.day} · {slot.room}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-brand-tint px-2.5 py-1 text-xs font-semibold text-primary">{slot.time}</span>
              </li>
            ))}
            {today.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No periods assigned today.</li>}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <Users className="h-4 w-4 text-primary" /> My classes
          </h2>
          <ul className="mt-4 space-y-3">
            {myClasses.map((cls) => (
              <li key={cls.id} className="rounded-xl border border-border bg-background p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{cls.name}</p>
                  <StatusBadge value={`${cls.enrolled} students`} tone="neutral" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sections A and B · {cls.subjects.slice(0, 3).join(', ')}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Marking queue</h2>
          <ul className="mt-4 space-y-3">
            {pendingMarking.slice(0, 4).map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-sm font-medium text-foreground">{row.studentName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.subject} · {row.exam}</p>
                <div className="mt-2"><StatusBadge value={row.status} /></div>
              </li>
            ))}
            {pendingMarking.length === 0 && <li className="text-sm text-muted-foreground">Nothing waiting to be marked.</li>}
          </ul>
          <Link to="/teacher/grading" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">Open marking</Link>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">My quizzes</h2>
          <ul className="mt-4 space-y-3">
            {quizzes.filter((q) => q.createdBy === teacher.name).slice(0, 4).map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.questions} questions · {row.marks} marks · {row.status}</p>
              </li>
            ))}
          </ul>
          <Link to="/teacher/quizzes" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">Manage quizzes</Link>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Office notices</h2>
          <ul className="mt-4 space-y-3">
            {announcements.filter((a) => a.audience === 'Teachers' || a.audience === 'Everyone').slice(0, 4).map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.category} · {row.date}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-cream p-6">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
          <TrendingUp className="h-4 w-4 text-primary" /> Class performance snapshot
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {myClasses.slice(0, 3).map((cls) => (
            <div key={cls.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{cls.name}</p>
              <p className="mt-1.5 font-display text-xl font-semibold text-foreground">
                {results.filter((r) => r.className === cls.name).length} results
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Marks entered this term</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Performance summaries are shown for guidance. They are never presented as a judgement on a student's ability.
        </p>
      </section>
    </div>
  );
}