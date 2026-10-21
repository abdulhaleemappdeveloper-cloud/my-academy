import { Clock, MapPin, Users } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { EVENTS } from '@/data/academy';

const label = (value) => new Date(value).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

export default function Events() {
  return (
    <DirectoryPage
      eyebrow="Campus calendar"
      title="Events and academic calendar"
      description="Examinations, parent meetings, sports days, holidays and other campus events for the current session."
      items={EVENTS}
      searchKeys={['title', 'venue', 'category']}
      filters={[{ key: 'category', label: 'Category', options: [...new Set(EVENTS.map((e) => e.category))] }]}
      renderCard={(event) => (
        <article className="flex h-full gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground">
            <span className="text-center leading-none">
              <span className="block font-display text-xl font-semibold">{new Date(event.date).getDate()}</span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-wider">
                {new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}
              </span>
            </span>
          </div>
          <div className="min-w-0">
            <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[11px] font-semibold text-foreground">{event.category}</span>
            <h2 className="mt-2 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{event.title}</h2>
            <p className="mt-1.5 text-xs text-muted-foreground">{label(event.date)}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.desc}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</span>
              {event.capacity && (
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.registered}/{event.capacity} registered</span>
              )}
            </p>
          </div>
        </article>
      )}
    />
  );
}