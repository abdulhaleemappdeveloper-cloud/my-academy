import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Circle, Clock, FileSearch, Search } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';

const STAGES = ['Draft', 'Submitted', 'Under review', 'Information requested', 'Approved', 'Admission completed'];

export default function ApplicationStatus() {
  const admissions = useCollection('admissions');
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [match, setMatch] = useState(null);

  const search = (event) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    if (!term) return;
    const found = admissions.find(
      (row) =>
        String(row.applicationNo).toLowerCase() === term ||
        String(row.phone) === term ||
        String(row.applicant).toLowerCase().includes(term)
    );
    setMatch(found || null);
    setSearched(true);
  };

  const stageIndex = match ? STAGES.indexOf(match.stage) : -1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Admissions</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Application status
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter the application reference number you received after submitting, the applicant's name, or the guardian's
          mobile number. Only the status of the application is shown — documents and notes stay private.
        </p>
      </header>

      <form onSubmit={search} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="APP-2026-0001, applicant name or mobile number"
            aria-label="Application reference, name or mobile number"
            className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-primary-foreground">
          Check status
        </button>
      </form>

      {searched && !match && (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <FileSearch className="mx-auto h-6 w-6 text-muted-foreground" />
          <h2 className="mt-3 font-heading text-base font-bold text-foreground">No application found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Check the reference number exactly as it appears on your confirmation, or call the campus office on the
            number below with the applicant's name and date of birth.
          </p>
          <Link to="/admissions/apply" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Start a new application <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {match && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold text-muted-foreground">{match.applicationNo}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">{match.applicant}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Applying for {match.applyingFor} · session {match.academicYear}
              </p>
            </div>
            <StatusBadge value={match.stage} />
          </div>

          <ol className="mt-7 space-y-4">
            {STAGES.map((stage, index) => {
              const done = stageIndex >= index && stageIndex !== -1;
              const current = stageIndex === index;
              return (
                <li key={stage} className="flex gap-4">
                  <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${done ? 'bg-brand text-primary-foreground' : 'border border-border text-muted-foreground'}`}>
                    {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${current ? 'text-primary' : 'text-foreground'}`}>{stage}</p>
                    {current && <p className="mt-0.5 text-xs text-muted-foreground">Current stage — the office is working on this application.</p>}
                  </div>
                </li>
              );
            })}
          </ol>

          <dl className="mt-7 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            {[
              ['Submitted on', match.submitted],
              ['Documents', match.documents],
              ['Interview or assessment', match.interview],
              ['Assigned class', match.assignedClass],
              ['Section', match.assignedSection],
              ['Admission number', match.admissionNumber],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          {match.reason && match.reason !== '—' && (
            <div className="mt-5 flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">{match.reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}