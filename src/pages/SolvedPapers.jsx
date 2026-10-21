import { Download, Lightbulb } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { CLASSES, PAPERS, SUBJECTS } from '@/data/academy';

export default function SolvedPapers() {
  const solved = PAPERS.filter((paper) => paper.type === 'Solved paper');
  return (
    <DirectoryPage
      eyebrow="Revision"
      title="Solved papers"
      description="Papers with model answers, marking guidance and notes on where students commonly lose marks."
      items={solved}
      searchKeys={['title', 'subject', 'classLabel']}
      filters={[
        { key: 'subject', label: 'Subject', options: SUBJECTS },
        { key: 'classLabel', label: 'Class', options: CLASSES.map((c) => c.name) },
      ]}
      emptyTitle="No solved papers for this filter"
      emptyDescription="Solved papers are published after each term examination. Try another subject or class."
      renderCard={(paper) => (
        <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-brand/5">
          <span className="self-start rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-primary">Solved paper</span>
          <h2 className="mt-3 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{paper.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            Full model answers with the marking scheme, awarded marks per step and teacher notes on presentation.
          </p>
          <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
            <div className="flex justify-between gap-3"><dt>Class</dt><dd className="font-medium text-foreground">{paper.classLabel}</dd></div>
            <div className="flex justify-between gap-3"><dt>Marks</dt><dd className="font-medium text-foreground">{paper.marks}</dd></div>
            <div className="flex justify-between gap-3"><dt>Downloads</dt><dd className="font-medium text-foreground">{paper.downloads}</dd></div>
          </dl>
          <a href="/portal" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <Download className="h-3.5 w-3.5" /> Open solved paper
          </a>
        </article>
      )}
    >
      <div className="mt-8 flex gap-3 rounded-2xl border border-primary/20 bg-brand-tint p-5">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Mark your own attempt before opening the solution. Comparing your answer with the marking scheme shows
          exactly where marks are lost — usually in steps rather than in the final answer.
        </p>
      </div>
    </DirectoryPage>
  );
}