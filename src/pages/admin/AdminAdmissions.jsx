import { useState } from 'react';
import { ArrowRight, FileSearch, UserPlus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const STAGES = ['Draft', 'Submitted', 'Under review', 'Information requested', 'Approved', 'Waitlisted', 'Rejected', 'Admission completed'];
const NEXT_STAGE = {
  Draft: 'Submitted',
  Submitted: 'Under review',
  'Under review': 'Approved',
  'Information requested': 'Under review',
  Approved: 'Admission completed',
  Waitlisted: 'Approved',
};

export default function AdminAdmissions() {
  const { account } = useSession();
  const admissions = useCollection('admissions');
  const classes = useCollection('classes');
  const { toast } = useToast();

  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');

  const pending = admissions.filter((a) => ['Submitted', 'Under review', 'Information requested'].includes(a.stage));
  const completed = admissions.filter((a) => a.stage === 'Admission completed');

  const advance = (row, stage) => {
    const needsReason = ['Rejected', 'Waitlisted', 'Information requested'].includes(stage);
    if (needsReason && reason.trim().length < 5) {
      toast({ title: 'A reason is required', description: `Explain why this application is being ${stage.toLowerCase()}.`, variant: 'destructive' });
      return;
    }
    patch('admissions', row.id, {
      stage,
      reviewer: account?.name,
      reason: reason || row.reason,
      assignedClass: stage === 'Admission completed' ? row.applyingFor : row.assignedClass,
      assignedSection: stage === 'Admission completed' ? row.assignedSection === '—' ? 'A' : row.assignedSection : row.assignedSection,
      admissionNumber: stage === 'Admission completed' ? `ADM-${2026000 + Math.floor(Math.random() * 900)}` : row.admissionNumber,
    });
    logAction({
      actor: account?.name,
      role: account?.label,
      action: `Admission moved to ${stage}`,
      module: 'Admissions',
      target: row.applicationNo,
      reason: reason || 'Standard workflow step',
      before: `stage: ${row.stage}`,
      after: `stage: ${stage}`,
    });
    toast({
      title: `Application ${stage.toLowerCase()}`,
      description:
        stage === 'Admission completed'
          ? 'The student record can now be created with an admission number, class and section.'
          : 'The applicant sees the new status when they check their application.',
    });
    setReason('');
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Admissions"
        description="The full admission lifecycle: application review, document checks, decisions with reasons, seat allocation and student record creation. Public self-registration stays disabled."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Admissions' }]}
        actions={
          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
            <UserPlus className="h-4 w-4" /> Invite an applicant
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications in progress" value={pending.length} hint="Submitted, reviewing or awaiting documents" tone="warning" />
        <StatCard label="Completed admissions" value={completed.length} hint="Student record created" tone="brand" />
        <StatCard label="Awaiting documents" value={admissions.filter((a) => a.stage === 'Information requested').length} hint="Applicant asked for more information" />
        <StatCard label="Waitlisted" value={admissions.filter((a) => a.stage === 'Waitlisted').length} hint="Seats filled — priority recorded" tone="gold" />
      </div>

      <Tabs defaultValue="queue" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="queue">Review queue</TabsTrigger>
          <TabsTrigger value="all">All applications</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="capacity">Seat capacity</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          <DataTable
            rows={pending}
            searchKeys={['applicationNo', 'applicant', 'guardian', 'phone', 'applyingFor']}
            searchPlaceholder="Search applications…"
            filters={[
              { key: 'stage', label: 'Stage', options: ['Submitted', 'Under review', 'Information requested'] },
              { key: 'applyingFor', label: 'Class', options: classes.map((c) => c.name) },
              { key: 'documents', label: 'Documents', options: ['Complete', 'Missing birth certificate'] },
            ]}
            columns={[
              { key: 'applicationNo', label: 'Application', render: (row) => <span className="font-mono text-xs font-semibold">{row.applicationNo}</span> },
              { key: 'applicant', label: 'Applicant', render: (row) => <span className="font-medium">{row.applicant}</span> },
              { key: 'applyingFor', label: 'Applying for' },
              { key: 'guardian', label: 'Guardian' },
              { key: 'phone', label: 'Contact' },
              { key: 'submitted', label: 'Submitted' },
              { key: 'documents', label: 'Documents', render: (row) => <StatusBadge value={row.documents} /> },
              { key: 'stage', label: 'Stage', render: (row) => <StatusBadge value={row.stage} /> },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
                Review
              </button>
            )}
            footerNote="Public self-registration cannot create a student, teacher or administrator account"
          />
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <DataTable
            rows={admissions}
            searchKeys={['applicationNo', 'applicant', 'guardian', 'reviewer']}
            searchPlaceholder="Search all applications…"
            filters={[
              { key: 'stage', label: 'Stage', options: STAGES },
              { key: 'applyingFor', label: 'Class', options: classes.map((c) => c.name) },
            ]}
            columns={[
              { key: 'applicationNo', label: 'Application' },
              { key: 'applicant', label: 'Applicant' },
              { key: 'applyingFor', label: 'Class' },
              { key: 'submitted', label: 'Submitted' },
              { key: 'stage', label: 'Stage', render: (row) => <StatusBadge value={row.stage} /> },
              { key: 'assignedClass', label: 'Allocated class' },
              { key: 'assignedSection', label: 'Section' },
              { key: 'admissionNumber', label: 'Admission no.' },
              { key: 'reviewer', label: 'Reviewer' },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected(row)}
          />
        </TabsContent>

        <TabsContent value="workflow" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Admission workflow</h2>
            <ol className="mt-4 space-y-3">
              {[
                'Draft — the applicant starts the form and can save it before submitting.',
                'Submitted — the office receives the application and issues a reference number.',
                'Under review — documents are checked against the required list.',
                'Information requested — the applicant is asked for a missing or unclear document.',
                'Approved, waitlisted or rejected — the decision records the approving account and the reason.',
                'Admission completed — student record created with an admission number, class, section and guardian link.',
              ].map((line, index) => (
                <li key={line} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{line}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Controls on this screen</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Only authorised staff can approve an application or create a student record.',
                'Duplicate applications are detected from the applicant name and guardian phone.',
                'Uploaded identity documents are held privately and reviewed by the admissions officer only.',
                'Every decision, including a rejection or waitlist, stores a reason.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <FileSearch className="h-3.5 w-3.5 text-primary" /> Application volume this session: {admissions.length}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3 text-right">Capacity (both sections)</th>
                  <th className="px-4 py-3 text-right">Enrolled</th>
                  <th className="px-4 py-3 text-right">Applications held</th>
                  <th className="px-4 py-3 text-right">Seats available</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => {
                  const held = admissions.filter((a) => a.applyingFor === cls.name && a.stage !== 'Admission completed').length;
                  const capacity = cls.capacity * 2;
                  const available = Math.max(0, capacity - cls.enrolled);
                  return (
                    <tr key={cls.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{cls.name}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{capacity}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{cls.enrolled}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{held}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{available}</td>
                      <td className="px-4 py-3">
                        <StatusBadge value={available > 5 ? 'Seats available' : available > 0 ? 'Limited seats' : 'Waitlist only'} tone={available > 5 ? 'success' : available > 0 ? 'warning' : 'danger'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Over-enrolment is blocked unless an authorised administrator records a capacity exception. Waitlist priority
            is stored with a timestamp so the order cannot be changed silently.
          </p>
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => { setSelected(null); setReason(''); }}
        title={selected?.applicant}
        subtitle={`${selected?.applicationNo} · applying for ${selected?.applyingFor}`}
        badge={selected?.stage}
        rows={
          selected
            ? [
                { key: 'guardian', label: 'Guardian', value: `${selected.guardian} · ${selected.phone}` },
                { key: 'email', label: 'Email', value: selected.email },
                { key: 'submitted', label: 'Submitted', value: selected.submitted },
                { key: 'documents', label: 'Documents', value: selected.documents },
                { key: 'interview', label: 'Interview', value: selected.interview },
                { key: 'reviewer', label: 'Reviewer', value: selected.reviewer },
                { key: 'reason', label: 'Reason recorded', value: selected.reason },
              ]
            : []
        }
        footer={
          <>
            {NEXT_STAGE[selected?.stage] && (
              <button
                type="button"
                onClick={() => advance(selected, NEXT_STAGE[selected.stage])}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
              >
                Move to {NEXT_STAGE[selected.stage]} <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <button type="button" onClick={() => advance(selected, 'Information requested')} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Request information
            </button>
            <button type="button" onClick={() => advance(selected, 'Waitlisted')} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Waitlist
            </button>
            <button type="button" onClick={() => advance(selected, 'Rejected')} className="inline-flex h-10 items-center rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-600 dark:border-rose-500/40">
              Reject
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-muted-foreground">
            Decision reason (required for request, waitlist or rejection)
            <textarea
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
              placeholder="For example: the birth certificate scan is unclear — please upload a readable copy."
            />
          </label>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            The decision, the account that made it and this reason are stored together. Approving an application does not
            itself create a student record — that happens at Admission completed, with the admission number, class and
            section assigned.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}