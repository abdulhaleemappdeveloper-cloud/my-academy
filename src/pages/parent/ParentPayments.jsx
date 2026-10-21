import { useState } from 'react';
import { Info, Upload, Wallet } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { formatMoney } from '@/lib/format';

export default function ParentPayments() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const invoices = useCollection('invoices');
  const payments = useCollection('payments');
  const paymentMethods = useCollection('paymentMethods');
  const { toast } = useToast();

  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));
  const payable = invoices.filter((i) => children.some((c) => c.id === i.studentId) && i.balance > 0);
  const related = payments.filter((p) => payable.some((i) => i.id === p.invoiceId) || p.submittedBy?.includes(guardian.name));

  const [form, setForm] = useState({ invoiceId: payable[0]?.id || '', amount: '', method: 'Bank transfer', reference: '', note: '' });
  const [proof, setProof] = useState(null);
  const [errors, setErrors] = useState({});
  const invoice = invoices.find((i) => i.id === form.invoiceId);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.invoiceId) next.invoiceId = 'Select the invoice you are paying.';
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter the amount paid.';
    if (!form.reference.trim()) next.reference = 'Enter the transaction reference.';
    if (!proof) next.proof = 'Attach the payment screenshot or deposit slip.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (payments.some((row) => String(row.reference).toLowerCase() === form.reference.trim().toLowerCase())) {
      toast({
        title: 'Reference already submitted',
        description: 'This transaction reference exists in the ledger. Check the invoice history before submitting again.',
        variant: 'destructive',
      });
      return;
    }

    const record = insert('payments', {
      reference: form.reference.trim(),
      invoiceId: form.invoiceId,
      invoiceNumber: invoice?.number,
      studentName: invoice?.studentName,
      className: invoice?.className,
      amount: Number(form.amount),
      method: form.method,
      submittedOn: new Date().toISOString().slice(0, 10),
      proof: 'Uploaded',
      status: 'Pending verification',
      submittedBy: `${guardian.name} (guardian)`,
      verifiedBy: '—',
      reason: form.note || '—',
    });
    logAction({
      actor: guardian.name,
      role: 'Guardian',
      action: 'Submitted payment proof',
      module: 'Finance',
      target: record.reference,
      reason: `Against invoice ${invoice?.number}`,
    });
    toast({
      title: 'Payment submitted for verification',
      description: 'The balance changes only after the finance office approves the payment. You will be notified either way.',
    });
    setForm({ invoiceId: payable[0]?.id || '', amount: '', method: 'Bank transfer', reference: '', note: '' });
    setProof(null);
  };

  return (
    <div>
      <PageHeader
        title="Payments and proof"
        description="Submit a payment against an invoice and follow its verification. Uploading a screenshot does not settle a fee — an authorised finance officer verifies every transaction."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Payments' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding invoices" value={payable.length} hint="Across your children" tone={payable.length ? 'warning' : 'brand'} />
        <StatCard label="Submissions" value={related.length} hint="Including those under review" icon={Wallet} />
        <StatCard label="Verified" value={related.filter((p) => p.status === 'Approved').length} hint="Receipts available" tone="brand" />
        <StatCard label="Needs attention" value={related.filter((p) => p.status === 'Rejected' || p.status === 'Correction requested').length} hint="Read the finance note" tone="danger" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Submit a payment</h2>

          <label className="block text-xs font-semibold text-muted-foreground">
            Invoice *
            <select value={form.invoiceId} onChange={(event) => setForm((prev) => ({ ...prev, invoiceId: event.target.value }))} className={inputClass}>
              <option value="">Select an invoice…</option>
              {payable.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.studentName} · {row.number} · balance {formatMoney(row.balance)}
                </option>
              ))}
            </select>
            {errors.invoiceId && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.invoiceId}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Amount paid (PKR) *
              <input value={form.amount} onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))} className={inputClass} inputMode="numeric" placeholder="9000" />
              {errors.amount && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.amount}</span>}
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Payment method
              <select value={form.method} onChange={(event) => setForm((prev) => ({ ...prev, method: event.target.value }))} className={inputClass}>
                {paymentMethods.map((method) => <option key={method.id}>{method.name}</option>)}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            Transaction reference *
            <input value={form.reference} onChange={(event) => setForm((prev) => ({ ...prev, reference: event.target.value }))} className={inputClass} placeholder="As printed on the receipt or SMS" />
            {errors.reference && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.reference}</span>}
          </label>

          <label className="block text-xs font-semibold text-muted-foreground">
            Note for the finance office (optional)
            <textarea rows={2} value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} className={textareaClass} />
          </label>

          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center">
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{proof ? proof.name : 'Attach payment proof'}</span>
            <span className="text-xs text-muted-foreground">Stored privately; visible only to authorised finance staff.</span>
            <input type="file" className="hidden" onChange={(event) => setProof(event.target.files?.[0] || null)} />
          </label>
          {errors.proof && <span className="block text-[11px] font-medium text-rose-600">{errors.proof}</span>}

          <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
            Submit for verification
          </button>

          <p className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Fees are payable by the due date on the invoice. A late fee of 2 per cent applies after ten days; waiving it
            requires approval from the finance office.
          </p>
        </form>

        <div>
          <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Submission history</h2>
          <DataTable
            rows={related}
            searchKeys={['reference', 'invoiceNumber', 'method', 'studentName']}
            searchPlaceholder="Search submissions…"
            filters={[{ key: 'status', label: 'Status', options: ['Pending verification', 'Approved', 'Rejected', 'Correction requested'] }]}
            pageSize={10}
            selectable={false}
            columns={[
              { key: 'reference', label: 'Reference' },
              { key: 'studentName', label: 'Student' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            emptyTitle="No payments submitted yet"
          />
          <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Receipts</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              A receipt appears against the invoice once a payment is approved. If a payment is rejected, the finance note
              explains why and you can submit a corrected proof with a new reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';