import { AlertTriangle, Banknote, Receipt, Wallet } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { formatMoney } from '@/lib/format';

export default function StudentFees() {
  const { account } = useSession();
  const students = useCollection('students');
  const invoices = useCollection('invoices');
  const payments = useCollection('payments');
  const feeStructures = useCollection('feeStructures');
  const paymentMethods = useCollection('paymentMethods');
  const student = students.find((s) => s.name === account?.name) || students[9];

  const mine = invoices.filter((row) => row.studentId === student.id);
  const myPayments = payments.filter((row) => mine.some((inv) => inv.id === row.invoiceId));
  const billed = mine.reduce((sum, row) => sum + row.amount - row.discount, 0);
  const paid = mine.reduce((sum, row) => sum + row.paid, 0);
  const balance = billed - paid;

  return (
    <div>
      <PageHeader
        title="Fees and invoices"
        description="Your fee obligations, payments recorded against them and the payment instructions for the academy accounts."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Fees' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total billed" value={formatMoney(billed)} hint={`${mine.length} invoices`} icon={Receipt} />
        <StatCard label="Verified paid" value={formatMoney(paid)} hint="Only verified payments count" tone="brand" icon={Banknote} />
        <StatCard label="Outstanding" value={formatMoney(balance)} hint={balance ? 'Due on the invoice date' : 'All cleared'} tone={balance ? 'warning' : 'brand'} icon={Wallet} />
        <StatCard label="Awaiting verification" value={myPayments.filter((p) => p.status === 'Pending verification').length} hint="Submitted proof under review" tone="warning" />
      </div>

      <Tabs defaultValue="invoices" className="mt-6">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="ledger">Payments and receipts</TabsTrigger>
          <TabsTrigger value="structure">Fee structure</TabsTrigger>
          <TabsTrigger value="instructions">Payment instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <DataTable
            rows={mine}
            searchKeys={['number', 'category', 'status']}
            searchPlaceholder="Search invoices…"
            filters={[
              { key: 'status', label: 'Status', options: ['Unpaid', 'Partially paid', 'Paid', 'Overdue'] },
              { key: 'category', label: 'Category', options: [...new Set(mine.map((r) => r.category))] },
            ]}
            columns={[
              { key: 'number', label: 'Invoice', render: (row) => <span className="font-medium">{row.number}</span> },
              { key: 'category', label: 'Category' },
              { key: 'issue', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount - row.discount) },
              { key: 'paid', label: 'Paid', align: 'right', render: (row) => formatMoney(row.paid) },
              { key: 'balance', label: 'Balance', align: 'right', render: (row) => formatMoney(row.balance) },
              { key: 'dueOn', label: 'Due' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="A fee is marked paid only after the finance office verifies the payment"
          />
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <DataTable
            rows={myPayments}
            searchKeys={['reference', 'invoiceNumber', 'method']}
            searchPlaceholder="Search payments…"
            filters={[
              { key: 'status', label: 'Status', options: ['Pending verification', 'Approved', 'Rejected', 'Correction requested'] },
              { key: 'method', label: 'Method', options: ['Bank transfer', 'JazzCash', 'Easypaisa', 'Cash at office'] },
            ]}
            columns={[
              { key: 'reference', label: 'Reference', render: (row) => <span className="font-mono text-xs">{row.reference}</span> },
              { key: 'invoiceNumber', label: 'Invoice' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'method', label: 'Method' },
              { key: 'submittedOn', label: 'Submitted' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Receipts are generated after approval"
          />
        </TabsContent>

        <TabsContent value="structure" className="mt-4">
          <DataTable
            rows={feeStructures.filter((row) => row.className === student.className)}
            searchKeys={['category', 'className', 'status']}
            searchPlaceholder="Search fee categories…"
            columns={[
              { key: 'category', label: 'Category' },
              { key: 'className', label: 'Class' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'installments', label: 'Installments' },
              { key: 'dueDay', label: 'Due day' },
              { key: 'version', label: 'Version' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Fee structures are versioned; historic invoices are never recalculated silently"
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
              Never share wallet PINs, banking passwords or one-time codes. Staff will never ask you for them. An
              uploaded screenshot is not treated as confirmation of payment — the finance office verifies every
              transaction before the ledger changes.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}