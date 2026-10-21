import { Link } from 'react-router-dom';
import { BookOpen, Calculator, FlaskConical, Globe, Languages, Laptop, Landmark, Leaf, PenTool, ScrollText } from 'lucide-react';
import DirectoryPage from '@/components/site/DirectoryPage';
import { ACADEMY, CLASSES, COURSES, SUBJECTS } from '@/data/academy';

const ICONS = {
  Mathematics: Calculator,
  Physics: FlaskConical,
  Chemistry: FlaskConical,
  Biology: Leaf,
  English: PenTool,
  Urdu: Languages,
  Islamiat: ScrollText,
  'Computer Science': Laptop,
  Accounting: Landmark,
  Economics: Globe,
};

const DESCRIPTIONS = {
  Mathematics: 'Algebra, geometry, trigonometry and statistics with weekly problem sets.',
  Physics: 'Mechanics, electricity, waves and practical work with numerical practice.',
  Chemistry: 'Physical, organic and inorganic chemistry with laboratory sessions.',
  Biology: 'Cell biology, physiology, genetics and diagram practice.',
  English: 'Grammar, comprehension, composition and spoken practice.',
  Urdu: 'Reading fluency, grammar and composition for all levels.',
  Islamiat: 'Core content with structured answer practice for board questions.',
  'Computer Science': 'Programming fundamentals, problem solving and computer theory.',
  Accounting: 'Bookkeeping, ledgers, final accounts and reporting.',
  Economics: 'Micro and macro concepts with graph interpretation.',
};

export default function Subjects() {
  const items = SUBJECTS.map((name, index) => ({
    id: name,
    name,
    level: index < 5 ? 'Primary to Intermediate' : 'Middle to Intermediate',
    classes: CLASSES.filter((cls) => cls.subjects.includes(name)).map((cls) => cls.name).join(', ') || 'Selected classes',
    courses: COURSES.filter((course) => course.subject === name).length,
    description: DESCRIPTIONS[name] || 'Taught with chapter-wise notes and assessments.',
  }));

  return (
    <DirectoryPage
      eyebrow="Academics"
      title="Subjects offered"
      description={`${ACADEMY.brand} teaches core school subjects across primary, middle, matric and intermediate levels, with chapter-wise notes, past papers and term assessments for each.`}
      items={items}
      searchKeys={['name', 'classes']}
      filters={[{ key: 'level', label: 'Level', options: ['Primary to Intermediate', 'Middle to Intermediate'] }]}
      renderCard={(subject) => {
        const Icon = ICONS[subject.name] || BookOpen;
        return (
          <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-brand/5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tint text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <h2 className="mt-4 font-heading text-base font-bold tracking-tight text-foreground">{subject.name}</h2>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-gold">{subject.level}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{subject.description}</p>
            <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
              <div className="flex justify-between gap-3"><dt>Taught in</dt><dd className="text-right font-medium text-foreground">{subject.classes}</dd></div>
              <div className="flex justify-between gap-3"><dt>Courses</dt><dd className="font-semibold text-foreground">{subject.courses || '—'}</dd></div>
            </dl>
          </article>
        );
      }}
    >
      <div className="mt-8 rounded-2xl border border-border bg-cream p-5">
        <p className="text-sm text-muted-foreground">
          Looking for the chapter breakdown, notes and past papers for a subject?{' '}
          <Link to="/notes" className="font-semibold text-primary hover:underline">Open the notes library</Link> or{' '}
          <Link to="/courses" className="font-semibold text-primary hover:underline">browse courses</Link>.
        </p>
      </div>
    </DirectoryPage>
  );
}