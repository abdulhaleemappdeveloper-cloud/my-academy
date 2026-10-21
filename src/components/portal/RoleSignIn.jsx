import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Lock, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { ACADEMY } from '@/data/academy';
import { canAccess, DEMO_ACCOUNTS, resolvePortalRole, useSession } from '@/lib/session';
import { safeReturnTo } from '@/lib/authReturnTo';
import AcademyLogo from '@/components/AcademyLogo';

const ROLE_META = {
  admin: {
    title: 'Administrator sign in',
    blurb: 'Full administrative access: command centre, people, academics, assessment, finance, website and system settings.',
    area: 'admin',
    home: '/admin',
    accounts: ['admin', 'editor', 'staff'],
  },
  teacher: {
    title: 'Teacher sign in',
    blurb: 'Your classes, attendance, lesson material, question bank, quizzes, grading and student progress.',
    area: 'teacher',
    home: '/teacher',
    accounts: ['teacher'],
  },
  student: {
    title: 'Student sign in',
    blurb: 'Your courses, notes, past papers, assessments, results, attendance and fee ledger.',
    area: 'student',
    home: '/student',
    accounts: ['student'],
  },
  parent: {
    title: 'Parent sign in',
    blurb: 'Your children, their progress, attendance, results, meetings and the family fee ledger.',
    area: 'parent',
    home: '/parent',
    accounts: ['parent'],
  },
};

const ROLE_TABS = [
  { id: 'admin', label: 'Administrator' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'student', label: 'Student' },
  { id: 'parent', label: 'Parent' },
];

/** Role-specific portal sign in. Credentials are checked by the platform authentication service. */
export default function RoleSignIn({ role }) {
  const meta = ROLE_META[role] || ROLE_META.student;
  const { ready, account, isAdmin, switchRole } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const returnTo = safeReturnTo();
  const destination = returnTo.startsWith(`/${meta.area}`) ? returnTo : meta.home;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter the account email and password.');
      return;
    }
    setBusy(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      const me = await base44.auth.me().catch(() => null);
      const resolved = resolvePortalRole(me);
      if (canAccess(meta.area, resolved)) {
        window.location.href = destination;
        return;
      }
      // Signed in, but not authorised for this portal — end the session rather than leave it open.
      await base44.auth.logout();
      setError(`This account does not have ${meta.area} access. Use the sign-in page for your role.`);
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setBusy(false);
    }
  };

  const signedInHere = ready && account && canAccess(meta.area, account.id) && !isAdmin;
  const signedInElsewhere = ready && account && !canAccess(meta.area, account.id) && !isAdmin;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 lg:flex">
        <div className="ta-glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            <GraduationCap className="h-3.5 w-3.5" /> {ACADEMY.brand}
          </span>
          <h1 className="mt-8 font-display text-4xl font-semibold leading-tight tracking-tight text-primary-foreground">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">{meta.blurb}</p>
        </div>
        <ul className="relative space-y-3 text-sm text-primary-foreground/85">
          {[
            'Passwords are verified by the platform authentication service — never stored in the app',
            `Roles are resolved from your signed-in account and enforced before any page renders`,
            'Portal assignments are made by the campus office and locked at the database level',
            'Administrative functions are never exposed to student, parent or teacher accounts',
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

          <h2 className="font-display text-2xl font-semibold tracking-tight">{meta.title}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Accounts are issued by the campus office after admission or appointment.
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {ROLE_TABS.map((tab) => (
              <Link
                key={tab.id}
                to={`/login/${tab.id}`}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  tab.id === role
                    ? 'border-primary/50 bg-brand text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {signedInHere && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-sm text-foreground">
                You are already signed in as <span className="font-semibold">{account.name}</span> ({account.label}).
              </p>
              <button
                type="button"
                onClick={() => { window.location.href = destination; }}
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground"
              >
                Continue to my dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {signedInElsewhere && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
              <p className="text-sm text-rose-700 dark:text-rose-300">
                You are signed in as {account.name} ({account.label}), which does not hold {meta.area.toLowerCase()} access.
              </p>
              <button
                type="button"
                onClick={() => { base44.auth.logout(window.location.pathname); }}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-rose-300 px-5 text-sm font-semibold text-rose-700 dark:border-rose-500/40 dark:text-rose-300"
              >
                Sign out of this account
              </button>
            </div>
          )}

          {!signedInHere && !signedInElsewhere && (
            <form onSubmit={submit} className="mt-7 space-y-4">
              <label className="block text-xs font-semibold text-muted-foreground">
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@tipsacademy.edu.pk"
                  autoComplete="username"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </label>

              <label className="block text-xs font-semibold text-muted-foreground">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </label>

              {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {busy ? 'Verifying with the authentication service…' : <>Sign in <ArrowRight className="h-4 w-4" /></>}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                <Link to="/forgot-password" className="font-semibold text-primary hover:underline">Forgot password?</Link>
              </p>
            </form>
          )}

          {isAdmin && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Review this portal (administrators only)
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Open this portal with a review account. Review switching is offered only to administrator accounts —
                student, parent and teacher sign-ins never see it.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {DEMO_ACCOUNTS.filter((option) => meta.accounts.includes(option.id)).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => { switchRole(option.id); navigate(option.home); }}
                    className="rounded-xl border border-border px-3 py-2 text-left text-xs transition-colors hover:border-primary/40"
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