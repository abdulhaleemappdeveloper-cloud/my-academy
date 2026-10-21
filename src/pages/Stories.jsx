import { Quote } from 'lucide-react';
import { ACHIEVEMENTS, STORIES, img } from '@/data/academy';

export default function Stories() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Student success</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Success stories
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Students and families describing what changed for them — published with their consent.
        </p>
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ACHIEVEMENTS.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-5">
            <dd className="font-display text-3xl font-semibold tracking-tight text-primary">{item.value}</dd>
            <dt className="mt-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {STORIES.map((story) => (
          <figure key={story.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={story.image} alt={story.name} loading="lazy" className="h-56 w-full object-cover" />
            <div className="p-6">
              <Quote className="h-5 w-5 text-gold" />
              <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground">"{story.quote}"</blockquote>
              <figcaption className="mt-4 border-t border-border pt-4 text-sm">
                <span className="block font-semibold text-foreground">{story.name}</span>
                <span className="block text-xs text-muted-foreground">{story.program} · {story.year}</span>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      <section className="mt-10 overflow-hidden rounded-2xl border border-border">
        <img src={img('1541339907198-e08756dedf3f', 1600)} alt="Graduating students at the campus" className="h-64 w-full object-cover" loading="lazy" />
      </section>
    </div>
  );
}