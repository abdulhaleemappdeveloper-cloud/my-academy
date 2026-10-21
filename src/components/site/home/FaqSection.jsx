import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { FAQS } from '@/data/academy';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Support</p>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Can't find your answer? Send a message to the campus office and the team will get back to you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/help"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <HelpCircle className="h-4 w-4" /> Help centre
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              Contact support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.slice(0, 6).map((item, index) => (
            <AccordionItem key={item.q} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-heading text-[15px] font-semibold hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}