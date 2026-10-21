import { AlertTriangle, CheckCircle2, Landmark, Smartphone } from 'lucide-react';
import ProsePage from '@/components/site/ProsePage';
import { PAYMENT_METHODS } from '@/data/records';
import { formatPKR } from '@/data/academy';

export default function PaymentInstructions() {
  return (
    <ProsePage
      eyebrow="Finance"
      title="Fee payment instructions"
      intro="Fees can be paid by bank transfer, JazzCash or Easypaisa. A payment is only recorded as paid after the finance office verifies the transaction against the invoice."
      updated="October 2026"
      sections={[
        {
          heading: 'How to submit a payment',
          bullets: [
            'Open the fee invoice in the parent or student portal to see the instalment amount and due date.',
            'Pay the exact amount using one of the accounts below and note the transaction reference.',
            'Upload the transaction reference and the payment screenshot in the portal against that invoice.',
            'The payment moves to Pending verification. Finance staff approve or reject it, and you receive a notification.',
            'A receipt is generated once the payment is approved and the invoice balance is updated.',
          ],
        },
        {
          heading: 'Important safeguards',
          bullets: [
            'A screenshot is not proof of payment on its own — the finance office verifies every transaction.',
            'Never share wallet PINs, banking passwords or one-time codes with anyone, including campus staff.',
            'Duplicate submissions are prevented by the transaction reference; do not submit the same payment twice.',
            'Refunds follow the refund policy and require approval; they are not processed at the counter.',
          ],
        },
        {
          heading: 'Installments and overdue fees',
          body: [
            `Most classes allow the term fee to be paid in two installments. The invoice shows which installment is due and the balance remaining.`,
            'A late fee of 2 per cent applies after ten days past the due date. Waiving a late fee requires approval from the finance office and is recorded.',
          ],
        },
        {
          heading: 'Fees at a glance',
          bullets: [
            `Primary classes from ${formatPKR(6500)} per term.`,
            `Middle classes from ${formatPKR(9000)} per term.`,
            `Matric classes from ${formatPKR(11000)} per term.`,
            `Intermediate and professional programmes from ${formatPKR(15000)} per term.`,
          ],
        },
      ]}
    >
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Payment accounts</h2>
        <div className="mt-5 space-y-4">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id} className="rounded-xl border border-border bg-background p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight text-foreground">
                  {method.name.toLowerCase().includes('bank') ? <Landmark className="h-4 w-4 text-primary" /> : <Smartphone className="h-4 w-4 text-primary" />}
                  {method.name}
                </h3>
                <span className="rounded-full bg-brand-tint px-2.5 py-0.5 text-[11px] font-semibold text-primary">{method.status}</span>
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-xs text-muted-foreground">Account title</dt>
                  <dd className="font-medium text-foreground">{method.title}</dd>
                </div>
                <div className="flex justify-between gap-3 sm:block">
                  <dt className="text-xs text-muted-foreground">Account / number</dt>
                  <dd className="font-medium text-foreground">{method.account}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{method.instructions}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            Automated confirmation from JazzCash and Easypaisa is not connected yet, so these payments are verified
            manually by the finance office. Do not treat an uploaded screenshot as a completed payment.
          </p>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Finance permissions are restricted: teachers and
          website editors cannot open fee records.
        </p>
      </section>
    </ProsePage>
  );
}