import ProsePage from '@/components/site/ProsePage';
import { CONSENTS } from '@/data/records';

export default function Consent() {
  return (
    <ProsePage
      eyebrow="Privacy"
      title="Consent information"
      intro="Which consents the academy asks for, what each one covers and how a consent can be withdrawn."
      updated="October 2026"
      sections={[
        {
          heading: 'Consent is asked for specifically',
          body: [
            'The academy does not treat silence as consent. Each consent is recorded separately against the guardian account, with the version of the wording shown, the time it was given and the person who gave it.',
          ],
        },
        {
          heading: 'How to withdraw',
          body: [
            'Guardians can withdraw an optional consent at any time from the parent portal or by writing to the campus office. Withdrawing an optional consent does not affect enrolment, and the withdrawal is recorded with its date.',
          ],
        },
        {
          heading: 'What is never optional',
          bullets: [
            'Recording attendance, marks and fee obligations, which are required to run the academic programme.',
            'Retaining academic and financial records for the periods described in the privacy policy.',
            'Sharing information where the academy is legally required to do so.',
          ],
        },
      ]}
    >
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Consents in use</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          The figures below show current consent coverage for the active session. Optional consents are counted only
          where a guardian has responded.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                <th className="py-2.5 pr-4">Purpose</th>
                <th className="py-2.5 pr-4">Audience</th>
                <th className="py-2.5 pr-4">Version</th>
                <th className="py-2.5 pr-4 text-right">Given</th>
                <th className="py-2.5 pr-4 text-right">Pending</th>
                <th className="py-2.5 text-right">Withdrawn</th>
              </tr>
            </thead>
            <tbody>
              {CONSENTS.map((item) => (
                <tr key={item.id} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 font-medium text-foreground">{item.purpose}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.audience}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.version}</td>
                  <td className="py-3 pr-4 text-right text-foreground">{item.given}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{item.pending}</td>
                  <td className="py-3 text-right text-muted-foreground">{item.withdrawn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ProsePage>
  );
}