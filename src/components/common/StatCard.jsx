import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const TONES = {
  neutral: 'bg-card border-border',
  brand: 'bg-brand-tint border-primary/20',
  gold: 'bg-gold-soft border-gold/40',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30',
  danger: 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30',
};

/** Compact metric tile used across dashboards and module pages. */
export default function StatCard({ label, value, hint, trend, tone = 'neutral', icon: Icon, to, className }) {
  const body = (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-all duration-200',
        TONES[tone],
        to && 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        {Icon && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-background/70 text-primary">
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {trend && <p className="mt-1.5 text-[11px] font-medium text-primary">{trend}</p>}
    </div>
  );

  return to ? <Link to={to} className="block">{body}</Link> : body;
}