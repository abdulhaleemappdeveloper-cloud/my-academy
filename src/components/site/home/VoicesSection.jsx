import { Quote } from 'lucide-react';
import SectionHeading from '@/components/site/SectionHeading';
import { ACHIEVEMENTS, STORIES } from '@/data/academy';

export default function VoicesSection() {
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Student success"
          title="Progress you can see, in the students' own words"
          description="Results, distinctions and the study habits that produced them."
        />

        <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ACHIEVEMENTS.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-5">
              <dd className="font-display text-3xl font-semibold tracking-tight text-primary">{item.value}</dd>
              <dt className="mt-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {STORIES.slice(0, 2).map((story) => (
            <figure key={story.id} className="rounded-2xl border border-border bg-card p-6">
              <Quote className="h-6 w-6 text-gold" />
              <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground">"{story.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img src={story.image} alt={story.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                <span>
                  <span className="block text-sm font-semibold text-foreground">{story.name}</span>
                  <span className="block text-xs text-muted-foreground">{story.program} · {story.year}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}