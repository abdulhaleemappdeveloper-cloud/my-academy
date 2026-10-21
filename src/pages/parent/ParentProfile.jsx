import { useState } from 'react';
import { LifeBuoy, Lock, Send, ShieldCheck, UserCog } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';
import { ACADEMY } from '@/data/academy';

const Row = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 border-b border-border/70 px-4 py-2.5 last:border-0">
    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-2 break-words text-sm text-foreground">{value}</dd>
  </div>
);

const CATEGORIES = ['Account access', 'Fees and invoices', 'Academics and results', 'Attendance', 'Transport', 'Other'];

export default function ParentProfile() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const consents = useCollection('consents');
  const tickets = useCollection('tickets');
  const { toast } = useToast();

  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));
  const mine = tickets.filter((t) => t.raisedBy === guardian.name);

  const [form, setForm] = useState({ subject: '', category: CATEGORIES[0], details: '' });
  const [errors, setErrors] = useState({});

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.subject.trim()) next.subject = 'Give the request a short title.';
    if (form.details.trim().length < 15) next.details = 'Describe the request in a little more detail.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const reference = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
    insert('tickets', {
      reference,
      subject: form.subject,
      category: form.category,
      raisedBy: guardian.name,
      role: 'Parent',
      priority: 'Normal',
      status: 'Open',
      assignedTo: 'Front desk',
      createdOn: new Date().toISOString().slice(0, 10),
      updatedOn: new Date().toISOString().slice(0, 10),
      responseDue: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      sla: 'Within target',
    });
    logAction({ actor: guardian.name, role: 'Guardian', action: 'Raised support ticket', module: 'Support', target: reference, reason: form.category });
    toast({ title: 'Request submitted', description: `Reference ${reference}. The office replies through your portal.` });
    setForm({ subject: '', category: CATEGORIES[0], details: '' });
  };

  return (
    <div>
      <PageHeader
        title="Profile, consents and support"
        description="Your guardian record as verified by the campus office, the consents you have given, and a way to raise a request."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Profile' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Guardian status" value={guardian.status} hint={`${guardian.relation} · linked ${children.length} child(ren)`} tone={guardian.status === 'Verified' ? 'brand' : 'warning'} icon={ShieldCheck} />
        <StatCard label="Consents recorded" value={consents.filter((c) => c.given > 0).length} hint="Per purpose and version" icon={Lock} />
        <StatCard label="My requests" value={mine.length} hint="Support tickets raised" icon={LifeBuoy} />
        <StatCard label="Open requests" value={mine.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed').length} hint="Being handled" tone="warning" />
      </div>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">My details</TabsTrigger>
          <TabsTrigger value="children">Linked children</TabsTrigger>
          <TabsTrigger value="consents">Consents</TabsTrigger>
          <TabsTrigger value="security">Account and privacy</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <dl className="overflow-hidden rounded-2xl border border-border bg-card">
            <Row label="Name" value={guardian.name} />
            <Row label="Relationship" value={guardian.relation} />
            <Row label="Mobile" value={guardian.phone} />
            <Row label="WhatsApp" value={guardian.whatsapp} />
            <Row label="Email" value={guardian.email} />
            <Row label="Occupation" value={guardian.occupation} />
            <Row label="Verification" value={<StatusBadge value={guardian.status} />} />
            <Row label="Last contact" value={guardian.lastContact} />
          </dl>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <UserCog className="h-3.5 w-3.5 text-primary" /> Requests to change your contact details or a guardian link are
            reviewed by the campus office before anything is updated.
          </p>
        </TabsContent>

        <TabsContent value="children" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Child</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Relationship</th>
                  <th className="px-4 py-3">Verification</th>
                </tr>
              </thead>
              <tbody>
                {children.map((child) => (
                  <tr key={child.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{child.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{child.className} · Section {child.section}</td>
                    <td className="px-4 py-3 text-muted-foreground">{guardian.relation}</td>
                    <td className="px-4 py-3"><StatusBadge value={guardian.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            A guardian link is verified once and can be revoked by the office when it is no longer valid. Guessing a
            student ID never grants access.
          </p>
        </TabsContent>

        <TabsContent value="consents" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Audience</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3 text-right">Given</th>
                  <th className="px-4 py-3 text-right">Pending</th>
                </tr>
              </thead>
              <tbody>
                {consents.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.purpose}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.audience}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.version}</td>
                    <td className="px-4 py-3 text-right text-foreground">{row.given}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Each consent is recorded with the wording version and the date it was given. Optional consents can be
            withdrawn at any time without affecting enrolment; silence is never treated as consent.
          </p>
        </TabsContent>

        <TabsContent value="security" className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <ShieldCheck className="h-4 w-4 text-primary" /> Account security
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ['Password', 'Reset from the sign-in screen if you forget it'],
                ['Sessions', 'Signing out ends the session on this device'],
                ['Two-step verification', 'Off — recommended for guardian accounts'],
                ['Access log', 'Recorded and visible to the campus office'],
              ].map(([label, value]) => (
                <li key={label} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-5 inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Change password
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Privacy settings</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                'Attendance and result notifications',
                'Fee reminder messages',
                'Meeting and event reminders',
                'Media publication of my child (optional)',
              ].map((line) => (
                <li key={line} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{line}</span>
                  <StatusBadge value="Enabled" />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Changes are processed by the campus office on receipt. Records required for academic and financial history
              are retained as described in the privacy policy.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Raise a request</h2>
            <label className="block text-xs font-semibold text-muted-foreground">
              Short title *
              <input value={form.subject} onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))} className={inputClass} placeholder="For example: request a result recheck" />
              {errors.subject && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.subject}</span>}
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Category
              <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className={inputClass}>
                {CATEGORIES.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Details *
              <textarea rows={5} value={form.details} onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))} className={textareaClass} placeholder="Include the child's name, class and any reference numbers." />
              {errors.details && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.details}</span>}
            </label>
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
              <Send className="h-4 w-4" /> Submit request
            </button>
            <p className="text-[11px] text-muted-foreground">
              For anything urgent call the campus office on {ACADEMY.phone}. Never include passwords or one-time codes.
            </p>
          </form>

          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">My requests</h2>
            <DataTable
              rows={mine}
              searchKeys={['reference', 'subject', 'status']}
              searchPlaceholder="Search requests…"
              filters={[{ key: 'status', label: 'Status', options: ['Open', 'In progress', 'Waiting on user', 'Resolved', 'Closed'] }]}
              pageSize={6}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';