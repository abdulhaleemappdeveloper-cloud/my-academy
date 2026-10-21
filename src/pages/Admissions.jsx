import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, FileText, UserCheck } from 'lucide-react';
import ProsePage from '@/components/site/ProsePage';
import { ACADEMY, CLASSES, FAQS, formatPKR } from '@/data/academy';

const STEPS = [
  { title: 'Submit the application', text: 'Complete the online admission application for the class you are applying to. You receive an application reference number immediately.' },
  { title: 'Document verification', text: 'The admissions office checks the photograph, birth certificate or B-Form, previous result card and school leaving certificate.' },
  { title: 'Interview or assessment', text: 'Applicants for class 6 and above sit a short placement assessment so the academic team can plan appropriate support.' },
  { title: 'Decision and seat offer', text: 'Applications are approved, waitlisted where capacity is full, or returned for missing information. Every decision records a reason.' },
  { title: 'Fee and confirmation', text: 'On approval, the admission fee invoice is issued. The seat is confirmed once the payment is verified by the finance office.' },
  { title: 'Account and placement', text: 'The student record is created with an admission number, assigned to a class and section, and portal access is issued.' },
];

export default function Admissions() {
  return (
    <ProsePage
      eyebrow="Admissions"
      title="Admissions for session 2026"
      intro="Admission is managed by the campus office. Applications are submitted online and reviewed in order of receipt, with seats confirmed only after document verification and fee clearance."
      updated="October 2026"
      sections={[
        {
          heading: 'Who can apply',
          bullets: [
            'Primary admission for class 1 with a birth certificate or B-Form.',
            'Middle and matric admission with the previous school leaving certificate and result card.',
            'Intermediate admission for pre-medical, pre-engineering and commerce streams.',
            'College support and professional certificate programmes, open to current students and working professionals.',
          ],
        },
        {
          heading: 'Documents required',
          bullets: [
            'Recent passport-size photograph of the applicant.',
            'Birth certificate or B-Form (original for verification).',
            'School leaving certificate from the previous institution.',
            'Last result card or transcript.',
            'Guardian CNIC copy and one emergency contact number.',
          ],
        },
        {
          heading: 'Important dates',
          bullets: [
            'Applications open: 15 October 2026.',
            'Placement assessments for class 6 and above: every Saturday morning.',
            'First merit list: 20 November 2026.',
            'Session begins: 5 January 2027.',
          ],
        },
        {
          heading: 'Fees at a glance',
          bullets: [
            `Tuition fee for primary classes from ${formatPKR(6500)} per term.`,
            `Tuition fee for matric classes from ${formatPKR(11000)} per term.`,
            `Intermediate and professional programmes from ${formatPKR(15000)} per term.`,
            'Admission fee is charged once at enrolment. Sibling concession and merit scholarships are available.',
          ],
        },
      ]}
    >
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Admission process</h2>
        <ol className="mt-5 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <div>
                <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/admissions/apply" className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
            Start an application <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/admissions/status" className="inline-flex h-11 items-center gap-2 rounded-xl border border-input px-5 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4" /> Check application status
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Seats available by class</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Seats shown are indicative. Final placement depends on the assessment and the capacity of each section.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                <th className="py-2.5 pr-4">Class</th>
                <th className="py-2.5 pr-4">Level</th>
                <th className="py-2.5 pr-4">Sections</th>
                <th className="py-2.5 text-right">Indicative seats</th>
              </tr>
            </thead>
            <tbody>
              {CLASSES.map((cls) => {
                const free = Math.max(0, cls.capacity * 2 - cls.students);
                return (
                  <tr key={cls.id} className="border-b border-border/70 last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{cls.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{cls.level}</td>
                    <td className="py-3 pr-4 text-muted-foreground">Section A, Section B</td>
                    <td className="py-3 text-right font-semibold text-foreground">{free}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Common questions</h2>
        <dl className="mt-4 space-y-4">
          {FAQS.slice(0, 4).map((item) => (
            <div key={item.q}>
              <dt className="flex items-start gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item.q}
              </dt>
              <dd className="mt-1.5 pl-6 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-cream p-6">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" /> Visit before you apply
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Families are welcome to tour the campus and meet the class teacher before submitting an application.
          Call {ACADEMY.phone} to arrange a time, or write to {ACADEMY.email}.
        </p>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <UserCheck className="h-3.5 w-3.5 text-primary" /> Admission is granted by the campus office only — public
          self-registration cannot create a student, teacher or administrator account.
        </p>
      </section>
    </ProsePage>
  );
}