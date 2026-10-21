import { Bell, CheckCheck, Megaphone, MessageSquare } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bulkPatch, patch, useCollection } from '@/data/store';

export default function StudentInbox() {
  const notifications = useCollection('notifications');
  const messages = useCollection('messages');
  const announcements = useCollection('announcements');
  const unread = notifications.filter((row) => !row.read);

  return (
    <div>
      <PageHeader
        title="Notifications and messages"
        description="Everything the academy has sent you: notices, result and fee updates, and messages from subject teachers."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Notifications' }]}
        actions={
          <button
            type="button"
            onClick={() => bulkPatch('notifications', unread.map((row) => row.id), { read: true })}
            disabled={unread.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Unread" value={unread.length} hint="Notifications awaiting you" tone={unread.length ? 'warning' : 'brand'} icon={Bell} />
        <StatCard label="Total notifications" value={notifications.length} hint="This session" icon={Bell} />
        <StatCard label="Messages" value={messages.length} hint="Teacher and office conversations" icon={MessageSquare} />
        <StatCard label="Notices published" value={announcements.filter((a) => a.status === 'Published').length} hint="Campus announcements" icon={Megaphone} />
      </div>

      <Tabs defaultValue="notifications" className="mt-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4 overflow-hidden rounded-2xl border border-border">
          <ul className="divide-y divide-border">
            {notifications.map((row) => (
              <li key={row.id} className={`flex items-start justify-between gap-4 px-4 py-3.5 ${row.read ? 'bg-card' : 'bg-brand-tint/40'}`}>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{row.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {row.category} · {row.time} · {row.channel}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge value={row.read ? 'Read' : 'Unread'} />
                  {!row.read && (
                    <button
                      type="button"
                      onClick={() => patch('notifications', row.id, { read: true })}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="messages" className="mt-4 overflow-hidden rounded-2xl border border-border">
          <ul className="divide-y divide-border">
            {messages.map((row) => (
              <li key={row.id} className="bg-card px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{row.subject}</p>
                  <span className="text-xs text-muted-foreground">{row.sent}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  From {row.from} · about {row.about}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.body}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <StatusBadge value={row.status} />
                  {row.flagged && <StatusBadge value="Flagged for review" tone="warning" />}
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            Conversations between teachers and guardians are private. Messages are moderated only when a report is raised.
          </p>
        </TabsContent>

        <TabsContent value="announcements" className="mt-4 overflow-hidden rounded-2xl border border-border">
          <ul className="divide-y divide-border">
            {announcements.filter((row) => row.status === 'Published').map((row) => (
              <li key={row.id} className="bg-card px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={row.category} tone="brand" />
                  <span className="text-xs text-muted-foreground">{row.date} · {row.audience}</span>
                  {row.pinned && <StatusBadge value="Pinned" tone="gold" />}
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{row.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{row.body}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}