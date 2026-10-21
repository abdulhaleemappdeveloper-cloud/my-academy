import { useState } from 'react';
import { CheckCircle2, Info, Upload, Wallet } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { formatMoney } from '@/lib/format';

export default function StudentPayments() {
  const { account } = useSession();
  const students = useCollection('students');
  const invoices = useCollection('invoices');
  const payments = useCollection('payments');
  const paymentMethods = useCollection('paymentMethods');
  const { toast } = useToast();

  const student = students.find((s) => s.name === account?.name) || students[9];
  const mine = invoices.filter((row) => row.studentId === student.id);
  const myPayments = payments.filter((row) => mine.some((inv) => inv.id === row.invoiceId));
  const payable = mine.filter((row) => row.balance > 0);

  const [form, setForm] = useState({ invoiceId: payable[0]?.id || '', amount: '', method: 'Bank transfer', reference: '', note: '' });
  const [proof, setProof] = useState(null);
  const [errors, setErrors] = useState({});

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const invoice = mine.find((row) => row.id === form.invoiceId);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.invoiceId) next.invoiceId = 'Select the invoice you are paying.';
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter the amount that was paid.';
    if (!form.reference.trim()) next.reference = 'Enter the transaction reference from your receipt or SMS.';
    if (!proof) next.proof = 'Attach the payment screenshot or deposit slip.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const duplicate = payments.some((row) => String(row.reference).toLowerCase() === form.reference.trim().toLowerCase());
    if (duplicate) {
      toast({
        title: 'This reference is already recorded',
        description: 'That transaction reference has been submitted before. Check the invoice ledger before submitting again.',
        variant: 'destructive',
      });
      return;
    }

    const record = insert('payments', {
      reference: form.reference.trim(),
      invoiceId: form.invoiceId,
      invoiceNumber: invoice?.number,
      studentName: student.name,
      className: student.className,
      amount: Number(form.amount),
      method: form.method,
      submittedOn: new Date().toISOString().slice(0, 10),
      proof: 'Uploaded',
      status: 'Pending verification',
      submittedBy: `${account?.name} (${account?.label})`,
      verifiedBy: '—',
      reason: form.note || '—',
    });

    logAction({
      actor: account?.name || 'Unknown',
      role: account?.label || 'Unknown',
      action: 'Submitted payment proof',
      module: 'Finance',
      target: record.reference,
      reason: `Against invoice ${invoice?.number}`,
    });

    toast({
      title: 'Payment submitted for verification',
      description: 'The finance office will approve or reject it. The invoice balance changes only after approval.',
    });
    setForm({ invoiceId: payable[0]?.id || '', amount: '', method: 'Bank transfer', reference: '', note: '' });
    setProof(null);
  };

  return (
    <div>
      <PageHeader
        title="Payments and proof"
        description="Submit a payment against an invoice and track its verification. Uploading proof does not settle a fee — the finance office verifies each transaction."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Payments' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding invoices" value={payable.length} hint="Balance greater than zero" tone={payable.length ? 'warning' : 'brand'} />
        <StatCard label="Submitted payments" value={myPayments.length} hint="Including payments under review" icon={Wallet} />
        <StatCard label="Verified" value={myPayments.filter((p) => p.status === 'Approved').length} hint="Receipts available" tone="brand" icon={CheckCircle2} />
        <StatCard label="Rejected or correction" value={myPayments.filter((p) => p.status === 'Rejected' || p.status === 'Correction requested').length} hint="Read the reason and resubmit" tone="danger" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Submit a payment</h2>

          <label className="block text-xs font-semibold text-muted-foreground">
            Invoice *
            <select value={form.invoiceId} onChange={(e) => update('invoiceId', e.target.value)} className={inputClass}>
              <option value="">Select an invoice…</option>
              {payable.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.number} · {row.category} · balance {formatMoney(row.balance)}
                </option>
              ))}
            </select>
            {errors.invoiceId && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.invoiceId}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Amount paid (PKR) *
              <input value={form.amount} onChange={(e) => update('amount', e.target.value)} inputMode="numeric" className={inputClass} placeholder="9000" />
              {errors.amount && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.amount}</span>}
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Payment method
              <select value={form.method} onChange={(e) => update('method', e.target.value)} className={inputClass}>
                {paymentMethods.map((method) => (
                  <option key={method.id}>{method.name}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            Transaction reference *
            <input value={form.reference} onChange={(e) => update('reference', e.target.value)} className={inputClass} placeholder="As printed on the receipt or SMS" />
            {errors.reference && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.reference}</span>}
          </label>

          <label className="block text-xs font-semibold text-muted-foreground">
            Note for the finance office (optional)
            <textarea rows={2} value={form.note} onChange={(e) => update('note', e.target.value)} className={textareaClass} placeholder="For example: paid the second installment on behalf of the guardian." />
          </label>

          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center">
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{proof ? proof.name : 'Attach payment proof'}</span>
            <span className="text-xs text-muted-foreground">Screenshot or deposit slip. Stored privately and visible only to finance staff.</span>
            <input type="file" className="hidden" onChange={(event) => setProof(event.target.files?.[0] || null)} />
          </label>
          {errors.proof && <span className="block text-[11px] font-medium text-rose-600">{errors.proof}</span>}

          <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
            Submit for verification
          </button>

          <p className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Duplicate references are rejected automatically so the same payment cannot be recorded twice.
          </p>
        </form>

        <div>
          <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Payment history</h2>
          <DataTable
            rows={myPayments}
            searchKeys={['reference', 'invoiceNumber', 'method']}
            searchPlaceholder="Search payments…"
            filters={[{ key: 'status', label: 'Status', options: ['Pending verification', 'Approved', 'Rejected', 'Correction requested'] }]}
            pageSize={10}
            selectable={false}
            columns={[
              { key: 'reference', label: 'Reference' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'method', label: 'Method' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'reason', label: 'Finance note', render: (row) => <span className="text-xs text-muted-foreground">{row.reason}</span> },
            ]}
          />

          <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Receipts</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              A receipt is generated once a payment is approved and appears against the invoice. If a payment was
              rejected, the finance note explains why and you can submit a corrected proof.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';