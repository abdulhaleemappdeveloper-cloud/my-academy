import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, ChevronsUpDown, LogOut, Moon, Search, Sun } from 'lucide-react';
import { ACADEMY } from '@/data/academy';
import { DEMO_ACCOUNTS } from '@/lib/session';

/** Account switcher — replaces the signed-in identity while the backend is pending. */
export function RoleSwitcher({ account, onSwitch, onSignOut }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Switch account"
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-1.5 text-left transition-colors hover:border-primary/40"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand text-[11px] font-bold text-primary-foreground">
          {(account?.name || 'G').split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-xs font-semibold text-foreground">{account?.name || 'Guest'}</span>
          <span className="block text-[10px] text-muted-foreground">{account?.label || 'Not signed in'}</span>
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" aria-hidden onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Switch account (demo)
            </p>
            {DEMO_ACCOUNTS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onSwitch(option.id);
                  setOpen(false);
                  navigate(option.home);
                }}
                className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-[10px] font-bold text-foreground">
                  {option.label[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-foreground">{option.label}</span>
                  <span className="block truncate text-[10px] text-muted-foreground">{option.scope}</span>
                </span>
                {account?.id === option.id && <Check className="mt-0.5 h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
            <div className="mt-1 border-t border-border pt-1">
              <button
                type="button"
                onClick={() => { setOpen(false); onSignOut(); }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PortalSearchButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-3 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Search students, invoices, pages…</span>
      <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] lg:inline">⌘K</kbd>
    </button>
  );
}

export function ThemeButton({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function NotificationButton({ count = 0, onClick }) {
  const label = useMemo(() => (count > 9 ? '9+' : String(count)), [count]);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Notifications${count ? `, ${count} unread` : ''}`}
      className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
    >
      <Bell className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-accent-foreground">
          {label}
        </span>
      )}
    </button>
  );
}

export function CampusChip() {
  return (
    <span className="hidden items-center gap-2 rounded-xl border border-border bg-cream px-3 py-1.5 text-[11px] font-medium text-muted-foreground xl:flex">
      {ACADEMY.campus} · {ACADEMY.city}
    </span>
  );
}