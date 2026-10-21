import { Receipt, TrendingUp, Wallet } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { formatMoney } from '@/lib/format';
import { CLASSES as CLASS_RECORDS } from '@/data/records';

export default function AdminFees() {
  const invoices = useCollection('invoices');
  const feeStructures = useCollection('feeStructures');
  const payments = useCollection('payments');
  const students = useCollection('students');

  const billed = invoices.reduce((sum, row) => sum + row.amount - row.discount, 0);
  const paid = invoices.reduce((sum, row) => sum + row.paid, 0);
  const outstanding = billed - paid;
  const collectionRate = billed ? Math.round((paid / billed) * 100) : 0;

  return (
    <div>
      <PageHeader
        title="Fees, structures and invoices"
        description="Fee structures by class and category, the invoice ledger and the collection position. Balances are calculated on the server — the ledger never changes from a client value."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Fees and invoices' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Billed" value={formatMoney(billed)} hint={`${invoices.length} invoices`} icon={Receipt} />
        <StatCard label="Verified collected" value={formatMoney(paid)} hint="Only verified payments" tone="brand" icon={Wallet} />
        <StatCard label="Outstanding" value={formatMoney(outstanding)} hint={`${invoices.filter((i) => i.balance > 0).length} invoices open`} tone="warning" />
        <StatCard label="Collection rate" value={`${collectionRate}%`} hint="Collected ÷ billed" icon={TrendingUp} />
      </div>

      <Tabs defaultValue="invoices" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="invoices">Invoices and ledger</TabsTrigger>
          <TabsTrigger value="structures">Fee structures</TabsTrigger>
          <TabsTrigger value="overdue">Overdue and follow-up</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <DataTable
            rows={invoices}
            searchKeys={['number', 'studentName', 'className', 'category']}
            searchPlaceholder="Search invoices by number, student or category…"
            filters={[
              { key: 'status', label: 'Status', options: ['Unpaid', 'Partially paid', 'Paid', 'Overdue', 'Waived', 'Refunded'] },
              { key: 'className', label: 'Class', options: [...new Set(invoices.map((i) => i.className))] },
              { key: 'category', label: 'Category', options: [...new Set(invoices.map((i) => i.category))] },
            ]}
            columns={[
              { key: 'number', label: 'Invoice', render: (row) => <span className="font-medium">{row.number}</span> },
              { key: 'studentName', label: 'Student' },
              { key: 'className', label: 'Class' },
              { key: 'category', label: 'Category' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'discount', label: 'Discount', align: 'right', render: (row) => formatMoney(row.discount) },
              { key: 'paid', label: 'Paid', align: 'right', render: (row) => formatMoney(row.paid) },
              { key: 'balance', label: 'Balance', align: 'right', render: (row) => formatMoney(row.balance) },
              { key: 'dueOn', label: 'Due' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Waived', 'Unpaid'] }}
            footerNote="Waivers and adjustments require approval and are recorded"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {payments.length} payment submissions are attached to this ledger · {formatMoney(payments.filter((p) => p.status === 'Pending verification').reduce((s, p) => s + p.amount, 0))} awaiting verification.
          </p>
        </TabsContent>

        <TabsContent value="structures" className="mt-4">
          <DataTable
            rows={feeStructures}
            searchKeys={['className', 'category', 'version']}
            searchPlaceholder="Search fee structures…"
            filters={[
              { key: 'className', label: 'Class', options: CLASS_RECORDS.map((c) => c.name) },
              { key: 'category', label: 'Category', options: [...new Set(feeStructures.map((f) => f.category))] },
              { key: 'status', label: 'Status', options: ['Active', 'Draft', 'Archived'] },
            ]}
            columns={[
              { key: 'className', label: 'Class', render: (row) => <span className="font-medium">{row.className}</span> },
              { key: 'category', label: 'Category' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'installments', label: 'Installments' },
              { key: 'dueDay', label: 'Due day' },
              { key: 'version', label: 'Version' },
              { key: 'effectiveFrom', label: 'Effective from' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="A new structure version never recalculates invoices already issued"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Late fee rule in force: {feeStructures[0]?.lateFeeRule}. Waiving a late fee requires finance approval.
          </p>
        </TabsContent>

        <TabsContent value="overdue" className="mt-4">
          <DataTable
            rows={invoices.filter((i) => i.balance > 0)}
            searchKeys={['number', 'studentName', 'className']}
            searchPlaceholder="Search open invoices…"
            filters={[
              { key: 'status', label: 'Status', options: ['Unpaid', 'Partially paid', 'Overdue'] },
              { key: 'className', label: 'Class', options: [...new Set(invoices.map((i) => i.className))] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'number', label: 'Invoice' },
              { key: 'balance', label: 'Balance', align: 'right', render: (row) => formatMoney(row.balance) },
              { key: 'dueOn', label: 'Due date' },
              { key: 'installments', label: 'Installments' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Overdue'] }}
            footerNote="Guardians can settle an invoice from the parent portal and submit proof"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-cream p-5">
            <p className="text-sm text-muted-foreground">
              Guardian accounts reachable for reminders: {new Set(students.map((s) => s.guardianName)).size}. Reminders are
              sent through the channels configured in notification settings — in-app and email today.
            </p>
            <button type="button" className="ml-auto inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              Queue fee reminders
            </button>
          </div>
        </TabsContent>

        <TabsContent value="reconciliation" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Reconciliation position</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Invoices issued', invoices.length],
                ['Payments approved', payments.filter((p) => p.status === 'Approved').length],
                ['Payments pending verification', payments.filter((p) => p.status === 'Pending verification').length],
                ['Submissions rejected', payments.filter((p) => p.status === 'Rejected').length],
                ['Invoices with no payment record', invoices.filter((i) => i.balance > 0 && !payments.some((p) => p.invoiceId === i.id)).length],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Financial rules in force</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'A payment is recorded only after an authorised finance officer approves it.',
                'Duplicate transaction references are rejected so the ledger cannot be double-counted.',
                'Refunds are tracked separately from the original payment and require approval.',
                'Balances are calculated on the server, not from a value submitted by the client.',
                'Every manual adjustment records the actor, the reason and the previous value.',
              ].map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {line}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}