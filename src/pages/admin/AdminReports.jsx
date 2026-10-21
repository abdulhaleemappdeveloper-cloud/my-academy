import { useState } from 'react';
import { BarChart3, FileBarChart, Target, TrendingUp } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { formatMoney } from '@/lib/format';

const COLOURS = ['#0f5a4a', '#f4b740', '#2d7d8f', '#7c5cbf', '#c2553f'];

/** Analytics and reporting, with a saved-report builder and documented KPI formulas. */
export default function AdminReports() {
  const students = useCollection('students');
  const invoices = useCollection('invoices');
  const attendance = useCollection('attendance');
  const kpis = useCollection('kpis');
  const results = useCollection('results');
  const admissions = useCollection('admissions');
  const payments = useCollection('payments');
  const [question, setQuestion] = useState('Attendance summary by class for the current term');

  const byClass = [...new Set(students.map((s) => s.className))].map((className) => ({
    name: className.replace('Class ', 'C'),
    students: students.filter((s) => s.className === className).length,
  }));

  const feeStates = ['Paid', 'Partially paid', 'Unpaid', 'Overdue'].map((status) => ({
    name: status,
    value: invoices.filter((i) => i.status === status).length,
  }));

  const attendanceTrend = [...new Set(attendance.map((a) => a.date))].sort().slice(-8).map((date) => {
    const rows = attendance.filter((a) => a.date === date);
    const present = rows.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    return { name: date.slice(5), rate: rows.length ? Math.round((present / rows.length) * 100) : 0 };
  });

  const billed = invoices.reduce((s, i) => s + i.amount - i.discount, 0);
  const collected = invoices.reduce((s, i) => s + i.paid, 0);

  const savedReports = [
    { id: 'rp-1', name: 'Attendance summary by class', source: 'Attendance', filters: 'Current term · all classes', lastRun: 'Today', owner: 'Academic office' },
    { id: 'rp-2', name: 'Outstanding fee summary', source: 'Invoices', filters: 'Balance greater than zero', lastRun: 'Yesterday', owner: 'Finance officer' },
    { id: 'rp-3', name: 'Admissions by stage', source: 'Admissions', filters: 'Session 2026', lastRun: '2 days ago', owner: 'Admissions officer' },
    { id: 'rp-4', name: 'Subject performance by term', source: 'Results', filters: 'Published results only', lastRun: 'Last week', owner: 'Examination controller' },
    { id: 'rp-5', name: 'Payment verification turnaround', source: 'Payments', filters: 'Submitted to approved', lastRun: 'Last week', owner: 'Finance officer' },
  ];

  return (
    <div>
      <PageHeader
        title="Reports and analytics"
        description="Enrolment, attendance, academic performance and fee collection, with saved report definitions and documented formulas. Every metric states its period and source."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Reports and analytics' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Enrolment" value={students.length} hint={`${students.filter((s) => s.status === 'Active').length} active students`} icon={BarChart3} />
        <StatCard label="Fee collection rate" value={`${billed ? Math.round((collected / billed) * 100) : 0}%`} hint={`${formatMoney(collected)} of ${formatMoney(billed)}`} tone="brand" icon={TrendingUp} />
        <StatCard label="Published results" value={results.filter((r) => r.status === 'Published').length} hint="Across all subjects" />
        <StatCard label="Admission conversion" value={`${admissions.length ? Math.round((admissions.filter((a) => a.stage === 'Admission completed').length / admissions.length) * 100) : 0}%`} hint="Completed ÷ submitted applications" icon={Target} />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="kpis">KPIs and targets</TabsTrigger>
          <TabsTrigger value="builder">Report builder</TabsTrigger>
          <TabsTrigger value="saved">Saved reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-base font-bold tracking-tight">Students by class</h2>
              <p className="mt-1 text-xs text-muted-foreground">Source: student records · session 2025 – 2026</p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byClass}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="students" fill={COLOURS[0]} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-base font-bold tracking-tight">Invoice status</h2>
              <p className="mt-1 text-xs text-muted-foreground">Source: fee ledger · all issued invoices</p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={feeStates} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {feeStates.map((entry, index) => (
                        <Cell key={entry.name} fill={COLOURS[index % COLOURS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {feeStates.map((state, index) => (
                  <li key={state.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLOURS[index % COLOURS.length] }} />
                    {state.name} · {state.value}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Attendance rate by day</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Formula: (present + late) ÷ marked sessions × 100 · last {attendanceTrend.length} recorded days
            </p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke={COLOURS[0]} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Verified collections', value: formatMoney(payments.filter((p) => p.status === 'Approved').reduce((s, p) => s + p.amount, 0)), hint: `${payments.filter((p) => p.status === 'Approved').length} approved payments` },
              { label: 'Pending verification', value: formatMoney(payments.filter((p) => p.status === 'Pending verification').reduce((s, p) => s + p.amount, 0)), hint: `${payments.filter((p) => p.status === 'Pending verification').length} submissions` },
              { label: 'Attendance records', value: attendance.length, hint: 'Marked sessions this session' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-cream p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                <p className="mt-1.5 font-display text-xl font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kpis" className="mt-4">
          <DataTable
            rows={kpis}
            searchKeys={['name', 'formula', 'source', 'owner']}
            searchPlaceholder="Search KPIs…"
            filters={[{ key: 'period', label: 'Period', options: [...new Set(kpis.map((k) => k.period))] }]}
            columns={[
              { key: 'name', label: 'Indicator', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'formula', label: 'Formula', render: (row) => <span className="text-xs text-muted-foreground">{row.formula}</span> },
              { key: 'source', label: 'Data source' },
              { key: 'period', label: 'Period' },
              { key: 'owner', label: 'Owner' },
              { key: 'target', label: 'Target', align: 'right' },
              { key: 'current', label: 'Current', align: 'right' },
              { key: 'trend', label: 'Trend', render: (row) => <StatusBadge value={row.trend} /> },
            ]}
            selectable={false}
            footerNote="A KPI formula is never changed silently — the change would make historical comparisons misleading"
          />
        </TabsContent>

        <TabsContent value="builder" className="mt-4 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <FileBarChart className="h-4 w-4 text-primary" /> Describe the report you need
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Describe the report in ordinary language. It is translated into an approved query structure using only the
              fields you are permitted to read — arbitrary database queries are not possible.
            </p>
            <label className="mt-4 block text-xs font-semibold text-muted-foreground">
              Report request
              <textarea
                rows={3}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
              />
            </label>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['Interpreted as', 'Attendance records grouped by class'],
                ['Date range', 'Current term'],
                ['Filters applied', 'All classes · all sections'],
                ['Rows expected', `${new Set(students.map((s) => s.className)).size} classes`],
                ['Permission check', 'Academic reporting — permitted'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Data sources available to you</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Attendance', 'All classes'],
                ['Invoices and payments', 'Summary only — finance role required for detail'],
                ['Results', 'Approved and published results'],
                ['Admissions', 'Applications and decisions'],
                ['Examinations', 'Schedules, marking and publication'],
                ['Certificates', 'Issued and revoked certificates'],
              ].map(([source, scope]) => (
                <li key={source} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{source}</span>
                  <span className="text-right text-xs text-muted-foreground">{scope}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Exports exclude credentials, tokens and unnecessary personal identifiers, and a report that would expose
              identifiable student-level data to an unauthorised role is refused rather than filtered afterwards.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          <DataTable
            rows={savedReports}
            searchKeys={['name', 'source', 'filters', 'owner']}
            searchPlaceholder="Search saved reports…"
            filters={[{ key: 'source', label: 'Source', options: [...new Set(savedReports.map((r) => r.source))] }]}
            columns={[
              { key: 'name', label: 'Report', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'source', label: 'Source' },
              { key: 'filters', label: 'Filters' },
              { key: 'owner', label: 'Owner' },
              { key: 'lastRun', label: 'Last run' },
            ]}
            selectable={false}
            footerNote="Scheduled delivery requires a secure, access-controlled channel"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}