import { useState } from 'react';
import { AlertCircle, CheckCircle2, LifeBuoy, Send } from 'lucide-react';
import { ACADEMY } from '@/data/academy';
import { insert, logAction } from '@/data/store';

const CATEGORIES = ['Account access', 'Fees and invoices', 'Academics and results', 'Attendance', 'Transport', 'Documents', 'Technical problem', 'Other'];
const PRIORITIES = ['Normal', 'High', 'Urgent'];

export default function Support() {
  const [form, setForm] = useState({ name: '', role: 'Parent', contact: '', category: CATEGORIES[0], priority: 'Normal', subject: '', details: '' });
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your name.';
    if (!form.contact.trim()) next.contact = 'Enter an email address or mobile number.';
    if (!form.subject.trim()) next.subject = 'Give the request a short title.';
    if (form.details.trim().length < 15) next.details = 'Please describe the issue in a little more detail.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const reference = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
    insert('tickets', {
      reference,
      subject: form.subject,
      category: form.category,
      raisedBy: form.name,
      role: form.role,
      priority: form.priority,
      status: 'Open',
      assignedTo: 'Front desk',
      createdOn: new Date().toISOString().slice(0, 10),
      updatedOn: new Date().toISOString().slice(0, 10),
      responseDue: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      sla: 'Within target',
    });
    logAction({
      actor: form.name,
      role: form.role,
      action: 'Raised support ticket',
      module: 'Support',
      target: reference,
      reason: form.category,
    });
    setTicket(reference);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Support</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Raise a support request
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Requests are logged with a reference number, assigned to the right department and tracked until they are
          resolved. For anything urgent, call the campus office on {ACADEMY.phone}.
        </p>
      </header>

      {ticket ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-8">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-tint text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">Request received</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Your request has been recorded under the reference below. The campus office aims to respond within one
            working day, and you will be contacted on {form.contact}.
          </p>
          <p className="mt-4 inline-block rounded-xl border border-primary/20 bg-brand-tint px-4 py-3 font-mono text-lg font-semibold tracking-wider text-primary">
            {ticket}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => { setTicket(null); setForm({ ...form, subject: '', details: '' }); }}
              className="inline-flex h-11 items-center rounded-xl border border-input px-5 text-sm font-semibold text-foreground"
            >
              Raise another request
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted-foreground">
                Your name *
                <input value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder="Full name" />
                {errors.name && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.name}</span>}
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                I am a
                <select value={form.role} onChange={(e) => update('role', e.target.value)} className={inputClass}>
                  {['Parent', 'Student', 'Teacher', 'Applicant', 'Other'].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Email or mobile *
                <input value={form.contact} onChange={(e) => update('contact', e.target.value)} className={inputClass} placeholder="How should we reply?" />
                {errors.contact && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.contact}</span>}
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Category
                <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass}>
                  {CATEGORIES.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Priority
                <select value={form.priority} onChange={(e) => update('priority', e.target.value)} className={inputClass}>
                  {PRIORITIES.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Short title *
                <input value={form.subject} onChange={(e) => update('subject', e.target.value)} className={inputClass} placeholder="For example: receipt not visible" />
                {errors.subject && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.subject}</span>}
              </label>
            </div>

            <label className="block text-xs font-semibold text-muted-foreground">
              What happened? *
              <textarea rows={5} value={form.details} onChange={(e) => update('details', e.target.value)} className={textareaClass} placeholder="Include the class, invoice number or page where the problem appears." />
              {errors.details && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.details}</span>}
            </label>

            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
              <Send className="h-4 w-4" /> Submit request
            </button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-cream p-6">
              <LifeBuoy className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-heading text-base font-bold tracking-tight text-foreground">Response times</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Urgent — access or payment blocked', 'Same working day'],
                  ['High — academic or fee question', 'Within 1 working day'],
                  ['Normal — general enquiry', 'Within 2 working days'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="flex gap-2.5 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Never include passwords, wallet PINs or one-time codes in a support request. Staff will never ask for them.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';