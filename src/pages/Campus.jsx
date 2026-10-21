import { Building2, Clock, FlaskConical, GraduationCap, Library, MonitorSmartphone, Users } from 'lucide-react';
import ProsePage from '@/components/site/ProsePage';
import { ACADEMY, img } from '@/data/academy';

const FACILITIES = [
  { icon: Building2, name: 'Three teaching blocks', text: 'Primary wing, middle wing and the secondary block with separate stair access.' },
  { icon: FlaskConical, name: 'Science laboratories', text: 'Physics, chemistry and biology laboratories used for practical sessions and board practicals.' },
  { icon: MonitorSmartphone, name: 'Computer laboratory', text: 'Twenty workstations used for computer science classes and programming practice.' },
  { icon: Library, name: 'Library and reading room', text: 'Textbook sets, reference books and a quiet reading room open through the school day.' },
  { icon: Users, name: 'Small-group rooms', text: 'Rooms reserved for Section B support classes and one-to-one revision sessions.' },
  { icon: GraduationCap, name: 'Examination halls', text: 'Two halls used for term examinations and mock board papers under timed conditions.' },
];

export default function Campus() {
  return (
    <ProsePage
      eyebrow="Campus information"
      title="Al Mursusb Campus, Lahore"
      intro="Everything families need before visiting: location, timings, facilities, transport and campus rules."
      updated="October 2026"
      sections={[
        {
          heading: 'Location and timings',
          body: [
            `${ACADEMY.address}. The campus is a short walk from College Road and is served by public transport on the College Road route.`,
            `The office is open ${ACADEMY.hours}. Morning classes run from 8:00 am and evening batches for college and professional courses start at 4:30 pm.`,
          ],
        },
        {
          heading: 'Getting to the campus',
          bullets: [
            'Families travelling by car can use the side street entrance for drop-off between 7:45 am and 8:15 am.',
            'Campus transport covers PCSIR Society, Township, Johar Town and Model Town with fixed stops and timings.',
            'Parents collecting students during school hours should report to the front desk first.',
          ],
        },
        {
          heading: 'Campus rules',
          bullets: [
            'Visitors sign in at the front desk and are escorted to their meeting.',
            'Students may only be collected by the guardian or an authorised pickup contact recorded in the student profile.',
            'Photography inside classrooms is not permitted during teaching hours.',
            'Mobile phones are not used during lessons or examinations unless a documented accommodation applies.',
          ],
        },
      ]}
    >
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Facilities</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FACILITIES.map((facility) => (
            <div key={facility.name} className="rounded-xl border border-border bg-background p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint text-primary">
                <facility.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-heading text-sm font-bold tracking-tight text-foreground">{facility.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{facility.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">Around the campus</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { id: '1562774053-701939374585', alt: 'Campus building entrance' },
            { id: '1507842217343-583bb7270b66', alt: 'Library and reading room' },
            { id: '1532094349884-543bc11b234d', alt: 'Science laboratory session' },
            { id: '1571260899304-425eee4c7efc', alt: 'Students during a class activity' },
          ].map((shot) => (
            <img
              key={shot.id}
              src={img(shot.id, 800)}
              alt={shot.alt}
              loading="lazy"
              className="h-44 w-full rounded-xl border border-border object-cover"
            />
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> Campus tours are arranged by appointment through the office.
        </p>
      </section>
    </ProsePage>
  );
}