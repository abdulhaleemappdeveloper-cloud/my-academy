import { TrendingUp, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function TeacherStudents() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const students = useCollection('students');
  const mastery = useCollection('mastery');
  const results = useCollection('results');
  const attendance = useCollection('attendance');
  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];
  const myStudents = students.filter((row) => teacher.classes.includes(row.className));

  const summarise = (student) => {
    const rows = results.filter((r) => r.studentId === student.id && r.status === 'Published');
    const average = rows.length ? Math.round(rows.reduce((sum, r) => sum + r.percent, 0) / rows.length) : null;
    const marked = attendance.filter((a) => a.studentId === student.id);
    const present = marked.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    const rate = marked.length ? Math.round((present / marked.length) * 100) : student.attendancePct;
    const topics = mastery.filter((m) => m.studentId === student.id);
    const supports = topics.filter((t) => t.level === 'Emerging' || t.level === 'Developing').length;
    return { average, rate, topics: topics.length, supports };
  };

  const watching = myStudents.filter((student) => {
    const { rate, supports, average } = summarise(student);
    return rate < 85 || supports > 0 || (average !== null && average < 55);
  });

  return (
    <div>
      <PageHeader
        title="Student progress"
        description="Attendance, results and topic mastery for the students in your assigned classes, with clear indicators of where support may help."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Student progress' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students in my classes" value={myStudents.length} hint={teacher.classes.join(', ')} icon={Users} />
        <StatCard label="May need support" value={watching.length} hint="Attendance, mastery or results" tone={watching.length ? 'warning' : 'brand'} icon={TrendingUp} />
        <StatCard label="Mastery records" value={mastery.filter((m) => teacher.classes.includes(m.className)).length} hint="Topic-level evidence" />
        <StatCard label="Attendance below 85%" value={myStudents.filter((s) => s.attendancePct < 85).length} hint="Consider a guardian conversation" tone="warning" />
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All students</TabsTrigger>
          <TabsTrigger value="support">Support indicators</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <DataTable
            rows={myStudents}
            searchKeys={['name', 'code', 'rollNumber', 'className', 'section']}
            searchPlaceholder="Search students…"
            filters={[
              { key: 'className', label: 'Class', options: teacher.classes },
              { key: 'section', label: 'Section', options: ['A', 'B'] },
            ]}
            columns={[
              { key: 'name', label: 'Student', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'className', label: 'Class' },
              { key: 'section', label: 'Section' },
              { key: 'attendance', label: 'Attendance', align: 'right', render: (row) => `${summarise(row).rate}%` },
              { key: 'average', label: 'Result average', align: 'right', render: (row) => (summarise(row).average === null ? '—' : `${summarise(row).average}%`) },
              { key: 'supports', label: 'Support topics', align: 'right', render: (row) => summarise(row).supports },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Indicators are review prompts, never automatic decisions"
          />
        </TabsContent>

        <TabsContent value="support" className="mt-4 space-y-4">
          <div className="flex gap-3 rounded-2xl border border-border bg-cream p-5">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              These indicators combine attendance, missing work and topic-level mastery. They are explainable and
              reviewable, and they are not diagnoses. No student is punished, excluded or permanently labelled on the
              strength of a single indicator.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {watching.map((student) => {
                const data = summarise(student);
                const reasons = [
                  data.rate < 85 ? `Attendance ${data.rate}%` : null,
                  data.supports > 0 ? `${data.supports} topic(s) needing revision` : null,
                  data.average !== null && data.average < 55 ? `Result average ${data.average}%` : null,
                ].filter(Boolean);
                return (
                  <li key={student.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <img src={student.photo} alt={student.name} className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.className} · Section {student.section}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {reasons.map((reason) => (
                        <StatusBadge key={reason} value={reason} tone="warning" />
                      ))}
                      <span className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground">
                        Plan a review
                      </span>
                    </div>
                  </li>
                );
              })}
              {watching.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No support indicators are flagged at the moment. Keep recording attendance and assessment evidence.
                </li>
              )}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}