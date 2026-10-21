import ProsePage from '@/components/site/ProsePage';

export default function Accessibility() {
  return (
    <ProsePage
      eyebrow="Inclusion"
      title="Accessibility"
      intro="What the academy does to keep its website, portals and documents usable for everyone, and how to ask for additional support."
      updated="October 2026"
      sections={[
        {
          heading: 'What we provide',
          bullets: [
            'Keyboard-operable navigation, forms and dialogs across the website and portals.',
            'Visible focus indicators on links, buttons and form fields.',
            'Text contrast that meets the usual readability guidance in both light and dark themes.',
            'Labels on every form field, and clear error messages that explain what to correct.',
            'Alternative text for meaningful images used in teaching material.',
            'Support for reduced-motion preferences, so animations are minimised when the device requests it.',
          ],
        },
        {
          heading: 'Reading and learning support',
          bullets: [
            'Notes and papers are published as documents that can be enlarged or printed.',
            'Teaching material can be read aloud by the device’s own reading tools.',
            'Students who need extended time, a separate room or rest breaks during an examination can be granted an examination accommodation by the academic office.',
          ],
        },
        {
          heading: 'Requesting support',
          body: [
            'If any part of the website or portal is difficult to use, contact the campus office and describe the task you were trying to complete. The office records the request and follows it up through the support process.',
            'Requests for examination accommodations should be submitted before the examination period so that arrangements can be made in time.',
          ],
        },
        {
          heading: 'Known limitations',
          bullets: [
            'Uploaded documents supplied by teachers are published as they are; automatically generated audio versions are not yet available.',
            'Live captions are not provided for online sessions until a suitable provider is configured.',
            'Some historical documents are scanned images without machine-readable text.',
          ],
        },
      ]}
    />
  );
}