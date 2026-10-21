import { AlertTriangle, CalendarDays, ClipboardCheck, Info, Timer } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function StudentExams() {
  const { account } = useSession();
  const students = useCollection('students');
  const exams = useCollection('exams');
  const results = useCollection('results');
  const student = students.find((s) => s.name === account?.name) || students[9];
  const myExams = exams.filter((row) => row.className === student.className);
  const myResults = results.filter((row) => row.studentId === student.id);

  return (
    <div>
      <PageHeader
        title="Examinations"
        description="Your examination schedule, the rules that apply in the hall, and the results published so far."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Examinations' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Scheduled papers" value={myExams.filter((e) => e.status === 'Scheduled' || e.status === 'Approved').length} hint={`${student.className} · Section ${student.section}`} icon={CalendarDays} />
        <StatCard label="Completed" value={myExams.filter((e) => ['Completed', 'Grading', 'Published'].includes(e.status)).length} hint="Marking in progress where needed" icon={ClipboardCheck} />
        <StatCard label="Published results" value={myResults.filter((r) => r.status === 'Published').length} hint="Released after approval" tone="brand" icon={ClipboardCheck} />
        <StatCard label="Recheck requests" value={myResults.filter((r) => r.status === 'Recheck requested').length} hint="Reviewed by the examination controller" tone="warning" />
      </div>

      <Tabs defaultValue="schedule" className="mt-6">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <DataTable
            rows={myExams}
            searchKeys={['title', 'subject', 'type']}
            searchPlaceholder="Search examinations…"
            filters={[
              { key: 'subject', label: 'Subject', options: [...new Set(myExams.map((e) => e.subject))] },
              { key: 'type', label: 'Type', options: [...new Set(myExams.map((e) => e.type))] },
            ]}
            columns={[
              { key: 'subject', label: 'Subject', render: (row) => <span className="font-medium">{row.subject}</span> },
              { key: 'type', label: 'Type' },
              { key: 'date', label: 'Date' },
              { key: 'start', label: 'Reporting time' },
              { key: 'duration', label: 'Duration' },
              { key: 'room', label: 'Room' },
              { key: 'totalMarks', label: 'Marks', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
        </TabsContent>

        <TabsContent value="instructions" className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <Info className="h-4 w-4 text-primary" /> Before the paper
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Arrive thirty minutes before the reporting time printed on the timetable.',
                'Carry your admit slip and stationery in a clear pouch.',
                'Mobile phones and smart watches are not allowed in the hall.',
                'Check that your roll number and subject appear correctly on the answer sheet.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <Timer className="h-4 w-4 text-primary" /> During the paper
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Answers are written in the space provided; extra sheets must be attached and signed.',
                'Objective sections are marked automatically once the paper is collected.',
                'Written answers are marked by the subject teacher against the marking scheme.',
                'If you feel unwell, raise your hand — a supervisor will accompany you out of the hall.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-500/30 dark:bg-amber-500/10 lg:col-span-2">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4" /> Integrity and fairness
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
              Papers may use different question orders so that neighbouring students do not receive identical papers.
              Attempt limits and time limits are recorded with each submission. Suspicious activity flags only prompt a
              review by staff — they are never treated as proof of misconduct on their own.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <DataTable
            rows={myResults}
            searchKeys={['subject', 'exam']}
            searchPlaceholder="Search your results…"
            filters={[
              { key: 'status', label: 'Status', options: ['Published', 'Awaiting approval', 'Pending marking', 'Recheck requested'] },
              { key: 'subject', label: 'Subject', options: [...new Set(myResults.map((r) => r.subject))] },
            ]}
            columns={[
              { key: 'exam', label: 'Examination' },
              { key: 'subject', label: 'Subject' },
              { key: 'marks', label: 'Marks', align: 'right', render: (row) => `${row.marks} / ${row.total}` },
              { key: 'percent', label: 'Percent', align: 'right', render: (row) => `${row.percent}%` },
              { key: 'grade', label: 'Grade' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'publishedOn', label: 'Published' },
            ]}
            selectable={false}
            footerNote="Only approved and published results appear here"
          />
          <p className="mt-4 text-xs text-muted-foreground">
            A published result is changed only through the rechecking process. Open the results page to raise a recheck
            request with a reason.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}