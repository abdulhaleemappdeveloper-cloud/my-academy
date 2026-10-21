import { CalendarDays, Download, FileText, DownloadCloud } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { ANNOUNCEMENTS, EVENTS, NOTES, PAPERS } from '@/data/academy';

/**
 * Authorised public notices.
 * Only notices the office has published are shown here — private notices, student
 * records and examination material never appear on a public page.
 */
export default function Notices() {
  const notices = ANNOUNCEMENTS.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    date: item.date,
    body: item.body,
    author: item.author,
  }));

  return (
    <DirectoryPage
      eyebrow="Public office"
      title="Authorised public notices"
      description="Notices the academy office has approved for publication on the public website. Portal notices, examination papers and student records are never published here."
      items={notices}
      searchKeys={['title', 'body', 'category']}
      filters={[{ key: 'category', label: 'Category', options: [...new Set(notices.map((n) => n.category))] }]}
      renderCard={(notice) => (
        <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-brand-tint px-2.5 py-0.5 font-semibold text-primary">{notice.category}</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(notice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h2 className="mt-3 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{notice.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{notice.body}</p>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">Issued by {notice.author}</p>
        </article>
      )}
    >
      <section className="mt-8 grid gap-5 sm:grid-cols-3">
        {[
          { icon: FileText, title: 'Notice board', text: `${notices.length} notices published this session.` },
          { icon: DownloadCloud, title: 'Downloads available', text: `${NOTES.length} notes and ${PAPERS.length} papers listed publicly.` },
          { icon: CalendarDays, title: 'Upcoming events', text: `${EVENTS.length} events listed on the campus calendar.` },
        ].map((item) => (
          <div key={item.title} className="flex gap-3 rounded-2xl border border-border bg-cream p-5">
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-5">
        <Download className="h-4 w-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          Looking for chapter-wise notes, worksheets or solved papers? These are published in the learning resources area.
        </p>
      </section>
    </DirectoryPage>
  );
}