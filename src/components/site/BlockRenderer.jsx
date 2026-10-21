import { Link } from 'react-router-dom';
import {
  ArrowRight, CalendarDays, CheckCircle2, Clock, Download, Mail, MapPin, MessageCircle,
  Phone, Play, Quote, Search,
} from 'lucide-react';
import { ACADEMY, img } from '@/data/academy';
import { all } from '@/data/store';
import { findBlock } from '@/data/blocks';
import { formatValue } from '@/lib/format';

const lines = (value) => String(value || '').split('\n').map((line) => line.trim()).filter(Boolean);
const pairs = (value) =>
  lines(value).map((line) => {
    const [a, b] = line.split('=');
    return { a: (a || '').trim(), b: (b || '').trim() };
  });

const CARD_SOURCES = {
  courses: () => all('courses').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: `${row.subject} · ${row.teacher}`, text: `${row.lessons} lessons · ${row.chapters} chapters`, path: `/courses/${row.id}`, image: row.image })),
  subjects: () => all('subjects').slice(0, 6).map((row) => ({ id: row.id, title: row.name, meta: `${row.chapters} chapters`, text: `${row.topics} topics · ${row.materials} resources` })),
  classes: () => all('classes').slice(0, 6).map((row) => ({ id: row.id, title: row.name, meta: row.level, text: `Sections A and B · class teacher ${row.classTeacher}` })),
  lessons: () => all('lessons').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: `${row.subject} · ${row.type}`, text: `${row.duration} · ${row.status}` })),
  chapters: () => all('chapters').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: row.subject, text: `${row.topics} topics · ${row.materials} materials` })),
  topics: () => all('topics').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: row.subject, text: `${row.objectives} learning objectives` })),
  notes: () => all('notes').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: `${row.subject} · ${row.className}`, text: row.type, path: `/notes/${row.id}` })),
  papers: () => all('papers').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: `${row.className} · ${row.year}`, text: `${row.marks} marks · ${row.pages} pages` })),
  teachers: () => all('teachers').slice(0, 6).map((row) => ({ id: row.id, title: row.name, meta: row.subject, text: row.qualification, path: `/teachers/${row.id}`, image: row.photo })),
  events: () => all('events').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: `${row.date} · ${row.venue}`, text: row.category })),
  announcements: () => all('announcements').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: row.category, text: row.body })),
  exams: () => all('exams').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: `${row.className} · ${row.date}`, text: `${row.duration} · ${row.totalMarks} marks` })),
  flashcards: () => all('flashcards').slice(0, 6).map((row) => ({ id: row.id, title: row.deck, meta: `${row.subject} · ${row.className}`, text: row.mastered })),
  learningPaths: () => all('learningPaths').slice(0, 6).map((row) => ({ id: row.id, title: row.title, meta: row.className, text: `${row.steps} steps · ${row.enrolled} enrolled` })),
  media: () => all('media').slice(0, 6).map((row) => ({ id: row.id, title: row.name, meta: `${row.type} · ${row.size}`, text: row.folder })),
  awards: () => all('awards').slice(0, 6).map((row) => ({ id: row.id, title: row.studentName, meta: row.award, text: row.activity })),
};

function Shell({ children, className = '' }) {
  return <section className={`rounded-2xl border border-border bg-card p-6 ${className}`}>{children}</section>;
}

function Heading({ eyebrow, heading, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{heading}</h2>
    </div>
  );
}

function CardGrid({ items, columns = 3 }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {items.map((item) => {
        const body = (
          <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
            {item.image && <img src={item.image} alt={item.title} loading="lazy" className="h-32 w-full object-cover" />}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">{item.title}</h3>
              {item.meta && <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">{item.meta}</p>}
              {item.text && <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>}
            </div>
          </article>
        );
        return item.path ? (
          <Link key={item.id} to={item.path} className="block">{body}</Link>
        ) : (
          <div key={item.id}>{body}</div>
        );
      })}
    </div>
  );
}

function FormBlocks({ props, compact }) {
  return (
    <Shell>
      {props.heading && <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">{props.heading}</h2>}
      {props.text && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{props.text}</p>}
      <div className={`mt-4 grid gap-3 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
          Full name
          <input className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary/50" placeholder="Your name" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
          Email or phone
          <input className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary/50" placeholder="How should we reply?" />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground sm:col-span-2">
          Message
          <textarea rows={3} className="rounded-xl border border-input bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/50" placeholder="Tell us what you need" />
        </label>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        {props.successMessage || 'Submissions are reviewed by the campus office during working hours.'}
      </p>
    </Shell>
  );
}

/**
 * Renders one page-builder block.
 * The block type decides which shape is used, so all 100 library types render real
 * content rather than a placeholder.
 */
export default function BlockRenderer({ block }) {
  if (!block || block.visible === false) return null;
  const definition = findBlock(block.type);
  const props = block.props || {};
  const shape = definition?.shape || 'text';
  const source = props.source || definition?.source || null;

  switch (shape) {
    case 'heading':
      return <Heading eyebrow={props.eyebrow} heading={props.text} align={props.align} />;

    case 'text':
      return (
        <Shell>
          <Heading eyebrow={props.eyebrow} heading={props.heading} />
          {props.text && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{props.text}</p>}
        </Shell>
      );

    case 'list':
      return (
        <Shell>
          <Heading eyebrow={props.eyebrow} heading={props.heading} />
          <ul className="mt-4 space-y-2.5">
            {lines(props.items).map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </Shell>
      );

    case 'stats':
      return (
        <Shell>
          <Heading heading={props.heading} />
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pairs(props.items).map((pair) => (
              <div key={pair.a} className="rounded-xl border border-border bg-background p-4">
                <dd className="font-display text-2xl font-semibold tracking-tight text-primary">{pair.b}</dd>
                <dt className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{pair.a}</dt>
              </div>
            ))}
          </dl>
        </Shell>
      );

    case 'table':
      return (
        <Shell>
          <Heading heading={props.heading} />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <tbody>
                {lines(props.rows).map((row, index) => {
                  const cells = row.split(',');
                  return (
                    <tr key={row} className="border-b border-border/70 last:border-0">
                      {cells.map((cell, cellIndex) => (
                        <td
                          key={`${row}-${cellIndex}`}
                          className={`px-3 py-2.5 ${cellIndex === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'} ${index === 0 ? 'bg-muted/40 text-[11px] uppercase tracking-[0.1em]' : ''}`}
                        >
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Shell>
      );

    case 'quote':
      return (
        <Shell>
          <Quote className="h-5 w-5 text-gold" />
          <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground">{props.text}</blockquote>
          {props.author && <p className="mt-3 text-xs text-muted-foreground">— {props.author}</p>}
        </Shell>
      );

    case 'faq':
      return (
        <Shell>
          <Heading heading={props.heading} />
          <dl className="mt-4 divide-y divide-border">
            {pairs(props.items).map((pair) => (
              <div key={pair.a} className="py-3.5">
                <dt className="font-heading text-sm font-semibold text-foreground">{pair.a}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pair.b}</dd>
              </div>
            ))}
          </dl>
        </Shell>
      );

    case 'timeline':
      return (
        <Shell>
          <Heading heading={props.heading} />
          <ol className="mt-4 space-y-4">
            {pairs(props.items).map((pair, index) => (
              <li key={pair.a} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">{pair.a}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{pair.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </Shell>
      );

    case 'links':
      return (
        <Shell>
          <Heading heading={props.heading} />
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {pairs(props.items).map((pair) => (
              <li key={pair.a}>
                <Link to={pair.b || '/'} className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40">
                  <ArrowRight className="h-3.5 w-3.5 text-primary" /> {pair.a}
                </Link>
              </li>
            ))}
          </ul>
        </Shell>
      );

    case 'cta':
      return (
        <section className="rounded-2xl border border-border bg-brand px-6 py-10 text-primary-foreground">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{props.heading}</h2>
          {props.text && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-foreground/80">{props.text}</p>}
          <Link
            to={props.buttonPath || '/admissions'}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-gold px-5 text-sm font-semibold text-accent-foreground"
          >
            {props.buttonLabel || 'Continue'} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      );

    case 'banner':
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold-soft px-5 py-4">
          <p className="text-sm font-semibold text-foreground">{props.heading}</p>
          <Link to={props.buttonPath || '/'} className="rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background">
            {props.buttonLabel || 'Open'}
          </Link>
        </div>
      );

    case 'contact':
      return (
        <Shell>
          <Heading heading={props.heading} />
          {props.text && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{props.text}</p>}
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{ACADEMY.address}</li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{ACADEMY.phone}</li>
            <li className="flex gap-2.5"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />WhatsApp {ACADEMY.whatsapp}</li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="break-all">{ACADEMY.email}</span></li>
            <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{ACADEMY.hours}</li>
          </ul>
        </Shell>
      );

    case 'form':
      return <FormBlocks props={props} />;

    case 'calendar':
      return (
        <Shell>
          <Heading heading={props.heading} />
          <ul className="mt-4 space-y-3">
            {all('events').slice(0, props.limit || 4).map((event) => (
              <li key={event.id} className="flex items-center gap-4 rounded-xl border border-border bg-background p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand text-primary-foreground">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{event.title}</span>
                  <span className="block text-xs text-muted-foreground">{event.date} · {event.venue}</span>
                </span>
              </li>
            ))}
          </ul>
        </Shell>
      );

    case 'embed':
      return (
        <Shell>
          <Heading heading={props.heading} />
          <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-border bg-muted/40 p-10 text-center">
            <Play className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium text-foreground">
              {props.url ? 'Embedded content is configured.' : 'No embed address configured yet.'}
            </p>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              External content only loads when the provider has been connected and approved. Until then the block stays
              empty instead of showing a broken frame.
            </p>
          </div>
        </Shell>
      );

    case 'spacer':
      return (
        <div className="py-4" aria-hidden>
          <div className={props.size === 'large' ? 'h-10' : props.size === 'small' ? 'h-2' : 'h-6'} />
        </div>
      );

    case 'media':
      return (
        <Shell>
          {props.heading && <Heading heading={props.heading} />}
          <img
            src={props.url || img('1523240795612-9a054b0db644', 1200)}
            alt={props.alt || props.heading || 'Academy image'}
            loading="lazy"
            className="mt-4 h-72 w-full rounded-xl border border-border object-cover"
          />
          {props.alt && <p className="mt-2 text-xs text-muted-foreground">{props.alt}</p>}
        </Shell>
      );

    case 'cards':
    default: {
      const builder = CARD_SOURCES[source];
      const items = builder ? builder().slice(0, props.limit || 6) : [];
      if (!items.length) {
        return (
          <Shell>
            <Heading eyebrow={props.eyebrow} heading={props.heading || definition?.label} />
            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
              <Search className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                This block lists {source ? formatValue(source) : 'academy'} records. Add records in the matching module and they appear here automatically.
              </p>
              {definition?.source === 'notes' && (
                <Link to="/notes" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
                  <Download className="h-3.5 w-3.5" /> Browse the notes library
                </Link>
              )}
            </div>
          </Shell>
        );
      }
      return (
        <section>
          <Heading eyebrow={props.eyebrow} heading={props.heading} />
          <div className="mt-4">
            <CardGrid items={items} columns={Number(props.columns || 3)} />
          </div>
        </section>
      );
    }
  }
}