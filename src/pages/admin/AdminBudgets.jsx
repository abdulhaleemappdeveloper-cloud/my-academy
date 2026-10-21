import { Banknote, Landmark, Scale, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { formatMoney } from '@/lib/format';

/** Budgets, expenses, purchase orders and reconciliation. */
export default function AdminBudgets() {
  const budgets = useCollection('budgets');
  const expenses = useCollection('expenses');
  const orders = useCollection('purchaseOrders');
  const vendors = useCollection('vendors');

  const allocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const used = budgets.reduce((s, b) => s + b.used, 0);

  return (
    <div>
      <PageHeader
        title="Budgets, expenses and purchasing"
        description="Departmental budgets, expense submissions with their approval chain, purchase orders and delivery, and the reconciliation position."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Budgets and expenses' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Budget allocated" value={formatMoney(allocated)} hint={`${budgets.length} budgets`} icon={Banknote} />
        <StatCard label="Utilised" value={formatMoney(used)} hint={`${Math.round((used / allocated) * 100)}% of allocation`} tone={used / allocated > 0.85 ? 'warning' : 'brand'} icon={TrendingUp} />
        <StatCard label="Expenses awaiting approval" value={expenses.filter((e) => e.status === 'Submitted' || e.status === 'Under review').length} hint={`${expenses.filter((e) => e.supporting === 'Receipt missing').length} without a receipt`} tone="warning" />
        <StatCard label="Purchase orders open" value={orders.filter((o) => o.delivery !== 'Delivered').length} hint={`${orders.filter((o) => o.approval === 'Pending approval').length} awaiting approval`} icon={Landmark} />
      </div>

      <Tabs defaultValue="budgets" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="orders">Purchase orders</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const percent = Math.round((budget.used / budget.allocated) * 100);
            return (
              <article key={budget.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-heading text-base font-bold text-foreground">{budget.name}</h2>
                  <StatusBadge value={budget.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{budget.period} · owner {budget.owner}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${percent > 85 ? 'bg-amber-500' : 'bg-brand'}`} style={{ width: `${Math.min(100, percent)}%` }} />
                </div>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Allocated</dt><dd className="font-semibold text-foreground">{formatMoney(budget.allocated)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Used</dt><dd className="font-semibold text-foreground">{formatMoney(budget.used)} · {percent}%</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Remaining</dt><dd className="font-semibold text-foreground">{formatMoney(budget.allocated - budget.used)}</dd></div>
                </dl>
              </article>
            );
          })}
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <DataTable
            rows={expenses}
            searchKeys={['reference', 'category', 'department', 'submittedBy']}
            searchPlaceholder="Search expenses…"
            filters={[
              { key: 'status', label: 'Status', options: ['Submitted', 'Under review', 'Approved', 'Paid', 'Rejected'] },
              { key: 'department', label: 'Department', options: [...new Set(expenses.map((e) => e.department))] },
              { key: 'supporting', label: 'Documents', options: ['Receipt attached', 'Receipt missing'] },
            ]}
            columns={[
              { key: 'reference', label: 'Reference' },
              { key: 'category', label: 'Category' },
              { key: 'department', label: 'Department' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'submittedBy', label: 'Submitted by' },
              { key: 'submittedOn', label: 'Submitted' },
              { key: 'supporting', label: 'Supporting document', render: (row) => <StatusBadge value={row.supporting} /> },
              { key: 'budget', label: 'Budget' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Approved', 'Rejected'] }}
            footerNote="Approval thresholds apply to high-value expenses"
          />
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <DataTable
            rows={orders}
            searchKeys={['number', 'vendor', 'items', 'raisedBy']}
            searchPlaceholder="Search purchase orders…"
            filters={[
              { key: 'approval', label: 'Approval', options: ['Pending approval', 'Approved'] },
              { key: 'delivery', label: 'Delivery', options: ['Pending', 'Partially delivered', 'Delivered'] },
              { key: 'payment', label: 'Payment', options: ['Unpaid', 'Part paid', 'Paid'] },
            ]}
            columns={[
              { key: 'number', label: 'Order', render: (row) => <span className="font-medium">{row.number}</span> },
              { key: 'vendor', label: 'Vendor' },
              { key: 'items', label: 'Items' },
              { key: 'amount', label: 'Amount', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'raisedBy', label: 'Raised by' },
              { key: 'raisedOn', label: 'Raised' },
              { key: 'approval', label: 'Approval', render: (row) => <StatusBadge value={row.approval} /> },
              { key: 'delivery', label: 'Delivery', render: (row) => <StatusBadge value={row.delivery} /> },
              { key: 'payment', label: 'Payment', render: (row) => <StatusBadge value={row.payment} /> },
            ]}
            selectable={false}
            footerNote={`${vendors.length} vendors are registered in the directory`}
          />
        </TabsContent>

        <TabsContent value="reconciliation" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <Scale className="h-4 w-4 text-primary" /> Reconciliation checks
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Expenses without a supporting receipt', expenses.filter((e) => e.supporting === 'Receipt missing').length],
                ['Orders delivered but unpaid', orders.filter((o) => o.delivery === 'Delivered' && o.payment !== 'Paid').length],
                ['Budgets above 85% utilisation', budgets.filter((b) => b.used / b.allocated > 0.85).length],
                ['Vendors with an outstanding balance', vendors.filter((v) => v.outstanding > 0).length],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <StatusBadge value={String(value)} tone={value > 0 ? 'warning' : 'success'} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">How this stays separate from fees</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Operational expenses, purchasing and payroll are kept separate from student fee collection. A consolidated
              financial report is available to authorised roles, but no expense entry can alter a fee invoice or a payment
              record, and no fee payment can be reclassified as an expense.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                'Historical transactions are never altered silently to make totals match.',
                'Corrections are made through a recorded adjustment with a reason.',
                'Financial exports are restricted to authorised roles.',
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