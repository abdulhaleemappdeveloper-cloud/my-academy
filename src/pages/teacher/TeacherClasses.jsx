import { useState } from 'react';
import { School, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function TeacherClasses() {
  const { account } = useSession();
  const teachers = useCollection('teachers');
  const classes = useCollection('classes');
  const sections = useCollection('sections');
  const students = useCollection('students');
  const subjects = useCollection('subjects');
  const mastery = useCollection('mastery');
  const teacher = teachers.find((t) => t.name === account?.name) || teachers[0];

  const [selected, setSelected] = useState(null);
  const myClasses = classes.filter((row) => teacher.classes.includes(row.name));
  const mySections = sections.filter((row) => teacher.classes.includes(row.className));
  const myStudents = students.filter((row) => teacher.classes.includes(row.className));
  const mySubjects = subjects.filter((row) => row.teachers.includes(teacher.name));

  return (
    <div>
      <PageHeader
        title="My classes and sections"
        description="Only the classes, sections and subjects assigned to you appear here. Student records outside your assignment are not accessible."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'My classes' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Classes" value={myClasses.length} hint={teacher.classes.join(', ')} icon={School} />
        <StatCard label="Sections" value={mySections.length} hint="Section A and Section B" icon={Users} />
        <StatCard label="Students" value={myStudents.length} hint="Across your classes" />
        <StatCard label="Subjects" value={mySubjects.length} hint={teacher.subject} tone="brand" />
      </div>

      <Tabs defaultValue="classes" className="mt-6">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((cls) => (
            <article key={cls.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">{cls.name}</h2>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-gold">{cls.level}</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint text-primary">
                  <School className="h-4 w-4" />
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Students</dt><dd className="font-semibold text-foreground">{cls.enrolled}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Capacity</dt><dd className="font-semibold text-foreground">{cls.capacity} per section</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Class teacher</dt><dd className="font-semibold text-foreground">{cls.classTeacher}</dd></div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Subjects: </span>{cls.subjects.join(', ')}
              </p>
              <button
                type="button"
                onClick={() => setSelected({ kind: 'class', row: cls })}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-input text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
              >
                Open class
              </button>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="sections" className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mySections.map((section) => (
            <article key={section.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading text-base font-bold text-foreground">{section.className} · Section {section.name}</h2>
                <StatusBadge value={section.placement} tone={section.name === 'A' ? 'brand' : 'gold'} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{section.placementNote}</p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Enrolled</dt><dd className="font-semibold text-foreground">{section.enrolled} of {section.capacity}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Class teacher</dt><dd className="font-semibold text-foreground">{section.classTeacher}</dd></div>
              </dl>
              <button
                type="button"
                onClick={() => setSelected({ kind: 'section', row: section })}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-input text-sm font-semibold text-foreground"
              >
                View roster
              </button>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          <DataTable
            rows={myStudents}
            searchKeys={['name', 'code', 'rollNumber', 'className', 'section']}
            searchPlaceholder="Search your students…"
            filters={[
              { key: 'className', label: 'Class', options: teacher.classes },
              { key: 'section', label: 'Section', options: ['A', 'B'] },
              { key: 'status', label: 'Status', options: ['Active', 'On leave', 'Suspended'] },
            ]}
            columns={[
              { key: 'name', label: 'Student', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'rollNumber', label: 'Roll number' },
              { key: 'className', label: 'Class' },
              { key: 'section', label: 'Section' },
              { key: 'attendancePct', label: 'Attendance', align: 'right', render: (row) => `${row.attendancePct}%` },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected({ kind: 'student', row })}
            footerNote="Guardian contact details are visible only where the office has granted access"
          />
        </TabsContent>

        <TabsContent value="subjects" className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mySubjects.map((subject) => (
            <article key={subject.id} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-heading text-base font-bold text-foreground">{subject.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{subject.classes.join(', ')}</p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Chapters</dt><dd className="font-semibold text-foreground">{subject.chapters}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Topics</dt><dd className="font-semibold text-foreground">{subject.topics}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Materials</dt><dd className="font-semibold text-foreground">{subject.materials}</dd></div>
              </dl>
              <StatusBadge className="mt-3" value={subject.status} />
            </article>
          ))}
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={
          selected?.kind === 'student'
            ? selected.row.name
            : selected?.kind === 'section'
            ? `${selected.row.className} · Section ${selected.row.name}`
            : selected?.row.name
        }
        subtitle={selected?.kind === 'student' ? `${selected.row.className} · Section ${selected.row.section}` : selected?.row.level || selected?.row.placement}
        badge={selected?.row.status || selected?.row.placement}
      >
        {selected?.kind === 'student' && (
          <div className="space-y-4">
            <dl className="divide-y divide-border rounded-xl border border-border">
              {[
                ['Roll number', selected.row.rollNumber],
                ['Attendance', `${selected.row.attendancePct}%`],
                ['Guardian link', `${selected.row.guardianRelation} · ${selected.row.guardianName}`],
                ['Fee status', selected.row.feeBalance ? 'Balance outstanding' : 'Cleared'],
                ['Admission date', selected.row.admissionDate],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-3 px-4 py-2.5">
                  <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                  <dd className="col-span-2 text-sm text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Topic mastery</p>
              <ul className="mt-2 space-y-2">
                {mastery.filter((m) => m.studentId === selected.row.id).map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                    <span className="text-sm text-foreground">{row.subject} · {row.topic}</span>
                    <StatusBadge value={row.level} />
                  </li>
                ))}
                {mastery.filter((m) => m.studentId === selected.row.id).length === 0 && (
                  <li className="text-sm text-muted-foreground">No mastery records yet for this student.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {selected?.kind === 'section' && (
          <ul className="space-y-2">
            {students
              .filter((row) => row.className === selected.row.className && row.section === selected.row.name)
              .slice(0, 12)
              .map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{row.name}</span>
                    <span className="block text-xs text-muted-foreground">{row.rollNumber}</span>
                  </span>
                  <StatusBadge value={row.status} />
                </li>
              ))}
          </ul>
        )}

        {selected?.kind === 'class' && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {selected.row.name} runs Section A and Section B with the same syllabus. Use the attendance and assessment
              screens to record work for this class.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Mark attendance', 'Create an assessment', 'Upload notes', 'View progress'].map((action) => (
                <span key={action} className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground">{action}</span>
              ))}
            </div>
          </div>
        )}
      </RecordDrawer>
    </div>
  );
}