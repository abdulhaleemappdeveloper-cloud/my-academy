import { CalendarDays, Trophy, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

/** Clubs, competitions, projects, portfolios and the alumni directory. */
export default function AdminActivities() {
  const activities = useCollection('activities');
  const awards = useCollection('awards');
  const projects = useCollection('projects');
  const portfolios = useCollection('portfolios');
  const events = useCollection('events');
  const alumni = useCollection('alumni');

  return (
    <div>
      <PageHeader
        title="Activities, projects and alumni"
        description="Clubs and competitions with consent tracking, project-based learning, student portfolios, the campus calendar and the alumni directory."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Activities and awards' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Activities running" value={activities.filter((a) => a.status === 'Active').length} hint={`${activities.reduce((s, a) => s + a.registered, 0)} participants`} icon={Users} />
        <StatCard label="Projects this term" value={projects.length} hint={`${projects.filter((p) => p.status === 'Assessed').length} assessed`} />
        <StatCard label="Achievements recorded" value={awards.length} hint={`${awards.filter((a) => a.certificate === 'Issued').length} certificates issued`} tone="brand" icon={Trophy} />
        <StatCard label="Campus events" value={events.length} hint={`${events.filter((e) => new Date(e.date) >= new Date()).length} upcoming`} icon={CalendarDays} />
      </div>

      <Tabs defaultValue="activities" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="activities">Clubs and activities</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="awards">Achievements</TabsTrigger>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-4">
          <DataTable
            rows={activities}
            searchKeys={['name', 'supervisor', 'day']}
            searchPlaceholder="Search activities…"
            filters={[{ key: 'status', label: 'Status', options: ['Active', 'Scheduled'] }]}
            columns={[
              { key: 'name', label: 'Activity', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'supervisor', label: 'Supervisor' },
              { key: 'day', label: 'Day' },
              { key: 'time', label: 'Time' },
              { key: 'registered', label: 'Registered', align: 'right', render: (row) => `${row.registered} / ${row.capacity}` },
              { key: 'consentRequired', label: 'Guardian consent', render: (row) => <StatusBadge value={row.consentRequired ? 'Required' : 'Not required'} tone="neutral" /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Guardian consent is recorded before a student takes part in an activity"
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <DataTable
            rows={projects}
            searchKeys={['title', 'className', 'teacher', 'type']}
            searchPlaceholder="Search projects…"
            filters={[
              { key: 'type', label: 'Type', options: ['Group', 'Individual'] },
              { key: 'status', label: 'Status', options: ['Open', 'In progress', 'Submitted', 'Assessed'] },
            ]}
            columns={[
              { key: 'title', label: 'Project', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'className', label: 'Class' },
              { key: 'teacher', label: 'Supervising teacher' },
              { key: 'type', label: 'Type' },
              { key: 'members', label: 'Members', align: 'right' },
              { key: 'completed', label: 'Milestones', align: 'right', render: (row) => `${row.completed} / ${row.milestones}` },
              { key: 'rubric', label: 'Rubric' },
              { key: 'due', label: 'Due' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Students cannot edit another student's submission — only their own group's work"
          />
        </TabsContent>

        <TabsContent value="awards" className="mt-4">
          <DataTable
            rows={awards}
            searchKeys={['studentName', 'award', 'activity', 'awardedBy']}
            searchPlaceholder="Search achievements…"
            filters={[
              { key: 'activity', label: 'Activity', options: [...new Set(awards.map((a) => a.activity))] },
              { key: 'certificate', label: 'Certificate', options: ['Issued', 'Pending generation'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'award', label: 'Achievement' },
              { key: 'activity', label: 'Activity' },
              { key: 'date', label: 'Awarded' },
              { key: 'awardedBy', label: 'Awarded by' },
              { key: 'certificate', label: 'Certificate', render: (row) => <StatusBadge value={row.certificate} /> },
            ]}
            selectable
            bulkStatus={{ key: 'certificate', options: ['Pending generation'] }}
          />
        </TabsContent>

        <TabsContent value="portfolios" className="mt-4">
          <DataTable
            rows={portfolios}
            searchKeys={['studentName', 'className', 'visibility']}
            searchPlaceholder="Search portfolios…"
            filters={[{ key: 'visibility', label: 'Visibility', options: ['Teachers only', 'Teachers and guardians', 'Shared with student'] }]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'projects', label: 'Projects', align: 'right' },
              { key: 'assignments', label: 'Assignments', align: 'right' },
              { key: 'certificates', label: 'Certificates', align: 'right' },
              { key: 'achievements', label: 'Achievements', align: 'right' },
              { key: 'visibility', label: 'Visibility', render: (row) => <StatusBadge value={row.visibility} /> },
              { key: 'lastUpdated', label: 'Updated' },
            ]}
            selectable={false}
            footerNote="Only work the student and teacher have chosen to include appears in a portfolio"
          />
        </TabsContent>

        <TabsContent value="alumni" className="mt-4">
          <DataTable
            rows={alumni}
            searchKeys={['name', 'program', 'graduationYear', 'current']}
            searchPlaceholder="Search alumni…"
            filters={[
              { key: 'program', label: 'Programme', options: [...new Set(alumni.map((a) => a.program))] },
              { key: 'consentToContact', label: 'Contact consent', options: ['true', 'false'] },
            ]}
            columns={[
              { key: 'name', label: 'Alumni', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'graduationYear', label: 'Graduated' },
              { key: 'program', label: 'Programme' },
              { key: 'current', label: 'Current activity' },
              { key: 'achievements', label: 'Achievements' },
              { key: 'mentoring', label: 'Mentoring', render: (row) => <StatusBadge value={row.mentoring ? 'Volunteered' : 'Not offered'} tone="neutral" /> },
              { key: 'consentToContact', label: 'Contact consent', render: (row) => <StatusBadge value={row.consentToContact ? 'Given' : 'Not given'} tone="neutral" /> },
            ]}
            selectable={false}
            footerNote="Alumni contact details are never published by default; only consented contacts may be reached"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}