import { Bus, Library, Package, Store, Utensils, Wrench } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { formatMoney } from '@/lib/format';

/** Operational modules: library, transport, inventory, facilities, visitors and vendors. */
export default function AdminOperations() {
  const books = useCollection('libraryBooks');
  const loans = useCollection('libraryLoans');
  const transport = useCollection('transport');
  const assets = useCollection('assets');
  const maintenance = useCollection('maintenance');
  const rooms = useCollection('rooms');
  const visitors = useCollection('visitors');
  const vendors = useCollection('vendors');

  return (
    <div>
      <PageHeader
        title="Campus operations"
        description="Library circulation, transport routes, inventory and assets, facilities and maintenance, visitor records and the vendor register."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Operations' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Library copies" value={books.reduce((s, b) => s + b.copies, 0)} hint={`${loans.filter((l) => l.status === 'Overdue').length} loans overdue`} icon={Library} />
        <StatCard label="Transport routes" value={transport.length} hint={`${transport.reduce((s, t) => s + t.assigned, 0)} students assigned`} icon={Bus} />
        <StatCard label="Assets tracked" value={assets.length} hint={`${assets.filter((a) => a.condition === 'Needs repair' || a.condition === 'Under repair').length} needing attention`} icon={Package} />
        <StatCard label="Maintenance open" value={maintenance.filter((m) => m.status !== 'Completed').length} hint={`${rooms.filter((r) => r.status === 'Under maintenance').length} rooms unavailable`} tone="warning" icon={Wrench} />
      </div>

      <Tabs defaultValue="library" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="assets">Inventory and assets</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-4 space-y-6">
          <DataTable
            rows={books}
            searchKeys={['title', 'author', 'category', 'isbn']}
            searchPlaceholder="Search the catalogue…"
            filters={[{ key: 'category', label: 'Category', options: [...new Set(books.map((b) => b.category))] }]}
            pageSize={5}
            columns={[
              { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'author', label: 'Author' },
              { key: 'isbn', label: 'ISBN' },
              { key: 'category', label: 'Category' },
              { key: 'shelf', label: 'Shelf' },
              { key: 'copies', label: 'Copies', align: 'right' },
              { key: 'available', label: 'Available', align: 'right' },
            ]}
            selectable={false}
          />
          <DataTable
            rows={loans}
            title="Loans"
            searchKeys={['book', 'borrower', 'status']}
            searchPlaceholder="Search loans…"
            filters={[{ key: 'status', label: 'Status', options: ['Issued', 'Returned', 'Overdue'] }]}
            pageSize={5}
            columns={[
              { key: 'book', label: 'Book' },
              { key: 'borrower', label: 'Borrower' },
              { key: 'issuedOn', label: 'Issued' },
              { key: 'dueOn', label: 'Due' },
              { key: 'returnedOn', label: 'Returned' },
              { key: 'fine', label: 'Fine', align: 'right', render: (row) => (row.fine ? formatMoney(row.fine) : '—') },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Fines are adjusted only with permission and are recorded"
          />
        </TabsContent>

        <TabsContent value="transport" className="mt-4">
          <DataTable
            rows={transport}
            searchKeys={['vehicle', 'route', 'driver', 'status']}
            searchPlaceholder="Search routes and vehicles…"
            filters={[{ key: 'status', label: 'Status', options: ['Active', 'In maintenance'] }]}
            columns={[
              { key: 'vehicle', label: 'Vehicle', render: (row) => <span className="font-medium">{row.vehicle}</span> },
              { key: 'type', label: 'Type' },
              { key: 'route', label: 'Route' },
              { key: 'driver', label: 'Driver' },
              { key: 'phone', label: 'Contact' },
              { key: 'stops', label: 'Stops', align: 'right' },
              { key: 'assigned', label: 'Students', align: 'right', render: (row) => `${row.assigned} / ${row.capacity}` },
              { key: 'fee', label: 'Monthly fee', align: 'right', render: (row) => formatMoney(row.fee) },
              { key: 'documents', label: 'Documents' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Live vehicle tracking is not available until a GPS provider is connected"
          />
        </TabsContent>

        <TabsContent value="assets" className="mt-4">
          <DataTable
            rows={assets}
            searchKeys={['tag', 'item', 'serial', 'location', 'responsible']}
            searchPlaceholder="Search assets by tag, item or location…"
            filters={[
              { key: 'category', label: 'Category', options: [...new Set(assets.map((a) => a.category))] },
              { key: 'condition', label: 'Condition', options: ['Excellent', 'Good', 'Needs repair', 'Under repair'] },
              { key: 'status', label: 'Status', options: ['In use', 'Marked for disposal'] },
            ]}
            columns={[
              { key: 'tag', label: 'Asset tag' },
              { key: 'item', label: 'Item', render: (row) => <span className="font-medium">{row.item}</span> },
              { key: 'category', label: 'Category' },
              { key: 'location', label: 'Location' },
              { key: 'responsible', label: 'Responsible staff' },
              { key: 'cost', label: 'Cost', align: 'right', render: (row) => formatMoney(row.cost) },
              { key: 'warranty', label: 'Warranty' },
              { key: 'condition', label: 'Condition', render: (row) => <StatusBadge value={row.condition} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['In use', 'Marked for disposal'] }}
            footerNote="Disposal and write-off require authorisation"
          />
        </TabsContent>

        <TabsContent value="facilities" className="mt-4 space-y-6">
          <DataTable
            rows={maintenance}
            searchKeys={['request', 'location', 'assignedTo', 'status']}
            searchPlaceholder="Search maintenance requests…"
            filters={[{ key: 'status', label: 'Status', options: ['Reported', 'Assigned', 'In progress', 'Completed'] }]}
            pageSize={5}
            columns={[
              { key: 'request', label: 'Request', render: (row) => <span className="font-medium">{row.request}</span> },
              { key: 'location', label: 'Location' },
              { key: 'priority', label: 'Priority', render: (row) => <StatusBadge value={row.priority} /> },
              { key: 'reportedOn', label: 'Reported' },
              { key: 'assignedTo', label: 'Assigned to' },
              { key: 'cost', label: 'Cost', align: 'right', render: (row) => (row.cost ? formatMoney(row.cost) : '—') },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
          <DataTable
            rows={rooms}
            searchKeys={['name', 'type', 'facilities']}
            searchPlaceholder="Search rooms…"
            pageSize={5}
            columns={[
              { key: 'name', label: 'Room' },
              { key: 'type', label: 'Type' },
              { key: 'capacity', label: 'Capacity', align: 'right' },
              { key: 'utilisation', label: 'Utilisation', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
          />
        </TabsContent>

        <TabsContent value="visitors" className="mt-4">
          <DataTable
            rows={visitors}
            searchKeys={['name', 'purpose', 'host', 'badge']}
            searchPlaceholder="Search visitor records…"
            filters={[{ key: 'status', label: 'Status', options: ['On campus', 'Checked out'] }]}
            columns={[
              { key: 'name', label: 'Visitor', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'purpose', label: 'Purpose' },
              { key: 'host', label: 'Host' },
              { key: 'badge', label: 'Badge' },
              { key: 'checkIn', label: 'Checked in' },
              { key: 'checkOut', label: 'Checked out' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Visitor data is retained only as long as operational need requires"
          />
        </TabsContent>

        <TabsContent value="vendors" className="mt-4">
          <DataTable
            rows={vendors}
            searchKeys={['name', 'category', 'contact']}
            searchPlaceholder="Search vendors…"
            filters={[{ key: 'category', label: 'Category', options: [...new Set(vendors.map((v) => v.category))] }]}
            columns={[
              { key: 'name', label: 'Vendor', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'category', label: 'Category' },
              { key: 'contact', label: 'Contact person' },
              { key: 'phone', label: 'Phone' },
              { key: 'rating', label: 'Rating', align: 'right' },
              { key: 'purchases', label: 'Purchases', align: 'right' },
              { key: 'outstanding', label: 'Outstanding', align: 'right', render: (row) => (row.outstanding ? formatMoney(row.outstanding) : '—') },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Purchase orders and goods receipt are tracked from the budgets module"
          />
          <p className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-cream p-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><Store className="h-3.5 w-3.5 text-primary" /> Campus store: uniform and stationery sales are kept separate from tuition invoices.</span>
            <span className="flex items-center gap-2"><Utensils className="h-3.5 w-3.5 text-primary" /> Canteen: dietary information is visible only to staff who need it.</span>
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}