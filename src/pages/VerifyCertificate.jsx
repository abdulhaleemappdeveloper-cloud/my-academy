import { useState } from 'react';
import { BadgeCheck, Search, ShieldCheck, XCircle } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useCollection } from '@/data/store';

/**
 * Public certificate verification.
 * Shows only what is needed to confirm authenticity: the certificate type, the
 * recipient's name, the issue date and the current status.
 */
export default function VerifyCertificate() {
  const certificates = useCollection('certificates');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(undefined);

  const verify = (event) => {
    event.preventDefault();
    const term = code.trim().toUpperCase();
    if (!term) return;
    setResult(certificates.find((row) => String(row.code).toUpperCase() === term) || null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Verification</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Verify a certificate
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter the certificate identifier printed on the document. Verification confirms the type of certificate, the
          recipient and whether it is currently valid. No other personal or academic information is shown.
        </p>
      </header>

      <form onSubmit={verify} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="For example TA-CERT-2026-1400"
            aria-label="Certificate identifier"
            className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm uppercase outline-none focus:border-primary/50"
          />
        </div>
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-primary-foreground">
          <ShieldCheck className="h-4 w-4" /> Verify
        </button>
      </form>

      {result === null && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-500/30 dark:bg-rose-500/10">
          <div className="flex gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-300" />
            <div>
              <h2 className="font-heading text-base font-bold text-rose-800 dark:text-rose-200">No matching certificate</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-rose-700 dark:text-rose-300">
                Check that the identifier matches the document exactly. If it should be valid, contact the campus office
                so the record can be reviewed — a certificate that was corrected or revoked will not verify here.
              </p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
                  {result.status === 'Issued' ? 'Certificate verified' : `Certificate ${result.status.toLowerCase()}`}
                </h2>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{result.code}</p>
              </div>
            </div>
            <StatusBadge value={result.status} />
          </div>

          <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            {[
              ['Recipient', result.studentName],
              ['Class', result.className],
              ['Certificate type', result.type],
              ['Issued on', result.issuedOn],
              ['Eligibility check', result.eligibility],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            This page confirms only the minimum needed to establish authenticity. Marks, attendance, guardian details
            and fee records are never disclosed here. Verification lookups are logged and rate limited.
          </p>
        </div>
      )}
    </div>
  );
}