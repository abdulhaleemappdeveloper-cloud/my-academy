import { useState } from 'react';
import { Bell, CheckCheck, MessageSquare, Send } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { bulkPatch, insert, logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function ParentInbox() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const notifications = useCollection('notifications');
  const messages = useCollection('messages');
  const announcements = useCollection('announcements');
  const { toast } = useToast();

  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));
  const unread = notifications.filter((row) => !row.read);

  const [reply, setReply] = useState({ to: '', body: '' });

  const send = () => {
    if (!reply.to || reply.body.trim().length < 10) {
      toast({ title: 'Complete the message', description: 'Choose a recipient and write your message.', variant: 'destructive' });
      return;
    }
    const record = insert('messages', {
      from: `${guardian.name} (guardian)`,
      to: reply.to,
      about: reply.to?.split(' ')[0] || 'General',
      subject: 'Message from guardian',
      sent: new Date().toISOString().slice(0, 10),
      status: 'Unread',
      flagged: false,
      body: reply.body,
    });
    logAction({ actor: guardian.name, role: 'Guardian', action: 'Messaged a subject teacher', module: 'Communication', target: record.to });
    toast({ title: 'Message sent', description: 'The teacher replies through the portal. Delivery is shown honestly — queued is not delivered.' });
    setReply({ to: '', body: '' });
  };

  return (
    <div>
      <PageHeader
        title="Notifications and messages"
        description="Academy notices, updates about your children and conversations with subject teachers."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Notifications' }]}
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
        <StatCard label="Unread" value={unread.length} hint="Notifications for you" tone={unread.length ? 'warning' : 'brand'} icon={Bell} />
        <StatCard label="Total notifications" value={notifications.length} hint="This session" icon={Bell} />
        <StatCard label="Conversations" value={messages.filter((m) => m.guardian === `${guardian.name} (guardian)` || m.from?.includes(guardian.name) || m.to?.includes('guardian')).length} hint="With subject teachers" icon={MessageSquare} />
        <StatCard label="Parent notices" value={announcements.filter((a) => a.audience === 'Parents' || a.audience === 'Everyone').length} hint="Published by the office" />
      </div>

      <Tabs defaultValue="notifications" className="mt-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4 overflow-hidden rounded-2xl border border-border">
          <ul className="divide-y divide-border">
            {notifications.map((row) => (
              <li key={row.id} className={`flex items-start justify-between gap-4 px-4 py-3.5 ${row.read ? 'bg-card' : 'bg-brand-tint/40'}`}>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{row.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.category} · {row.time} · {row.channel} · {row.delivery}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge value={row.read ? 'Read' : 'Unread'} />
                  {!row.read && (
                    <button type="button" onClick={() => patch('notifications', row.id, { read: true })} className="text-xs font-semibold text-primary hover:underline">
                      Mark read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="messages" className="mt-4 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-border">
            <ul className="divide-y divide-border">
              {messages.map((row) => (
                <li key={row.id} className="bg-card px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{row.subject}</p>
                    <span className="text-xs text-muted-foreground">{row.sent}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">From {row.from} · about {row.about}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Message a subject teacher</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                About which child?
                <select value={reply.to} onChange={(event) => setReply((prev) => ({ ...prev, to: event.target.value }))} className={inputClass}>
                  <option value="">Select a child…</option>
                  {children.map((child) => (
                    <option key={child.id} value={`${child.name} (${child.className})`}>{child.name} · {child.className}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Message
                <textarea
                  rows={4}
                  value={reply.body}
                  onChange={(event) => setReply((prev) => ({ ...prev, body: event.target.value }))}
                  className={textareaClass}
                  placeholder="Describe what you would like to discuss."
                />
              </label>
              <button type="button" onClick={send} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
                <Send className="h-4 w-4" /> Send message
              </button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Teachers' private contact details are never shared, and your contact details are not shown to other
                families. For anything urgent, call the campus office instead.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notices" className="mt-4 overflow-hidden rounded-2xl border border-border">
          <ul className="divide-y divide-border">
            {announcements.filter((row) => row.audience === 'Parents' || row.audience === 'Everyone').map((row) => (
              <li key={row.id} className="bg-card px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={row.category} tone="brand" />
                  <span className="text-xs text-muted-foreground">{row.date}</span>
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

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';