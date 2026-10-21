import { useState } from 'react';
import { Bell, Megaphone, MessageSquare, Send } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { bulkPatch, insert, logAction, patch, useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function TeacherInbox() {
  const { account } = useSession();
  const notifications = useCollection('notifications');
  const messages = useCollection('messages');
  const announcements = useCollection('announcements');
  const students = useCollection('students');
  const { toast } = useToast();

  const unread = notifications.filter((row) => !row.read);
  const [draft, setDraft] = useState({ title: '', audience: 'Class 9 – 12', category: 'Academics', body: '' });
  const [errors, setErrors] = useState({});
  const [reply, setReply] = useState({ to: '', about: '', body: '' });

  const publishAnnouncement = () => {
    const next = {};
    if (!draft.title.trim()) next.title = 'Enter a title for the announcement.';
    if (draft.body.trim().length < 15) next.body = 'Write the announcement in a little more detail.';
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
    logAction({ actor: account?.name, role: 'Teacher', action: 'Published class announcement', module: 'Communication', target: record.title });
    toast({ title: 'Announcement published', description: `Visible to ${draft.audience}.` });
    setDraft({ ...draft, title: '', body: '' });
  };

  const sendMessage = () => {
    if (!reply.to || reply.body.trim().length < 10) {
      toast({ title: 'Complete the message', description: 'Choose a recipient and write the message before sending.', variant: 'destructive' });
      return;
    }
    const record = insert('messages', {
      from: account?.name,
      to: reply.to,
      about: reply.about || 'General',
      subject: 'Message from the subject teacher',
      sent: new Date().toISOString().slice(0, 10),
      status: 'Unread',
      flagged: false,
      body: reply.body,
    });
    logAction({ actor: account?.name, role: 'Teacher', action: 'Sent message to guardian', module: 'Communication', target: record.to });
    toast({ title: 'Message sent', description: 'Guardians see messages in their portal. Delivery is recorded honestly — queued is not delivered.' });
    setReply({ to: '', about: '', body: '' });
  };

  return (
    <div>
      <PageHeader
        title="Notifications and communication"
        description="Office notices, class announcements and conversations with guardians about their own children only."
        breadcrumbs={[{ label: 'Teacher portal', path: '/teacher' }, { label: 'Notifications' }]}
        actions={
          <button
            type="button"
            onClick={() => bulkPatch('notifications', unread.map((row) => row.id), { read: true })}
            disabled={unread.length === 0}
            className="inline-flex h-10 items-center rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            Mark all read
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Unread" value={unread.length} hint="Notifications for you" tone={unread.length ? 'warning' : 'brand'} icon={Bell} />
        <StatCard label="Conversations" value={messages.length} hint="Guardian and office messages" icon={MessageSquare} />
        <StatCard label="Class announcements" value={announcements.filter((a) => a.author === account?.name).length} hint="Published by you" icon={Megaphone} />
        <StatCard label="Parents reachable" value={new Set(students.map((s) => s.guardianName)).size} hint="Verified guardian links only" />
      </div>

      <Tabs defaultValue="notifications" className="mt-6">
        <TabsList className="flex-wrap">
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
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.category} · {row.time} · {row.channel} · {row.delivery}</p>
                </div>
                {!row.read && (
                  <button type="button" onClick={() => patch('notifications', row.id, { read: true })} className="shrink-0 text-xs font-semibold text-primary hover:underline">
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="border-t border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            Delivery status reflects what the provider reported. A queued message is not shown as delivered.
          </p>
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
            <h2 className="font-heading text-base font-bold tracking-tight">Send a message to a guardian</h2>
            <p className="mt-1.5 text-xs text-muted-foreground">
              You can only message the guardian of a student in your assigned classes.
            </p>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Student
                <select value={reply.about} onChange={(event) => setReply((prev) => ({ ...prev, about: event.target.value, to: `${students.find((s) => s.name === event.target.value)?.guardianName} (guardian)` }))} className={inputClass}>
                  <option value="">Select a student…</option>
                  {students.slice(0, 20).map((student) => (
                    <option key={student.id} value={student.name}>{student.name} · {student.className} {student.section}</option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-semibold text-muted-foreground">
                Recipient
                <input value={reply.to} readOnly className={`${inputClass} bg-muted/50`} placeholder="Set automatically from the guardian link" />
              </label>

              <label className="block text-xs font-semibold text-muted-foreground">
                Message
                <textarea
                  rows={4}
                  value={reply.body}
                  onChange={(event) => setReply((prev) => ({ ...prev, body: event.target.value }))}
                  className={textareaClass}
                  placeholder="Keep it factual: what was observed, what is being done, what is needed."
                />
              </label>

              <button type="button" onClick={sendMessage} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
                <Send className="h-4 w-4" /> Send message
              </button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Your personal contact details are never shown to guardians. Conversations stay inside the portal and are
                reviewed only if a report is raised.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Publish a class announcement</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Title *
                <input value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} className={inputClass} placeholder="Revision class on Saturday" />
                {errors.title && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.title}</span>}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-muted-foreground">
                  Audience
                  <select value={draft.audience} onChange={(event) => setDraft((prev) => ({ ...prev, audience: event.target.value }))} className={inputClass}>
                    {['Class 9 – 12', 'Class 9', 'Class 10', 'Section A', 'Section B'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Category
                  <select value={draft.category} onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))} className={inputClass}>
                    {['Academics', 'Examinations', 'Assignments', 'Meetings', 'Campus'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <label className="block text-xs font-semibold text-muted-foreground">
                Message *
                <textarea rows={4} value={draft.body} onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))} className={textareaClass} />
                {errors.body && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.body}</span>}
              </label>
              <button type="button" onClick={publishAnnouncement} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
                <Megaphone className="h-4 w-4" /> Publish announcement
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <ul className="divide-y divide-border">
              {announcements.slice(0, 8).map((row) => (
                <li key={row.id} className="bg-card px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge value={row.category} tone="brand" />
                    <span className="text-xs text-muted-foreground">{row.date} · {row.audience}</span>
                    <StatusBadge value={row.status} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{row.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{row.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';