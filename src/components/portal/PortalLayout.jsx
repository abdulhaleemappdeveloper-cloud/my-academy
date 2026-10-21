import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Lock, Menu, ShieldAlert, X } from 'lucide-react';
import AcademyLogo from '@/components/AcademyLogo';
import { ACADEMY } from '@/data/academy';
import { useCollection } from '@/data/store';
import { ADMIN_GROUP_ACCESS, canAccess, PORTAL_LOGIN, useSession } from '@/lib/session';
import { useTheme } from '@/lib/useTheme';
import { AREA_LABELS, PORTAL_NAV } from './nav.config';
import { icon } from './icons';
import GlobalSearch from './GlobalSearch';
import {
  CampusChip, NotificationButton, PortalSearchButton, RoleSwitcher, ThemeButton,
} from './PortalControls';
import AccountMenu from './AccountMenu';
import { cn } from '@/lib/utils';

/** Shared shell for the student, teacher, parent, admin and owner portals. */
export default function PortalLayout({ area }) {
  const { account, role, ready, pendingPortal, platformEmail, isAdmin, isReview, switchRole, signOut } = useSession();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const notifications = useCollection('notifications');
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (!account) {
    if (pendingPortal) {
      return (
        <div className="grid min-h-screen place-items-center bg-cream px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-accent-foreground">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold tracking-tight">Account under review</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You are signed in as {platformEmail}, but the campus office has not yet assigned this account to the{' '}
              {AREA_LABELS[area]?.toLowerCase()}. Ask the office to complete the assignment.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand text-primary-foreground">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold tracking-tight">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is restricted to {AREA_LABELS[area]?.toLowerCase()} accounts. Sign in from the {AREA_LABELS[area]?.toLowerCase()} page.
          </p>
          <Link
            to={PORTAL_LOGIN[area] || '/portal'}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  // Scoped administrator roles (editor, staff) may open only their own sections.
  const allowedGroups = ADMIN_GROUP_ACCESS[role] || null;
  let sectionAllowed = true;
  if (area === 'admin' && allowedGroups) {
    const navPaths = (PORTAL_NAV.admin || [])
      .filter((group) => allowedGroups.includes(group.label))
      .flatMap((group) => group.items.map((item) => item.path));
    sectionAllowed = pathname === '/admin' || navPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  }

  if (!canAccess(area, role) || !sectionAllowed) {
    const message = !canAccess(area, role)
      ? `Your account is not authorised to open the ${AREA_LABELS[area]?.toLowerCase()}. The role is resolved from the account you signed in with and checked before this page renders — not merely hidden in the interface.`
      : `This section is limited to full administrator accounts. Your administrative access is scoped to ${allowedGroups.join(' and ').toLowerCase()} only.`;
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold tracking-tight">Access restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <div className="mt-6 flex justify-center gap-2">
            {canAccess(area, role) ? (
              <Link
                to="/admin"
                className="inline-flex h-10 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground"
              >
                Back to administration
              </Link>
            ) : (
              <Link
                to={account.home}
                className="inline-flex h-10 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground"
              >
                Go to my area
              </Link>
            )}
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center rounded-xl border border-input px-5 text-sm font-semibold text-foreground"
            >
              {isAdmin ? (isReview ? 'Back to my account' : 'Sign out') : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groups = (PORTAL_NAV[area] || []).filter(
    (group) => !allowedGroups || allowedGroups.includes(group.label)
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <AcademyLogo className="h-9 w-9" />
          <span className="leading-tight">
            <span className="block font-heading text-sm font-extrabold tracking-tight">{ACADEMY.brand}</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {AREA_LABELS[area]}
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-muted-foreground lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="ta-scroll flex-1 overflow-y-auto px-2 pb-6">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const ItemIcon = icon(item.icon);
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === `/${area}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors',
                          isActive
                            ? 'bg-brand text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )
                      }
                    >
                      <ItemIcon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3">
        <Link to="/" className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
          ← Back to public website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        {sidebar}
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-foreground/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <PortalSearchButton onClick={() => setSearchOpen(true)} />
            <div className="ml-auto flex items-center gap-2">
              <CampusChip />
              <NotificationButton count={unread} onClick={() => setSearchOpen(false)} />
              <ThemeButton theme={theme} onToggle={toggle} />
              {isAdmin ? (
                <RoleSwitcher account={account} onSwitch={switchRole} onSignOut={signOut} />
              ) : (
                <AccountMenu account={account} onSignOut={signOut} />
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-border px-4 py-4 text-center text-[11px] text-muted-foreground sm:px-6">
          {ACADEMY.brand} · {ACADEMY.campus} · Owner {ACADEMY.owner} · Platform built by {ACADEMY.developer}
        </footer>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}