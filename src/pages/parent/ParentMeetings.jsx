import { useState } from 'react';
import { CalendarClock, CalendarDays, MapPin, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function ParentMeetings() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const meetings = useCollection('meetings');
  const teachers = useCollection('teachers');
  const events = useCollection('events');
  const exams = useCollection('exams');
  const { toast } = useToast();

  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));
  const child = children[0];

  const [request, setRequest] = useState({ teacher: teachers[0]?.name || '', child: child?.name || '', mode: 'In person', preferred: '' });

  const book = () => {
    if (!request.preferred) {
      toast({ title: 'Choose a slot', description: 'Select your preferred meeting time before requesting.', variant: 'destructive' });
      return;
    }
    const record = insert('meetings', {
      teacher: request.teacher,
      subject: teachers.find((t) => t.name === request.teacher)?.subject || '—',
      slot: request.preferred,
      guardian: `${guardian.name} (guardian)`,
      student: request.child,
      mode: request.mode,
      status: 'Requested',
      note: 'Meeting notes are visible only to the teacher and the guardian.',
    });
    logAction({ actor: guardian.name, role: 'Guardian', action: 'Requested a teacher meeting', module: 'Meetings', target: record.teacher });
    toast({
      title: 'Meeting requested',
      description: 'The subject teacher confirms the slot and you will be notified. Conflicts are checked before confirmation.',
    });
    setRequest({ ...request, preferred: '' });
  };

  const cancel = (row) => {
    patch('meetings', row.id, { status: 'Cancelled' });
    logAction({ actor: guardian.name, role: 'Guardian', action: 'Cancelled meeting request', module: 'Meetings', target: row.teacher });
    toast({ title: 'Meeting cancelled', description: 'The teacher has been notified through the portal.' });
  };

  const slots = [
    'Saturday 25 Oct · 09:00',
    'Saturday 25 Oct · 09:30',
    'Saturday 25 Oct · 10:00',
    'Friday 31 Oct · 11:00',
    'Saturday 1 Nov · 10:30',
  ];

  return (
    <div>
      <PageHeader
        title="Meetings and calendar"
        description="Book a slot with a subject teacher, track confirmations and follow the academic calendar. Meeting notes stay between you and the teacher."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Meetings' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My meeting requests" value={meetings.filter((m) => m.guardian?.includes(guardian.name)).length} hint="Requested, confirmed or completed" icon={CalendarClock} />
        <StatCard label="Confirmed" value={meetings.filter((m) => m.guardian?.includes(guardian.name) && m.status === 'Confirmed').length} hint="Ready to attend" tone="brand" />
        <StatCard label="Upcoming campus events" value={events.filter((e) => new Date(e.date) >= new Date()).length} hint="On the academic calendar" icon={CalendarDays} />
        <StatCard label="Examinations scheduled" value={exams.filter((e) => children.some((c) => c.className === e.className)).length} hint="For your children's classes" icon={Users} />
      </div>

      <Tabs defaultValue="meetings" className="mt-6">
        <TabsList>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Request a meeting</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Child
                <select value={request.child} onChange={(event) => setRequest((prev) => ({ ...prev, child: event.target.value }))} className={inputClass}>
                  {children.map((item) => <option key={item.id} value={item.name}>{item.name} · {item.className}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Subject teacher
                <select value={request.teacher} onChange={(event) => setRequest((prev) => ({ ...prev, teacher: event.target.value }))} className={inputClass}>
                  {teachers.slice(0, 10).map((teacher) => (
                    <option key={teacher.id} value={teacher.name}>{teacher.name} · {teacher.subject}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Meeting type
                <select value={request.mode} onChange={(event) => setRequest((prev) => ({ ...prev, mode: event.target.value }))} className={inputClass}>
                  {['In person', 'Online'].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Preferred slot *
                <select value={request.preferred} onChange={(event) => setRequest((prev) => ({ ...prev, preferred: event.target.value }))} className={inputClass}>
                  <option value="">Choose a slot…</option>
                  {slots.map((slot) => <option key={slot}>{slot}</option>)}
                </select>
              </label>
              <button type="button" onClick={book} className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
                Request meeting
              </button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Only one meeting can be booked in a slot, so conflicts are prevented. Online meetings use the link the
                academy publishes once a meeting provider is connected.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">My meetings</h2>
            <DataTable
              rows={meetings}
              searchKeys={['teacher', 'student', 'slot']}
              searchPlaceholder="Search meetings…"
              filters={[{ key: 'status', label: 'Status', options: ['Requested', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'] }]}
              selectable={false}
              columns={[
                { key: 'teacher', label: 'Teacher' },
                { key: 'subject', label: 'Subject' },
                { key: 'student', label: 'Student' },
                { key: 'slot', label: 'Slot' },
                { key: 'mode', label: 'Type' },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              ]}
              rowActions={(row) =>
                row.status === 'Requested' || row.status === 'Confirmed' ? (
                  <button type="button" onClick={() => cancel(row)} className="text-xs font-semibold text-muted-foreground hover:underline">
                    Cancel
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )
              }
              footerNote="Rescheduling is handled by the teacher and shown here"
            />
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4 space-y-6">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em]">Academic calendar</h2>
            <ul className="divide-y divide-border">
              {events.slice(0, 8).map((event) => (
                <li key={event.id} className="flex items-start gap-4 px-5 py-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground">
                    <span className="text-center leading-none">
                      <span className="block font-display text-base font-semibold">{new Date(event.date).getDate()}</span>
                      <span className="mt-0.5 block text-[10px] uppercase tracking-wider">
                        {new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{event.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span>{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</span>
                    </p>
                  </div>
                  <StatusBadge className="ml-auto shrink-0" value={event.category} tone="neutral" />
                </li>
              ))}
            </ul>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em]">Examination schedule</h2>
            <ul className="divide-y divide-border">
              {exams.filter((e) => children.some((c) => c.className === e.className)).slice(0, 6).map((exam) => (
                <li key={exam.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{exam.subject} · {exam.type}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{exam.className} · {exam.date} · {exam.start} · {exam.room}</p>
                  </div>
                  <StatusBadge value={exam.status} />
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';