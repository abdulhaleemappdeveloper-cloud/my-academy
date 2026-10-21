import { AlertTriangle, BookOpen, CalendarRange, Layers, School, Target } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/**
 * Academic configuration.
 * Academic years, classes and sections, subjects with chapters and topics, curriculum
 * coverage, and the promotion and section-allocation rules.
 */
export default function AdminAcademics() {
  const years = useCollection('academicYears');
  const terms = useCollection('terms');
  const classes = useCollection('classes');
  const sections = useCollection('sections');
  const subjects = useCollection('subjects');
  const chapters = useCollection('chapters');
  const topics = useCollection('topics');
  const curriculumMap = useCollection('curriculumMap');
  const students = useCollection('students');
  const mastery = useCollection('mastery');

  const classColumns = [
    { key: 'name', label: 'Class', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'level', label: 'Level' },
    { key: 'classTeacher', label: 'Class teacher' },
    { key: 'subjects', label: 'Subjects', render: (row) => row.subjects.join(', ') },
    { key: 'enrolled', label: 'Enrolled', align: 'right' },
    { key: 'capacity', label: 'Capacity per section', align: 'right' },
  ];

  return (
    <div>
      <PageHeader
        title="Academic structure and configuration"
        description="Define academic years, terms, classes, sections, subjects, chapters and topics without changing any code. Changes are validated before they are applied to existing records."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Academic structure' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Academic years" value={years.length} hint={`${years.filter((y) => y.status === 'Active').length} active, ${years.filter((y) => y.locked).length} locked`} icon={CalendarRange} />
        <StatCard label="Classes" value={classes.length} hint={`${sections.length} sections`} icon={School} />
        <StatCard label="Subjects" value={subjects.length} hint={`${chapters.length} chapters · ${topics.length} topics`} icon={BookOpen} />
        <StatCard label="Curriculum gaps" value={curriculumMap.filter((c) => c.gap !== 'No gaps detected').length} hint="Topics without published material" tone="warning" icon={Target} />
      </div>

      <Tabs defaultValue="years" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="years">Years and terms</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="subjects">Subjects and chapters</TabsTrigger>
          <TabsTrigger value="coverage">Curriculum coverage</TabsTrigger>
          <TabsTrigger value="promotion">Promotion and allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="years" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Academic years</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3 text-right">Students</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((row) => (
                    <tr key={row.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.start} → {row.end}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{row.students}</td>
                      <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Moving to a new academic year creates a new year rather than overwriting the last one. Historic marks,
              attendance, payments and reports stay attached to their own year.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Terms</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="px-4 py-3">Term</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Examinations</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((row) => (
                    <tr key={row.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.start} → {row.end}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.exams}</td>
                      <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="classes" className="mt-4">
          <DataTable
            rows={classes}
            searchKeys={['name', 'level', 'classTeacher']}
            searchPlaceholder="Search classes…"
            filters={[
              { key: 'level', label: 'Level', options: [...new Set(classes.map((c) => c.level))] },
            ]}
            columns={classColumns}
            selectable={false}
            footerNote="Capacity is checked before a student is enrolled in a section"
          />
        </TabsContent>

        <TabsContent value="sections" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <article key={section.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-heading text-base font-bold text-foreground">{section.className} · Section {section.name}</h2>
                <StatusBadge value={section.placement} tone={section.name === 'A' ? 'brand' : 'gold'} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{section.placementNote}</p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Enrolled</dt><dd className="font-semibold text-foreground">{section.enrolled} of {section.capacity}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Class teacher</dt><dd className="font-semibold text-foreground">{section.classTeacher}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Seats available</dt><dd className="font-semibold text-foreground">{Math.max(0, section.capacity - section.enrolled)}</dd></div>
              </dl>
            </article>
          ))}
          <div className="rounded-2xl border border-primary/20 bg-brand-tint p-5 sm:col-span-2 lg:col-span-3">
            <p className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Section A and Section B are not permanent labels of ability. Allocation and any transfer are decided by
              staff after a performance review, with a recorded reason, and the previous placement stays in history.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="mt-4 space-y-8">
          <DataTable
            rows={subjects}
            searchKeys={['name']}
            searchPlaceholder="Search subjects…"
            filters={[{ key: 'status', label: 'Status', options: ['Published', 'Draft'] }]}
            columns={[
              { key: 'name', label: 'Subject', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'levels', label: 'Levels' },
              { key: 'classes', label: 'Classes' },
              { key: 'teachers', label: 'Teachers' },
              { key: 'chapters', label: 'Chapters', align: 'right' },
              { key: 'topics', label: 'Topics', align: 'right' },
              { key: 'materials', label: 'Materials', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            pageSize={7}
          />

          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Chapters and topics</h2>
            <DataTable
              rows={chapters}
              searchKeys={['title', 'subject', 'className']}
              searchPlaceholder="Search chapters…"
              filters={[
                { key: 'subject', label: 'Subject', options: [...new Set(chapters.map((c) => c.subject))] },
                { key: 'status', label: 'Status', options: ['Published', 'Draft'] },
              ]}
              columns={[
                { key: 'order', label: '#', align: 'right' },
                { key: 'title', label: 'Chapter', render: (row) => <span className="font-medium">{row.title}</span> },
                { key: 'className', label: 'Class' },
                { key: 'topics', label: 'Topics', align: 'right' },
                { key: 'objectives', label: 'Objectives', align: 'right' },
                { key: 'materials', label: 'Materials', align: 'right' },
                { key: 'covered', label: 'Taught', render: (row) => <StatusBadge value={row.covered ? 'Covered' : 'Not covered'} /> },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              ]}
              selectable={false}
              pageSize={7}
              footerNote="Chapter order and topic order are configurable per class"
            />
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="mt-4">
          <DataTable
            rows={curriculumMap}
            searchKeys={['className', 'subject', 'outcome']}
            searchPlaceholder="Search curriculum outcomes…"
            filters={[
              { key: 'className', label: 'Class', options: [...new Set(curriculumMap.map((c) => c.className))] },
              { key: 'subject', label: 'Subject', options: [...new Set(curriculumMap.map((c) => c.subject))] },
            ]}
            columns={[
              { key: 'className', label: 'Class' },
              { key: 'subject', label: 'Subject' },
              { key: 'outcome', label: 'Learning outcome' },
              { key: 'topicsMapped', label: 'Topics mapped', align: 'right' },
              { key: 'materials', label: 'Materials', align: 'right' },
              { key: 'assessments', label: 'Assessments', align: 'right' },
              { key: 'coverage', label: 'Coverage', align: 'right' },
              { key: 'gap', label: 'Gap', render: (row) => <StatusBadge value={row.gap === 'No gaps detected' ? 'No gaps' : 'Gap found'} /> },
            ]}
            selectable={false}
            footerNote="A topic is only marked as taught when a teacher records it — uploading material alone does not count"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {mastery.length} mastery records are available to support these coverage figures.
          </p>
        </TabsContent>

        <TabsContent value="promotion" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Promotion policy</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {[
                ['Minimum aggregate', '40% across assessed subjects'],
                ['Minimum attendance', '75% of marked sessions'],
                ['Fail subjects', 'At most one, with a supplementary attempt'],
                ['Recommendation', 'Calculated from results and attendance — decided by staff'],
                ['Section allocation', 'Reviewed each term by the academic committee'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              The system may calculate eligibility, but promotion, retention and section moves are consequential
              decisions that always follow the configured approval process.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Bulk promotion preview</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Promotion runs in stages: eligibility calculated from published results and attendance, a preview of
              affected students, confirmation by an authorised administrator, then a report of successful and
              unsuccessful records.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                [`${students.filter((s) => s.status === 'Active').length} active students would be considered`, 'Ready'],
                [`${students.filter((s) => s.attendancePct < 75).length} students fall below the attendance rule`, 'Needs a decision'],
                [`${curriculumMap.filter((c) => c.gap !== 'No gaps detected').length} subjects have curriculum gaps`, 'Review first'],
              ].map(([label, status]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <StatusBadge value={status} />
                </li>
              ))}
            </ul>
            <button type="button" className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <Layers className="h-4 w-4" /> Simulate the promotion run
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Nothing is committed until an authorised administrator confirms the preview.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}