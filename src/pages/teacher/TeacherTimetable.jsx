import { AlertTriangle, Clock, MapPin, Timer } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TeacherTimetable() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const timetable = useCollection('timetable');
  const lessonPlans = useCollection('lessonPlans');
  const substitutes = useCollection('substitutes');
  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];

  const mine = timetable.filter((row) => row.teacher === teacher.name);
  const slots = [...new Set(mine.map((row) => row.time))].sort();
  const conflicts = [
    ...mine.filter((row) => row.conflict !== 'None').map((row) => ({ id: row.id, day: row.day, time: row.time, className: row.className, detail: row.conflict, type: 'Timetable conflict' })),
    ...substitutes.filter((row) => row.absentTeacher === teacher.name).map((row) => ({ id: row.id, day: row.date, time: row.periods, className: row.className, detail: 'You are recorded as absent on this date', type: 'Leave overlap' })),
  ];

  return (
    <div>
      <PageHeader
        title="Timetable and workload"
        description="Your weekly periods, marking responsibilities and any conflicts that need attention. Workload is shown for planning, not as a measure of teaching quality."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Timetable and workload' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Periods per week" value={teacher.periodsPerWeek} hint="Across your classes" icon={Timer} />
        <StatCard label="Classes assigned" value={teacher.classes.length} hint={teacher.classes.join(', ')} />
        <StatCard label="Lesson plans" value={lessonPlans.filter((p) => p.teacher === teacher.name).length} hint="Draft, submitted and approved" icon={Clock} />
        <StatCard label="Conflicts to resolve" value={conflicts.length} hint="Before the timetable is published" tone={conflicts.length ? 'warning' : 'brand'} icon={AlertTriangle} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[780px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="px-4 py-3">Period</th>
              {DAYS.map((day) => <th key={day} className="px-4 py-3">{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot} className="border-b border-border/70 last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{slot}</td>
                {DAYS.map((day) => {
                  const cell = mine.find((row) => row.time === slot && row.day === day);
                  return (
                    <td key={`${slot}-${day}`} className="px-3 py-2.5">
                      {cell ? (
                        <div className={`rounded-xl border p-2.5 ${cell.conflict !== 'None' ? 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10' : 'border-border bg-background'}`}>
                          <p className="text-xs font-semibold text-foreground">{cell.subject}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{cell.className} {cell.section}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <MapPin className="h-2.5 w-2.5" /> {cell.room}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {slots.length === 0 && (
              <tr>
                <td colSpan={DAYS.length + 1} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No periods are assigned to you yet. The academic office publishes timetables each term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {conflicts.length > 0 && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <h2 className="border-b border-border px-5 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em]">Conflicts and cover</h2>
          <ul className="divide-y divide-border">
            {conflicts.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.type} · {item.className}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.day} · {item.time} · {item.detail}</p>
                </div>
                <StatusBadge value="Needs a decision" tone="warning" />
              </li>
            ))}
          </ul>
          <p className="border-t border-border bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
            A timetable with unresolved conflicts is not published. An authorised staff member may accept an exception
            with a recorded reason.
          </p>
        </section>
      )}

      <div className="mt-6">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Workload overview</h2>
        <DataTable
          rows={mine}
          searchKeys={['className', 'subject', 'day', 'room']}
          searchPlaceholder="Search your periods…"
          filters={[
            { key: 'className', label: 'Class', options: teacher.classes },
            { key: 'day', label: 'Day', options: DAYS },
          ]}
          pageSize={10}
          selectable={false}
          columns={[
            { key: 'day', label: 'Day' },
            { key: 'time', label: 'Period' },
            { key: 'className', label: 'Class' },
            { key: 'section', label: 'Section' },
            { key: 'subject', label: 'Subject' },
            { key: 'room', label: 'Room' },
            { key: 'conflict', label: 'Conflict', render: (row) => <StatusBadge value={row.conflict} /> },
          ]}
          footerNote="Substitutions and cover arrangements appear here once allocated"
        />
      </div>
    </div>
  );
}