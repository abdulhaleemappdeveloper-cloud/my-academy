import { AlertTriangle, Banknote, Receipt, Wallet } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { formatMoney } from '@/lib/format';

export default function ParentFees() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const invoices = useCollection('invoices');
  const payments = useCollection('payments');
  const scholarships = useCollection('scholarships');
  const paymentMethods = useCollection('paymentMethods');
  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));

  const childInvoices = (child) => invoices.filter((i) => i.studentId === child.id);
  const billed = children.reduce((sum, c) => sum + childInvoices(c).reduce((s, i) => s + i.amount - i.discount, 0), 0);
  const paid = children.reduce((sum, c) => sum + childInvoices(c).reduce((s, i) => s + i.paid, 0), 0);
  const balance = billed - paid;
  const relatedPayments = payments.filter((p) => children.some((c) => childInvoices(c).some((i) => i.id === p.invoiceId)));

  return (
    <div>
      <PageHeader
        title="Fees and ledger"
        description="Invoices, payments and the fee ledger for your children. A fee is marked paid only after the finance office verifies the transaction."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Fees and ledger' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total billed" value={formatMoney(billed)} hint="Across your children" icon={Receipt} />
        <StatCard label="Verified paid" value={formatMoney(paid)} hint="Only verified payments" tone="brand" icon={Banknote} />
        <StatCard label="Outstanding" value={formatMoney(balance)} hint={balance ? 'Payable by the invoice due date' : 'All cleared'} tone={balance ? 'warning' : 'brand'} icon={Wallet} />
        <StatCard label="Scholarships" value={scholarships.filter((s) => children.some((c) => c.id === s.studentId)).length} hint="Applied, approved or under review" />
      </div>

      <Tabs defaultValue="invoices" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="ledger">Payments and receipts</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships and discounts</TabsTrigger>
          <TabsTrigger value="instructions">Payment instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4 space-y-8">
          {children.map((child) => (
            <section key={child.id}>
              <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {child.name} · {child.className}
              </h2>
              <DataTable
                rows={childInvoices(child)}
                searchKeys={['number', 'category', 'status']}
                searchPlaceholder="Search invoices…"
                filters={[
                  { key: 'status', label: 'Status', options: ['Unpaid', 'Partially paid', 'Paid', 'Overdue'] },
                  { key: 'category', label: 'Category', options: ['Tuition fee', 'Examination fee', 'Transport fee', 'Activity fee'] },
                ]}
                pageSize={5}
                selectable={false}
                columns={[
                  { key: 'number', label: 'Invoice', render: (row) => <span className="font-medium">{row.number}</span> },
                  { key: 'category', label: 'Category' },
                  { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount - row.discount) },
                  { key: 'paid', label: 'Paid', align: 'right', render: (row) => formatMoney(row.paid) },
                  { key: 'balance', label: 'Balance', align: 'right', render: (row) => formatMoney(row.balance) },
                  { key: 'dueOn', label: 'Due' },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                ]}
                footerNote="Late fee of 2% applies after ten days; a waiver requires approval"
              />
            </section>
          ))}
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <DataTable
            rows={relatedPayments}
            searchKeys={['reference', 'invoiceNumber', 'method', 'studentName']}
            searchPlaceholder="Search payments…"
            filters={[
              { key: 'status', label: 'Status', options: ['Pending verification', 'Approved', 'Rejected', 'Correction requested'] },
              { key: 'method', label: 'Method', options: ['Bank transfer', 'JazzCash', 'Easypaisa', 'Cash at office'] },
            ]}
            selectable={false}
            columns={[
              { key: 'reference', label: 'Reference', render: (row) => <span className="font-mono text-xs">{row.reference}</span> },
              { key: 'studentName', label: 'Student' },
              { key: 'invoiceNumber', label: 'Invoice' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'method', label: 'Method' },
              { key: 'submittedOn', label: 'Submitted' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'reason', label: 'Finance note', render: (row) => <span className="text-xs text-muted-foreground">{row.reason}</span> },
            ]}
            footerNote="Receipts are generated once a payment is approved"
          />
        </TabsContent>

        <TabsContent value="scholarships" className="mt-4">
          <DataTable
            rows={scholarships.filter((s) => children.some((c) => c.id === s.studentId))}
            searchKeys={['studentName', 'type', 'status']}
            searchPlaceholder="Search scholarships…"
            filters={[
              { key: 'type', label: 'Type', options: ['Merit', 'Need-based', 'Sports', 'Sibling concession'] },
              { key: 'status', label: 'Status', options: ['Applied', 'Under review', 'Approved', 'Rejected'] },
            ]}
            selectable={false}
            columns={[
              { key: 'studentName', label: 'Student' },
              { key: 'type', label: 'Type' },
              { key: 'percentage', label: 'Concession', align: 'right', render: (row) => `${row.percentage}%` },
              { key: 'appliedOn', label: 'Applied' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'decidedBy', label: 'Decided by' },
              { key: 'note', label: 'Basis', render: (row) => <span className="text-xs text-muted-foreground">{row.note}</span> },
            ]}
            footerNote="Approved concessions are applied to future invoices as a discount"
          />
        </TabsContent>

        <TabsContent value="instructions" className="mt-4 space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{method.name}</h2>
                <StatusBadge value={method.status} />
              </div>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Account title</dt>
                  <dd className="font-medium text-foreground">{method.title}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Account or number</dt>
                  <dd className="font-medium text-foreground">{method.account}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{method.instructions}</p>
            </div>
          ))}

          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              Never send wallet PINs, banking passwords or one-time codes to anyone, including staff. Automated
              confirmation for JazzCash and Easypaisa is not connected, so those payments are verified manually by the
              finance office before the ledger changes.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}