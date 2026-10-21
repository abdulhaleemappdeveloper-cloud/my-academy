import { Download, FileText } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { CLASSES, NOTES, PAPERS, SUBJECTS } from '@/data/academy';

/** Public downloads: everything a visitor may take away without a portal account. */
export default function Downloads() {
  const items = [
    ...NOTES.filter((note) => note.type !== 'Practice set').map((note) => ({
      id: note.id,
      title: note.title,
      kind: note.type,
      subject: note.subject,
      classLabel: note.classLabel,
      pages: note.pages,
      size: `${(0.4 + (note.pages % 7) * 0.3).toFixed(1)} MB`,
      downloads: note.downloads,
      access: 'Open to everyone',
    })),
    ...PAPERS.map((paper) => ({
      id: paper.id,
      title: paper.title,
      kind: paper.type,
      subject: paper.subject,
      classLabel: paper.classLabel,
      pages: paper.pages,
      size: `${(0.5 + (paper.pages % 6) * 0.4).toFixed(1)} MB`,
      downloads: paper.downloads,
      access: 'Open to everyone',
    })),
  ];

  return (
    <DirectoryPage
      eyebrow="Resources"
      title="Downloadable learning resources"
      description="Notes, worksheets, past papers and sample papers that can be downloaded without signing in. Chapter-wise material for enrolled students is available in the portal."
      items={items}
      searchKeys={['title', 'subject', 'classLabel', 'kind']}
      filters={[
        { key: 'kind', label: 'Type', options: [...new Set(items.map((item) => item.kind))] },
        { key: 'subject', label: 'Subject', options: SUBJECTS },
        { key: 'classLabel', label: 'Class', options: CLASSES.map((c) => c.name) },
      ]}
      renderCard={(item) => (
        <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-foreground">{item.kind}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="h-3.5 w-3.5" /> {item.downloads}
            </span>
          </div>
          <h2 className="mt-3 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{item.title}</h2>
          <dl className="mt-3 flex-1 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between gap-3"><dt>Subject</dt><dd className="font-medium text-foreground">{item.subject}</dd></div>
            <div className="flex justify-between gap-3"><dt>Class</dt><dd className="font-medium text-foreground">{item.classLabel}</dd></div>
            <div className="flex justify-between gap-3"><dt>File</dt><dd className="font-medium text-foreground">{item.pages} pages · {item.size}</dd></div>
            <div className="flex justify-between gap-3"><dt>Access</dt><dd className="font-medium text-foreground">{item.access}</dd></div>
          </dl>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-input px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            <FileText className="h-3.5 w-3.5" /> Download
          </button>
        </article>
      )}
    />
  );
}