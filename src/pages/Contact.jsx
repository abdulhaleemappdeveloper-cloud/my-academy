import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { ACADEMY } from '@/data/academy';

const TOPICS = ['Admission enquiry', 'Fee or invoice question', 'Notes and study material', 'Portal access', 'Transport', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', topic: TOPICS[0], message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.contact.trim()) next.contact = 'Enter an email address or phone number so we can reply.';
    if (form.message.trim().length < 10) next.message = 'Please describe your question in a little more detail.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Talk to the campus office
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          The office is open {ACADEMY.hours}. Send a message and the team replies within one working day, or call the
          campus directly for anything urgent.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {[
            { icon: MapPin, label: 'Campus address', value: ACADEMY.address },
            { icon: Phone, label: 'Phone', value: ACADEMY.phone },
            { icon: MessageCircle, label: 'WhatsApp', value: ACADEMY.whatsapp },
            { icon: Mail, label: 'Email', value: ACADEMY.email },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-tint text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                <p className="mt-1 break-words text-sm font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-border bg-cream p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Office hours</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ['Monday – Friday', '8:00 am – 6:00 pm'],
                ['Saturday', '8:00 am – 2:00 pm'],
                ['Sunday', 'Closed'],
              ].map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{day}</dt>
                  <dd className="font-medium text-foreground">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Getting here</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The campus is on College Road near the PCSIR Staff Housing Society, with drop-off at the side street
              entrance between 7:45 am and 8:15 am.
            </p>
            <div className="mt-3 grid h-40 place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-center">
              <p className="px-4 text-xs text-muted-foreground">
                An interactive map loads here once the maps provider is connected. The office shares directions on request.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          {sent ? (
            <div className="grid h-full place-items-center py-10 text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-tint text-primary">
                  <Send className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">Message recorded</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Thank you, {form.name.split(' ')[0] || 'there'}. Your enquiry has been noted for the{' '}
                  {form.topic.toLowerCase()} and the office will reply to {form.contact}.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm({ name: '', contact: '', topic: TOPICS[0], message: '' }); }}
                  className="mt-5 inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Send a message</h2>

              <label className="block text-xs font-semibold text-muted-foreground">
                Your name *
                <input
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
                  placeholder="Full name"
                />
                {errors.name && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.name}</span>}
              </label>

              <label className="block text-xs font-semibold text-muted-foreground">
                Email or phone *
                <input
                  value={form.contact}
                  onChange={(event) => update('contact', event.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
                  placeholder="How should we reply?"
                />
                {errors.contact && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.contact}</span>}
              </label>

              <label className="block text-xs font-semibold text-muted-foreground">
                What is it about?
                <select
                  value={form.topic}
                  onChange={(event) => update('topic', event.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary/50"
                >
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-semibold text-muted-foreground">
                Message *
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(event) => update('message', event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50"
                  placeholder="Tell us what you need help with"
                />
                {errors.message && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.message}</span>}
              </label>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Send className="h-4 w-4" /> Send message
              </button>

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Please do not send identity documents or payment proofs through this form. Upload them in the portal so
                they are stored privately and linked to the correct record.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}