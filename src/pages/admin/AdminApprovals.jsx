import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

/**
 * Unified approvals inbox.
 * High-impact decisions are made one record at a time; bulk approval is deliberately
 * not offered for financial, academic or permission changes.
 */
export default function AdminApprovals() {
  const { account } = useSession();
  const approvals = useCollection('approvals');
  const tickets = useCollection('tickets');
  const dataQuality = useCollection('dataQuality');
  const { toast } = useToast();

  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');
  const pending = approvals.filter((a) => a.status === 'Pending');

  const decide = (outcome) => {
    if (!selected) return;
    if (outcome !== 'Approved' && reason.trim().length < 5) {
      toast({ title: 'Add a reason', description: 'A reason is required when returning or rejecting a request.', variant: 'destructive' });
      return;
    }
    patch('approvals', selected.id, { status: outcome, decision: `${outcome} by ${account?.name}${reason ? ` — ${reason}` : ''}` });
    logAction({
      actor: account?.name,
      role: account?.label,
      action: `${outcome} ${selected.type.toLowerCase()}`,
      module: selected.type,
      target: selected.title,
      reason: reason || 'Routine approval',
      before: 'status: Pending',
      after: `status: ${outcome}`,
    });
    toast({
      title: `${selected.type} ${outcome.toLowerCase()}`,
      description: `${selected.title} was ${outcome.toLowerCase()} and the decision is recorded in the audit log.`,
    });
    setReason('');
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Approvals inbox"
        description="One queue for every decision that needs authorisation: admissions, payment verification, result publication, refunds, transfers and content publishing."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Approvals inbox' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending decisions" value={pending.length} hint="Across all modules" tone={pending.length ? 'warning' : 'brand'} />
        <StatCard label="High priority" value={pending.filter((p) => p.priority === 'High').length} hint="Financial or academic impact" tone="danger" />
        <StatCard label="Decided this session" value={approvals.filter((a) => a.status !== 'Pending').length} hint="Recorded with a reason" tone="brand" />
        <StatCard label="Data quality follow-ups" value={dataQuality.filter((d) => d.status === 'Open').length} hint="Suggested corrections" />
      </div>

      <Tabs defaultValue="pending" className="mt-6">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="decided">Decided</TabsTrigger>
          <TabsTrigger value="tickets">Support tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <DataTable
            rows={pending}
            searchKeys={['title', 'type', 'requester']}
            searchPlaceholder="Search requests…"
            filters={[
              { key: 'type', label: 'Type', options: [...new Set(approvals.map((a) => a.type))] },
              { key: 'priority', label: 'Priority', options: ['High', 'Medium', 'Low'] },
            ]}
            columns={[
              { key: 'title', label: 'Request', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} tone="brand" /> },
              { key: 'requester', label: 'Raised by' },
              { key: 'waiting', label: 'Waiting' },
              { key: 'evidence', label: 'Evidence' },
              { key: 'priority', label: 'Priority', render: (row) => <StatusBadge value={row.priority} /> },
            ]}
            selectable={false}
            onRowClick={(row) => setSelected(row)}
            rowActions={(row) => (
              <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
                Review
              </button>
            )}
            footerNote="Each record is decided individually — bulk approval is not available for financial or academic decisions"
          />
        </TabsContent>

        <TabsContent value="decided" className="mt-4">
          <DataTable
            rows={approvals.filter((a) => a.status !== 'Pending')}
            searchKeys={['title', 'type', 'decision']}
            searchPlaceholder="Search decisions…"
            columns={[
              { key: 'title', label: 'Request' },
              { key: 'type', label: 'Type' },
              { key: 'decision', label: 'Decision' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            emptyTitle="No decisions recorded yet"
          />
        </TabsContent>

        <TabsContent value="tickets" className="mt-4">
          <DataTable
            rows={tickets}
            searchKeys={['reference', 'subject', 'raisedBy', 'assignedTo']}
            searchPlaceholder="Search support tickets…"
            filters={[
              { key: 'status', label: 'Status', options: ['Open', 'In progress', 'Waiting on user', 'Resolved', 'Closed'] },
              { key: 'priority', label: 'Priority', options: ['Low', 'Medium', 'High', 'Urgent'] },
              { key: 'category', label: 'Category', options: [...new Set(tickets.map((t) => t.category))] },
            ]}
            columns={[
              { key: 'reference', label: 'Reference' },
              { key: 'subject', label: 'Subject', render: (row) => <span className="font-medium">{row.subject}</span> },
              { key: 'raisedBy', label: 'Raised by' },
              { key: 'role', label: 'Role' },
              { key: 'assignedTo', label: 'Assigned to' },
              { key: 'priority', label: 'Priority', render: (row) => <StatusBadge value={row.priority} /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'sla', label: 'SLA', render: (row) => <StatusBadge value={row.sla} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Open', 'In progress', 'Waiting on user', 'Resolved', 'Closed'] }}
          />
        </TabsContent>
      </Tabs>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => { setSelected(null); setReason(''); }}
        title={selected?.title}
        subtitle={`${selected?.type} · raised by ${selected?.requester} · waiting ${selected?.waiting}`}
        badge={selected?.priority}
        rows={selected ? [{ key: 'evidence', label: 'Evidence', value: selected.evidence }, { key: 'decision', label: 'Required decision', value: selected.decision }] : []}
        footer={
          <>
            <button type="button" onClick={() => decide('Approved')} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Approve
            </button>
            <button type="button" onClick={() => decide('Returned')} className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Return for correction
            </button>
            <button type="button" onClick={() => decide('Rejected')} className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-600 dark:border-rose-500/40">
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-muted-foreground">
            Reason for the decision
            <textarea
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
              placeholder="Required when returning or rejecting a request."
            />
          </label>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            The decision, your account, the time and this reason are stored together so the academy can review why a
            request was approved or refused.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}