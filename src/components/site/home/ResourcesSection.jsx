import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, Library } from 'lucide-react';
import SectionHeading from '@/components/site/SectionHeading';
import { NOTES, PAPERS } from '@/data/academy';

export default function ResourcesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Learning resources"
        title="Notes, solved papers and revision material in one library"
        description="Resources are organised by class, subject and chapter so revision never starts from a blank page."
        action={
          <Link
            to="/notes"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            Open notes library
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint text-primary">
              <Library className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-base font-bold tracking-tight">Latest notes</h3>
          </div>
          <ul className="mt-5 divide-y divide-border">
            {NOTES.slice(0, 5).map((note) => (
              <li key={note.id} className="py-3.5">
                <Link to={`/notes/${note.id}`} className="group flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {note.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {note.subject} · {note.classLabel} · {note.type}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Download className="h-3.5 w-3.5" /> {note.downloads}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-soft text-foreground">
              <FileText className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-base font-bold tracking-tight">Past and sample papers</h3>
          </div>
          <ul className="mt-5 divide-y divide-border">
            {PAPERS.slice(0, 5).map((paper) => (
              <li key={paper.id} className="py-3.5">
                <Link to="/past-papers" className="group flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {paper.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {paper.classLabel} · {paper.marks} marks · {paper.pages} pages
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {paper.type.replace(' paper', '')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/past-papers"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-soft"
          >
            Browse all papers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}