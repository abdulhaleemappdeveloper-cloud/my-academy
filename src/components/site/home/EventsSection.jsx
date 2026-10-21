import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock, MapPin, Pin } from 'lucide-react';
import SectionHeading from '@/components/site/SectionHeading';
import { ANNOUNCEMENTS, EVENTS } from '@/data/academy';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function EventsSection() {
  const announcements = [...ANNOUNCEMENTS].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Campus life"
        title="Announcements and upcoming events"
        description="Official notices from the academy office, plus the academic calendar for the current session."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
            <Pin className="h-4 w-4 text-gold" /> Notices
          </h3>
          <ul className="space-y-3">
            {announcements.slice(0, 4).map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-brand-tint px-2.5 py-0.5 font-medium text-primary">{item.category}</span>
                  <span>{formatDate(item.date)}</span>
                  {item.pinned && <span className="font-semibold text-gold">Pinned</span>}
                </div>
                <h4 className="mt-3 font-heading text-base font-bold tracking-tight text-foreground">{item.title}</h4>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/announcements"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-soft"
          >
            All announcements
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
            <CalendarDays className="h-4 w-4 text-primary" /> Events calendar
          </h3>
          <ul className="space-y-3">
            {EVENTS.slice(0, 4).map((event) => (
              <li key={event.id} className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground">
                  <span className="text-center leading-none">
                    <span className="block font-display text-lg font-semibold">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wider">
                      {new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-sm font-bold tracking-tight text-foreground">{event.title}</h4>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/events"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-soft"
          >
            Full calendar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}