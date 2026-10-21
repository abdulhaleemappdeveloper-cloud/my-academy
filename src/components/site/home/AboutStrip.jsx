import { Link } from 'react-router-dom';
import { BadgeCheck, HeartHandshake, LayoutGrid, Target } from 'lucide-react';
import { ACADEMY, img } from '@/data/academy';

const PILLARS = [
  { icon: Target, title: 'Defined curriculum', text: 'Chapters, topics and learning objectives mapped for every class and subject.' },
  { icon: LayoutGrid, title: 'Two supported sections', text: 'Section A and Section B follow the same syllabus, with extra support in Section B.' },
  { icon: BadgeCheck, title: 'Verified results', text: 'Marks are validated and results released only after academic approval.' },
  { icon: HeartHandshake, title: 'Parents included', text: 'Guardians see attendance, results and fee status for their own children.' },
];

export default function AboutStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative">
          <div className="overflow-hidden rounded-[1.5rem] border border-border">
            <img
              src={img('1507842217343-583bb7270b66', 1000)}
              alt="Library and study area at the campus"
              className="h-[300px] w-full object-cover sm:h-[380px]"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-5 right-4 hidden rounded-2xl border border-border bg-background/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Established campus</p>
            <p className="mt-1 font-display text-xl font-semibold text-foreground">{ACADEMY.city}, {ACADEMY.country}</p>
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">About the academy</p>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            Teaching that follows the student, not just the syllabus
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            {ACADEMY.brand} at {ACADEMY.campus} teaches classes 1 to 12 alongside college support and
            professional certification. Every class runs with two sections, subject teachers, weekly
            assessments and clear reporting to parents.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-border bg-card p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint text-primary">
                  <pillar.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3.5 font-heading text-sm font-bold tracking-tight text-foreground">{pillar.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{pillar.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/about"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              More about us
            </Link>
            <Link
              to="/campus"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              Campus information
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}