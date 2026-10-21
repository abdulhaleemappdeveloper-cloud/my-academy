import { CalendarDays, Pin } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { ANNOUNCEMENTS } from '@/data/academy';

const formatDate = (value) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Announcements() {
  const categories = [...new Set(ANNOUNCEMENTS.map((item) => item.category))];
  return (
    <DirectoryPage
      eyebrow="Official notices"
      title="Announcements"
      description="Notices published by the academy office for students, guardians and staff. Pinned notices remain at the top of the portal."
      items={ANNOUNCEMENTS}
      searchKeys={['title', 'body', 'category']}
      filters={[{ key: 'category', label: 'Category', options: categories }]}
      renderCard={(item) => (
        <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-brand-tint px-2.5 py-0.5 font-semibold text-primary">{item.category}</span>
            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDate(item.date)}</span>
            {item.pinned && (
              <span className="flex items-center gap-1 font-semibold text-gold"><Pin className="h-3 w-3" /> Pinned</span>
            )}
          </div>
          <h2 className="mt-3 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{item.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            Issued by {item.author}
          </p>
        </article>
      )}
    />
  );
}