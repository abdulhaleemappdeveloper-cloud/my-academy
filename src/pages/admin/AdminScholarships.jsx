import { Coins, Percent, RotateCcw, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { formatMoney } from '@/lib/format';

export default function AdminScholarships() {
  const scholarships = useCollection('scholarships');
  const refunds = useCollection('refunds');
  const invoices = useCollection('invoices');
  const students = useCollection('students');

  const concessions = invoices.reduce((sum, row) => sum + row.discount, 0);

  return (
    <div>
      <PageHeader
        title="Scholarships, concessions and refunds"
        description="Scholarship decisions, sibling and merit concessions applied to the ledger, and the refund workflow with its approvals."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Scholarships and refunds' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Scholarship applications" value={scholarships.length} hint={`${scholarships.filter((s) => s.status === 'Approved').length} approved`} icon={Coins} />
        <StatCard label="Concessions applied" value={formatMoney(concessions)} hint="Across issued invoices" tone="gold" icon={Percent} />
        <StatCard label="Students receiving support" value={new Set(scholarships.filter((s) => s.status === 'Approved').map((s) => s.studentId)).size} hint="Merit and need-based" icon={Users} />
        <StatCard label="Refund requests" value={refunds.length} hint={`${refunds.filter((r) => r.status === 'Requested' || r.status === 'Under review').length} awaiting a decision`} tone="warning" icon={RotateCcw} />
      </div>

      <Tabs defaultValue="scholarships" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="discounts">Concessions on the ledger</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="scholarships" className="mt-4">
          <DataTable
            rows={scholarships}
            searchKeys={['studentName', 'type', 'status', 'note']}
            searchPlaceholder="Search scholarship records…"
            filters={[
              { key: 'type', label: 'Type', options: ['Merit', 'Need-based', 'Sports', 'Sibling concession'] },
              { key: 'status', label: 'Status', options: ['Applied', 'Under review', 'Approved', 'Rejected'] },
            ]}
            columns={[
              { key: 'studentName', label: 'Student', render: (row) => <span className="font-medium">{row.studentName}</span> },
              { key: 'className', label: 'Class' },
              { key: 'type', label: 'Scheme' },
              { key: 'percentage', label: 'Concession', align: 'right', render: (row) => `${row.percentage}%` },
              { key: 'appliedOn', label: 'Applied' },
              { key: 'note', label: 'Basis' },
              { key: 'decidedBy', label: 'Decided by' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Under review', 'Approved', 'Rejected'] }}
            footerNote="Approved concessions apply to future invoices; existing invoices are corrected through an adjustment"
          />
        </TabsContent>

        <TabsContent value="discounts" className="mt-4">
          <DataTable
            rows={invoices.filter((i) => i.discount > 0)}
            searchKeys={['number', 'studentName', 'className']}
            searchPlaceholder="Search discounted invoices…"
            filters={[{ key: 'status', label: 'Status', options: ['Unpaid', 'Partially paid', 'Paid', 'Overdue'] }]}
            columns={[
              { key: 'number', label: 'Invoice', render: (row) => <span className="font-medium">{row.number}</span> },
              { key: 'studentName', label: 'Student' },
              { key: 'className', label: 'Class' },
              { key: 'amount', label: 'Gross', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'discount', label: 'Concession', align: 'right', render: (row) => formatMoney(row.discount) },
              { key: 'paid', label: 'Paid', align: 'right', render: (row) => formatMoney(row.paid) },
              { key: 'balance', label: 'Balance', align: 'right', render: (row) => formatMoney(row.balance) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Concessions are visible on the invoice so the ledger always shows what was charged"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {students.filter((s) => s.scholarship !== 'None').length} students hold a scholarship on their record.
          </p>
        </TabsContent>

        <TabsContent value="refunds" className="mt-4">
          <DataTable
            rows={refunds}
            searchKeys={['requestNumber', 'invoiceNumber', 'studentName', 'reason']}
            searchPlaceholder="Search refund requests…"
            filters={[{ key: 'status', label: 'Status', options: ['Requested', 'Under review', 'Approved', 'Processed', 'Rejected'] }]}
            columns={[
              { key: 'requestNumber', label: 'Request', render: (row) => <span className="font-mono text-xs font-semibold">{row.requestNumber}</span> },
              { key: 'studentName', label: 'Student' },
              { key: 'invoiceNumber', label: 'Invoice' },
              { key: 'amount', label: 'Requested', align: 'right', render: (row) => formatMoney(row.amount) },
              { key: 'refundableBalance', label: 'Refundable', align: 'right', render: (row) => formatMoney(row.refundableBalance) },
              { key: 'reason', label: 'Reason' },
              { key: 'requestedOn', label: 'Requested' },
              { key: 'approvedBy', label: 'Approved by' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            bulkStatus={{ key: 'status', options: ['Under review', 'Rejected'] }}
            footerNote="Money is treated as returned only when the payment method confirms it"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Refunds are tracked separately from the original payment so reconciliation stays accurate.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}