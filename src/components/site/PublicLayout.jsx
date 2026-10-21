import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, Mail, MapPin, Search, Clock } from 'lucide-react';
import { ACADEMY, NAV_LINKS } from '@/data/academy';
import AcademyLogo from '@/components/AcademyLogo';
import { ThemeButton } from '@/components/portal/PortalControls';
import { useTheme } from '@/lib/useTheme';

function Brand({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <AcademyLogo className="h-10 w-10" />
      <span className="leading-tight">
        <span className="block font-heading text-[15px] font-extrabold tracking-tight text-foreground">
          {ACADEMY.brand}
        </span>
        {!compact && (
          <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {ACADEMY.campus}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Brand />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.slice(0, 8).map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-tint text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/search"
              aria-label="Search the academy website"
              className="hidden h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground sm:grid"
            >
              <Search className="h-4 w-4" />
            </Link>
            <div className="hidden sm:block">
              <ThemeButton theme={theme} onToggle={toggle} />
            </div>
            <Link
              to="/portal"
              className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:block"
            >
              Portal sign in
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-brand-tint text-primary' : 'text-muted-foreground'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/portal"
                className="mt-2 rounded-lg bg-brand px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Portal sign in
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="space-y-4">
            <Brand />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ACADEMY.tagline} Primary, middle, matric, intermediate, college and professional levels.
            </p>
            <p className="text-xs text-muted-foreground">
              Owner: {ACADEMY.owner} · Project created by {ACADEMY.developer}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Academics</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { label: 'Classes and levels', path: '/classes' },
                { label: 'Subjects', path: '/subjects' },
                { label: 'Courses', path: '/courses' },
                { label: 'Notes library', path: '/notes' },
                { label: 'Past papers', path: '/past-papers' },
                { label: 'Solved papers', path: '/solved-papers' },
                { label: 'Downloads', path: '/downloads' },
                { label: 'Exam preparation', path: '/exam-preparation' },
              ].map((l) => (
                <li key={l.path}>
                  <Link className="transition-colors hover:text-primary" to={l.path}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Academy</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { label: 'About the academy', path: '/about' },
                { label: 'Campus information', path: '/campus' },
                { label: 'Admissions', path: '/admissions' },
                { label: 'Scholarships', path: '/scholarships' },
                { label: 'Announcements', path: '/announcements' },
                { label: 'Public notices', path: '/notices' },
                { label: 'Student stories', path: '/stories' },
                { label: 'Verify a certificate', path: '/verify-certificate' },
                { label: 'Help centre', path: '/help' },
              ].map((l) => (
                <li key={l.path}>
                  <Link className="transition-colors hover:text-primary" to={l.path}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{ACADEMY.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{ACADEMY.phone}</span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="break-all">{ACADEMY.email}</span>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{ACADEMY.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} {ACADEMY.brand}, {ACADEMY.campus}. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Privacy policy', path: '/privacy' },
                { label: 'Terms and conditions', path: '/terms' },
                { label: 'Refund policy', path: '/refund-policy' },
                { label: 'Payment instructions', path: '/payment-instructions' },
                { label: 'Accessibility', path: '/accessibility' },
              ].map((l) => (
                <Link key={l.path} className="transition-colors hover:text-primary" to={l.path}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}