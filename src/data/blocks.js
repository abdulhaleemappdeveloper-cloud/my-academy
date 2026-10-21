/**
 * Reusable page-builder block library.
 *
 * Every block type the editor can place on a page is defined here with its
 * category, the shape used to render it, the form fields shown in the editor and
 * the collection it reads when the block is data-driven.
 */

export const BLOCK_CATEGORIES = [
  { id: 'structure', label: 'Layout and structure' },
  { id: 'text', label: 'Text and content' },
  { id: 'media', label: 'Images and media' },
  { id: 'navigation', label: 'Navigation and actions' },
  { id: 'education', label: 'Educational content' },
  { id: 'trust', label: 'Trust and engagement' },
  { id: 'finance', label: 'Finance and information' },
  { id: 'advanced', label: 'Advanced blocks' },
];

/** Field sets per shape, so every block gets a consistent editor form. */
const FIELDS = {
  heading: [
    { key: 'text', label: 'Heading text', type: 'text' },
    { key: 'eyebrow', label: 'Small label above', type: 'text' },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center'] },
  ],
  text: [
    { key: 'eyebrow', label: 'Small label above', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'text', label: 'Body text', type: 'textarea' },
  ],
  list: [
    { key: 'eyebrow', label: 'Small label above', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'items', label: 'Items (one per line)', type: 'textarea' },
  ],
  cards: [
    { key: 'eyebrow', label: 'Small label above', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'source', label: 'Data source', type: 'text' },
    { key: 'limit', label: 'Maximum items', type: 'number' },
  ],
  media: [
    { key: 'heading', label: 'Caption heading', type: 'text' },
    { key: 'url', label: 'Media URL', type: 'text' },
    { key: 'alt', label: 'Alternative text', type: 'text' },
  ],
  layout: [
    { key: 'heading', label: 'Section heading', type: 'text' },
    { key: 'text', label: 'Section text', type: 'textarea' },
    { key: 'columns', label: 'Columns', type: 'select', options: ['1', '2', '3', '4'] },
  ],
  stats: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'items', label: 'Label = value per line', type: 'textarea' },
  ],
  table: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'rows', label: 'Rows (comma separated per line)', type: 'textarea' },
  ],
  quote: [
    { key: 'text', label: 'Quote', type: 'textarea' },
    { key: 'author', label: 'Attributed to', type: 'text' },
  ],
  faq: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'items', label: 'Question = answer per line', type: 'textarea' },
  ],
  timeline: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'items', label: 'Step = description per line', type: 'textarea' },
  ],
  cta: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'text', label: 'Supporting text', type: 'textarea' },
    { key: 'buttonLabel', label: 'Button label', type: 'text' },
    { key: 'buttonPath', label: 'Button link', type: 'text' },
  ],
  banner: [
    { key: 'heading', label: 'Banner text', type: 'text' },
    { key: 'buttonLabel', label: 'Button label', type: 'text' },
    { key: 'buttonPath', label: 'Button link', type: 'text' },
  ],
  links: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'items', label: 'Label = path per line', type: 'textarea' },
  ],
  contact: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'text', label: 'Supporting text', type: 'textarea' },
  ],
  form: [
    { key: 'heading', label: 'Form heading', type: 'text' },
    { key: 'text', label: 'Instructions', type: 'textarea' },
    { key: 'successMessage', label: 'Confirmation message', type: 'text' },
  ],
  calendar: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'limit', label: 'Number of entries', type: 'number' },
  ],
  embed: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'url', label: 'Embed URL', type: 'text' },
  ],
  spacer: [{ key: 'size', label: 'Spacing', type: 'select', options: ['small', 'medium', 'large'] }],
};

const DEFAULTS = {
  heading: { text: 'Section heading', align: 'left' },
  text: { heading: 'Section heading', text: 'Add the content for this section in the page builder.' },
  list: { heading: 'Key points', items: 'First point\nSecond point\nThird point' },
  cards: { heading: 'Featured content', limit: 3 },
  media: { heading: 'Image caption', alt: 'Descriptive alternative text' },
  layout: { heading: 'Section', columns: '2' },
  stats: { heading: 'Key numbers', items: 'Students=1240\nTeachers=68\nCourses=120' },
  table: { heading: 'Comparison', rows: 'Feature, Academy, Other centres\nSmall groups, Yes, No' },
  quote: { text: 'Add a quotation here.', author: 'Name, class' },
  faq: { heading: 'Frequently asked questions', items: 'Question one=Answer one\nQuestion two=Answer two' },
  timeline: { heading: 'How it works', items: 'Step one=What happens first\nStep two=What happens next' },
  cta: { heading: 'Ready to apply?', text: 'Submit an admission application online.', buttonLabel: 'Apply now', buttonPath: '/admissions/apply' },
  banner: { heading: 'Admissions for session 2026 are open.', buttonLabel: 'Apply now', buttonPath: '/admissions/apply' },
  links: { heading: 'Useful links', items: 'Notes=/notes\nPast papers=/past-papers' },
  contact: { heading: 'Contact the campus office' },
  form: { heading: 'Send us a message', successMessage: 'Thank you — the office will reply within one working day.' },
  calendar: { heading: 'Upcoming events', limit: 4 },
  embed: { heading: 'Embedded content' },
  spacer: { size: 'medium' },
};

const slug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** [label, category, shape, data source] */
const DEFS = [
  ['One column layout', 'structure', 'layout'],
  ['Two column layout', 'structure', 'layout'],
  ['Three column layout', 'structure', 'layout'],
  ['Four column grid', 'structure', 'layout'],
  ['Split layout', 'structure', 'layout'],
  ['Container', 'structure', 'layout'],
  ['Spacer', 'structure', 'spacer'],
  ['Divider', 'structure', 'spacer'],
  ['Tabs', 'structure', 'faq'],
  ['Accordion', 'structure', 'faq'],
  ['Anchor navigation', 'structure', 'links'],
  ['Section wrapper', 'structure', 'layout'],

  ['Heading', 'text', 'heading'],
  ['Rich text content', 'text', 'text'],
  ['Paragraph', 'text', 'text'],
  ['Bullet list', 'text', 'list'],
  ['Numbered list', 'text', 'list'],
  ['Quote', 'text', 'quote'],
  ['Highlighted information', 'text', 'text'],
  ['Callout', 'text', 'text'],
  ['Statistics counter', 'text', 'stats'],
  ['Timeline', 'text', 'timeline'],
  ['Step-by-step instructions', 'text', 'timeline'],
  ['Table', 'text', 'table'],
  ['Comparison table', 'text', 'table'],
  ['Formatted code or text', 'text', 'text'],

  ['Single image', 'media', 'media'],
  ['Image gallery', 'media', 'media', 'images'],
  ['Image carousel', 'media', 'media', 'images'],
  ['Video embed', 'media', 'media'],
  ['Approved uploaded video', 'media', 'media'],
  ['Audio player', 'media', 'media'],
  ['Document preview', 'media', 'media'],
  ['Downloadable file', 'media', 'media'],
  ['Image with caption', 'media', 'media'],
  ['Before and after image', 'media', 'media'],

  ['Primary call to action', 'navigation', 'cta'],
  ['Button group', 'navigation', 'cta'],
  ['Internal link list', 'navigation', 'links'],
  ['Breadcrumbs', 'navigation', 'links'],
  ['Card navigation', 'navigation', 'links'],
  ['Social links', 'navigation', 'links'],
  ['Contact details', 'navigation', 'contact'],
  ['WhatsApp contact link', 'navigation', 'contact'],
  ['Search box', 'navigation', 'form'],
  ['Newsletter form', 'navigation', 'form'],

  ['Course cards', 'education', 'cards', 'courses'],
  ['Featured courses', 'education', 'cards', 'courses'],
  ['Course categories', 'education', 'cards', 'subjects'],
  ['Lesson list', 'education', 'cards', 'lessons'],
  ['Chapter list', 'education', 'cards', 'chapters'],
  ['Topic list', 'education', 'cards', 'topics'],
  ['Subject list', 'education', 'cards', 'subjects'],
  ['Class list', 'education', 'cards', 'classes'],
  ['Learning path', 'education', 'cards', 'learningPaths'],
  ['Notes list', 'education', 'cards', 'notes'],
  ['Downloadable notes', 'education', 'cards', 'notes'],
  ['Past-paper list', 'education', 'cards', 'papers'],
  ['Solved-paper list', 'education', 'cards', 'papers'],
  ['Resource library', 'education', 'cards', 'media'],
  ['Teacher profile cards', 'education', 'cards', 'teachers'],
  ['Student success stories', 'education', 'cards', 'awards'],
  ['Quiz introduction', 'education', 'text'],
  ['Upcoming examinations', 'education', 'cards', 'exams'],
  ['Study tips', 'education', 'list'],
  ['Syllabus progress', 'education', 'stats'],
  ['Learning objectives', 'education', 'list'],
  ['Flashcard preview', 'education', 'cards', 'flashcards'],

  ['Testimonials', 'trust', 'quote'],
  ['Ratings summary', 'trust', 'stats'],
  ['FAQ section', 'trust', 'faq'],
  ['Announcement banner', 'trust', 'banner'],
  ['Event list', 'trust', 'cards', 'events'],
  ['Calendar preview', 'trust', 'calendar'],
  ['Team profiles', 'trust', 'cards', 'teachers'],
  ['Contact form', 'trust', 'form'],
  ['Feedback form', 'trust', 'form'],
  ['Support information', 'trust', 'contact'],

  ['Fee cards', 'finance', 'stats'],
  ['Scholarship information', 'finance', 'text'],
  ['Payment instructions', 'finance', 'table'],
  ['Feature comparison', 'finance', 'table'],
  ['Key metrics', 'finance', 'stats'],
  ['Notice board', 'finance', 'cards', 'announcements'],
  ['Office hours', 'finance', 'contact'],
  ['Location information', 'finance', 'contact'],
  ['Map embed', 'finance', 'embed'],
  ['Policy links', 'finance', 'links'],

  ['Related content', 'advanced', 'cards'],
  ['Related courses', 'advanced', 'cards', 'courses'],
  ['Related notes', 'advanced', 'cards', 'notes'],
  ['Dynamic content list', 'advanced', 'cards'],
  ['Custom approved HTML block', 'advanced', 'text'],
  ['Approved integration embed', 'advanced', 'embed'],
  ['Conditional visibility block', 'advanced', 'layout'],
  ['Role-restricted content block', 'advanced', 'layout'],
  ['Reusable saved section template', 'advanced', 'layout'],
  ['Custom form embed', 'advanced', 'form'],
  ['Recently published resources', 'advanced', 'cards', 'notes'],
  ['Custom data-driven widget', 'advanced', 'stats'],
];

export const BLOCKS = DEFS.map(([label, category, shape, source], index) => ({
  id: slug(label),
  label,
  category,
  shape,
  source: source || null,
  fields: FIELDS[shape] || FIELDS.text,
  defaults: DEFAULTS[shape] || {},
  order: index,
}));

export const findBlock = (type) => BLOCKS.find((block) => block.id === type);

export const blocksByCategory = (category) => BLOCKS.filter((block) => block.category === category);

export const newBlock = (type) => {
  const definition = findBlock(type);
  if (!definition) return null;
  return {
    id: `${type}-${Date.now().toString(36)}${Math.floor(Math.random() * 900 + 100)}`,
    type,
    visible: true,
    props: { ...definition.defaults },
  };
};