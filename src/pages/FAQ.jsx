import { Link } from 'react-router-dom';
import { HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ACADEMY, FAQS } from '@/data/academy';

const TOPICS = [
  { title: 'Admissions', items: FAQS.slice(0, 2) },
  { title: 'Academics', items: FAQS.slice(2, 4) },
  { title: 'Fees and payments', items: FAQS.slice(3, 5) },
  { title: 'Portal and accounts', items: FAQS.slice(4, 6) },
  { title: 'Campus', items: FAQS.slice(5, 7) },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Help</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Answers to the questions families ask most often. If your question is not listed, the campus office will help.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {TOPICS.map((topic) => (
            <section key={topic.title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">{topic.title}</h2>
              <Accordion type="single" collapsible className="mt-3">
                {topic.items.map((item, index) => (
                  <AccordionItem key={item.q} value={`${topic.title}-${index}`}>
                    <AccordionTrigger className="text-left font-heading text-sm font-semibold hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-primary/20 bg-brand-tint p-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-heading text-base font-bold tracking-tight text-foreground">Still need help?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Send a message to the campus office and the team will reply within one working day. For anything
              requiring a document or a decision, the office will open a support ticket for you.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/contact" className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                Contact the office
              </Link>
              <Link to="/support" className="inline-flex h-10 items-center justify-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
                Support form
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Reach us directly</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> WhatsApp {ACADEMY.whatsapp}</li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="break-all">{ACADEMY.email}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}