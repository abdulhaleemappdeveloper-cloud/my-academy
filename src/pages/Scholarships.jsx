import { Link } from 'react-router-dom';
import { ArrowRight, Percent, Sparkles, Users } from 'lucide-react';
import ProsePage from '@/components/site/ProsePage';

const SCHEMES = [
  { icon: Sparkles, name: 'Merit scholarship', award: 'Up to 50% of tuition', basis: 'Position in the class assessment and previous result card, reviewed each term.' },
  { icon: Percent, name: 'Need-based support', award: 'Up to 40% of tuition', basis: 'Verified household income documents and a review by the scholarship committee.' },
  { icon: Users, name: 'Sibling concession', award: '25% for the second sibling', basis: 'Applies when two or more siblings are enrolled at the campus in the same session.' },
  { icon: Sparkles, name: 'Sports and activity award', award: 'Up to 30% of tuition', basis: 'Representation at district or provincial level in a recognised sport or activity.' },
];

export default function Scholarships() {
  return (
    <ProsePage
      eyebrow="Support"
      title="Scholarships and concessions"
      intro="The academy reserves part of each session's seats for students who need financial support, and rewards consistent academic performance. Every application is reviewed by the scholarship committee and recorded with a decision and a reason."
      updated="October 2026"
      sections={[
        {
          heading: 'How to apply',
          bullets: [
            'Submit the scholarship request from the parent portal after admission is confirmed, or in writing to the campus office.',
            'Attach the previous result card for a merit award, or income documents for need-based support.',
            'The committee reviews applications at the start of each term and decides before the first fee due date.',
            'Approved awards are applied to the fee ledger as a discount, so the invoice shows the reduced amount.',
          ],
        },
        {
          heading: 'What the award covers',
          bullets: [
            'Tuition fee only. Examination, laboratory, transport and activity fees are charged at the standard rate.',
            'Awards are granted for one academic year and reviewed before renewal.',
            'A scholarship does not reduce the attendance or academic requirements of the class.',
          ],
        },
        {
          heading: 'Applying the discount to fees',
          body: [
            'Once approved, the discount appears on the next invoice. Existing invoices are not recalculated automatically — the finance office issues a corrected invoice if a discount applies to an amount already billed.',
            'Approved awards, changes and cancellations are recorded so the academy can review its own decisions.',
          ],
        },
      ]}
    >
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Available schemes</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {SCHEMES.map((scheme) => (
            <div key={scheme.name} className="rounded-xl border border-border bg-background p-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint text-primary">
                <scheme.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-heading text-sm font-bold tracking-tight text-foreground">{scheme.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{scheme.award}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{scheme.basis}</p>
            </div>
          ))}
        </div>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Ask about a scholarship <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </ProsePage>
  );
}