import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Lock, ShieldCheck } from 'lucide-react';
import { ACADEMY } from '@/data/academy';
import { DEMO_ACCOUNTS, useSession } from '@/lib/session';
import AcademyLogo from '@/components/AcademyLogo';

const ROLE_CARDS = [
  { id: 'admin', title: 'Administrator', blurb: 'Command centre, people, academics, finance and system settings', path: '/login/admin' },
  { id: 'student', title: 'Student', blurb: 'Courses, assessments, results and fees', path: '/login/student' },
  { id: 'teacher', title: 'Teacher', blurb: 'Classes, attendance, assessments and grading', path: '/login/teacher' },
  { id: 'parent', title: 'Parent', blurb: 'Children, progress, meetings and fees', path: '/login/parent' },
];

/**
 * Portal sign-in hub. Each role continues to its own sign-in page, and roles never
 * share an entry point: a student opening the administrator address is verified and
 * refused by the same access rules that guard the pages behind it.
 */
export default function PortalSignIn() {
  const { isAdmin, account, switchRole } = useSession();
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 lg:flex">
        <div className="ta-glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            <GraduationCap className="h-3.5 w-3.5" /> {ACADEMY.brand}
          </span>
          <h1 className="mt-8 font-display text-4xl font-semibold leading-tight tracking-tight text-primary-foreground">
            One platform for students, teachers, parents and the academy office
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">
            Attendance, notes, assessments, results, fees and admissions — with each role
            seeing only the records it is authorised to open.
          </p>
        </div>
        <ul className="relative space-y-3 text-sm text-primary-foreground/85">
          {[
            'A separate sign-in page for each role',
            'Roles resolved from the signed-in account, not from the browser',
            'Results published only after academic approval',
            'Fees marked paid only after finance verification',
          ].map((line) => (
            <li key={line} className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <AcademyLogo className="h-10 w-10" />
            <span>
              <span className="block font-heading text-base font-extrabold tracking-tight">{ACADEMY.brand}</span>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{ACADEMY.campus}</span>
            </span>
          </div>

          <h2 className="font-display text-2xl font-semibold tracking-tight">Choose your portal</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Accounts are issued by the campus office after admission or appointment.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {ROLE_CARDS.map((card) => (
              <Link
                key={card.id}
                to={card.path}
                className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-heading text-sm font-bold tracking-tight text-foreground">{card.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{card.blurb}</span>
              </Link>
            ))}
          </div>

          {isAdmin && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Review accounts (administrators only)
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Open any portal with a review account. This panel is offered only to administrator accounts —
                student, parent and teacher sign-ins never see it.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {DEMO_ACCOUNTS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => { switchRole(option.id); navigate(option.home); }}
                    className={`rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                      account?.id === option.id ? 'border-primary/40 bg-brand-tint' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="block font-semibold text-foreground">{option.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{option.scope}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Trouble signing in? Contact the campus office on {ACADEMY.phone}.
          </p>
        </div>
      </div>
    </div>
  );
}