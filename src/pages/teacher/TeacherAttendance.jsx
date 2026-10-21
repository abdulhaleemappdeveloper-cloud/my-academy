import { useMemo, useState } from 'react';
import { CalendarCheck, CheckCircle2, Clock, Save, UserCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const STATUSES = ['Present', 'Absent', 'Late', 'Excused', 'Leave'];

export default function TeacherAttendance() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const students = useCollection('students');
  const classes = useCollection('classes');
  const sections = useCollection('sections');
  const attendance = useCollection('attendance');
  const subjects = useCollection('subjects');
  const { toast } = useToast();

  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const myClasses = classes.filter((row) => teacher.classes.includes(row.name));
  const mySubjects = subjects.filter((row) => row.teachers.includes(teacher.name));

  const [className, setClassName] = useState(myClasses[0]?.name || '');
  const [section, setSection] = useState('A');
  const [session, setSession] = useState('Daily');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState({});
  const [notes, setNotes] = useState({});

  const roster = useMemo(
    () => students.filter((row) => row.className === className && row.section === section),
    [students, className, section]
  );

  const alreadyMarked = (studentId) =>
    attendance.some((row) => row.studentId === studentId && row.date === date && row.subject === session);

  const setAll = (status) => {
    const next = {};
    roster.forEach((student) => { next[student.id] = status; });
    setMarks(next);
  };

  const save = () => {
    const entries = roster.filter((student) => marks[student.id] && !alreadyMarked(student.id));
    if (entries.length === 0) {
      toast({
        title: 'Nothing to save',
        description: 'Mark at least one student, or choose a different session — records for this date already exist.',
        variant: 'destructive',
      });
      return;
    }
    entries.forEach((student) => {
      insert('attendance', {
        date,
        studentId: student.id,
        studentName: student.name,
        className,
        section,
        subject: session,
        status: marks[student.id],
        markedBy: teacher.name,
        note: notes[student.id] || '—',
        correction: 'None',
      });
    });
    logAction({
      actor: teacher.name,
      role: 'Teacher',
      action: 'Marked attendance',
      module: 'Attendance',
      target: `${className} ${section} · ${session}`,
      reason: `${entries.length} students marked for ${date}`,
    });
    toast({
      title: 'Attendance saved',
      description: `${entries.length} records stored for ${className} Section ${section}. Corrections after saving require an approved request.`,
    });
    setMarks({});
    setNotes({});
  };

  const marked = roster.filter((student) => marks[student.id]).length;

  return (
    <div>
      <PageHeader
        title="Mark attendance"
        description="Attendance can be marked for your assigned classes and subjects only. A record cannot be created twice for the same student, date and session."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Attendance' }]}
        actions={
          <button
            type="button"
            onClick={save}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
          >
            <Save className="h-4 w-4" /> Save attendance
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students in roster" value={roster.length} hint={`${className} · Section ${section}`} icon={UserCheck} />
        <StatCard label="Marked in this session" value={`${marked} of ${roster.length}`} hint="Not yet saved" tone={marked ? 'brand' : 'neutral'} />
        <StatCard label="Records saved today" value={attendance.filter((row) => row.date === date).length} hint="Across the campus" icon={CalendarCheck} />
        <StatCard label="Corrections pending" value={attendance.filter((row) => row.correction === 'Correction requested').length} hint="Reviewed by the academic office" tone="warning" icon={Clock} />
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-xs font-semibold text-muted-foreground">
          Class
          <select value={className} onChange={(event) => { setClassName(event.target.value); setMarks({}); }} className={selectClass}>
            {myClasses.map((cls) => <option key={cls.id}>{cls.name}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-muted-foreground">
          Section
          <select value={section} onChange={(event) => { setSection(event.target.value); setMarks({}); }} className={selectClass}>
            {sections.filter((row) => row.className === className).map((row) => (
              <option key={row.id} value={row.name}>Section {row.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-muted-foreground">
          Session
          <select value={session} onChange={(event) => setSession(event.target.value)} className={selectClass}>
            <option value="Daily">Daily attendance</option>
            {mySubjects.map((subject) => <option key={subject.id} value={subject.name}>{subject.name} period</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-muted-foreground">
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={selectClass} />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Mark all as</span>
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setAll(status)}
            className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {roster.map((student) => (
            <li key={student.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <img src={student.photo} alt={student.name} className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.rollNumber} · attendance {student.attendancePct}%</p>
                </div>
                {alreadyMarked(student.id) && <StatusBadge value="Already recorded" tone="neutral" />}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={alreadyMarked(student.id)}
                    onClick={() => setMarks((prev) => ({ ...prev, [student.id]: status }))}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                      marks[student.id] === status
                        ? 'border-primary/50 bg-brand-tint text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {status}
                  </button>
                ))}
                <input
                  value={notes[student.id] || ''}
                  onChange={(event) => setNotes((prev) => ({ ...prev, [student.id]: event.target.value }))}
                  placeholder="Note (optional)"
                  aria-label={`Note for ${student.name}`}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-primary/50 sm:w-40"
                />
              </div>
            </li>
          ))}
          {roster.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              No students are enrolled in this section yet.
            </li>
          )}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Recent records you marked</h2>
        <DataTable
          rows={attendance.filter((row) => row.markedBy === teacher.name)}
          searchKeys={['studentName', 'date', 'subject', 'status']}
          searchPlaceholder="Search records you marked…"
          filters={[
            { key: 'className', label: 'Class', options: teacher.classes },
            { key: 'status', label: 'Status', options: STATUSES },
          ]}
          pageSize={5}
          selectable={false}
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'studentName', label: 'Student' },
            { key: 'className', label: 'Class' },
            { key: 'subject', label: 'Session' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            { key: 'correction', label: 'Correction', render: (row) => <StatusBadge value={row.correction} /> },
          ]}
          footerNote="Corrections are requested and approved, never overwritten silently"
        />
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Historical attendance is preserved. If a mistake is made,
          raise a correction request so the original record stays visible in the audit history.
        </p>
      </div>
    </div>
  );
}

const selectClass = 'mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary/50';