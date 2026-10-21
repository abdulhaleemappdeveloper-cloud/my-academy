import { AlertTriangle, CalendarClock, LayoutGrid, Timer } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminTimetable() {
  const timetable = useCollection('timetable');
  const substitutes = useCollection('substitutes');
  const rooms = useCollection('rooms');
  const classes = useCollection('classes');
  const teachers = useCollection('teachers');

  const conflicts = timetable.filter((row) => row.conflict !== 'None');
  const periods = [...new Set(timetable.map((row) => row.time))].sort();

  return (
    <div>
      <PageHeader
        title="Timetable and scheduling"
        description="Period structure, class and teacher views, room allocation and conflict checks. A timetable is published only once hard conflicts are resolved."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Timetable' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Periods per day" value={periods.length} hint="40–45 minutes each, including breaks" icon={Timer} />
        <StatCard label="Scheduled periods" value={timetable.length} hint={`${classes.length} classes · Sections A and B`} icon={LayoutGrid} />
        <StatCard label="Unresolved conflicts" value={conflicts.length} hint="Must be resolved before publishing" tone={conflicts.length ? 'danger' : 'brand'} icon={AlertTriangle} />
        <StatCard label="Cover arrangements" value={substitutes.filter((s) => s.status === 'Allocated').length} hint={`${substitutes.filter((s) => s.status === 'Pending').length} still need a decision`} icon={CalendarClock} />
      </div>

      <Tabs defaultValue="grid" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="grid">Weekly grid</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="cover">Cover and substitutions</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4 space-y-6">
          {classes.slice(0, 3).map((cls) => {
            const rows = timetable.filter((t) => t.className === cls.name);
            return (
              <section key={cls.id}>
                <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {cls.name} · class teacher {cls.classTeacher}
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                  <table className="w-full min-w-[820px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                        <th className="px-4 py-3">Period</th>
                        {DAYS.map((day) => <th key={day} className="px-4 py-3">{day}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map((period) => (
                        <tr key={period} className="border-b border-border/70 last:border-0">
                          <td className="px-4 py-3 font-medium text-foreground">{period}</td>
                          {DAYS.map((day) => {
                            const cell = rows.find((row) => row.time === period && row.day === day);
                            return (
                              <td key={`${period}-${day}`} className="px-3 py-2.5">
                                {cell ? (
                                  <div className={`rounded-xl border p-2.5 ${cell.conflict !== 'None' ? 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10' : 'border-border bg-background'}`}>
                                    <p className="text-xs font-semibold text-foreground">{cell.subject}</p>
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">{cell.teacher}</p>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground">{cell.room} · Section {cell.section}</p>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
          <p className="text-xs text-muted-foreground">
            Periods, breaks and school hours are configurable. Drag-and-drop editing and printable schedules are provided
            from the timetable designer, and every constraint is validated again on the server.
          </p>
        </TabsContent>

        <TabsContent value="conflicts" className="mt-4">
          {conflicts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No hard conflicts detected in the current timetable draft.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border">
              <ul className="divide-y divide-border">
                {conflicts.map((row) => (
                  <li key={row.id} className="flex flex-col gap-2 bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.className} {row.section} · {row.subject}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{row.day} · {row.time} · {row.teacher} · {row.room}</p>
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{row.conflict}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge value={row.status} />
                      <button type="button" className="rounded-xl border border-input px-3 py-1.5 text-xs font-semibold text-foreground">
                        Resolve
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            A timetable containing unresolved conflicts is not published. An authorised staff member may accept a
            documented exception, which is recorded with a reason.
          </p>
        </TabsContent>

        <TabsContent value="cover" className="mt-4">
          <DataTable
            rows={substitutes}
            searchKeys={['absentTeacher', 'substitute', 'className', 'subject']}
            searchPlaceholder="Search cover arrangements…"
            filters={[
              { key: 'status', label: 'Status', options: ['Pending', 'Allocated'] },
              { key: 'className', label: 'Class', options: [...new Set(substitutes.map((s) => s.className))] },
            ]}
            columns={[
              { key: 'absentTeacher', label: 'Absent teacher' },
              { key: 'date', label: 'Date' },
              { key: 'periods', label: 'Periods' },
              { key: 'className', label: 'Class' },
              { key: 'subject', label: 'Subject' },
              { key: 'substitute', label: 'Substitute' },
              { key: 'conflict', label: 'Conflict check' },
              { key: 'notified', label: 'Notified the teacher(s)' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Pending', 'Allocated'] }}
            footerNote="Where no valid substitute exists, an authorised decision is required"
          />
        </TabsContent>

        <TabsContent value="rooms" className="mt-4">
          <DataTable
            rows={rooms}
            searchKeys={['name', 'type', 'facilities']}
            searchPlaceholder="Search rooms…"
            filters={[
              { key: 'type', label: 'Type', options: [...new Set(rooms.map((r) => r.type))] },
              { key: 'status', label: 'Status', options: ['Available', 'Under maintenance'] },
            ]}
            columns={[
              { key: 'name', label: 'Room', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'type', label: 'Type' },
              { key: 'capacity', label: 'Capacity', align: 'right' },
              { key: 'facilities', label: 'Facilities' },
              { key: 'utilisation', label: 'Utilisation', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Room bookings are checked for clashes before a session is scheduled"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {teachers.length} teaching accounts are available for allocation · {rooms.filter((r) => r.status === 'Under maintenance').length} room(s)
            currently unavailable.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}