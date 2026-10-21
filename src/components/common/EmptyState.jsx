import { Inbox } from 'lucide-react';

/** Friendly empty state shown when a filter or search returns no records. */
export default function EmptyState({ title = 'Nothing to show yet', description, action, icon: Icon = Inbox, className = '' }) {
  return (
    <div className={`grid place-items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center ${className}`}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-tint text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3.5 font-heading text-sm font-bold text-foreground">{title}</p>
      {description && <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}