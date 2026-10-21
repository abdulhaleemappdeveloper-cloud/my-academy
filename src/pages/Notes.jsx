import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { CLASSES, NOTES, SUBJECTS } from '@/data/academy';

export default function Notes() {
  return (
    <DirectoryPage
      eyebrow="Learning resources"
      title="Notes library"
      description="Chapter-wise text notes, solved sets, revision sheets and worksheets prepared by subject teachers and reviewed before publication."
      items={NOTES}
      searchKeys={['title', 'subject', 'classLabel', 'chapter']}
      filters={[
        { key: 'subject', label: 'Subject', options: SUBJECTS },
        { key: 'classLabel', label: 'Class', options: CLASSES.map((c) => c.name) },
        { key: 'type', label: 'Type', options: [...new Set(NOTES.map((n) => n.type))] },
      ]}
      renderCard={(note) => (
        <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-brand/5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-primary">{note.type}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="h-3.5 w-3.5" /> {note.downloads}
            </span>
          </div>
          <h2 className="mt-3 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{note.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{note.summary}</p>
          <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
            <div className="flex justify-between gap-3"><dt>Subject</dt><dd className="font-medium text-foreground">{note.subject}</dd></div>
            <div className="flex justify-between gap-3"><dt>Class</dt><dd className="font-medium text-foreground">{note.classLabel}</dd></div>
            <div className="flex justify-between gap-3"><dt>Pages</dt><dd className="font-medium text-foreground">{note.pages}</dd></div>
          </dl>
          <Link to={`/notes/${note.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <FileText className="h-3.5 w-3.5" /> Open notes
          </Link>
        </article>
      )}
    />
  );
}