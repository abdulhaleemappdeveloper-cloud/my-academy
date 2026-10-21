import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { all } from '@/data/store';
import { useSession } from '@/lib/session';

const SOURCES = [
  { key: 'students', label: 'Students', fields: ['name', 'code', 'rollNumber', 'guardianName'], roles: ['admin', 'owner', 'teacher', 'staff'] },
  { key: 'teachers', label: 'Teachers', fields: ['name', 'code', 'subject'], roles: ['admin', 'owner'] },
  { key: 'guardians', label: 'Guardians', fields: ['name', 'phone', 'email'], roles: ['admin', 'owner', 'staff'] },
  { key: 'invoices', label: 'Invoices', fields: ['number', 'studentName', 'category'], roles: ['admin', 'owner', 'staff'] },
  { key: 'payments', label: 'Payments', fields: ['reference', 'studentName', 'method'], roles: ['admin', 'owner', 'staff'] },
  { key: 'certificates', label: 'Certificates', fields: ['code', 'studentName', 'type'], roles: ['admin', 'owner', 'student', 'parent'] },
  { key: 'pages', label: 'Website pages', fields: ['title', 'slug', 'status'], roles: ['admin', 'owner', 'editor'] },
  { key: 'notes', label: 'Notes', fields: ['title', 'subject', 'className'], roles: ['admin', 'owner', 'teacher', 'student'] },
  { key: 'exams', label: 'Examinations', fields: ['title', 'className', 'subject'], roles: ['admin', 'owner', 'teacher', 'student', 'parent'] },
  { key: 'tickets', label: 'Support tickets', fields: ['reference', 'subject', 'raisedBy'], roles: ['admin', 'owner', 'staff'] },
  { key: 'announcements', label: 'Announcements', fields: ['title', 'category'], roles: ['admin', 'owner', 'teacher', 'student', 'parent', 'editor'] },
];

const PATHS = {
  students: '/admin/students',
  teachers: '/admin/people',
  guardians: '/admin/people',
  invoices: '/admin/fees',
  payments: '/admin/payments',
  certificates: '/admin/certificates',
  pages: '/admin/pages',
  notes: '/student/lessons',
  exams: '/admin/exams',
  tickets: '/admin/documents',
  announcements: '/admin/communications',
};

/**
 * Permission-aware global search.
 * Only the collections the current role may open are searched, and only permitted
 * fields are matched, so suggestions never reveal restricted information.
 */
export default function GlobalSearch({ open, onOpenChange }) {
  const [query, setQuery] = useState('');
  const { role } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return SOURCES.filter((source) => source.roles.includes(role)).map((source) => {
      const rows = all(source.key)
        .filter((row) => source.fields.some((field) => String(row[field] ?? '').toLowerCase().includes(term)))
        .slice(0, 4)
        .map((row) => ({
          id: row.id,
          title: row.name || row.title || row.studentName || row.number || row.reference,
          subtitle: source.fields.slice(1).map((field) => row[field]).filter(Boolean).join(' · '),
        }));
      return { ...source, rows };
    }).filter((group) => group.rows.length > 0);
  }, [query, role]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-24 max-w-2xl translate-y-0 gap-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Global search</DialogTitle>
          <DialogDescription>Search permitted academy records</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search students, invoices, pages, examinations…"
            aria-label="Search academy records"
            className="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">esc</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length < 2 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              Type at least two characters. Results follow your role permissions — restricted records are never suggested.
            </p>
          )}

          {query.trim().length >= 2 && results.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No permitted records match “{query}”.
            </p>
          )}

          {results.map((group) => (
            <div key={group.key} className="mb-1">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{group.label}</p>
              {group.rows.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => { onOpenChange(false); navigate(PATHS[group.key] || '/admin'); }}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{row.title}</span>
                    {row.subtitle && <span className="block truncate text-xs text-muted-foreground">{row.subtitle}</span>}
                  </span>
                  <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}