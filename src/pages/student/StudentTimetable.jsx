import { CalendarDays, Clock, MapPin } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StudentTimetable() {
  const { account } = useSession();
  const students = useCollection('students');
  const timetable = useCollection('timetable');
  const events = useCollection('events');
  const student = students.find((s) => s.name === account?.name) || students[9];

  const mine = timetable.filter((row) => row.className === student.className && row.section === student.section);
  const slots = [...new Set(mine.map((row) => row.time))].sort();

  return (
    <div>
      <PageHeader
        title="Timetable and calendar"
        description={`Weekly schedule for ${student.className} · Section ${student.section}. Timetable changes are notified in your portal.`}
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Timetable' }]}
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="px-4 py-3">Period</th>
              {DAYS.map((day) => (
                <th key={day} className="px-4 py-3">{day}</th>
              ))}
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
                        <div className="rounded-xl border border-border bg-background p-2.5">
                          <p className="text-xs font-semibold text-foreground">{cell.subject}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{cell.teacher}</p>
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
                  The timetable for this section is being prepared and will be published shortly.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <CalendarDays className="h-4 w-4 text-primary" /> Upcoming campus dates
          </h2>
          <ul className="mt-4 space-y-3">
            {events.slice(0, 6).map((event) => (
              <li key={event.id} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand text-[11px] font-bold text-primary-foreground">
                  {new Date(event.date).getDate()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{event.time} · {event.venue}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
            <Clock className="h-4 w-4 text-primary" /> Study plan for this week
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              { day: 'Monday', task: 'Mathematics: chapter practice set (45 min)' },
              { day: 'Tuesday', task: 'Physics: numerical questions (45 min)' },
              { day: 'Wednesday', task: 'Chemistry: revise periodic table (30 min)' },
              { day: 'Thursday', task: 'English: composition practice (40 min)' },
              { day: 'Friday', task: 'Past paper: attempt one section under time' },
              { day: 'Saturday', task: 'Review error log and redo mistakes' },
            ].map((item) => (
              <li key={item.day} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5">
                <span className="w-20 shrink-0 text-xs font-semibold text-primary">{item.day}</span>
                <span className="text-sm text-muted-foreground">{item.task}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Study plans are suggestions. Your teacher can adjust the plan in the study planner.
          </p>
        </section>
      </div>
    </div>
  );
}