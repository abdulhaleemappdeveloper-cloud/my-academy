import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ACADEMY } from '@/data/academy';

/**
 * Standard layout for informational and policy pages so the academy's public
 * content keeps one consistent, readable structure.
 */
export default function ProsePage({ eyebrow, title, intro, updated, sections = [], aside = true, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        {eyebrow && <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {intro && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{intro}</p>}
        {updated && <p className="mt-3 text-xs text-muted-foreground">Last reviewed: {updated}</p>}
      </header>

      <div className={`mt-10 grid gap-10 ${aside ? 'lg:grid-cols-[1.6fr_1fr]' : ''}`}>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {children}
        </div>

        {aside && (
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-cream p-6">
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Campus office</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{ACADEMY.address}</li>
                <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{ACADEMY.phone}</li>
                <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="break-all">{ACADEMY.email}</span></li>
              </ul>
              <Link
                to="/contact"
                className="mt-5 inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
              >
                Contact the office
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Related pages</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { label: 'Admissions information', path: '/admissions' },
                  { label: 'Fees and payment instructions', path: '/payment-instructions' },
                  { label: 'Scholarships', path: '/scholarships' },
                  { label: 'Help centre', path: '/help' },
                  { label: 'Accessibility', path: '/accessibility' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}