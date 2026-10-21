import { Link } from 'react-router-dom';
import {
  Award, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Clock, FileText, Megaphone, Receipt, TrendingUp, Wallet,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function StudentDashboard() {
  const { account } = useSession();
  const students = useCollection('students');
  const timetable = useCollection('timetable');
  const assignments = useCollection('assignments');
  const exams = useCollection('exams');
  const invoices = useCollection('invoices');
  const announcements = useCollection('announcements');
  const quizzes = useCollection('quizzes');
  const attendance = useCollection('attendance');
  const results = useCollection('results');

  const student = students.find((s) => s.name === account?.name) || students[9];
  const today = timetable.filter((row) => row.className === student.className && row.section === student.section).slice(0, 5);
  const openAssignments = assignments.filter((row) => row.className === student.className).slice(0, 4);
  const nextExams = exams.filter((row) => row.className === student.className || row.className === 'Class 10').slice(0, 4);
  const myAttendance = attendance.filter((row) => row.studentId === student.id);
  const present = myAttendance.filter((row) => row.status === 'Present' || row.status === 'Late').length;
  const attendanceRate = myAttendance.length ? Math.round((present / myAttendance.length) * 100) : student.attendancePct;
  const myInvoices = invoices.filter((row) => row.studentId === student.id);
  const balance = myInvoices.reduce((sum, row) => sum + row.balance, 0);
  const publishedResults = results.filter((row) => row.studentId === student.id && row.status === 'Published');
  const average = publishedResults.length ? Math.round(publishedResults.reduce((sum, row) => sum + row.percent, 0) / publishedResults.length) : 0;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${student.name.split(' ')[0]}`}
        description={`${student.className} · Section ${student.section} · ${student.academicYear} · Roll number ${student.rollNumber}`}
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Dashboard' }]}
        actions={
          <>
            <Link to="/student/assignments" className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
              <ClipboardList className="h-4 w-4" /> Assignments
            </Link>
            <Link to="/student/tutor" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <BookOpen className="h-4 w-4" /> Open AI tutor
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance" value={`${attendanceRate}%`} hint={`${myAttendance.length} marked sessions`} tone={attendanceRate >= 85 ? 'brand' : 'warning'} icon={CalendarDays} to="/student/attendance" />
        <StatCard label="Assessment average" value={publishedResults.length ? `${average}%` : '—'} hint="Across published results" icon={TrendingUp} to="/student/results" />
        <StatCard label="Fee balance" value={balance ? `PKR ${balance.toLocaleString('en-PK')}` : 'Cleared'} hint={`${myInvoices.length} invoices`} tone={balance ? 'warning' : 'brand'} icon={Wallet} to="/student/fees" />
        <StatCard label="Quizzes available" value={quizzes.filter((q) => q.status === 'Published').length} hint="Attempt limits apply" icon={CheckCircle2} to="/student/quizzes" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <Clock className="h-4 w-4 text-primary" /> Today's timetable
            </h2>
            <Link to="/student/timetable" className="text-xs font-semibold text-primary hover:underline">Full week</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {today.map((slot) => (
              <li key={slot.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{slot.subject}</p>
                  <p className="text-xs text-muted-foreground">{slot.teacher} · {slot.room}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-brand-tint px-2.5 py-1 text-xs font-semibold text-primary">{slot.time}</span>
              </li>
            ))}
            {today.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No periods scheduled for today.</li>}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <Megaphone className="h-4 w-4 text-gold" /> Latest notices
          </h2>
          <ul className="mt-4 space-y-3">
            {announcements.slice(0, 4).map((item) => (
              <li key={item.id} className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.category} · {item.date}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight">
            <ClipboardList className="h-4 w-4 text-primary" /> Assignments due
          </h2>
          <ul className="mt-4 space-y-3">
            {openAssignments.map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{row.title}</p>
                  <StatusBadge value={row.status} />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{row.subject} · due {row.dueOn} · {row.marks} marks</p>
              </li>
            ))}
          </ul>
          <Link to="/student/assignments" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">
            Open assignments
          </Link>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight">
            <FileText className="h-4 w-4 text-primary" /> Upcoming examinations
          </h2>
          <ul className="mt-4 space-y-3">
            {nextExams.map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-sm font-medium text-foreground">{row.subject}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.date} · {row.start} · {row.room}</p>
              </li>
            ))}
          </ul>
          <Link to="/student/exams" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">
            Examination instructions
          </Link>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight">
            <Receipt className="h-4 w-4 text-primary" /> Fee summary
          </h2>
          {myInvoices.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No invoices have been issued yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {myInvoices.slice(0, 3).map((row) => (
                <li key={row.id} className="rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{row.number}</p>
                    <StatusBadge value={row.status} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {row.category} · due {row.dueOn} · balance PKR {row.balance.toLocaleString('en-PK')}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex gap-3">
            <Link to="/student/fees" className="text-xs font-semibold text-primary hover:underline">Invoices</Link>
            <Link to="/student/payments" className="text-xs font-semibold text-primary hover:underline">Submit payment proof</Link>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-cream p-6">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
          <Award className="h-4 w-4 text-primary" /> Progress snapshot
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Chapters completed', value: `${Math.min(9, 3 + myAttendance.length)} of 9`, hint: 'Mathematics · Class 9–10' },
            { label: 'Assignments submitted', value: '12 of 14', hint: 'This term' },
            { label: 'Certificates earned', value: '2', hint: 'Attendance and quiz achievement' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
              <p className="mt-1.5 font-display text-xl font-semibold text-foreground">{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </div>
          ))}
        </div>
        <Link to="/student/progress" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">
          See detailed progress and mastery
        </Link>
      </section>
    </div>
  );
}