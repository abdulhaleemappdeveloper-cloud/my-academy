import { Download, FileText } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { CLASSES, PAPERS, SUBJECTS } from '@/data/academy';

export default function PastPapers() {
  return (
    <DirectoryPage
      eyebrow="Revision"
      title="Past papers and sample papers"
      description="Past board papers, model papers and practice papers organised by class, subject and year. Attempt them under timed conditions for the best preparation."
      items={PAPERS}
      searchKeys={['title', 'subject', 'classLabel']}
      filters={[
        { key: 'subject', label: 'Subject', options: SUBJECTS },
        { key: 'classLabel', label: 'Class', options: [...new Set(PAPERS.map((p) => p.classLabel))] },
        { key: 'type', label: 'Type', options: ['Past paper', 'Sample paper'] },
        { key: 'year', label: 'Year', options: [...new Set(PAPERS.map((p) => String(p.year)))].sort() },
      ]}
      renderCard={(paper) => (
        <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-brand/5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-foreground">{paper.type}</span>
            <span className="text-xs font-semibold text-muted-foreground">{paper.year}</span>
          </div>
          <h2 className="mt-3 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{paper.title}</h2>
          <dl className="mt-4 flex-1 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between gap-3"><dt>Class</dt><dd className="font-medium text-foreground">{paper.classLabel}</dd></div>
            <div className="flex justify-between gap-3"><dt>Subject</dt><dd className="font-medium text-foreground">{paper.subject}</dd></div>
            <div className="flex justify-between gap-3"><dt>Total marks</dt><dd className="font-medium text-foreground">{paper.marks}</dd></div>
            <div className="flex justify-between gap-3"><dt>Pages</dt><dd className="font-medium text-foreground">{paper.pages}</dd></div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="h-3.5 w-3.5" /> {paper.downloads}
            </span>
            <a href="/portal" className="text-sm font-semibold text-primary hover:underline">Open paper</a>
          </div>
        </article>
      )}
    >
      <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-cream p-5 sm:grid-cols-3">
        {[
          { title: 'Attempt under time', text: 'Give yourself the same time as in the examination hall, then mark your own answers.' },
          { title: 'Log your mistakes', text: 'Keep an error log of the questions you lose marks on and revise those topics first.' },
          { title: 'Practise the format', text: 'Board papers repeat the structure, so familiarity with the format saves time.' },
        ].map((tip) => (
          <div key={tip.title} className="flex gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">{tip.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
    </DirectoryPage>
  );
}