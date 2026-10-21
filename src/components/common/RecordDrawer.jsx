import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import StatusBadge from './StatusBadge';

/** Right-hand detail panel used to inspect a record without leaving the list. */
export default function RecordDrawer({ open, onClose, title, subtitle, badge, rows = [], children, footer }) {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle className="pr-8 font-display text-xl tracking-tight">{title}</SheetTitle>
          {subtitle && <SheetDescription>{subtitle}</SheetDescription>}
          {badge && <div className="pt-2"><StatusBadge value={badge} /></div>}
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {children}

          {rows.length > 0 && (
            <dl className="divide-y divide-border rounded-xl border border-border">
              {rows.map((row) => (
                <div key={row.key || row.label} className="grid grid-cols-3 gap-3 px-4 py-2.5">
                  <dt className="text-xs font-medium text-muted-foreground">{row.label}</dt>
                  <dd className="col-span-2 break-words text-sm text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {footer && <div className="flex flex-wrap gap-2 border-t border-border pt-5">{footer}</div>}
        </div>
      </SheetContent>
    </Sheet>
  );
}