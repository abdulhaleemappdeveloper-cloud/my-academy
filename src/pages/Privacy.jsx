import ProsePage from '@/components/site/ProsePage';

export default function Privacy() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Privacy policy"
      intro="This policy explains what information the academy collects, why it is collected, who may see it and how long it is kept."
      updated="October 2026"
      sections={[
        {
          heading: 'Information we collect',
          bullets: [
            'Student information: name, date of birth, photograph, class and section, previous school, attendance, assessment marks and certificates.',
            'Guardian information: name, relationship, contact number, email address and, where required for transport, address.',
            'Staff information: employment details, qualifications, contact details and assigned responsibilities.',
            'Financial information: invoices, payment references, verified amounts and receipts. Wallet PINs, banking passwords and one-time codes are never collected or stored.',
          ],
        },
        {
          heading: 'Why we collect it',
          body: [
            'Information is collected to run the academy: to enrol and teach students, to record attendance and assessment, to publish results to the correct people, to raise and verify fees, and to communicate with guardians about their own children.',
            'We collect the minimum needed for those purposes. Optional fields such as medical notes are only requested when they support a student’s safety at the campus.',
          ],
        },
        {
          heading: 'Who can see it',
          bullets: [
            'Students see only their own records.',
            'Guardians see only children whose guardian link has been verified by the campus office.',
            'Teachers see only the classes and subjects assigned to them.',
            'Finance staff see fee records; website editors and teachers do not.',
            'Administrators see the records required by their permitted role, and ownership-level settings remain restricted to the owner.',
          ],
        },
        {
          heading: 'Protecting private documents',
          body: [
            'Identity papers, result cards, medical records and payment proofs are stored privately and opened through short-lived authorised links rather than permanent public addresses.',
            'Uploaded files are checked for type and size, and file names are sanitised. Sensitive documents are never used as public website media.',
          ],
        },
        {
          heading: 'Retention',
          bullets: [
            'Academic records are retained permanently so transcripts and report cards can be reissued.',
            'Financial records are retained for seven years.',
            'Attendance records are retained for five years.',
            'Audit records are retained for two years.',
            'Support tickets are retained for two years after resolution.',
          ],
        },
        {
          heading: 'Your choices',
          body: [
            'You may ask the campus office to correct inaccurate information, to see the records held about you or your child, or to withdraw a consent you previously gave for optional activities or media publication.',
            'Requests that affect official academic or financial history are handled through a recorded correction process rather than edited directly.',
          ],
        },
      ]}
    />
  );
}