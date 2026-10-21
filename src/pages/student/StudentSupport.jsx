import { useState } from 'react';
import { LifeBuoy, Send } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { ACADEMY } from '@/data/academy';
import { FAQS } from '@/data/academy';

const CATEGORIES = ['Account access', 'Fees and invoices', 'Academics and results', 'Attendance', 'Study material', 'Technical problem', 'Other'];

export default function StudentSupport() {
  const { account } = useSession();
  const tickets = useCollection('tickets');
  const feedback = useCollection('feedback');
  const { toast } = useToast();

  const [form, setForm] = useState({ subject: '', category: CATEGORIES[0], priority: 'Normal', details: '' });
  const [errors, setErrors] = useState({});
  const mine = tickets.filter((row) => row.raisedBy === account?.name);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.subject.trim()) next.subject = 'Give your request a short title.';
    if (form.details.trim().length < 15) next.details = 'Describe the issue in a little more detail.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const reference = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
    insert('tickets', {
      reference,
      subject: form.subject,
      category: form.category,
      raisedBy: account?.name,
      role: account?.label || 'Student',
      priority: form.priority,
      status: 'Open',
      assignedTo: 'Front desk',
      createdOn: new Date().toISOString().slice(0, 10),
      updatedOn: new Date().toISOString().slice(0, 10),
      responseDue: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      sla: 'Within target',
    });
    logAction({
      actor: account?.name || 'Unknown',
      role: account?.label || 'Student',
      action: 'Raised support ticket',
      module: 'Support',
      target: reference,
      reason: form.category,
    });
    toast({ title: 'Support request raised', description: `Reference ${reference}. The office will reply through your portal.` });
    setForm({ subject: '', category: CATEGORIES[0], priority: 'Normal', details: '' });
  };

  return (
    <div>
      <PageHeader
        title="Support and help"
        description={`Raise a request about results, fees, attendance or portal access. For anything urgent call the campus office on ${ACADEMY.phone}.`}
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Support' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open requests" value={mine.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed').length} hint="Being handled by the office" tone="warning" icon={LifeBuoy} />
        <StatCard label="Resolved" value={mine.filter((t) => t.status === 'Resolved').length} hint="Closed this session" tone="brand" />
        <StatCard label="Teacher feedback" value={feedback.filter((f) => f.studentName === account?.name).length} hint="Subject comments shared with you" />
        <StatCard label="Help articles" value={FAQS.length} hint="Answers to common questions" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">Raise a support request</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Short title *
              <input
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                className={inputClass}
                placeholder="For example: attendance marked absent by mistake"
              />
              {errors.subject && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.subject}</span>}
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Category
              <select
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                className={inputClass}
              >
                {CATEGORIES.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Priority
              <select
                value={form.priority}
                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
                className={inputClass}
              >
                {['Normal', 'High', 'Urgent'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-muted-foreground">
            What happened? *
            <textarea
              rows={5}
              value={form.details}
              onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
              className={textareaClass}
              placeholder="Include dates and subject names where relevant."
            />
            {errors.details && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.details}</span>}
          </label>

          <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
            <Send className="h-4 w-4" /> Submit request
          </button>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Never include passwords or one-time codes. Corrections to official records are reviewed before any change is
            made.
          </p>
        </form>

        <div className="space-y-6">
          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">My requests</h2>
            <DataTable
              rows={mine}
              searchKeys={['reference', 'subject', 'category', 'status']}
              searchPlaceholder="Search requests…"
              filters={[{ key: 'status', label: 'Status', options: ['Open', 'In progress', 'Waiting on user', 'Resolved', 'Closed'] }]}
              pageSize={5}
              selectable={false}
              columns={[
                { key: 'reference', label: 'Reference' },
                { key: 'subject', label: 'Subject' },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                { key: 'updatedOn', label: 'Updated' },
              ]}
              emptyTitle="No requests raised yet"
            />
          </div>

          <div className="rounded-2xl border border-border bg-cream p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">Common questions</h2>
            <dl className="mt-3 space-y-3">
              {FAQS.slice(0, 4).map((item) => (
                <div key={item.q}>
                  <dt className="text-sm font-semibold text-foreground">{item.q}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';