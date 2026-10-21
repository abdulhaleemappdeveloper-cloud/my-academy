import { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { insert, logAction, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

/** Announcements, campus events, notification delivery and email templates. */
export default function AdminCommunications() {
  const announcements = useCollection('announcements');
  const events = useCollection('events');
  const notifications = useCollection('notifications');
  const templates = useCollection('emailTemplates');
  const { account } = useSession();
  const { toast } = useToast();

  const [draft, setDraft] = useState({ title: '', category: 'Academics', audience: 'Everyone', body: '' });
  const [errors, setErrors] = useState({});

  const publish = () => {
    const next = {};
    if (!draft.title.trim()) next.title = 'Enter an announcement title.';
    if (draft.body.trim().length < 15) next.body = 'Write the notice in a little more detail.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const record = insert('announcements', {
      title: draft.title,
      date: new Date().toISOString().slice(0, 10),
      category: draft.category,
      audience: draft.audience,
      status: 'Published',
      pinned: false,
      author: account?.name,
      views: 0,
      body: draft.body,
    });
    logAction({ actor: account?.name, role: account?.label, action: 'Published announcement', module: 'Communication', target: record.title });
    toast({ title: 'Announcement published', description: `Visible to ${draft.audience} in their portal.` });
    setDraft({ ...draft, title: '', body: '' });
  };

  return (
    <div>
      <PageHeader
        title="Announcements and notifications"
        description="Notices for the whole academy or a specific audience, the campus event calendar, notification delivery and the email templates behind each message."
        breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Announcements and notifications' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published notices" value={announcements.filter((a) => a.status === 'Published').length} hint={`${announcements.filter((a) => a.pinned).length} pinned`} icon={Megaphone} />
        <StatCard label="Events scheduled" value={events.length} hint={`${events.filter((e) => new Date(e.date) >= new Date()).length} upcoming`} />
        <StatCard label="Notifications sent" value={notifications.length} hint={`${notifications.filter((n) => n.delivery === 'Failed').length} failed delivery`} tone={notifications.some((n) => n.delivery === 'Failed') ? 'warning' : 'neutral'} />
        <StatCard label="Email templates" value={templates.length} hint={`${templates.filter((t) => t.status === 'Active').length} active`} />
      </div>

      <Tabs defaultValue="announcements" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="notifications">Notification delivery</TabsTrigger>
          <TabsTrigger value="templates">Email templates</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Publish a notice</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Title *
                <input value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} className={inputClass} placeholder="Examination timetable released" />
                {errors.title && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.title}</span>}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-muted-foreground">
                  Category
                  <select value={draft.category} onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))} className={inputClass}>
                    {['Admissions', 'Examinations', 'Meetings', 'Academics', 'Campus', 'Finance'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Audience
                  <select value={draft.audience} onChange={(event) => setDraft((prev) => ({ ...prev, audience: event.target.value }))} className={inputClass}>
                    {['Everyone', 'Students', 'Teachers', 'Parents', 'Class 9 – 12'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <label className="block text-xs font-semibold text-muted-foreground">
                Notice text *
                <textarea rows={5} value={draft.body} onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))} className={textareaClass} />
                {errors.body && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.body}</span>}
              </label>
              <button type="button" onClick={publish} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
                <Send className="h-4 w-4" /> Publish notice
              </button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Publishing a notice for a large audience asks for confirmation before it is sent. SMS and WhatsApp remain
                unavailable until a provider is connected — the portal reports that honestly.
              </p>
            </div>
          </div>

          <DataTable
            rows={announcements}
            searchKeys={['title', 'category', 'audience', 'author']}
            searchPlaceholder="Search notices…"
            filters={[
              { key: 'status', label: 'Status', options: ['Published', 'Draft', 'Scheduled'] },
              { key: 'audience', label: 'Audience', options: [...new Set(announcements.map((a) => a.audience))] },
              { key: 'category', label: 'Category', options: [...new Set(announcements.map((a) => a.category))] },
            ]}
            pageSize={7}
            columns={[
              { key: 'title', label: 'Notice', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'category', label: 'Category' },
              { key: 'audience', label: 'Audience' },
              { key: 'date', label: 'Date' },
              { key: 'author', label: 'Issued by' },
              { key: 'views', label: 'Views', align: 'right' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Published', 'Draft'] }}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <DataTable
            rows={events}
            searchKeys={['title', 'venue', 'category', 'audience']}
            searchPlaceholder="Search events…"
            filters={[
              { key: 'category', label: 'Category', options: [...new Set(events.map((e) => e.category))] },
              { key: 'audience', label: 'Audience', options: [...new Set(events.map((e) => e.audience))] },
              { key: 'status', label: 'Status', options: ['Published', 'Draft'] },
            ]}
            columns={[
              { key: 'title', label: 'Event', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'category', label: 'Category' },
              { key: 'date', label: 'Date' },
              { key: 'time', label: 'Time' },
              { key: 'venue', label: 'Venue' },
              { key: 'audience', label: 'Audience' },
              { key: 'registered', label: 'Registered', align: 'right', render: (row) => `${row.registered} / ${row.capacity}` },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable
            bulkStatus={{ key: 'status', options: ['Published', 'Draft'] }}
            footerNote="Calendar visibility and reminders follow the event audience"
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <DataTable
            rows={notifications}
            searchKeys={['title', 'category', 'audience', 'channel']}
            searchPlaceholder="Search notifications…"
            filters={[
              { key: 'audience', label: 'Audience', options: [...new Set(notifications.map((n) => n.audience))] },
              { key: 'channel', label: 'Channel', options: [...new Set(notifications.map((n) => n.channel))] },
              { key: 'delivery', label: 'Delivery', options: ['Delivered', 'Queued', 'Failed'] },
            ]}
            columns={[
              { key: 'title', label: 'Notification', render: (row) => <span className="font-medium">{row.title}</span> },
              { key: 'category', label: 'Category' },
              { key: 'audience', label: 'Audience' },
              { key: 'channel', label: 'Channel' },
              { key: 'time', label: 'Time' },
              { key: 'delivery', label: 'Delivery', render: (row) => <StatusBadge value={row.delivery} /> },
              { key: 'read', label: 'Read', render: (row) => <StatusBadge value={row.read ? 'Read' : 'Unread'} tone="neutral" /> },
            ]}
            selectable={false}
            footerNote="A queued message is never reported as delivered"
          />
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <DataTable
            rows={templates}
            searchKeys={['name', 'channel', 'subject']}
            searchPlaceholder="Search templates…"
            filters={[
              { key: 'status', label: 'Status', options: ['Active', 'Draft'] },
              { key: 'channel', label: 'Channel', options: [...new Set(templates.map((t) => t.channel))] },
            ]}
            columns={[
              { key: 'name', label: 'Template', render: (row) => <span className="font-medium">{row.name}</span> },
              { key: 'channel', label: 'Channel' },
              { key: 'subject', label: 'Subject' },
              { key: 'sent', label: 'Sent', align: 'right' },
              { key: 'opens', label: 'Opened', align: 'right' },
              { key: 'lastSent', label: 'Last sent' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Templates never contain passwords, one-time codes or payment credentials"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';