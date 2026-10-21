import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ACADEMY } from '@/data/academy';

export default function ContactSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-brand px-6 py-14 sm:px-12">
        <div className="ta-glow pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Admissions and enquiries</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-primary-foreground sm:text-4xl">
              Visit the campus or send us a message
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
              The admissions office is open Monday to Saturday. Walk in for a campus tour, or send your
              question and we will reply within one working day.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/admissions/apply"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Start an application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Contact the office
              </Link>
            </div>
          </div>

          <ul className="space-y-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur">
            <li className="flex gap-3 text-sm text-primary-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{ACADEMY.address}</span>
            </li>
            <li className="flex gap-3 text-sm text-primary-foreground">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{ACADEMY.phone}</span>
            </li>
            <li className="flex gap-3 text-sm text-primary-foreground">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>WhatsApp {ACADEMY.whatsapp}</span>
            </li>
            <li className="flex gap-3 text-sm break-all text-primary-foreground">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{ACADEMY.email}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}