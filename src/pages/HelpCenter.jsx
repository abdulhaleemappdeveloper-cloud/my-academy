import { Link } from 'react-router-dom';
import { BookOpen, CreditCard, FileText, GraduationCap, LifeBuoy, Lock, Users } from 'lucide-react';
import { ACADEMY } from '@/data/academy';

const GUIDES = [
  { icon: GraduationCap, title: 'Admissions and enrolment', text: 'Submitting an application, documents required, placement assessment and seat confirmation.', links: [{ label: 'Admissions information', path: '/admissions' }, { label: 'Check application status', path: '/admissions/status' }] },
  { icon: CreditCard, title: 'Fees and payments', text: 'Fee structure, installments, payment methods and how verification works after you upload proof.', links: [{ label: 'Payment instructions', path: '/payment-instructions' }, { label: 'Refund policy', path: '/refund-policy' }] },
  { icon: BookOpen, title: 'Notes and learning material', text: 'Where to find chapter-wise notes, worksheets and past papers, and which resources need a portal account.', links: [{ label: 'Notes library', path: '/notes' }, { label: 'Past papers', path: '/past-papers' }] },
  { icon: FileText, title: 'Assessments and results', text: 'How quizzes and examinations are marked, when results are published and how to request a recheck.', links: [{ label: 'Exam preparation', path: '/exam-preparation' }, { label: 'FAQ', path: '/faq' }] },
  { icon: Users, title: 'Parent and student accounts', text: 'How portal accounts are issued, how a guardian link is verified and how to reset a password.', links: [{ label: 'Portal sign in', path: '/portal' }, { label: 'Support form', path: '/support' }] },
  { icon: Lock, title: 'Privacy and documents', text: 'Which records are private, how documents are stored and who may open them.', links: [{ label: 'Privacy policy', path: '/privacy' }, { label: 'Consent information', path: '/consent' }] },
];

export default function HelpCenter() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Help centre</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Guides for families, students and staff
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Step-by-step help for the tasks people complete most often at {ACADEMY.brand}.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <section key={guide.title} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tint text-primary">
              <guide.icon className="h-4 w-4" />
            </span>
            <h2 className="mt-4 font-heading text-base font-bold tracking-tight text-foreground">{guide.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{guide.text}</p>
            <ul className="mt-4 space-y-2 border-t border-border pt-4">
              {guide.links.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm font-semibold text-primary hover:underline">{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-cream p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">Cannot find what you need?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Raise a support ticket and the campus office will follow it up with a reference number.
            </p>
          </div>
        </div>
        <Link to="/support" className="inline-flex h-11 shrink-0 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground">
          Raise a support ticket
        </Link>
      </section>
    </div>
  );
}