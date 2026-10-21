import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { ACADEMY, CLASSES } from '@/data/academy';
import { insert, logAction } from '@/data/store';

const STEPS = ['Student details', 'Guardian details', 'Class and documents', 'Review and submit'];

const LEVELS = ['Primary', 'Middle', 'Matric', 'Intermediate', 'College', 'Professional'];

const emptyForm = {
  firstName: '', lastName: '', dob: '', gender: 'Female', previousSchool: '',
  guardianName: '', relation: 'Father', guardianPhone: '', guardianEmail: '', address: '',
  level: 'Matric', className: 'Class 9', documents: [], notes: '',
};

export default function AdmissionApply() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [reference, setReference] = useState(null);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const classOptions = CLASSES.filter((cls) => cls.level === form.level);

  const validate = () => {
    const next = {};
    if (step === 0) {
      if (!form.firstName.trim()) next.firstName = 'Enter the student’s first name.';
      if (!form.lastName.trim()) next.lastName = 'Enter the student’s family name.';
      if (!form.dob) next.dob = 'Enter the date of birth as shown on the B-Form.';
    }
    if (step === 1) {
      if (!form.guardianName.trim()) next.guardianName = 'Enter the guardian’s full name.';
      if (!/^0\d{10}$/.test(form.guardianPhone.replace(/\s|-/g, ''))) next.guardianPhone = 'Enter an 11-digit mobile number, for example 03001234567.';
      if (form.guardianEmail && !/^\S+@\S+\.\S+$/.test(form.guardianEmail)) next.guardianEmail = 'Check the email address format.';
      if (!form.address.trim()) next.address = 'Enter the residential address.';
    }
    if (step === 2) {
      if (form.documents.length === 0) next.documents = 'Select at least one document you can provide.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = () => {
    if (!validate()) return;
    const number = `APP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    insert('admissions', {
      applicationNo: number,
      applicant: `${form.firstName} ${form.lastName}`.trim(),
      guardian: form.guardianName,
      phone: form.guardianPhone,
      email: form.guardianEmail || '—',
      applyingFor: form.className,
      academicYear: '2025 – 2026',
      submitted: new Date().toISOString().slice(0, 10),
      stage: 'Submitted',
      documents: form.documents.join(', '),
      interview: 'Not required',
      assignedClass: '—',
      assignedSection: '—',
      admissionNumber: '—',
      reason: form.notes ? `Applicant note: ${form.notes}` : '—',
      reviewer: '—',
    });
    logAction({
      actor: form.guardianName,
      role: 'Applicant guardian',
      action: 'Submitted admission application',
      module: 'Admissions',
      target: number,
      reason: `Application for ${form.className}`,
    });
    setReference(number);
  };

  if (reference) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-tint text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">Application submitted</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The application for {form.firstName} {form.lastName} has been received for {form.className}. Keep the
            reference number below — you can use it to check the status at any time.
          </p>
          <p className="mt-5 rounded-xl border border-primary/20 bg-brand-tint px-4 py-3 font-mono text-lg font-semibold tracking-wider text-primary">
            {reference}
          </p>
          <div className="mt-6 space-y-3 text-left">
            {[
              'The admissions office verifies the documents within three working days.',
              'If anything is missing, you will be asked for additional information.',
              'Approved applicants receive a placement assessment date where required.',
              'The seat is confirmed once the admission fee payment is verified by the finance office.',
            ].map((line) => (
              <p key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {line}
              </p>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/admissions/status" className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
              Check application status
            </Link>
            <Link to="/" className="inline-flex h-11 items-center justify-center rounded-xl border border-input px-5 text-sm font-semibold text-foreground">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const DOCUMENTS = ['Photograph', 'Birth certificate or B-Form', 'Previous result card', 'School leaving certificate', 'Guardian CNIC copy'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Admissions</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Admission application
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Complete the four steps below. The information is used to review the application and plan class placement.
          Documents are verified in person by the campus office before a seat is offered.
        </p>
      </header>

      <ol className="mt-8 flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${index === step ? 'border-primary/40 bg-brand-tint text-primary' : index < step ? 'border-border bg-card text-foreground' : 'border-border text-muted-foreground'}`}>
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${index <= step ? 'bg-brand text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student first name *" error={errors.firstName}>
              <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className={inputClass} placeholder="Areeba" />
            </Field>
            <Field label="Family name *" error={errors.lastName}>
              <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className={inputClass} placeholder="Khan" />
            </Field>
            <Field label="Date of birth *" error={errors.dob}>
              <input type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className={inputClass}>
                {['Female', 'Male', 'Prefer not to say'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Previous school (if any)" className="sm:col-span-2">
              <input value={form.previousSchool} onChange={(e) => update('previousSchool', e.target.value)} className={inputClass} placeholder="Name of the last school attended" />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Guardian full name *" error={errors.guardianName}>
              <input value={form.guardianName} onChange={(e) => update('guardianName', e.target.value)} className={inputClass} placeholder="Khalid Khan" />
            </Field>
            <Field label="Relationship to student">
              <select value={form.relation} onChange={(e) => update('relation', e.target.value)} className={inputClass}>
                {['Father', 'Mother', 'Uncle', 'Aunt', 'Legal guardian'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Mobile number *" error={errors.guardianPhone} hint="Used for attendance and fee notifications.">
              <input value={form.guardianPhone} onChange={(e) => update('guardianPhone', e.target.value)} className={inputClass} placeholder="03001234567" inputMode="tel" />
            </Field>
            <Field label="Email address" error={errors.guardianEmail}>
              <input value={form.guardianEmail} onChange={(e) => update('guardianEmail', e.target.value)} className={inputClass} placeholder="name@example.com" />
            </Field>
            <Field label="Residential address *" error={errors.address} className="sm:col-span-2">
              <textarea rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} className={textareaClass} placeholder="House, street, area, city" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Academic level">
              <select value={form.level} onChange={(e) => { update('level', e.target.value); update('className', CLASSES.find((c) => c.level === e.target.value)?.name || 'Class 9'); }} className={inputClass}>
                {LEVELS.map((level) => <option key={level}>{level}</option>)}
              </select>
            </Field>
            <Field label="Applying for class">
              <select value={form.className} onChange={(e) => update('className', e.target.value)} className={inputClass}>
                {(classOptions.length ? classOptions : CLASSES).map((cls) => <option key={cls.id}>{cls.name}</option>)}
              </select>
            </Field>
            <Field label="Documents you can provide *" error={errors.documents} className="sm:col-span-2">
              <div className="grid gap-2 sm:grid-cols-2">
                {DOCUMENTS.map((doc) => (
                  <label key={doc} className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={form.documents.includes(doc)}
                      onChange={(e) => update('documents', e.target.checked ? [...form.documents, doc] : form.documents.filter((d) => d !== doc))}
                      className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                    />
                    {doc}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Anything the office should know? (optional)" className="sm:col-span-2">
              <textarea rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} className={textareaClass} placeholder="For example: sibling already studying at the campus" />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="flex gap-3 rounded-xl border border-primary/20 bg-brand-tint p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Check the details before submitting. The application is recorded with today's date and reviewed by the
                admissions office. You can still contact the office to correct anything afterwards.
              </p>
            </div>
            <dl className="divide-y divide-border rounded-xl border border-border">
              {[
                ['Student', `${form.firstName} ${form.lastName}`],
                ['Date of birth', form.dob],
                ['Previous school', form.previousSchool || '—'],
                ['Guardian', `${form.guardianName} (${form.relation})`],
                ['Contact', `${form.guardianPhone} · ${form.guardianEmail || 'no email provided'}`],
                ['Address', form.address],
                ['Applying for', `${form.className} · ${form.level}`],
                ['Documents', form.documents.join(', ') || '—'],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-3 px-4 py-2.5">
                  <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                  <dd className="col-span-2 text-sm text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" /> Documents are verified in person; nothing is uploaded at
              this stage. Campus contact: {ACADEMY.phone}.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-input px-5 text-sm font-semibold text-foreground disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
              Submit application <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';
const textareaClass = 'mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary/50';

function Field({ label, error, hint, className = '', children }) {
  return (
    <label className={`block text-xs font-semibold text-muted-foreground ${className}`}>
      {label}
      {children}
      {hint && !error && <span className="mt-1 block text-[11px] font-normal text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] font-medium text-rose-600">{error}</span>}
    </label>
  );
}