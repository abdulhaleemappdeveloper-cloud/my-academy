import ProsePage from '@/components/site/ProsePage';

export default function RefundPolicy() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Refund policy"
      intro="How fee refunds are requested, reviewed and processed at the academy."
      updated="October 2026"
      sections={[
        {
          heading: 'When a refund may be considered',
          bullets: [
            'Withdrawal from the academy before the end of the first month of a term.',
            'A duplicate payment made in error against the same invoice.',
            'Transport fee for a period during which the service was not used after a documented relocation.',
            'An examination or activity fee for an event that the academy cancelled.',
          ],
        },
        {
          heading: 'How to request a refund',
          bullets: [
            'Submit the request in writing to the campus office or through the parent portal.',
            'Quote the invoice number and the transaction reference of the original payment.',
            'Explain the reason and attach supporting documents where applicable.',
            'The finance office confirms the refundable amount against the fee ledger — admission fees and completed months are non-refundable.',
          ],
        },
        {
          heading: 'Review and approval',
          body: [
            'Every request is reviewed by the finance office and approved by an authorised administrator. The decision, the reason and the approving account are recorded.',
            'Where the request is rejected, the reason is recorded and communicated to the guardian.',
          ],
        },
        {
          heading: 'Processing',
          body: [
            'Approved refunds are returned to the original payment method where possible, typically within ten working days of approval.',
            'Money is treated as returned only when the payment method confirms it. Uploading a refund request does not by itself change the fee ledger, and the ledger is updated only after the finance office completes the refund.',
          ],
        },
        {
          heading: 'Historical records',
          body: [
            'Refunds are recorded separately from the original payment so the ledger always shows what was invoiced, what was paid, what was refunded and what remains outstanding.',
          ],
        },
      ]}
    />
  );
}