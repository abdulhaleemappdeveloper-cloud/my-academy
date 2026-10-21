import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, GraduationCap, Search, User } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import { ANNOUNCEMENTS, CLASSES, COURSES, EVENTS, NOTES, PAPERS, SUBJECTS, TEACHERS } from '@/data/academy';

/** Public site search across pages, resources and people. */
export default function SearchPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    const match = (value) => String(value || '').toLowerCase().includes(term);

    const groups = [
      {
        label: 'Courses', icon: GraduationCap, path: '/courses',
        rows: COURSES.filter((c) => match(c.title) || match(c.subject) || match(c.summary)).map((c) => ({ id: c.id, title: c.title, meta: `${c.subject} · ${c.classLabel}`, path: `/courses/${c.id}` })),
      },
      {
        label: 'Notes', icon: FileText, path: '/notes',
        rows: NOTES.filter((n) => match(n.title) || match(n.subject) || match(n.chapter)).map((n) => ({ id: n.id, title: n.title, meta: `${n.subject} · ${n.classLabel}`, path: `/notes/${n.id}` })),
      },
      {
        label: 'Past papers', icon: FileText, path: '/past-papers',
        rows: PAPERS.filter((p) => match(p.title) || match(p.subject)).map((p) => ({ id: p.id, title: p.title, meta: `${p.type} · ${p.year}`, path: '/past-papers' })),
      },
      {
        label: 'Teachers', icon: User, path: '/teachers',
        rows: TEACHERS.filter((t) => match(t.name) || match(t.subject) || match(t.role)).map((t) => ({ id: t.id, title: t.name, meta: `${t.subject} · ${t.role}`, path: `/teachers/${t.id}` })),
      },
      {
        label: 'Subjects and classes', icon: GraduationCap, path: '/classes',
        rows: [
          ...SUBJECTS.filter(match).map((s) => ({ id: `s-${s}`, title: s, meta: 'Subject', path: '/subjects' })),
          ...CLASSES.filter((c) => match(c.name) || match(c.level)).map((c) => ({ id: c.id, title: c.name, meta: `${c.level} · Sections A and B`, path: '/classes' })),
        ],
      },
      {
        label: 'Announcements and events', icon: FileText, path: '/announcements',
        rows: [
          ...ANNOUNCEMENTS.filter((a) => match(a.title) || match(a.body)).map((a) => ({ id: a.id, title: a.title, meta: `Announcement · ${a.category}`, path: '/announcements' })),
          ...EVENTS.filter((e) => match(e.title) || match(e.venue)).map((e) => ({ id: e.id, title: e.title, meta: `Event · ${e.date}`, path: '/events' })),
        ],
      },
    ];

    return groups.filter((group) => group.rows.length > 0);
  }, [query]);

  const total = results.reduce((sum, group) => sum + group.rows.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Search</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Search the academy website
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Search courses, notes, past papers, teachers, subjects, classes, announcements and events.
        </p>
      </header>

      <div className="relative mt-8">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a subject, chapter, paper or teacher"
          aria-label="Search the academy website"
          autoFocus
          className="h-13 w-full rounded-2xl border border-input bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:border-primary/50"
        />
      </div>

      {query.trim().length < 2 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {['Quadratic equations', 'Physics past paper', 'Class 9', 'Chemistry notes', 'Ayesha Siddiqui', 'Admissions'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && total === 0 && (
        <div className="mt-8">
          <EmptyState
            title="No results found"
            description="Try a subject name, a chapter title or a teacher's name. Notes and papers are also listed in the learning resources area."
          />
        </div>
      )}

      {total > 0 && (
        <>
          <p className="mt-6 text-xs text-muted-foreground">{total} results for “{query}”</p>
          <div className="mt-4 space-y-6">
            {results.map((group) => (
              <section key={group.label} className="rounded-2xl border border-border bg-card p-5">
                <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.12em] text-foreground">
                  <group.icon className="h-4 w-4 text-primary" /> {group.label}
                  <span className="text-xs font-medium text-muted-foreground">({group.rows.length})</span>
                </h2>
                <ul className="mt-3 divide-y divide-border">
                  {group.rows.slice(0, 6).map((row) => (
                    <li key={row.id} className="py-3">
                      <Link to={row.path} className="block transition-colors hover:text-primary">
                        <span className="block text-sm font-semibold text-foreground">{row.title}</span>
                        <span className="block text-xs text-muted-foreground">{row.meta}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {group.rows.length > 6 && (
                  <Link to={group.path} className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
                    See all {group.rows.length} in {group.label.toLowerCase()}
                  </Link>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}