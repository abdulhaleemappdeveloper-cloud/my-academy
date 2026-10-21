import { Briefcase, GraduationCap, Timer, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { formatMoney } from '@/lib/format';

/** Staff HR: records, leave, payroll, lesson observation and workload fairness. */
export default function AdminHR() {
  const staff = useCollection('staff');
  const teachers = useCollection('teachers');
  const payroll = useCollection('payroll');
  const lessonPlans = useCollection('lessonPlans');
  const substitutes = useCollection('substitutes');
  const attendance = useCollection('attendance');

  return (
    <div>
      <PageHeader
        title="Staff and HR"
        description="Staff records, leave and cover, payroll periods, lesson observations and workload. Salary information is restricted to authorised finance and ownership roles."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'HR and payroll' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Staff records" value={staff.length} hint={`${staff.filter((s) => s.status === 'Active').length} active`} icon={Users} />
        <StatCard label="Teaching accounts" value={teachers.length} hint="Class and subject teachers" icon={GraduationCap} />
        <StatCard label="Cover arrangements" value={substitutes.length} hint={`${substitutes.filter((s) => s.status === 'Pending').length} awaiting a decision`} icon={Timer} />
        <StatCard label="Payroll this period" value={formatMoney(payroll.reduce((s, p) => s + p.net, 0))} hint={`${payroll.filter((p) => p.status === 'Pending approval').length} awaiting approval`} tone="warning" icon={Briefcase} />
      </div>

      <Tabs defaultValue="staff" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="staff">Staff records</TabsTrigger>
          <TabsTrigger value="workload">Workload and observation</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="cover">Leave and cover</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-4">
          <DataTable
            rows={staff}
            searchKeys={['name', 'role', 'department', 'email']}
            searchPlaceholder="Search staff…"
            filters={[
              { key: 'department', label: 'Department', options: [...new Set(staff.map((s) => s.department))] },
              { key: 'status', label: 'Status', options: ['Active', 'On leave'] },
            ]}
            columns={[
              { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'role', label: 'Role' },
              { key: 'department', label: 'Department' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Mobile' },
              { key: 'joined', label: 'Joined' },
              { key: 'contractExpiry', label: 'Contract expiry' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Contract expiry reminders are configured from the automation module"
          />
        </TabsContent>

        <TabsContent value="workload" className="mt-4 space-y-6">
          <DataTable
            rows={teachers}
            searchKeys={['name', 'subject', 'classes']}
            searchPlaceholder="Search teachers…"
            filters={[{ key: 'status', label: 'Status', options: ['Active', 'On leave'] }]}
            columns={[
              { key: 'name', label: 'Teacher', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'subject', label: 'Main subject' },
              { key: 'classes', label: 'Classes', render: (row) => row.classes.join(', ') },
              { key: 'periodsPerWeek', label: 'Periods / week', align: 'right' },
              { key: 'pendingMarking', label: 'Marking outstanding', align: 'right' },
              { key: 'classTeacherOf', label: 'Class teacher of' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Workload supports planning and fairness — it is not an automatic measure of teaching quality"
          />
          <DataTable
            rows={lessonPlans}
            searchKeys={['title', 'teacher', 'className', 'subject']}
            searchPlaceholder="Search lesson plans…"
            filters={[{ key: 'observation', label: 'Observation', options: ['Scheduled', 'Completed', 'Not scheduled'] }]}
            pageSize={5}
            columns={[
              { key: 'title', label: 'Plan', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'teacher', label: 'Teacher' },
              { key: 'className', label: 'Class' },
              { key: 'objectives', label: 'Objectives', align: 'right' },
              { key: 'observation', label: 'Observation', render: (row) => <StatusBadge value={row.observation} /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Observation notes are restricted to the teacher and the observer"
          />
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <DataTable
            rows={payroll}
            searchKeys={['employee', 'role', 'department', 'period']}
            searchPlaceholder="Search payroll records…"
            filters={[
              { key: 'status', label: 'Status', options: ['Pending approval', 'Approved', 'Paid'] },
              { key: 'period', label: 'Period', options: [...new Set(payroll.map((p) => p.period))] },
            ]}
            columns={[
              { key: 'employee', label: 'Employee', render: (row) => <span className="font-medium">{row.employee}</span> },
              { key: 'role', label: 'Role' },
              { key: 'department', label: 'Department' },
              { key: 'basic', label: 'Basic', align: 'right', render: (row) => formatMoney(row.basic) },
              { key: 'allowances', label: 'Allowances', align: 'right', render: (row) => formatMoney(row.allowances) },
              { key: 'deductions', label: 'Deductions', align: 'right', render: (row) => formatMoney(row.deductions) },
              { key: 'net', label: 'Net', align: 'right', render: (row) => formatMoney(row.net) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'paidOn', label: 'Paid on' },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Approved', 'Paid'] }}
            footerNote="Payroll approval is separated from staff record editing; tax and statutory rules must be verified before use"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Salary information is visible only to the owner and the finance officer. The payroll module is optional and can be
            disabled from the feature flags screen.
          </p>
        </TabsContent>

        <TabsContent value="cover" className="mt-4 space-y-6">
          <DataTable
            rows={substitutes}
            searchKeys={['absentTeacher', 'substitute', 'className', 'subject']}
            searchPlaceholder="Search leave and cover…"
            filters={[{ key: 'status', label: 'Status', options: ['Pending', 'Allocated'] }]}
            pageSize={5}
            columns={[
              { key: 'absentTeacher', label: 'Absent teacher' },
              { key: 'date', label: 'Date' },
              { key: 'periods', label: 'Periods' },
              { key: 'className', label: 'Class' },
              { key: 'subject', label: 'Subject' },
              { key: 'substitute', label: 'Cover' },
              { key: 'conflict', label: 'Conflict check' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Affected lessons this week</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {substitutes.length} lessons need cover or a decision. Where no valid substitute is available, an authorised
              decision is required and is recorded with a reason. Affected staff are notified through the portal.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {attendance.filter((a) => a.status === 'Leave').length} student leave records are recorded separately from staff leave.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}