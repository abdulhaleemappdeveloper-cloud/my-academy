import { useState } from 'react';
import { LogOut } from 'lucide-react';

/** Account menu for a signed-in portal user — identity and sign-out only. */
export default function AccountMenu({ account, onSignOut }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account"
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-1.5 text-left transition-colors hover:border-primary/40"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand text-[11px] font-bold text-primary-foreground">
          {(account?.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-xs font-semibold text-foreground">{account?.name}</span>
          <span className="block text-[10px] text-muted-foreground">{account?.label}</span>
        </span>
      </button>

      {open && (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" aria-hidden onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-foreground">{account?.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{account?.email}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">{account?.label}</p>
            </div>
            <div className="border-t border-border pt-1">
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