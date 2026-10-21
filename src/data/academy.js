/**
 * Academy identity and public-facing demo content.
 * This module is the single source of truth for the academy's public data.
 * It is intentionally shaped like an API response so a real backend can replace
 * these exports later without changing the screens that consume them.
 */

export const ACADEMY = {
  brand: 'Tips Academy',
  campus: 'Al Mursusb Campus',
  owner: 'Muhammad Aamir Sohail',
  developer: 'Abdul Haleem',
  country: 'Pakistan',
  city: 'Lahore',
  address: '104-A Block-B PCSIR Staff Housing Society, College Road Lahore',
  email: 'tipsalmursusb006@gmail.com',
  phone: '03200601936',
  whatsapp: '03200601936',
  language: 'English',
  currency: 'PKR',
  category: 'Education',
  tagline: 'Structured learning from primary to professional level.',
  hours: 'Monday – Saturday, 8:00 am – 6:00 pm',
};

export const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const formatPKR = (value) =>
  `PKR ${Number(value || 0).toLocaleString('en-PK')}`;

export const STATS = [
  { label: 'Students enrolled', value: '1,240+' },
  { label: 'Qualified teachers', value: '68' },
  { label: 'Courses and programs', value: '120+' },
  { label: 'Board pass rate', value: '96%' },
];

export const LEVELS = [
  { name: 'Primary', range: 'Class 1 – 5', icon: 'Blocks', desc: 'Foundations in language, numeracy and curiosity-led learning.' },
  { name: 'Middle', range: 'Class 6 – 8', icon: 'BookOpen', desc: 'Concept building with regular assessments and guided practice.' },
  { name: 'Matric', range: 'Class 9 – 10', icon: 'FlaskConical', desc: 'Board-focused preparation with past papers and mock exams.' },
  { name: 'Intermediate', range: 'Class 11 – 12', icon: 'GraduationCap', desc: 'Pre-medical, pre-engineering and commerce streams.' },
  { name: 'College', range: 'Undergraduate support', icon: 'Building2', desc: 'Subject tutoring and semester exam preparation.' },
  { name: 'Professional', range: 'Certifications', icon: 'Briefcase', desc: 'Skill courses for accounting, computing and languages.' },
];

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Urdu', 'Islamiat', 'Computer Science', 'Accounting', 'Economics',
];

export const CLASSES = [
  { id: 'c-1', name: 'Class 5', level: 'Primary', sections: ['A', 'B'], students: 62, teacher: 'Sadia Rehman', subjects: ['Mathematics', 'English', 'Urdu', 'Islamiat'] },
  { id: 'c-7', name: 'Class 7', level: 'Middle', sections: ['A', 'B'], students: 74, teacher: 'Naveed Anjum', subjects: ['Mathematics', 'Science', 'English', 'Urdu'] },
  { id: 'c-9', name: 'Class 9', level: 'Matric', sections: ['A', 'B'], students: 88, teacher: 'Ayesha Siddiqui', subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'] },
  { id: 'c-10', name: 'Class 10', level: 'Matric', sections: ['A', 'B'], students: 91, teacher: 'Imran Bashir', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'] },
  { id: 'c-11', name: 'Class 11', level: 'Intermediate', sections: ['A', 'B'], students: 56, teacher: 'Hina Malik', subjects: ['Physics', 'Chemistry', 'Biology', 'English'] },
  { id: 'c-12', name: 'Class 12', level: 'Intermediate', sections: ['A', 'B'], students: 49, teacher: 'Bilal Ahmed', subjects: ['Physics', 'Mathematics', 'Economics', 'Accounting'] },
];

export const COURSES = [
  {
    id: 'math-9', title: 'Mathematics — Class 9', subject: 'Mathematics', level: 'Matric', classLabel: 'Class 9 · Section A & B',
    teacher: 'Ayesha Siddiqui', lessons: 42, chapters: 9, duration: '36 weeks', rating: 4.8, students: 88, fee: 12000,
    image: img('1546410531-bb4caa6b424d'), badge: 'Board focused',
    summary: 'Complete Class 9 mathematics with worked examples, weekly practice and full past-paper coverage.',
    outcomes: ['Solve algebraic and geometric problems with confidence', 'Attempt board-style questions under exam timing', 'Track weekly mastery of each chapter'],
    tags: ['Algebra', 'Geometry', 'Statistics'],
  },
  {
    id: 'phy-10', title: 'Physics — Class 10', subject: 'Physics', level: 'Matric', classLabel: 'Class 10 · Section A & B',
    teacher: 'Imran Bashir', lessons: 38, chapters: 8, duration: '32 weeks', rating: 4.7, students: 91, fee: 13000,
    image: img('1532094349884-543bc11b234d'), badge: 'Most enrolled',
    summary: 'Concept-first physics with experiment demonstrations, numerical drills and revision tests.',
    outcomes: ['Explain core physical laws with real examples', 'Solve numerical problems accurately', 'Complete practical write-ups'],
    tags: ['Mechanics', 'Electricity', 'Magnetism'],
  },
  {
    id: 'chem-11', title: 'Chemistry — Class 11', subject: 'Chemistry', level: 'Intermediate', classLabel: 'Class 11 · Pre-medical',
    teacher: 'Hina Malik', lessons: 36, chapters: 11, duration: '34 weeks', rating: 4.9, students: 56, fee: 15000,
    image: img('1554479231-51eda8a8a9d7'), badge: 'Intermediate',
    summary: 'Organic and inorganic chemistry with laboratory practice and structured revision notes.',
    outcomes: ['Balance and interpret chemical equations', 'Describe laboratory procedures safely', 'Prepare for board and entry-test questions'],
    tags: ['Organic', 'Inorganic', 'Lab work'],
  },
  {
    id: 'bio-12', title: 'Biology — Class 12', subject: 'Biology', level: 'Intermediate', classLabel: 'Class 12 · Pre-medical',
    teacher: 'Bilal Ahmed', lessons: 34, chapters: 10, duration: '32 weeks', rating: 4.8, students: 49, fee: 15000,
    image: img('1579154204601-01588f351e67'), badge: 'Intermediate',
    summary: 'Advanced biology covering genetics, evolution and human physiology with diagram practice.',
    outcomes: ['Draw and label biological diagrams accurately', 'Explain physiological processes', 'Answer structured and extended questions'],
    tags: ['Genetics', 'Physiology', 'Diagrams'],
  },
  {
    id: 'eng-7', title: 'English Language — Class 7', subject: 'English', level: 'Middle', classLabel: 'Class 7 · Section A & B',
    teacher: 'Naveed Anjum', lessons: 30, chapters: 7, duration: '28 weeks', rating: 4.6, students: 74, fee: 9000,
    image: img('1503676260728-1c00da094a0b'), badge: 'Foundation',
    summary: 'Grammar, comprehension and creative writing with weekly speaking practice.',
    outcomes: ['Write clear, well-structured paragraphs', 'Improve reading comprehension', 'Speak with confidence in class'],
    tags: ['Grammar', 'Writing', 'Comprehension'],
  },
  {
    id: 'cs-10', title: 'Computer Science — Class 10', subject: 'Computer Science', level: 'Matric', classLabel: 'Class 10 · Section A & B',
    teacher: 'Usman Tariq', lessons: 28, chapters: 6, duration: '26 weeks', rating: 4.7, students: 63, fee: 11000,
    image: img('1517180102446-f3ece451e9d8'), badge: 'Practical',
    summary: 'Programming basics, problem solving and computer fundamentals with lab sessions.',
    outcomes: ['Write simple programs and algorithms', 'Understand hardware and software basics', 'Complete practical projects'],
    tags: ['Programming', 'Algorithms', 'Lab'],
  },
  {
    id: 'urd-5', title: 'Urdu — Class 5', subject: 'Urdu', level: 'Primary', classLabel: 'Class 5 · Section A & B',
    teacher: 'Sadia Rehman', lessons: 24, chapters: 6, duration: '24 weeks', rating: 4.5, students: 62, fee: 7000,
    image: img('1456513080510-7bf3a84b82f8'), badge: 'Primary',
    summary: 'Reading fluency, handwriting and comprehension for early learners.',
    outcomes: ['Read fluently with correct pronunciation', 'Write neat, accurate answers', 'Build vocabulary progressively'],
    tags: ['Reading', 'Writing', 'Grammar'],
  },
  {
    id: 'acc-cert', title: 'Accounting Essentials — Certificate', subject: 'Accounting', level: 'Professional', classLabel: 'Open to all levels',
    teacher: 'Farah Naz', lessons: 20, chapters: 5, duration: '12 weeks', rating: 4.9, students: 34, fee: 18000,
    image: img('1554224155-6726b3ff858f'), badge: 'Certificate',
    summary: 'Practical bookkeeping, ledgers and financial statements for working professionals.',
    outcomes: ['Maintain ledgers and journals', 'Prepare trial balance and final accounts', 'Use spreadsheets for reporting'],
    tags: ['Bookkeeping', 'Ledgers', 'Reporting'],
  },
];

export const NOTES = [
  { id: 'n-1', title: 'Algebra: Quadratic Equations (Solved Set)', subject: 'Mathematics', classLabel: 'Class 9', chapter: 'Ch 2 · Quadratic Equations', type: 'Solved notes', pages: 14, downloads: 412, author: 'Ayesha Siddiqui', updated: '2026-09-28', summary: 'Step-by-step solutions to 40 past-paper quadratic questions with method notes.' },
  { id: 'n-2', title: 'Physics: Work, Power and Energy', subject: 'Physics', classLabel: 'Class 10', chapter: 'Ch 5 · Work and Energy', type: 'PDF notes', pages: 18, downloads: 366, author: 'Imran Bashir', updated: '2026-09-21', summary: 'Definitions, derivations and numerical practice for the work-energy chapter.' },
  { id: 'n-3', title: 'Chemistry: Periodic Table Trends', subject: 'Chemistry', classLabel: 'Class 11', chapter: 'Ch 3 · Periodic Table', type: 'Revision notes', pages: 11, downloads: 289, author: 'Hina Malik', updated: '2026-09-18', summary: 'Group-wise trends, comparison tables and quick-recall summary sheets.' },
  { id: 'n-4', title: 'Biology: Human Digestive System', subject: 'Biology', classLabel: 'Class 12', chapter: 'Ch 6 · Nutrition', type: 'Diagram notes', pages: 9, downloads: 254, author: 'Bilal Ahmed', updated: '2026-09-12', summary: 'Labelled diagrams with function notes for every organ in the digestive tract.' },
  { id: 'n-5', title: 'English: Essay Writing Framework', subject: 'English', classLabel: 'Class 7', chapter: 'Writing skills', type: 'Worksheet', pages: 6, downloads: 198, author: 'Naveed Anjum', updated: '2026-09-09', summary: 'Essay structure, linking words and three model essays with teacher comments.' },
  { id: 'n-6', title: 'Computer Science: Flowcharts and Algorithms', subject: 'Computer Science', classLabel: 'Class 10', chapter: 'Ch 1 · Problem Solving', type: 'Practice set', pages: 12, downloads: 176, author: 'Usman Tariq', updated: '2026-09-04', summary: 'Worked flowchart examples plus 15 practice problems with answer key.' },
  { id: 'n-7', title: 'Islamiat: Seerat-un-Nabi — Key Points', subject: 'Islamiat', classLabel: 'Class 10', chapter: 'Ch 4 · Seerat', type: 'Revision notes', pages: 8, downloads: 231, author: 'Sadia Rehman', updated: '2026-08-30', summary: 'Chronology, key events and structured answer guidance.' },
  { id: 'n-8', title: 'Economics: Demand and Supply Basics', subject: 'Economics', classLabel: 'Class 12', chapter: 'Ch 2 · Market Forces', type: 'PDF notes', pages: 15, downloads: 143, author: 'Farah Naz', updated: '2026-08-26', summary: 'Curves, shifts and exam-ready explanations with graph practice.' },
];

export const PAPERS = [
  { id: 'p-1', title: 'Mathematics — Annual Paper 2025', classLabel: 'Class 10', subject: 'Mathematics', year: 2025, type: 'Past paper', marks: 75, pages: 4, downloads: 520 },
  { id: 'p-2', title: 'Physics — Annual Paper 2025 (Solved)', classLabel: 'Class 10', subject: 'Physics', year: 2025, type: 'Solved paper', marks: 75, pages: 9, downloads: 468 },
  { id: 'p-3', title: 'Chemistry — Annual Paper 2024', classLabel: 'Class 11', subject: 'Chemistry', year: 2024, type: 'Past paper', marks: 85, pages: 5, downloads: 342 },
  { id: 'p-4', title: 'Biology — Annual Paper 2024 (Solved)', classLabel: 'Class 12', subject: 'Biology', year: 2024, type: 'Solved paper', marks: 85, pages: 11, downloads: 316 },
  { id: 'p-5', title: 'English — Model Paper 2026', classLabel: 'Class 9', subject: 'English', year: 2026, type: 'Sample paper', marks: 75, pages: 4, downloads: 288 },
  { id: 'p-6', title: 'Computer Science — Annual Paper 2025', classLabel: 'Class 10', subject: 'Computer Science', year: 2025, type: 'Past paper', marks: 75, pages: 4, downloads: 205 },
  { id: 'p-7', title: 'Urdu — Model Paper 2026', classLabel: 'Class 5', subject: 'Urdu', year: 2026, type: 'Sample paper', marks: 50, pages: 3, downloads: 174 },
  { id: 'p-8', title: 'Accounting — Practice Paper 2026', classLabel: 'Certificate', subject: 'Accounting', year: 2026, type: 'Sample paper', marks: 60, pages: 6, downloads: 96 },
];

export const EXAM_PREP = [
  { id: 'e-1', title: 'Board exam revision plan — 8 weeks', subject: 'All subjects', classLabel: 'Class 10', steps: ['Week 1–2: chapter-wise notes', 'Week 3–4: past papers', 'Week 5–6: timed mock exams', 'Week 7–8: weak-topic revision'] },
  { id: 'e-2', title: 'Entry test foundation plan', subject: 'Physics, Chemistry, Biology', classLabel: 'Class 12', steps: ['Concept recap from notes', 'MCQ practice sets', 'Weekly timed test', 'Error-log review'] },
];

export const TEACHERS = [
  { id: 't-1', name: 'Ayesha Siddiqui', role: 'Head of Mathematics', subject: 'Mathematics', qualification: 'MSc Mathematics, Punjab University', experience: '12 years', classes: 'Class 9 – 10', image: img('1573496359142-b8d87734a5a2', 600), bio: 'Ayesha leads the mathematics department and is known for breaking difficult problems into simple, repeatable steps.' },
  { id: 't-2', name: 'Imran Bashir', role: 'Senior Physics Teacher', subject: 'Physics', qualification: 'MPhil Physics, GCU Lahore', experience: '15 years', classes: 'Class 10 – 12', image: img('1560250097-0b93528c311a', 600), bio: 'Imran combines classroom demonstrations with structured numerical practice for board and entry-test preparation.' },
  { id: 't-3', name: 'Hina Malik', role: 'Chemistry Teacher', subject: 'Chemistry', qualification: 'MSc Chemistry, UET Lahore', experience: '9 years', classes: 'Class 11 – 12', image: img('1594744803329-e58b31de8bf5', 600), bio: 'Hina runs the campus laboratory sessions and prepares practical write-ups with her students.' },
  { id: 't-4', name: 'Bilal Ahmed', role: 'Biology Teacher', subject: 'Biology', qualification: 'MBBS, King Edward Medical University', experience: '7 years', classes: 'Class 11 – 12', image: img('1612349317150-e413f6a5b16d', 600), bio: 'Bilal teaches human physiology and genetics with a strong focus on diagram accuracy.' },
  { id: 't-5', name: 'Naveed Anjum', role: 'English Language Teacher', subject: 'English', qualification: 'MA English Literature, GCU Lahore', experience: '11 years', classes: 'Class 6 – 9', image: img('1600486913747-55e5470d6f40', 600), bio: 'Naveed builds writing confidence through weekly composition practice and reading circles.' },
  { id: 't-6', name: 'Sadia Rehman', role: 'Primary Wing Coordinator', subject: 'Urdu & Islamiat', qualification: 'MEd, Punjab University', experience: '14 years', classes: 'Class 1 – 5', image: img('1580489944761-15a19d654956', 600), bio: 'Sadia coordinates the primary wing and focuses on reading fluency and handwriting.' },
  { id: 't-7', name: 'Usman Tariq', role: 'Computer Science Teacher', subject: 'Computer Science', qualification: 'BS Computer Science, FAST NUCES', experience: '6 years', classes: 'Class 9 – 12', image: img('1519085360753-af0119f7cbe7', 600), bio: 'Usman teaches programming fundamentals and runs the campus computer laboratory.' },
  { id: 't-8', name: 'Farah Naz', role: 'Commerce & Accounting', subject: 'Accounting', qualification: 'ACCA (Affiliate)', experience: '8 years', classes: 'Professional courses', image: img('1544005313-94ddf0286df2', 600), bio: 'Farah delivers the accounting certificate programme for working professionals.' },
];

export const ANNOUNCEMENTS = [
  { id: 'a-1', title: 'Admissions open for session 2026', date: '2026-10-15', category: 'Admissions', pinned: true, body: 'Applications are open for classes 1 to 12. Submit the online admission form; the admissions office reviews applications within three working days.' },
  { id: 'a-2', title: 'First term examinations timetable released', date: '2026-10-11', category: 'Examinations', pinned: true, body: 'The first term examination timetable for classes 6 to 12 is now available in the student portal. Please check subject dates and reporting times.' },
  { id: 'a-3', title: 'Parent–teacher meeting — Saturday 25 October', date: '2026-10-08', category: 'Meetings', pinned: false, body: 'All parents are invited to the campus for the term review meeting. Booking slots are available through the parent portal.' },
  { id: 'a-4', title: 'Section reassessment window now open', date: '2026-10-04', category: 'Academics', pinned: false, body: 'Students in Section B may be considered for reassessment after the term review. Allocation remains at the discretion of the academic committee.' },
  { id: 'a-5', title: 'Winter uniform guidance', date: '2026-09-29', category: 'Campus', pinned: false, body: 'Winter uniform is required from 1 November. The campus store has stock available for collection during school hours.' },
];

export const EVENTS = [
  { id: 'ev-1', title: 'Annual Science Exhibition', date: '2026-11-07', time: '9:00 am – 1:00 pm', venue: 'Main Hall', category: 'Academic', desc: 'Class 8–12 project exhibition judged by visiting faculty.' },
  { id: 'ev-2', title: 'Parent–Teacher Meeting (Classes 6–12)', date: '2026-10-25', time: '8:30 am – 1:00 pm', venue: 'Classrooms, Block B', category: 'Meeting', desc: 'Term review meetings with subject teachers. Slot booking required.' },
  { id: 'ev-3', title: 'Inter-house Sports Day', date: '2026-12-12', time: '8:00 am – 4:00 pm', venue: 'Campus Ground', category: 'Sports', desc: 'Athletics, cricket and team events across all houses.' },
  { id: 'ev-4', title: 'First Term Examinations Begin', date: '2026-11-16', time: '9:00 am', venue: 'Examination Halls', category: 'Examinations', desc: 'Examinations run for two weeks. Timetable available in the portal.' },
  { id: 'ev-5', title: 'Career Guidance Session', date: '2026-12-04', time: '11:00 am – 1:00 pm', venue: 'Library', category: 'Guidance', desc: 'Guidance for Class 10–12 students on subject and stream selection.' },
  { id: 'ev-6', title: 'Winter Break Begins', date: '2026-12-22', time: 'All day', venue: '—', category: 'Holiday', desc: 'Campus closed for winter break. Classes resume on 5 January.' },
];

export const STORIES = [
  { id: 's-1', name: 'Areeba Khan', program: 'Class 10 — Matric', year: '2025', quote: 'The weekly past-paper practice changed how I attempt questions. I walked into my board exams knowing the paper format.', image: img('1494790108377-be9c29b29330', 600) },
  { id: 's-2', name: 'Hamza Rafiq', program: 'Class 12 — Pre-engineering', year: '2025', quote: 'Teachers marked my written answers line by line and told me exactly where I lost marks. That feedback was the difference.', image: img('1500648767791-00dcc994a43e', 600) },
  { id: 's-3', name: 'Maryam Yousaf', program: 'Class 9 — Section B', year: '2026', quote: 'Being in Section B meant extra support, not a label. With the revision classes I moved into Section A this term.', image: img('1534528741775-53994a69daeb', 600) },
  { id: 's-4', name: 'Zain Abbas', program: 'Accounting Certificate', year: '2026', quote: 'I could keep my job and study in the evening batch. The ledgers and final accounts practice was directly useful at work.', image: img('1507003211169-0a1dd7228f2d', 600) },
];

export const FAQS = [
  { q: 'How do I apply for admission?', a: 'Submit the online admission application from the Admissions page. The office issues an application reference number and reviews the form, then contacts you for document verification and an interview if required.' },
  { q: 'What documents are required with the application?', a: 'A recent photograph, the student\'s birth certificate or B-form, the previous school leaving certificate and the last result card. Additional documents may be requested for some classes.' },
  { q: 'What is the difference between Section A and Section B?', a: 'Both sections follow the same curriculum. Section B is an academic-support arrangement with smaller groups and additional revision time. Students can be reassessed and moved between sections.' },
  { q: 'How are fees paid?', a: 'Fees can be paid by bank transfer, JazzCash or Easypaisa. After paying, upload the payment proof in the portal. The fee is marked paid only after the finance office verifies the transaction.' },
  { q: 'Can I download notes without a portal account?', a: 'Public notes and past papers are available on the website. Chapter-wise notes, worksheets and solved papers for enrolled students are available after signing in to the student portal.' },
  { q: 'How are results published?', a: 'Written answers are marked by subject teachers, totals are validated, and results are released only after academic approval. Students and guardians can then view results and report cards in their portals.' },
  { q: 'Do you offer scholarships?', a: 'Merit and need-based scholarships are available for eligible students. Details and the application process are published on the Scholarships page each session.' },
  { q: 'What are the campus timings?', a: 'The campus is open Monday to Saturday, 8:00 am to 6:00 pm. Morning and evening batches are available for most classes.' },
];

export const ACHIEVEMENTS = [
  { label: 'Board distinctions 2025', value: '48' },
  { label: 'A+ grades in matric', value: '126' },
  { label: 'Entry-test qualifiers', value: '73' },
  { label: 'Merit scholarships awarded', value: '21' },
];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Academics', path: '/classes' },
  { label: 'Courses', path: '/courses' },
  { label: 'Notes', path: '/notes' },
  { label: 'Past Papers', path: '/past-papers' },
  { label: 'Teachers', path: '/teachers' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
];