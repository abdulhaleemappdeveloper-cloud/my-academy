import ProsePage from '@/components/site/ProsePage';

export default function Terms() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Terms and conditions"
      intro="These terms apply to the use of the academy website, portals and campus services."
      updated="October 2026"
      sections={[
        {
          heading: 'Accounts',
          bullets: [
            'Portal accounts are issued by the campus office. Public self-registration cannot create a student, guardian, teacher or administrator account.',
            'You are responsible for keeping your password confidential and for activity performed through your account.',
            'Accounts are issued to a named person. Sharing an account, or attempting to open records belonging to another student, is a breach of these terms.',
          ],
        },
        {
          heading: 'Acceptable use',
          bullets: [
            'Learning material published by the academy is for the personal study of enrolled students and their guardians.',
            'Republishing, reselling or redistributing notes, worksheets and examination papers outside the academy is not permitted.',
            'Uploaded content must not include material that is unlawful, harmful or unrelated to study.',
          ],
        },
        {
          heading: 'Assessments and results',
          body: [
            'Marks are recorded by subject teachers and validated before publication. Published results are changed only through the recorded rechecking process.',
            'Where a quiz or examination has a time limit or attempt limit, late submissions may be refused. Technical failures should be reported to the office immediately so the attempt can be reviewed.',
          ],
        },
        {
          heading: 'Fees',
          body: [
            'Fees are payable by the due date shown on the invoice. An uploaded payment proof does not by itself settle a fee — the payment is recorded only after verification by the finance office.',
            'Refunds are governed by the refund policy and require approval.',
          ],
        },
        {
          heading: 'Availability',
          body: [
            'The academy aims to keep the website and portals available during school hours, but planned maintenance, network failures or third-party service interruptions may interrupt access.',
            'Where a service such as SMS, WhatsApp messaging or online meeting links has not been configured, the portal shows it as unavailable rather than pretending it works.',
          ],
        },
        {
          heading: 'Changes',
          body: [
            'These terms may be updated. The version in force at any time is the one published on this page, and material changes are announced to guardians through the portal.',
          ],
        },
      ]}
    />
  );
}