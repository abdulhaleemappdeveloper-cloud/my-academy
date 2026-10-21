import ProsePage from '@/components/site/ProsePage';
import { ACADEMY } from '@/data/academy';

export default function About() {
  return (
    <ProsePage
      eyebrow="About the academy"
      title={`${ACADEMY.brand} at ${ACADEMY.campus}`}
      intro="A neighbourhood academy in Lahore teaching classes 1 to 12 alongside college support and professional certification, with an emphasis on structured revision, measurable progress and clear communication with parents."
      updated="October 2026"
      sections={[
        {
          heading: 'How the academy began',
          body: [
            'The campus opened to serve families in the PCSIR Staff Housing Society and nearby areas of College Road. It began with a single middle-school wing and grew class by class as parents asked for the same teaching approach in higher grades.',
            'Today the campus runs primary, middle, matric, intermediate, college-support and professional programmes from one building, with a shared library, science laboratories and a computer laboratory.',
          ],
        },
        {
          heading: 'Our teaching approach',
          bullets: [
            'Every subject is taught as a defined sequence of chapters and topics, so students always know what comes next.',
            'Each class is split into Section A and Section B. Both follow the same syllabus; Section B carries smaller groups and additional revision time.',
            'Weekly assessments are marked by subject teachers, and written answers are returned with specific feedback.',
            'Parents see attendance, assessment results, teacher feedback and fee status for their own children only.',
          ],
        },
        {
          heading: 'Academic standards',
          body: [
            'Assessment follows a documented grading scheme: percentage marks, letter grades, and a pass mark of 33 per cent per subject. Promotion requires a minimum aggregate and a defined attendance level.',
            'Results are never released directly from the marking desk. Written answers are marked, totals are validated, and results are published only after academic approval. Corrections after publication follow a recorded rechecking process.',
          ],
        },
        {
          heading: 'Safeguarding and privacy',
          body: [
            'Student records, guardian contact details, payment proofs and identity documents are treated as confidential. Documents are stored privately and opened only by authorised staff.',
            'Access follows the role of the account and the relationship between the account and the student. A parent can only open records for a child whose guardian link has been verified by the campus office.',
          ],
        },
        {
          heading: 'Accountability',
          body: [
            `The academy is owned by ${ACADEMY.owner}. This platform was created as a separate project by ${ACADEMY.developer}.`,
            'Administrative actions — admissions decisions, section transfers, payment verification, result publication and permission changes — are recorded with the account, time and reason so the academy can review its own decisions.',
          ],
        },
      ]}
    />
  );
}