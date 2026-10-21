import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import RecordDrawer from '@/components/common/RecordDrawer';
import { useToast } from '@/components/ui/use-toast';
import { logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { formatMoney } from '@/lib/format';

/**
 * Payment verification queue.
 * A submitted screenshot is not proof: each transaction is reviewed by an authorised
 * finance officer, and only an approval changes the ledger.
 */
export default function AdminPayments() {
  const { account } = useSession();
  const payments = useCollection('payments');
  const invoices = useCollection('invoices');
  const { toast } = useToast();

  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');

  const pending = payments.filter((p) => p.status === 'Pending verification');

  const decide = (outcome) => {
    if (!selected) return;
    if (outcome !== 'Approved' && note.trim().length < 5) {
      toast({ title: 'Add a reason', description: 'Explain why the payment is being rejected or returned.', variant: 'destructive' });
      return;
    }
    patch('payments', selected.id, { status: outcome, verifiedBy: account?.name, reason: note || 'Verified against the transaction reference' });

    if (outcome === 'Approved') {
      const invoice = invoices.find((i) => i.id === selected.invoiceId);
      if (invoice) {
        const paid = Math.min(invoice.amount - invoice.discount, invoice.paid + selected.amount);
        const balance = invoice.amount - invoice.discount - paid;
        patch('invoices', invoice.id, {
          paid,
          balance,
          status: balance === 0 ? 'Paid' : paid > 0 ? 'Partially paid' : invoice.status,
        });
      }
    }

    logAction({
      actor: account?.name,
      role: account?.label,
      action: `Payment ${outcome.toLowerCase()}`,
      module: 'Finance',
      target: selected.reference,
      reason: note || 'Routine verification',
      before: 'status: Pending verification',
      after: `status: ${outcome}`,
    });
    toast({
      title: `Payment ${outcome.toLowerCase()}`,
      description:
        outcome === 'Approved'
          ? 'The invoice balance is updated and a receipt is available to the payer.'
          : 'The payer sees your reason and can submit a corrected proof.',
    });
    setNote('');
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Payment verification"
        description="Review submitted payments against their invoice, check the reference and proof, then approve, reject or ask for a correction. The ledger changes only on approval."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Payment verification' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting verification" value={pending.length} hint={formatMoney(pending.reduce((s, p) => s + p.amount, 0))} tone="warning" icon={ShieldCheck} />
        <StatCard label="Approved" value={payments.filter((p) => p.status === 'Approved').length} hint="Recorded in the ledger" tone="brand" icon={CheckCircle2} />
        <StatCard label="Rejected or returned" value={payments.filter((p) => p.status === 'Rejected' || p.status === 'Correction requested').length} hint="Reason shared with the payer" tone="danger" />
        <StatCard label="Proof missing" value={payments.filter((p) => p.proof === 'Missing').length} hint="Cannot be verified" tone="danger" icon={AlertTriangle} />
      </div>

      <div className="mt-6">
        <DataTable
          rows={payments}
          searchKeys={['reference', 'invoiceNumber', 'studentName', 'method', 'submittedBy']}
          searchPlaceholder="Search by reference, invoice, student or method…"
          filters={[
            { key: 'status', label: 'Status', options: ['Pending verification', 'Approved', 'Rejected', 'Correction requested'] },
            { key: 'method', label: 'Method', options: ['Bank transfer', 'JazzCash', 'Easypaisa', 'Cash at office'] },
            { key: 'proof', label: 'Proof', options: ['Uploaded', 'Missing'] },
          ]}
          columns={[
            { key: 'reference', label: 'Reference', render: (row) => <span className="font-mono text-xs font-semibold">{row.reference}</span> },
            { key: 'invoiceNumber', label: 'Invoice' },
            { key: 'studentName', label: 'Student' },
            { key: 'className', label: 'Class' },
            { key: 'amount', label: 'Claimed amount', align: 'right', render: (row) => formatMoney(row.amount) },
            { key: 'method', label: 'Method' },
            { key: 'proof', label: 'Proof', render: (row) => <StatusBadge value={row.proof} /> },
            { key: 'submittedOn', label: 'Submitted' },
            { key: 'submittedBy', label: 'Submitted by' },
            { key: 'verifiedBy', label: 'Verified by' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          selectable={false}
          onRowClick={(row) => setSelected(row)}
          rowActions={(row) => (
            <button type="button" onClick={() => setSelected(row)} className="text-xs font-semibold text-primary hover:underline">
              {row.status === 'Pending verification' ? 'Verify' : 'Review'}
            </button>
          )}
          footerNote="Duplicate references are rejected automatically — the same payment cannot be recorded twice"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Verification checklist</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              'The amount matches the instalment expected on the invoice.',
              'The reference on the proof matches the reference submitted.',
              'The date on the proof falls within the term being billed.',
              'The payment type and account match the published instructions.',
              'No earlier payment already covers the same reference or the same instalment.',
            ].map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-cream p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">What happens on approval</h2>
          <ol className="mt-4 space-y-2.5">
            {[
              'The payment is marked approved with your account and the verification note.',
              'The invoice balance is recalculated and its status updated.',
              'A receipt becomes available to the payer in their portal.',
              'A notification is sent to the payer through the configured channels.',
              'The decision is written to the audit log — no credential or PIN is ever stored.',
            ].map((line, index) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                {line}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <RecordDrawer
        open={Boolean(selected)}
        onClose={() => { setSelected(null); setNote(''); }}
        title={selected?.reference}
        subtitle={selected ? `${selected.studentName} · ${selected.invoiceNumber} · ${selected.method}` : ''}
        badge={selected?.status}
        rows={
          selected
            ? [
                { key: 'amount', label: 'Claimed amount', value: formatMoney(selected.amount) },
                { key: 'submittedOn', label: 'Submitted', value: selected.submittedOn },
                { key: 'submittedBy', label: 'Submitted by', value: selected.submittedBy },
                { key: 'proof', label: 'Proof', value: selected.proof },
                { key: 'verifiedBy', label: 'Verified by', value: selected.verifiedBy },
                { key: 'reason', label: 'Existing note', value: selected.reason },
              ]
            : []
        }
        footer={
          <>
            <button type="button" onClick={() => decide('Approved')} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Approve and update the ledger
            </button>
            <button type="button" onClick={() => decide('Correction requested')} className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Request a correction
            </button>
            <button type="button" onClick={() => decide('Rejected')} className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-600 dark:border-rose-500/40">
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-muted-foreground">
            Verification note (required to reject or return)
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
              placeholder="For example: the deposited amount does not match the instalment due."
            />
          </label>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Never ask a payer for a wallet PIN, banking password or one-time code. If the proof cannot be validated, reject
            it with a clear reason and ask for a corrected submission.
          </p>
        </div>
      </RecordDrawer>
    </div>
  );
}