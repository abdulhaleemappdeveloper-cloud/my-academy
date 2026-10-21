import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Standard page header used by every portal screen so headings, breadcrumbs and
 * actions stay consistent across modules.
 */
export default function PageHeader({ title, description, breadcrumbs = [], actions, children }) {
  return (
    <header className="mb-6 border-b border-border pb-5">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
              {crumb.path ? (
                <Link to={crumb.path} className="transition-colors hover:text-primary">{crumb.label}</Link>
              ) : (
                <span className="font-medium text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
          {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
          {children}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}