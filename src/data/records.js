/**
 * Academy records.
 *
 * These collections are generated locally so every screen can be built, navigated
 * and tested before a backend exists. Each collection is shaped exactly like the
 * API response the screen will receive later, so connecting the real backend means
 * replacing this module with fetch calls — no screen changes required.
 */

const FIRST = [
  'Areeba', 'Hamza', 'Maryam', 'Zain', 'Fatima', 'Bilal', 'Hira', 'Usman', 'Ayesha', 'Saad',
  'Noor', 'Ahmed', 'Iqra', 'Hassan', 'Sana', 'Danish', 'Amna', 'Talha', 'Mahnoor', 'Faizan',
  'Laiba', 'Ali', 'Zoya', 'Rehan', 'Kiran', 'Umair', 'Anaya', 'Shahzad', 'Rida', 'Junaid',
];
const LAST = [
  'Khan', 'Rafiq', 'Yousaf', 'Abbas', 'Malik', 'Butt', 'Chaudhry', 'Sheikh', 'Qureshi', 'Baig',
  'Tariq', 'Iqbal', 'Nawaz', 'Hashmi', 'Siddiqui', 'Rehman', 'Anjum', 'Naz', 'Farooq', 'Aslam',
];

const name = (i) => `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`;
const email = (n, domain = 'tipsacademy.edu.pk') =>
  `${n.toLowerCase().replace(/[^a-z]+/g, '.')}@${domain}`;
const pick = (list, i) => list[i % list.length];
const day = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const photo = (i) => `https://i.pravatar.cc/160?img=${(i % 60) + 1}`;

export const CLASS_META = [
  { id: 'c1', name: 'Class 1', level: 'Primary', teacher: 'Sadia Rehman' },
  { id: 'c5', name: 'Class 5', level: 'Primary', teacher: 'Sadia Rehman' },
  { id: 'c7', name: 'Class 7', level: 'Middle', teacher: 'Naveed Anjum' },
  { id: 'c9', name: 'Class 9', level: 'Matric', teacher: 'Ayesha Siddiqui' },
  { id: 'c10', name: 'Class 10', level: 'Matric', teacher: 'Imran Bashir' },
  { id: 'c11', name: 'Class 11', level: 'Intermediate', teacher: 'Hina Malik' },
  { id: 'c12', name: 'Class 12', level: 'Intermediate', teacher: 'Bilal Ahmed' },
];

export const SUBJECT_LIST = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Urdu', 'Islamiat', 'Computer Science', 'Accounting', 'Economics',
];

export const ACADEMIC_YEARS = [
  { id: 'ay-2025', label: '2024 – 2025', start: '2024-08-01', end: '2025-06-30', terms: '2 terms', status: 'Completed · Locked', students: 1120, locked: true },
  { id: 'ay-2026', label: '2025 – 2026', start: '2025-08-01', end: '2026-06-30', terms: '2 terms', status: 'Active', students: 1240, locked: false },
  { id: 'ay-2027', label: '2026 – 2027', start: '2026-08-01', end: '2027-06-30', terms: '2 terms', status: 'Planning', students: 0, locked: false },
];

export const TERMS = [
  { id: 'tm-1', year: '2025 – 2026', name: 'First term', start: '2025-08-01', end: '2025-12-20', exams: '16 Nov – 28 Nov', status: 'Active' },
  { id: 'tm-2', year: '2025 – 2026', name: 'Second term', start: '2026-01-05', end: '2026-06-15', exams: '20 Apr – 2 May', status: 'Scheduled' },
];

export const CLASSES = CLASS_META.map((c, i) => ({
  id: c.id,
  name: c.name,
  level: c.level,
  classTeacher: c.teacher,
  sections: ['A', 'B'],
  capacity: 45 + (i % 3) * 5,
  enrolled: 38 + (i * 3) % 18,
  subjects: SUBJECT_LIST.slice(0, 4 + (i % 3)),
  academicYear: '2025 – 2026',
}));

export const SECTIONS = CLASSES.flatMap((c) =>
  ['A', 'B'].map((s) => ({
    id: `${c.id}-${s}`,
    classId: c.id,
    className: c.name,
    name: s,
    capacity: s === 'A' ? c.capacity : c.capacity - 5,
    enrolled: s === 'A' ? Math.round(c.enrolled * 0.55) : c.enrolled - Math.round(c.enrolled * 0.55),
    classTeacher: c.classTeacher,
    placement: s === 'A' ? 'Core group' : 'Academic support group',
    placementNote: s === 'A' ? 'Standard pace with extension work.' : 'Same syllabus with smaller groups and extra revision time.',
  }))
);

export const STUDENT_STATUSES = ['Applicant', 'Admitted', 'Active', 'On leave', 'Suspended', 'Promoted', 'Graduated', 'Withdrawn', 'Archived'];

export const STUDENTS = Array.from({ length: 64 }, (_, i) => {
  const cls = CLASSES[i % CLASSES.length];
  const nm = name(i + 3);
  const status = i % 17 === 0 ? 'Suspended' : i % 13 === 0 ? 'On leave' : i < 6 ? 'Applicant' : i % 29 === 0 ? 'Withdrawn' : 'Active';
  return {
    id: `st-${1000 + i}`,
    code: `TA-2026-${String(i + 1).padStart(3, '0')}`,
    rollNumber: `${cls.name.replace('Class ', '')}-${cls.sections[i % 2]}-${String((i % 40) + 1).padStart(2, '0')}`,
    admissionNumber: `ADM-${2026000 + i}`,
    name: nm,
    photo: photo(i),
    gender: i % 2 === 0 ? 'Female' : 'Male',
    dob: `20${String(10 + (i % 8)).padStart(2, '0')}-0${(i % 9) + 1}-1${i % 9}`,
    className: cls.name,
    classId: cls.id,
    section: cls.sections[i % 2],
    academicYear: '2025 – 2026',
    status,
    admissionDate: day(-400 + i * 5),
    guardianName: `${LAST[(i * 5) % LAST.length]} ${LAST[(i * 3) % LAST.length]}`,
    guardianPhone: `0300${String(1000000 + i * 7919).slice(0, 7)}`,
    guardianRelation: i % 3 === 0 ? 'Mother' : 'Father',
    phone: `0321${String(2000000 + i * 6151).slice(0, 7)}`,
    email: email(nm),
    address: `House ${10 + i}, ${pick(['PCSIR Society', 'College Road', 'Township', 'Johar Town', 'Gulberg'], i)}, Lahore`,
    previousSchool: i % 4 === 0 ? 'City Public School, Lahore' : '—',
    attendancePct: 74 + (i % 24),
    feeBalance: i % 5 === 0 ? 0 : ((i % 4) + 1) * 4500,
    scholarship: i % 7 === 0 ? 'Merit 25%' : i % 11 === 0 ? 'Need-based 40%' : 'None',
    sectionHistory: [
      { term: '2025 – 2026 First term', section: cls.sections[i % 2], reason: 'Initial placement after admission assessment.' },
    ],
    tags: [cls.level, i % 7 === 0 ? 'Scholarship' : 'Regular'],
  };
});

export const GUARDIANS = Array.from({ length: 22 }, (_, i) => {
  const childA = STUDENTS[(i * 3) % STUDENTS.length];
  const childB = STUDENTS[(i * 3 + 1) % STUDENTS.length];
  return {
    id: `gd-${200 + i}`,
    name: `${LAST[(i * 7) % LAST.length]} ${LAST[(i * 2) % LAST.length]}`,
    relation: i % 3 === 0 ? 'Mother' : 'Father',
    phone: `0301${String(3000000 + i * 8123).slice(0, 7)}`,
    whatsapp: i % 4 === 0 ? 'Yes' : 'No',
    email: email(`guardian${i + 1}`, 'gmail.com'),
    occupation: pick(['Engineer', 'Teacher', 'Shopkeeper', 'Bank officer', 'Doctor', 'Government service'], i),
    linkedChildren: [childA.name, ...(i % 3 === 0 ? [childB.name] : [])],
    status: i % 9 === 0 ? 'Pending verification' : i % 15 === 0 ? 'Link revoked' : 'Verified',
    lastContact: day(-i * 3),
  };
});

export const TEACHERS = Array.from({ length: 18 }, (_, i) => {
  const subject = pick(SUBJECT_LIST, i);
  const nm = name(i * 5 + 1);
  return {
    id: `tc-${300 + i}`,
    code: `TCH-${String(i + 1).padStart(3, '0')}`,
    name: nm,
    photo: photo(i + 20),
    subject,
    secondarySubject: pick(SUBJECT_LIST, i + 3),
    qualification: pick(['MSc', 'MPhil', 'MA', 'BS', 'ACCA'], i) + ', ' + pick(['Punjab University', 'GCU Lahore', 'UET Lahore', 'FAST NUCES', 'KEMU'], i),
    experience: `${5 + (i % 12)} years`,
    email: email(nm),
    phone: `0333${String(4000000 + i * 3571).slice(0, 7)}`,
    joined: day(-1400 + i * 40),
    status: i % 11 === 0 ? 'On leave' : 'Active',
    classes: [pick(CLASSES, i).name, pick(CLASSES, i + 3).name],
    sections: ['A', 'B'],
    periodsPerWeek: 18 + (i % 8),
    pendingMarking: (i * 7) % 40,
    classTeacherOf: i % 4 === 0 ? pick(CLASSES, i).name : '—',
  };
});

export const STAFF = Array.from({ length: 12 }, (_, i) => ({
  id: `sf-${400 + i}`,
  name: name(i * 9 + 2),
  role: pick(['Registrar', 'Accounts officer', 'Front desk', 'Lab assistant', 'Librarian', 'IT support', 'Admissions officer', 'Finance officer', 'Support agent', 'Counsellor', 'Security supervisor', 'Maintenance lead'], i),
  department: pick(['Administration', 'Finance', 'Academics', 'Operations', 'Support'], i),
  phone: `0345${String(5000000 + i * 4451).slice(0, 7)}`,
  email: email(`staff${i + 1}`),
  joined: day(-900 + i * 60),
  status: i % 9 === 0 ? 'On leave' : 'Active',
  contractExpiry: day(120 + i * 12),
}));

export const ROLES = [
  { id: 'owner', name: 'Owner', users: 1, description: 'Ownership-level settings, privileged accounts and security configuration.', risk: 'Critical' },
  { id: 'super-admin', name: 'Super administrator', users: 2, description: 'Full administrative access except ownership-only controls.', risk: 'Critical' },
  { id: 'academic-admin', name: 'Academic administrator', users: 3, description: 'Academic structure, examinations, results approval and promotions.', risk: 'High' },
  { id: 'admissions', name: 'Admissions officer', users: 2, description: 'Admission reviews, document checks and seat allocation.', risk: 'High' },
  { id: 'finance', name: 'Finance officer', users: 2, description: 'Fee ledgers, payment verification, refunds and financial reports.', risk: 'Critical' },
  { id: 'exams', name: 'Examination controller', users: 1, description: 'Examination scheduling, papers, moderation and result publication.', risk: 'High' },
  { id: 'editor', name: 'Website editor', users: 2, description: 'Website pages, media, menus and SEO. No academic or financial access.', risk: 'Medium' },
  { id: 'teacher', name: 'Teacher', users: 18, description: 'Assigned classes, attendance, assessments and student progress.', risk: 'Medium' },
  { id: 'student', name: 'Student', users: 1180, description: 'Own learning materials, assessments, attendance and results.', risk: 'Low' },
  { id: 'parent', name: 'Parent', users: 640, description: 'Verified linked children only.', risk: 'Medium' },
  { id: 'staff', name: 'Staff', users: 12, description: 'Operational records assigned to them.', risk: 'Medium' },
  { id: 'auditor', name: 'Auditor', users: 1, description: 'Read-only access to audit logs and compliance records.', risk: 'High' },
];

export const PERMISSIONS = [
  { module: 'Students', owner: 'Manage', admin: 'Manage', academic: 'Manage', finance: '—', editor: '—', teacher: 'Assigned only', student: 'Own record', parent: 'Linked children' },
  { module: 'Attendance', owner: 'Manage', admin: 'Manage', academic: 'Manage', finance: '—', editor: '—', teacher: 'Mark assigned', student: 'View own', parent: 'View child' },
  { module: 'Examinations', owner: 'Manage', admin: 'Manage', academic: 'Approve', finance: '—', editor: '—', teacher: 'Create for assigned', student: 'Attempt', parent: 'View published' },
  { module: 'Results', owner: 'Manage', admin: 'Approve & publish', academic: 'Approve & publish', finance: '—', editor: '—', teacher: 'Enter marks', student: 'View published', parent: 'View published' },
  { module: 'Fees', owner: 'Manage', admin: 'Manage', academic: '—', finance: 'Verify & adjust', editor: '—', teacher: '—', student: 'View own', parent: 'View & submit proof' },
  { module: 'Website', owner: 'Manage', admin: 'Manage', academic: '—', finance: '—', editor: 'Manage', teacher: '—', student: '—', parent: '—' },
  { module: 'Security settings', owner: 'Owner only', admin: 'View', academic: '—', finance: '—', editor: '—', teacher: '—', student: '—', parent: '—' },
  { module: 'Audit logs', owner: 'Manage', admin: 'View', academic: 'View', finance: 'View finance only', editor: '—', teacher: '—', student: '—', parent: '—' },
];

export const SUBJECTS = SUBJECT_LIST.map((s, i) => ({
  id: `sb-${i + 1}`,
  name: s,
  levels: [pick(['Primary', 'Middle', 'Matric', 'Intermediate', 'Professional'], i), pick(['Matric', 'Intermediate'], i)],
  classes: [pick(CLASSES, i).name, pick(CLASSES, i + 2).name],
  teachers: [pick(TEACHERS, i).name, pick(TEACHERS, i + 2).name],
  chapters: 6 + (i % 6),
  topics: 24 + i * 3,
  materials: 12 + i * 4,
  status: i === 9 ? 'Draft' : 'Published',
}));

export const CHAPTERS = SUBJECTS.flatMap((s, si) =>
  Array.from({ length: 4 }, (_, ci) => ({
    id: `ch-${si}-${ci}`,
    subject: s.name,
    subjectId: s.id,
    className: pick(CLASSES, si + ci).name,
    order: ci + 1,
    title: `${s.name} — Chapter ${ci + 1}`,
    topics: 3 + (ci % 3),
    objectives: 2 + (ci % 2),
    materials: 4 + ci,
    status: ci === 3 && si % 4 === 3 ? 'Draft' : 'Published',
    covered: ci < 3,
  }))
);

export const TOPICS = CHAPTERS.slice(0, 20).flatMap((ch, i) =>
  Array.from({ length: ch.topics }, (_, ti) => ({
    id: `tp-${ch.id}-${ti}`,
    chapterId: ch.id,
    chapter: ch.title,
    subject: ch.subject,
    className: ch.className,
    order: ti + 1,
    title: `${ch.subject} topic ${ch.order}.${ti + 1}`,
    objectives: ti + 2,
    materials: 2 + ((i + ti) % 4),
    assessments: (i + ti) % 3,
    status: 'Published',
  }))
);

export const COURSES = [
  { id: 'co-1', title: 'Mathematics — Class 9', subject: 'Mathematics', className: 'Class 9', teacher: 'Ayesha Siddiqui', lessons: 42, chapters: 9, students: 88, status: 'Published', updated: day(-4) },
  { id: 'co-2', title: 'Physics — Class 10', subject: 'Physics', className: 'Class 10', teacher: 'Imran Bashir', lessons: 38, chapters: 8, students: 91, status: 'Published', updated: day(-9) },
  { id: 'co-3', title: 'Chemistry — Class 11', subject: 'Chemistry', className: 'Class 11', teacher: 'Hina Malik', lessons: 36, chapters: 11, students: 56, status: 'Under review', updated: day(-2) },
  { id: 'co-4', title: 'Biology — Class 12', subject: 'Biology', className: 'Class 12', teacher: 'Bilal Ahmed', lessons: 34, chapters: 10, students: 49, status: 'Published', updated: day(-14) },
  { id: 'co-5', title: 'English Language — Class 7', subject: 'English', className: 'Class 7', teacher: 'Naveed Anjum', lessons: 30, chapters: 7, students: 74, status: 'Published', updated: day(-6) },
  { id: 'co-6', title: 'Computer Science — Class 10', subject: 'Computer Science', className: 'Class 10', teacher: 'Usman Tariq', lessons: 28, chapters: 6, students: 63, status: 'Draft', updated: day(-1) },
];

export const LESSONS = Array.from({ length: 28 }, (_, i) => {
  const course = COURSES[i % COURSES.length];
  return {
    id: `ls-${500 + i}`,
    courseId: course.id,
    course: course.title,
    className: course.className,
    subject: course.subject,
    chapter: `Chapter ${(i % 5) + 1}`,
    order: (i % 5) + 1,
    title: `${course.subject}: lesson ${(i % 5) + 1}`,
    type: pick(['Text lesson', 'PDF notes', 'Video lesson', 'Audio lesson', 'Practice set', 'Worksheet'], i),
    duration: `${15 + (i % 5) * 5} min`,
    status: i % 9 === 0 ? 'Draft' : i % 7 === 0 ? 'In review' : 'Published',
    author: course.teacher,
    updated: day(-i),
  };
});

export const CONTENT_STATUSES = ['Draft', 'In review', 'Approved', 'Published', 'Archived'];

export const NOTES = Array.from({ length: 26 }, (_, i) => ({
  id: `nt-${600 + i}`,
  title: pick([
    'Quadratic equations — solved set', 'Work, power and energy notes', 'Periodic table trends',
    'Human digestive system diagrams', 'Essay writing framework', 'Flowcharts and algorithms',
    'Seerat-un-Nabi key points', 'Demand and supply basics', 'Chemical bonding summary',
    'Trigonometry revision sheet', 'Cell structure diagrams', 'Urdu grammar rules',
  ], i) + ` (${i + 1})`,
  subject: pick(SUBJECT_LIST, i),
  className: pick(CLASSES, i).name,
  chapter: `Chapter ${(i % 6) + 1}`,
  topic: `Topic ${(i % 4) + 1}`,
  type: pick(['Text notes', 'PDF notes', 'Revision notes', 'Worksheet', 'Practice questions', 'Chapter summary', 'Solved examples', 'Flashcards'], i),
  pages: 4 + (i % 12),
  downloads: 60 + i * 11,
  author: pick(TEACHERS, i).name,
  status: i % 11 === 0 ? 'Draft' : i % 7 === 0 ? 'In review' : 'Published',
  visibility: i % 13 === 0 ? 'Teachers only' : 'Students and staff',
  updated: day(-i * 2),
  summary: 'Chapter-aligned notes with worked examples, revision points and practice questions for the current term.',
}));

export const PAPERS = Array.from({ length: 22 }, (_, i) => ({
  id: `pp-${700 + i}`,
  title: `${pick(SUBJECT_LIST, i)} — ${pick(['Annual paper', 'Model paper', 'Practice paper'], i)} ${2023 + (i % 3)}`,
  subject: pick(SUBJECT_LIST, i),
  className: pick(CLASSES, i).name,
  year: 2023 + (i % 3),
  type: pick(['Past paper', 'Solved paper', 'Sample paper'], i),
  marks: pick([50, 60, 75, 85, 100], i),
  pages: 3 + (i % 8),
  downloads: 40 + i * 9,
  status: i % 10 === 0 ? 'Draft' : 'Published',
  uploadedBy: pick(TEACHERS, i).name,
  updated: day(-i),
}));

export const QUESTION_TYPES = ['Single MCQs', 'Multiple select', 'True / false', 'Short answer', 'Long answer', 'Fill in the blank', 'Matching', 'Image based'];
export const DIFFICULTY = ['Easy', 'Medium', 'Hard'];

export const QUESTIONS = Array.from({ length: 46 }, (_, i) => ({
  id: `qn-${800 + i}`,
  code: `Q-${pick(SUBJECT_LIST, i).slice(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
  text: pick([
    'Solve for x: 2x² − 5x + 2 = 0.',
    'State Newton\'s second law of motion with one example.',
    'Which group of the periodic table contains the noble gases?',
    'Label the parts of the human digestive system.',
    'Write a short paragraph on the importance of reading.',
    'Draw a flowchart to find the largest of three numbers.',
    'Define demand and explain one factor that shifts the demand curve.',
    'Explain the difference between an atom and an ion.',
  ], i) + ` (variant ${i + 1})`,
  subject: pick(SUBJECT_LIST, i),
  className: pick(CLASSES, i).name,
  chapter: `Chapter ${(i % 6) + 1}`,
  topic: `Topic ${(i % 4) + 1}`,
  type: pick(QUESTION_TYPES, i),
  difficulty: pick(DIFFICULTY, i),
  marks: pick([1, 2, 3, 5, 8], i),
  language: 'English',
  curriculum: 'Punjab Board',
  answer: 'Answer key stored securely and released only after the configured release time.',
  explanation: 'Marking guidance with the expected steps and common mistakes.',
  status: pick(['Approved', 'Approved', 'Approved', 'Draft', 'Under review', 'Archived'], i),
  usage: (i * 3) % 12,
  author: pick(TEACHERS, i).name,
  updated: day(-i),
}));

export const QUIZZES = Array.from({ length: 14 }, (_, i) => ({
  id: `qz-${900 + i}`,
  title: `${pick(SUBJECT_LIST, i)} quiz — ${pick(['chapter test', 'weekly practice', 'revision set'], i)} ${i + 1}`,
  subject: pick(SUBJECT_LIST, i),
  className: pick(CLASSES, i).name,
  section: pick(['A', 'B', 'A & B'], i),
  questions: 8 + (i % 8),
  marks: 10 + (i % 5) * 5,
  timeLimit: `${10 + i} min`,
  attemptsAllowed: 1 + (i % 3),
  generated: i % 3 === 0 ? 'AI generated' : 'Teacher authored',
  status: pick(['Draft', 'Under review', 'Published', 'Closed'], i),
  createdBy: pick(TEACHERS, i).name,
  window: `${day(2 + i)} → ${day(9 + i)}`,
  averageScore: 45 + (i * 3) % 45,
  attempts: 12 + i * 7,
}));

export const EXAMS = Array.from({ length: 16 }, (_, i) => ({
  id: `ex-${1100 + i}`,
  title: `${pick(SUBJECT_LIST, i)} — ${pick(['First term', 'Mid term', 'Final term', 'Monthly test', 'Mock board', 'Practical', 'Oral'], i)}`,
  type: pick(['First term', 'Mid term', 'Final term', 'Monthly test', 'Mock board', 'Practical', 'Oral'], i),
  className: pick(CLASSES, i).name,
  section: pick(['A', 'B', 'A & B'], i),
  subject: pick(SUBJECT_LIST, i),
  date: day(4 + i * 2),
  start: pick(['09:00', '11:00', '13:30'], i),
  end: pick(['10:30', '12:30', '15:00'], i),
  duration: pick(['90 min', '2 hours', '3 hours'], i),
  totalMarks: pick([50, 60, 75, 85, 100], i),
  passing: 33,
  examiner: pick(TEACHERS, i).name,
  approvedBy: i % 5 === 3 ? '—' : 'Academic administrator',
  status: pick(['Draft', 'Teacher review', 'Approved', 'Scheduled', 'Completed', 'Grading', 'Result approval', 'Published'], i),
  candidates: 35 + (i % 40),
  room: pick(['Hall A', 'Hall B', 'Room 12', 'Laboratory 1'], i),
}));

export const RESULTS = Array.from({ length: 34 }, (_, i) => {
  const st = STUDENTS[i % STUDENTS.length];
  const total = pick([50, 75, 85, 100], i);
  const marks = Math.round(total * (0.42 + ((i * 13) % 55) / 100));
  const percent = Math.round((marks / total) * 100);
  return {
    id: `rs-${1200 + i}`,
    exam: pick(EXAMS, i).title,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    section: st.section,
    subject: pick(SUBJECT_LIST, i),
    marks,
    total,
    percent,
    grade: percent >= 80 ? 'A+' : percent >= 70 ? 'A' : percent >= 60 ? 'B' : percent >= 50 ? 'C' : percent >= 33 ? 'E' : 'F',
    status: pick(['Pending marking', 'Awaiting approval', 'Published', 'Recheck requested'], i),
    publishedOn: i % 3 === 0 ? day(-i) : '—',
    marker: pick(TEACHERS, i).name,
    validated: i % 8 !== 0,
  };
});

export const REPORT_CARDS = Array.from({ length: 14 }, (_, i) => {
  const st = STUDENTS[(i * 3) % STUDENTS.length];
  return {
    id: `rc-${1300 + i}`,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    section: st.section,
    term: pick(['First term', 'Second term'], i),
    academicYear: '2025 – 2026',
    subjects: 5 + (i % 3),
    obtained: 320 + i * 11,
    total: 500,
    percent: Math.min(94, 58 + i * 3),
    grade: 'A',
    attendance: st.attendancePct,
    status: pick(['Draft', 'Awaiting approval', 'Approved', 'Published'], i),
    publishedOn: i % 4 === 0 ? day(-i) : '—',
  };
});

export const ATTENDANCE = Array.from({ length: 60 }, (_, i) => {
  const st = STUDENTS[i % STUDENTS.length];
  return {
    id: `at-${1400 + i}`,
    date: day(-(i % 14)),
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    section: st.section,
    subject: pick(['Daily', ...SUBJECT_LIST], i),
    status: pick(['Present', 'Present', 'Present', 'Present', 'Absent', 'Late', 'Excused', 'Leave'], i),
    markedBy: pick(TEACHERS, i).name,
    note: i % 11 === 0 ? 'Bus was late; student reported at 9:20 am.' : '—',
    correction: i % 13 === 0 ? 'Correction requested' : i % 17 === 0 ? 'Corrected & approved' : 'None',
  };
});

export const TIMETABLE = Array.from({ length: 32 }, (_, i) => ({
  id: `tt-${1500 + i}`,
  className: pick(CLASSES, i).name,
  section: pick(['A', 'B'], i),
  day: pick(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], i),
  period: (i % 6) + 1,
  time: pick(['08:00 – 08:45', '08:45 – 09:30', '09:45 – 10:30', '10:30 – 11:15', '11:30 – 12:15', '12:15 – 13:00'], i),
  subject: pick(SUBJECT_LIST, i),
  teacher: pick(TEACHERS, i).name,
  room: pick(['Room 4', 'Room 7', 'Room 12', 'Hall A', 'Laboratory 1'], i),
  conflict: i % 16 === 0 ? 'Teacher double-booked — resolve before publishing' : 'None',
  status: pick(['Draft', 'Published'], i),
}));

export const ASSIGNMENTS = Array.from({ length: 18 }, (_, i) => ({
  id: `as-${1600 + i}`,
  title: `${pick(SUBJECT_LIST, i)} assignment ${i + 1}`,
  subject: pick(SUBJECT_LIST, i),
  className: pick(CLASSES, i).name,
  section: pick(['A', 'B', 'A & B'], i),
  teacher: pick(TEACHERS, i).name,
  assignedOn: day(-12 + i),
  dueOn: day(1 + i),
  marks: pick([10, 15, 20, 25], i),
  submissions: 12 + i * 3,
  expected: 35 + (i % 10),
  lateAllowed: i % 3 === 0 ? 'Allowed with 10% deduction' : 'Not allowed',
  rubric: i % 2 === 0 ? 'Rubric v2' : 'Rubric v1',
  status: pick(['Open', 'Open', 'Closed', 'Marking', 'Published'], i),
}));

export const SUBMISSIONS = Array.from({ length: 26 }, (_, i) => {
  const st = STUDENTS[(i * 5) % STUDENTS.length];
  const asg = pick(ASSIGNMENTS, i);
  return {
    id: `sbm-${1700 + i}`,
    assignmentId: asg.id,
    assignment: asg.title,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    submittedOn: day(-3 + (i % 6)),
    late: i % 7 === 0,
    type: pick(['File upload', 'Written answer', 'File + written'], i),
    marks: i % 4 === 0 ? '—' : 12 + (i % 8),
    outOf: asg.marks,
    status: pick(['Submitted', 'Marked', 'Resubmit requested'], i),
    feedback: i % 4 === 0 ? 'Awaiting marking.' : 'Good structure. Improve the closing paragraph and check units.',
  };
});

export const FEE_STRUCTURES = Array.from({ length: 12 }, (_, i) => ({
  id: `fs-${1800 + i}`,
  academicYear: '2025 – 2026',
  className: pick(CLASSES, i).name,
  category: pick(['Tuition fee', 'Admission fee', 'Examination fee', 'Transport fee', 'Laboratory fee', 'Activity fee'], i),
  amount: pick([6500, 9000, 11000, 13000, 15000, 18000], i),
  installments: pick(['1', '2', '3', 'Monthly'], i),
  dueDay: pick(['5th of month', '10th of month', '15th of month'], i),
  lateFeeRule: '2% of instalment after 10 days (waiver requires finance approval)',
  status: pick(['Active', 'Active', 'Draft', 'Archived'], i),
  version: `v${1 + (i % 3)}`,
  effectiveFrom: day(-90 + i),
}));

export const INVOICES = Array.from({ length: 30 }, (_, i) => {
  const st = STUDENTS[(i * 7) % STUDENTS.length];
  const amount = pick([6500, 9000, 11000, 13000, 15000, 18000], i);
  const discount = st.scholarship === 'Merit 25%' ? Math.round(amount * 0.25) : st.scholarship === 'Need-based 40%' ? Math.round(amount * 0.4) : 0;
  const payable = amount - discount;
  const paid = i % 5 === 0 ? 0 : i % 3 === 0 ? Math.round(payable / 2) : payable;
  const balance = payable - paid;
  return {
    id: `iv-${1900 + i}`,
    number: `INV-2026-${String(i + 1).padStart(4, '0')}`,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    section: st.section,
    category: pick(['Tuition fee', 'Examination fee', 'Transport fee', 'Activity fee'], i),
    amount,
    discount,
    paid,
    balance,
    issuedOn: day(-45 + i),
    dueOn: day(-10 + i),
    status: balance === 0 ? 'Paid' : paid > 0 ? 'Partially paid' : i % 7 === 0 ? 'Overdue' : 'Unpaid',
    installments: pick(['1 of 2', '2 of 2', 'Single payment'], i),
  };
});

export const PAYMENTS = Array.from({ length: 26 }, (_, i) => {
  const inv = pick(INVOICES, i);
  return {
    id: `pm-${2000 + i}`,
    reference: `TRX-${90000 + i * 137}`,
    invoiceId: inv.id,
    invoiceNumber: inv.number,
    studentName: inv.studentName,
    className: inv.className,
    amount: inv.balance === 0 ? inv.paid : pick([3000, 4500, 6500, 9000], i),
    method: pick(['Bank transfer', 'JazzCash', 'Easypaisa', 'Cash at office'], i),
    submittedOn: day(-i),
    proof: i % 9 === 0 ? 'Missing' : 'Uploaded',
    status: pick(['Pending verification', 'Pending verification', 'Approved', 'Rejected', 'Correction requested'], i),
    submittedBy: inv.studentName + ' (guardian)',
    verifiedBy: i % 3 === 0 ? '—' : 'Finance officer',
    reason: i % 5 === 4 ? 'Amount does not match the invoice instalment.' : '—',
  };
});

export const SCHOLARSHIPS = Array.from({ length: 14 }, (_, i) => {
  const st = STUDENTS[(i * 4) % STUDENTS.length];
  return {
    id: `sch-${2100 + i}`,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    type: pick(['Merit', 'Need-based', 'Sports', 'Sibling concession'], i),
    percentage: pick([25, 40, 50, 100], i),
    appliedOn: day(-30 + i),
    status: pick(['Applied', 'Under review', 'Approved', 'Rejected'], i),
    decidedBy: i % 3 === 0 ? '—' : 'Scholarship committee',
    note: pick(['Top three in class assessment.', 'Verified household income documents.', 'State-level athlete.', 'Second sibling enrolled at the campus.'], i),
  };
});

export const REFUNDS = Array.from({ length: 10 }, (_, i) => {
  const pool = INVOICES.filter((x) => x.paid > 0);
  const inv = pick(pool, i);
  return {
    id: `rf-${2200 + i}`,
    requestNumber: `REF-2026-${String(i + 1).padStart(3, '0')}`,
    invoiceNumber: inv.number,
    studentName: inv.studentName,
    amount: Math.round(inv.paid / 2),
    reason: pick(['Class withdrawal after admission.', 'Duplicate payment submitted by guardian.', 'Transport not used after relocation.'], i),
    requestedOn: day(-i * 3),
    status: pick(['Requested', 'Under review', 'Approved', 'Processed', 'Rejected'], i),
    approvedBy: i % 3 === 0 ? '—' : 'Finance officer',
    refundableBalance: inv.paid,
  };
});

export const CERTIFICATES = Array.from({ length: 16 }, (_, i) => {
  const st = STUDENTS[(i * 6) % STUDENTS.length];
  return {
    id: `crt-${2300 + i}`,
    code: `TA-CERT-2026-${String(1400 + i)}`,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    type: pick(['Course completion', 'Academic completion', 'Achievement', 'Participation'], i),
    issuedOn: day(-60 + i * 3),
    status: pick(['Issued', 'Issued', 'Issued', 'Draft', 'Revoked'], i),
    eligibility: i % 5 === 0 ? 'Pending verification' : 'Verified',
    verifications: (i * 3) % 18,
  };
});

export const ANNOUNCEMENTS = Array.from({ length: 18 }, (_, i) => ({
  id: `ann-${2400 + i}`,
  title: pick([
    'Admissions open for session 2026', 'First term examination timetable released',
    'Parent–teacher meeting — Saturday 25 October', 'Section reassessment window now open',
    'Winter uniform guidance', 'Fee submission deadline reminder',
    'Annual science exhibition projects', 'Winter break schedule',
  ], i) + (i > 7 ? ` (${i - 6})` : ''),
  date: day(-i * 2),
  category: pick(['Admissions', 'Examinations', 'Meetings', 'Academics', 'Campus', 'Finance'], i),
  audience: pick(['Everyone', 'Students', 'Teachers', 'Parents', 'Class 9 – 12'], i),
  status: pick(['Published', 'Published', 'Draft', 'Scheduled'], i),
  pinned: i < 3,
  author: pick(['Admin office', 'Academic office', 'Finance office', 'Principal'], i),
  views: 120 + i * 47,
  body: 'The academy office has issued this notice for the information of students, guardians and staff. Please read the details and contact the campus office if you need clarification.',
}));

export const EVENTS = Array.from({ length: 14 }, (_, i) => ({
  id: `evt-${2500 + i}`,
  title: pick(['Annual Science Exhibition', 'Parent–Teacher Meeting', 'Inter-house Sports Day', 'First Term Examinations', 'Career Guidance Session', 'Winter Break Begins', 'Speech Competition', 'Prize Distribution'], i),
  date: day(3 + i * 5),
  time: pick(['09:00 – 13:00', '08:30 – 13:00', '10:00 – 12:00', 'All day'], i),
  venue: pick(['Main Hall', 'Classrooms, Block B', 'Campus Ground', 'Library'], i),
  category: pick(['Academic', 'Meeting', 'Sports', 'Examinations', 'Guidance', 'Holiday'], i),
  audience: pick(['Everyone', 'Students', 'Parents', 'Classes 8 – 12'], i),
  capacity: 40 + i * 15,
  registered: 20 + i * 9,
  status: pick(['Published', 'Published', 'Draft'], i),
  desc: 'Campus event managed by the academic office with attendance recorded for participating students.',
}));

export const TICKETS = Array.from({ length: 16 }, (_, i) => ({
  id: `tkt-${2600 + i}`,
  reference: `TKT-${1040 + i}`,
  subject: pick(['Portal login issue', 'Fee receipt not visible', 'Timetable change request', 'Report card correction', 'Transport route query', 'Assignment upload failed'], i),
  category: pick(['Account', 'Finance', 'Academics', 'Operations', 'Technical'], i),
  raisedBy: pick([...STUDENTS.map((s) => s.name), ...GUARDIANS.map((g) => g.name)], i),
  role: i % 3 === 0 ? 'Parent' : i % 3 === 1 ? 'Student' : 'Teacher',
  priority: pick(['Low', 'Medium', 'High', 'Urgent'], i),
  status: pick(['Open', 'In progress', 'Waiting on user', 'Resolved', 'Closed'], i),
  assignedTo: pick(STAFF, i).name,
  createdOn: day(-i * 2),
  updatedOn: day(-i),
  responseDue: day(1 + (i % 3)),
  sla: i % 6 === 0 ? 'Breached' : 'Within target',
}));

export const NOTIFICATIONS = Array.from({ length: 18 }, (_, i) => ({
  id: `ntf-${2700 + i}`,
  title: pick([
    'Fee payment verified', 'Result published', 'Assignment deadline tomorrow',
    'Attendance alert', 'Admission application received', 'Timetable updated',
    'Support ticket updated', 'Certificate issued',
  ], i),
  category: pick(['Finance', 'Results', 'Assignments', 'Attendance', 'Admissions', 'Academics', 'Support', 'Certificates'], i),
  time: day(-(i % 10)),
  read: i > 5,
  audience: pick(['Student', 'Teacher', 'Parent', 'Admin'], i),
  channel: pick(['In-app', 'Email', 'In-app + Email'], i),
  delivery: pick(['Delivered', 'Delivered', 'Queued', 'Failed'], i),
  link: pick(['/student/fees', '/student/results', '/student/assignments', '/teacher/attendance', '/admin/admissions'], i),
}));

export const MESSAGES = Array.from({ length: 12 }, (_, i) => {
  const st = STUDENTS[(i * 9) % STUDENTS.length];
  return {
    id: `msg-${2800 + i}`,
    from: i % 2 === 0 ? pick(TEACHERS, i).name : `${st.guardianName} (guardian)`,
    to: i % 2 === 0 ? `${st.guardianName} (guardian)` : pick(TEACHERS, i).name,
    about: st.name,
    subject: pick(['Progress in mathematics', 'Attendance this week', 'Assignment extension request', 'Meeting request'], i),
    sent: day(-(i % 8)),
    status: i % 4 === 0 ? 'Unread' : 'Read',
    flagged: i % 9 === 0,
    body: 'Thank you for your message. The subject teacher has reviewed the latest assessment and will share specific next steps during the parent–teacher meeting.',
  };
});

export const AUDIT_LOGS = Array.from({ length: 40 }, (_, i) => ({
  id: `aud-${2900 + i}`,
  actor: pick([...ROLES.map((r) => r.name), ...TEACHERS.map((t) => t.name)], i),
  role: pick(ROLES, i).name,
  action: pick([
    'Approved payment', 'Published results', 'Updated student record', 'Changed section allocation',
    'Created examination', 'Issued certificate', 'Updated website page', 'Revoked session',
    'Approved scholarship', 'Imported student list', 'Changed role permissions', 'Verified document',
  ], i),
  module: pick(['Finance', 'Results', 'Students', 'Academics', 'Examinations', 'Certificates', 'Website', 'Security', 'Admissions', 'System'], i),
  target: pick([...STUDENTS.map((s) => s.code), ...INVOICES.map((v) => v.number), ...EXAMS.map((e) => e.id)], i),
  time: day(-(i % 20)) + ' ' + pick(['09:14', '10:02', '11:37', '13:05', '15:22', '17:41'], i),
  outcome: pick(['Success', 'Success', 'Success', 'Failed', 'Denied'], i),
  reason: pick(['Routine verification', 'Guardian request', 'Academic approval', 'Policy exception', '—'], i),
  requestId: `req-${70000 + i * 31}`,
  before: i % 4 === 0 ? 'status: pending' : '—',
  after: i % 4 === 0 ? 'status: approved' : '—',
}));

export const MEDIA = Array.from({ length: 24 }, (_, i) => ({
  id: `med-${3000 + i}`,
  name: pick(['campus-front.jpg', 'science-exhibition.jpg', 'class9-maths-notes.pdf', 'annual-report-2025.pdf', 'sports-day.mp4', 'principal-message.txt', 'logo-primary.svg', 'lab-safety-poster.pdf'], i),
  type: pick(['Image', 'PDF', 'Video', 'Document'], i),
  size: `${(0.3 + (i % 9) * 0.7).toFixed(1)} MB`,
  folder: pick(['Campus', 'Academics', 'Finance', 'Events', 'Brand'], i),
  uploadedBy: pick([...STAFF.map((s) => s.name), 'Website editor'], i),
  uploadedOn: day(-i * 3),
  usedIn: pick(['Home page hero', 'Admissions page', 'Class 9 notes', 'Events page', 'Unused'], i),
  altText: i % 3 === 0 ? '' : 'Students at the campus during an academic activity',
  visibility: i % 6 === 0 ? 'Private' : 'Public',
  tags: [pick(['campus', 'academics', 'event', 'brand'], i)],
}));

export const SITE_PAGES = [
  { id: 'pg-1', title: 'Home', slug: '/', type: 'Homepage', status: 'Published', updated: day(-3), updatedBy: 'Website editor', sections: 9, seoTitle: 'Tips Academy — Al Mursusb Campus, Lahore', metaDescription: 'Structured learning from primary to professional level with notes, past papers and progress tracking.', views: 8420 },
  { id: 'pg-2', title: 'About the Academy', slug: '/about', type: 'Content page', status: 'Published', updated: day(-12), updatedBy: 'Website editor', sections: 6, seoTitle: 'About Tips Academy', metaDescription: 'About our campus, teaching approach and academic results.', views: 1930 },
  { id: 'pg-3', title: 'Admissions', slug: '/admissions', type: 'Content page', status: 'Published', updated: day(-5), updatedBy: 'Admissions officer', sections: 7, seoTitle: 'Admissions 2026', metaDescription: 'Admission process, requirements and application form.', views: 5120 },
  { id: 'pg-4', title: 'Scholarships', slug: '/scholarships', type: 'Content page', status: 'In review', updated: day(-2), updatedBy: 'Academic office', sections: 4, seoTitle: 'Scholarships', metaDescription: 'Merit and need-based scholarships at Tips Academy.', views: 640 },
  { id: 'pg-5', title: 'Campus Life', slug: '/campus', type: 'Content page', status: 'Draft', updated: day(-1), updatedBy: 'Website editor', sections: 5, seoTitle: '', metaDescription: '', views: 0 },
  { id: 'pg-6', title: 'Summer Programme', slug: '/summer-programme', type: 'Landing page', status: 'Scheduled', updated: day(-8), updatedBy: 'Website editor', sections: 3, seoTitle: 'Summer programme', metaDescription: 'Vacation learning programme for classes 5 to 10.', views: 0, schedule: day(20) },
];

export const NAV_ITEMS = [
  { id: 'nav-1', label: 'Home', path: '/', order: 1, parent: '—', status: 'Published' },
  { id: 'nav-2', label: 'About', path: '/about', order: 2, parent: '—', status: 'Published' },
  { id: 'nav-3', label: 'Academics', path: '/classes', order: 3, parent: '—', status: 'Published' },
  { id: 'nav-4', label: 'Notes', path: '/notes', order: 4, parent: 'Academics', status: 'Published' },
  { id: 'nav-5', label: 'Past papers', path: '/past-papers', order: 5, parent: 'Academics', status: 'Published' },
  { id: 'nav-6', label: 'Admissions', path: '/admissions', order: 6, parent: '—', status: 'Published' },
  { id: 'nav-7', label: 'Events', path: '/events', order: 7, parent: '—', status: 'Published' },
  { id: 'nav-8', label: 'Contact', path: '/contact', order: 8, parent: '—', status: 'Published' },
];

export const EMAIL_TEMPLATES = Array.from({ length: 14 }, (_, i) => ({
  id: `emt-${3100 + i}`,
  name: pick([
    'Admission application received', 'Admission decision', 'Account verification', 'Password recovery',
    'Teacher onboarding', 'Attendance alert', 'Assignment reminder', 'Examination reminder',
    'Result publication', 'Payment verified', 'Receipt', 'Fee reminder', 'Support ticket update', 'Important announcement',
  ], i),
  channel: pick(['Email', 'Email', 'Email + In-app', 'In-app'], i),
  subject: 'Notification from Tips Academy',
  status: pick(['Active', 'Active', 'Draft'], i),
  lastSent: day(-i),
  sent: 40 + i * 23,
  opens: 20 + i * 11,
}));

export const INTEGRATIONS = [
  { id: 'int-1', name: 'Email delivery', purpose: 'Transactional email for admissions, results and receipts', state: 'Connected', lastTest: day(-1), detail: 'Test email delivered successfully.', required: 'Sender domain verified' },
  { id: 'int-2', name: 'SMS gateway', purpose: 'Attendance and fee reminders', state: 'Configuration incomplete', lastTest: '—', detail: 'Provider credentials not supplied yet.', required: 'API key, sender ID, approved template' },
  { id: 'int-3', name: 'WhatsApp messaging', purpose: 'Parent notifications on WhatsApp', state: 'Not configured', lastTest: '—', detail: 'No provider connected.', required: 'Business account, phone number, templates' },
  { id: 'int-4', name: 'Payment — JazzCash', purpose: 'Manual payment instructions and reference checks', state: 'Manual only', lastTest: '—', detail: 'Instructions published; verification is manual by finance staff.', required: 'Merchant account for automated confirmation' },
  { id: 'int-5', name: 'Payment — Easypaisa', purpose: 'Manual payment instructions and reference checks', state: 'Manual only', lastTest: '—', detail: 'Instructions published; verification is manual by finance staff.', required: 'Merchant account for automated confirmation' },
  { id: 'int-6', name: 'Bank transfer', purpose: 'Account details and deposit slip verification', state: 'Connected', lastTest: day(-3), detail: 'Account details configured; slips reviewed manually.', required: '—' },
  { id: 'int-7', name: 'File storage', purpose: 'Notes, documents, media and payment proofs', state: 'Connected', lastTest: day(-1), detail: 'Private storage available for sensitive documents.', required: '—' },
  { id: 'int-8', name: 'Online meetings', purpose: 'Live session links for selected classes', state: 'Not configured', lastTest: '—', detail: 'No meeting provider connected. Links must not be displayed until configured.', required: 'Meeting provider account' },
  { id: 'int-9', name: 'Analytics', purpose: 'Public website traffic reporting', state: 'Connected', lastTest: day(-2), detail: 'Page views are being recorded.', required: '—' },
  { id: 'int-10', name: 'Error monitoring', purpose: 'Frontend and API error reporting', state: 'Connection failed', lastTest: day(-6), detail: 'Last test returned an authorisation error.', required: 'Valid project key' },
  { id: 'int-11', name: 'Cloud database', purpose: 'Primary data store', state: 'Pending backend build', lastTest: '—', detail: 'Front end currently runs on local demo data.', required: 'Backend deployment' },
  { id: 'int-12', name: 'Webhooks', purpose: 'Outbound event notifications', state: 'Disabled', lastTest: '—', detail: 'Endpoint and signing key not configured.', required: 'Endpoint URL, signing secret' },
];

export const AI_PROVIDERS = [
  { id: 'aip-1', name: 'OpenAI', models: 'GPT family', state: 'Config incomplete', lastTest: '—', usage: '—', features: 'Quiz generation, content studio' },
  { id: 'aip-2', name: 'Google Gemini', models: 'Gemini family', state: 'Connected', lastTest: day(-1), usage: '1,240 requests this month', features: 'Quiz generation, search with web context' },
  { id: 'aip-3', name: 'Anthropic Claude', models: 'Claude family', state: 'Not configured', lastTest: '—', usage: '—', features: 'Long-form content review' },
  { id: 'aip-4', name: 'DeepSeek', models: 'DeepSeek family', state: 'Not configured', lastTest: '—', usage: '—', features: 'Cost-efficient drafting' },
  { id: 'aip-5', name: 'xAI Grok', models: 'Grok family', state: 'Not configured', lastTest: '—', usage: '—', features: 'Alternative explanations' },
  { id: 'aip-6', name: 'Mistral', models: 'Mistral family', state: 'Disabled', lastTest: '—', usage: '—', features: 'Draft generation' },
  { id: 'aip-7', name: 'OpenRouter', models: 'Multi-provider routing', state: 'Config incomplete', lastTest: '—', usage: '—', features: 'Fallback routing' },
];

export const PAYMENT_METHODS = [
  { id: 'pym-1', name: 'JazzCash', account: '0320 060 1936', title: 'Tips Academy', instructions: 'Send the exact instalment amount, then upload the transaction ID and screenshot in the portal. Fees are marked paid only after verification.', status: 'Active', enabled: true },
  { id: 'pym-2', name: 'Easypaisa', account: '0320 060 1936', title: 'Tips Academy', instructions: 'Use the student code in the payment note. Upload proof of payment for finance verification.', status: 'Active', enabled: true },
  { id: 'pym-3', name: 'Bank transfer', account: 'PK00 XXXX 0000 0000 0000 0000', title: 'Tips Academy — Al Mursusb Campus', instructions: 'Deposit or online transfer only. Write the student code on the deposit slip and upload it in the portal.', status: 'Active', enabled: true },
];

export const AI_USAGE = Array.from({ length: 10 }, (_, i) => ({
  id: `aau-${3200 + i}`,
  feature: pick(['Quiz generation', 'Question generation', 'Content studio', 'AI tutor', 'Feedback drafting', 'Study plan'], i),
  provider: pick(['Google Gemini', 'OpenAI', 'Anthropic Claude', 'OpenRouter'], i),
  requests: 40 + i * 31,
  estimatedCost: `USD ${(2 + i * 0.75).toFixed(2)}`,
  limit: 'USD 50.00 monthly',
  status: i % 7 === 0 ? 'Near budget limit' : 'Within budget',
}));

export const DATA_QUALITY = [
  { id: 'dqa-1', issue: 'Students without a verified guardian link', entity: 'Students', count: 6, severity: 'High', suggested: 'Send a guardian verification request from the account linking centre.', status: 'Open' },
  { id: 'dqa-2', issue: 'Invoices with no matching payment record', entity: 'Invoices', count: 4, severity: 'High', suggested: 'Review the payment verification queue for these invoices.', status: 'Open' },
  { id: 'dqa-3', issue: 'Attendance rows without a subject', entity: 'Attendance', count: 9, severity: 'Medium', suggested: 'Re-mark the affected sessions or default to daily attendance.', status: 'In review' },
  { id: 'dqa-4', issue: 'Possible duplicate student records', entity: 'Students', count: 2, severity: 'High', suggested: 'Compare names, guardian phone and date of birth before merging.', status: 'Open' },
  { id: 'dqa-5', issue: 'Certificates pending eligibility verification', entity: 'Certificates', count: 5, severity: 'Medium', suggested: 'Confirm attendance and result requirements before issuing.', status: 'Open' },
  { id: 'dqa-6', issue: 'Fee structures without an effective date', entity: 'Fee structures', count: 3, severity: 'Low', suggested: 'Set an effective date so historic invoices stay unchanged.', status: 'Open' },
  { id: 'dqa-7', issue: 'Media files missing alt text', entity: 'Media', count: 12, severity: 'Low', suggested: 'Add descriptive alt text for accessibility.', status: 'Open' },
  { id: 'dqa-8', issue: 'Website pages missing meta description', entity: 'Pages', count: 2, severity: 'Low', suggested: 'Complete SEO metadata before publishing.', status: 'Open' },
];

export const KPIS = [
  { id: 'kpi-1', name: 'Admission completion rate', formula: 'completed admissions ÷ submitted applications × 100', source: 'Admissions', period: 'Monthly', owner: 'Admissions officer', target: '70%', current: '64%', trend: 'Improving' },
  { id: 'kpi-2', name: 'Attendance rate', formula: 'present + late ÷ total marked sessions × 100', source: 'Attendance', period: 'Term', owner: 'Academic office', target: '92%', current: '89%', trend: 'Stable' },
  { id: 'kpi-3', name: 'Assignment completion rate', formula: 'submitted ÷ assigned × 100', source: 'Assignments', period: 'Monthly', owner: 'Academic office', target: '90%', current: '84%', trend: 'Needs attention' },
  { id: 'kpi-4', name: 'Fee collection rate', formula: 'verified collections ÷ invoiced amount × 100', source: 'Invoices and payments', period: 'Monthly', owner: 'Finance officer', target: '85%', current: '81%', trend: 'Stable' },
  { id: 'kpi-5', name: 'Result publication turnaround', formula: 'average days from marking complete to publication', source: 'Examinations', period: 'Term', owner: 'Examination controller', target: '5 days', current: '6 days', trend: 'Stable' },
  { id: 'kpi-6', name: 'Support ticket resolution time', formula: 'average hours from creation to resolution', source: 'Support tickets', period: 'Monthly', owner: 'Support agent', target: '24 hours', current: '31 hours', trend: 'Needs attention' },
];

export const FEATURE_FLAGS = Array.from({ length: 12 }, (_, i) => ({
  id: `ffg-${3300 + i}`,
  name: pick(['AI tutor', 'AI quiz generation', 'Online examinations', 'Discussion forums', 'Parent–teacher messaging', 'Digital certificates', 'QR certificate verification', 'Online fee payment', 'Library module', 'Transport module', 'Payroll module', 'Alumni directory'], i),
  description: 'Optional module controlled by the owner. Disabling hides the feature without deleting its data.',
  environment: i % 4 === 0 ? 'Development only' : 'All environments',
  roles: pick(['Owner, Admin', 'All staff', 'Student, Parent', 'Everyone'], i),
  state: pick(['Enabled', 'Enabled', 'Disabled', 'Rollout'], i),
  changed: day(-i * 4),
}));

export const SYSTEM_HEALTH = [
  { id: 'syh-1', check: 'Application front end', status: 'Healthy', detail: 'All screens rendering.', measured: 'Live' },
  { id: 'syh-2', check: 'Backend API', status: 'Not connected', detail: 'Front end is running on local demo data until the backend is built.', measured: 'Live' },
  { id: 'syh-3', check: 'Database connectivity', status: 'Not connected', detail: 'No database configured yet.', measured: 'Live' },
  { id: 'syh-4', check: 'File storage', status: 'Healthy', detail: 'Private storage reachable for uploads.', measured: day(-1) },
  { id: 'syh-5', check: 'Email delivery', status: 'Healthy', detail: 'Last test message delivered.', measured: day(-1) },
  { id: 'syh-6', check: 'Background jobs', status: 'Idle', detail: 'No scheduled jobs are configured yet.', measured: 'Live' },
  { id: 'syh-7', check: 'Backups', status: 'Not configured', detail: 'Backup schedule requires the backend.', measured: '—' },
  { id: 'syh-8', check: 'Error monitoring', status: 'Degraded', detail: 'Last connection test failed with an authorisation error.', measured: day(-6) },
];

export const JOBS = Array.from({ length: 10 }, (_, i) => ({
  id: `job-${3400 + i}`,
  name: pick(['Scheduled result publication', 'Fee reminder run', 'Backup snapshot', 'Report generation', 'Notification delivery', 'Data reconciliation', 'Attendance summary', 'Document generation', 'Media cleanup', 'Import validation'], i),
  schedule: pick(['Daily 02:00', 'Weekly Monday 03:00', 'Monthly 1st 04:00', 'On demand'], i),
  lastRun: day(-(i % 5)),
  duration: `${10 + i * 4} s`,
  status: pick(['Succeeded', 'Succeeded', 'Failed', 'Running', 'Queued'], i),
  retries: i % 4,
  detail: i % 5 === 2 ? 'Failed: provider timeout after 30 s. Retry available.' : 'Completed successfully.',
}));

export const BACKUPS = Array.from({ length: 8 }, (_, i) => ({
  id: `bkp-${3500 + i}`,
  type: pick(['Automatic', 'Manual'], i),
  started: day(-i * 2) + ' 02:00',
  size: `${120 + i * 18} MB`,
  storage: 'Secure private storage',
  retention: pick(['30 days', '90 days', '1 year'], i),
  integrity: i % 5 === 0 ? 'Not verified' : 'Verified',
  status: pick(['Completed', 'Completed', 'Completed', 'Failed'], i),
}));

export const APPROVALS = [
  { id: 'apr-1', type: 'Admission', title: 'Application ADM-2026044 — Class 7', requester: 'Admissions office', waiting: '2 days', priority: 'High', evidence: 'Documents verified', decision: 'Approve / Reject / Request information', status: 'Pending' },
  { id: 'apr-2', type: 'Payment verification', title: 'TRX-90318 — PKR 9,000 (JazzCash)', requester: 'Finance officer', waiting: '4 hours', priority: 'High', evidence: 'Proof uploaded', decision: 'Approve / Reject / Correction', status: 'Pending' },
  { id: 'apr-3', type: 'Result publication', title: 'Class 10 — Physics first term results', requester: 'Examination controller', waiting: '1 day', priority: 'High', evidence: 'Marking complete, moderation done', decision: 'Approve / Return', status: 'Pending' },
  { id: 'apr-4', type: 'Content publishing', title: 'Website page — Scholarships', requester: 'Website editor', waiting: '6 hours', priority: 'Medium', evidence: 'Draft ready', decision: 'Approve / Return with notes', status: 'Pending' },
  { id: 'apr-5', type: 'Refund', title: 'REF-2026-004 — PKR 4,500', requester: 'Finance officer', waiting: '3 days', priority: 'Medium', evidence: 'Withdrawal approved', decision: 'Approve / Reject', status: 'Pending' },
  { id: 'apr-6', type: 'Teacher onboarding', title: 'New teacher account — Computer Science', requester: 'Academic office', waiting: '1 day', priority: 'Medium', evidence: 'Documents submitted', decision: 'Approve / Reject', status: 'Pending' },
  { id: 'apr-7', type: 'Student transfer', title: 'Section transfer — Maryam Yousaf (9-B to 9-A)', requester: 'Class teacher', waiting: '5 hours', priority: 'Low', evidence: 'Reassessment complete', decision: 'Approve / Reject', status: 'Pending' },
  { id: 'apr-8', type: 'Scholarship', title: 'Need-based scholarship 40% — Class 12', requester: 'Scholarship committee', waiting: '2 days', priority: 'Medium', evidence: 'Income documents verified', decision: 'Approve / Reject', status: 'Pending' },
];

export const ADMISSIONS = Array.from({ length: 24 }, (_, i) => {
  const nm = name(i * 4 + 5);
  const stage = pick(['Draft', 'Submitted', 'Under review', 'Information requested', 'Approved', 'Waitlisted', 'Rejected', 'Admission completed'], i);
  return {
    id: `adm-${3600 + i}`,
    applicationNo: `APP-2026-${String(i + 1).padStart(4, '0')}`,
    applicant: nm,
    guardian: `${LAST[(i * 3) % LAST.length]} ${LAST[(i * 5) % LAST.length]}`,
    phone: `0302${String(4000000 + i * 7717).slice(0, 7)}`,
    email: email(nm, 'gmail.com'),
    applyingFor: pick(CLASSES, i).name,
    academicYear: '2025 – 2026',
    submitted: day(-i * 2),
    stage,
    documents: i % 5 === 0 ? 'Missing birth certificate' : 'Complete',
    interview: i % 4 === 0 ? day(3 + i) : 'Not required',
    assignedClass: stage === 'Admission completed' ? pick(CLASSES, i).name : '—',
    assignedSection: stage === 'Admission completed' ? pick(['A', 'B'], i) : '—',
    admissionNumber: stage === 'Admission completed' ? `ADM-${2026100 + i}` : '—',
    reason: stage === 'Rejected' ? 'Seats unavailable for the requested class.' : stage === 'Waitlisted' ? 'Capacity full — placed on the waitlist with priority 4.' : '—',
    reviewer: i % 3 === 0 ? '—' : 'Admissions officer',
  };
});

export const SITE_SETTINGS = {
  branding: { brand: 'Tips Academy', campus: 'Al Mursusb Campus', tagline: 'Structured learning from primary to professional level.', primaryColor: '#0f5a4a', accentColor: '#f4b740' },
  contact: { address: '104-A Block-B PCSIR Staff Housing Society, College Road Lahore', phone: '03200601936', email: 'tipsalmursusb006@gmail.com', hours: 'Monday – Saturday, 8:00 am – 6:00 pm' },
  academics: { activeYear: '2025 – 2026', grading: 'Percentage with letter grades (A+ ≥ 80)', passing: '33% per subject', promotion: 'Minimum 40% aggregate with 75% attendance', sections: 'Section A (core) and Section B (academic support)' },
  registration: { publicSelfRegistration: 'Disabled (default)', admissions: 'Admin-controlled workflow', teacherOnboarding: 'Requires approval' },
  notifications: { inApp: true, email: true, sms: false, whatsapp: false, digest: 'Daily at 7:00 pm' },
  files: { maxUpload: '10 MB per file', allowed: 'PDF, DOCX, XLSX, JPG, PNG, MP3, MP4', sensitive: 'Stored privately' },
  retention: { academic: 'Permanent', financial: '7 years', audit: '2 years', attendance: '5 years', supportTickets: '2 years' },
  maintenance: { enabled: false, notice: '', allowAdminAccess: true },
  security: { mfaForPrivileged: 'Recommended', sessionTimeout: '60 minutes', passwordPolicy: 'Minimum 10 characters, mixed case and number', reauthForSensitive: true },
};

export const ACTIVITIES = Array.from({ length: 12 }, (_, i) => ({
  id: `act-${3700 + i}`,
  name: pick(['Science Club', 'Debate Society', 'Cricket Team', 'Football Team', 'Art Club', 'Robotics Club', 'Quiz Society', 'Reading Circle'], i),
  supervisor: pick(TEACHERS, i).name,
  day: pick(['Monday', 'Tuesday', 'Wednesday', 'Thursday'], i),
  time: '2:30 pm – 4:00 pm',
  capacity: 30 + i * 3,
  registered: 18 + i * 2,
  consentRequired: true,
  status: pick(['Active', 'Active', 'Scheduled'], i),
}));

export const WELLBEING = Array.from({ length: 8 }, (_, i) => {
  const st = STUDENTS[(i * 11) % STUDENTS.length];
  return {
    id: `wll-${3800 + i}`,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    referralType: pick(['Academic support', 'Attendance concern', 'Counselling', 'Peer support'], i),
    openedOn: day(-i * 6),
    counsellor: pick(['Ms. Sana Tariq (Counsellor)', 'Mr. Adeel Raza (Counsellor)'], i),
    status: pick(['Open', 'In progress', 'Follow-up scheduled', 'Closed'], i),
    nextReview: day(4 + i * 3),
    accessLog: 'Restricted to counsellor and principal',
  };
});

export const ROOMS = Array.from({ length: 12 }, (_, i) => ({
  id: `rom-${3900 + i}`,
  name: pick(['Room 4', 'Room 7', 'Room 12', 'Hall A', 'Hall B', 'Laboratory 1', 'Laboratory 2', 'Computer Lab', 'Library', 'Art Room', 'Sports Ground', 'Staff Room'], i),
  type: pick(['Classroom', 'Laboratory', 'Hall', 'Common'], i),
  capacity: 30 + i * 5,
  facilities: pick(['Projector, whiteboard', 'Lab benches, fume hood', 'Projector, sound system', 'Computers, projector'], i),
  status: i % 7 === 0 ? 'Under maintenance' : 'Available',
  utilisation: `${40 + i * 4}%`,
}));

export const LIBRARY_BOOKS = Array.from({ length: 14 }, (_, i) => ({
  id: `lib-${4000 + i}`,
  title: pick(['Physics for Matric', 'Chemistry Concepts', 'Advanced Mathematics', 'Biology Atlas', 'English Grammar in Use', 'Pak Studies Companion', 'Accounting Principles', 'Programming Basics'], i),
  author: pick(['Punjab Textbook Board', 'Ilmi Kitab Khana', 'Oxford Press', 'Local Author'], i),
  isbn: `978-969-${1000 + i * 7}`,
  category: pick(['Science', 'Mathematics', 'Language', 'Commerce', 'Reference'], i),
  copies: 4 + (i % 6),
  available: 1 + (i % 4),
  shelf: `S-${(i % 8) + 1}`,
  status: 'Active',
}));

export const LIBRARY_LOANS = Array.from({ length: 12 }, (_, i) => {
  const st = STUDENTS[(i * 8) % STUDENTS.length];
  return {
    id: `lol-${4100 + i}`,
    book: pick(LIBRARY_BOOKS, i).title,
    borrower: st.name,
    role: 'Student',
    issuedOn: day(-20 + i),
    dueOn: day(-3 + i),
    returnedOn: i % 3 === 0 ? day(-1 + i) : '—',
    status: i % 3 === 0 ? 'Returned' : i % 4 === 0 ? 'Overdue' : 'Issued',
    fine: i % 4 === 0 ? 100 : 0,
  };
});

export const TRANSPORT = Array.from({ length: 8 }, (_, i) => ({
  id: `trp-${4200 + i}`,
  vehicle: `LES-2026-${1000 + i}`,
  type: pick(['Coaster', 'Hiace', 'Bus'], i),
  driver: `${LAST[(i * 3) % LAST.length]} ${LAST[(i * 9) % LAST.length]}`,
  phone: `0300${String(6000000 + i * 5531).slice(0, 7)}`,
  route: pick(['Route 1 — PCSIR Society', 'Route 2 — Township', 'Route 3 — Johar Town', 'Route 4 — Model Town'], i),
  stops: 5 + (i % 4),
  capacity: 24 + i * 4,
  assigned: 18 + i * 3,
  fee: 4500,
  documents: i % 5 === 0 ? 'Fitness certificate expiring in 22 days' : 'Valid',
  status: i % 7 === 0 ? 'In maintenance' : 'Active',
}));

export const ASSETS = Array.from({ length: 14 }, (_, i) => ({
  id: `ast-${4300 + i}`,
  tag: `AST-${2200 + i}`,
  item: pick(['Desktop computer', 'Student desk', 'Laboratory microscope', 'Projector', 'Air conditioner', 'Printer', 'Cricket kit', 'Chemistry glassware'], i),
  category: pick(['IT equipment', 'Furniture', 'Laboratory', 'Sports', 'Facilities'], i),
  serial: `SN-${700000 + i * 13}`,
  location: pick(ROOMS, i).name,
  responsible: pick(STAFF, i).name,
  purchased: day(-600 + i * 25),
  cost: 15000 + i * 7500,
  warranty: i % 4 === 0 ? 'Expired' : day(200 + i * 5),
  condition: pick(['Excellent', 'Good', 'Needs repair', 'Under repair'], i),
  status: i % 6 === 0 ? 'Marked for disposal' : 'In use',
}));

export const EXPENSES = Array.from({ length: 14 }, (_, i) => ({
  id: `exp-${4400 + i}`,
  reference: `EXP-2026-${String(i + 1).padStart(3, '0')}`,
  category: pick(['Utilities', 'Maintenance', 'Stationery', 'Laboratory consumables', 'Transport fuel', 'Events', 'Marketing', 'IT services'], i),
  department: pick(['Operations', 'Academics', 'Finance', 'Administration'], i),
  amount: 12000 + i * 4300,
  submittedOn: day(-i * 4),
  submittedBy: pick(STAFF, i).name,
  supporting: i % 5 === 0 ? 'Receipt missing' : 'Receipt attached',
  status: pick(['Submitted', 'Under review', 'Approved', 'Paid', 'Rejected'], i),
  budget: pick(['Operations budget', 'Academic budget', 'Capital budget'], i),
}));

export const BUDGETS = Array.from({ length: 8 }, (_, i) => ({
  id: `bud-${4500 + i}`,
  name: pick(['Operations', 'Academics', 'Facilities', 'IT', 'Transport', 'Marketing', 'Events', 'Welfare'], i) + ' budget',
  period: '2025 – 2026',
  allocated: 400000 + i * 180000,
  used: 180000 + i * 96000,
  owner: pick(['Finance officer', 'Operations manager', 'Academic office'], i),
  status: 'Active',
}));

export const VENDORS = Array.from({ length: 8 }, (_, i) => ({
  id: `ven-${4600 + i}`,
  name: pick(['Lahore Stationers', 'Al-Madina Furniture', 'TechMart Computers', 'City Lab Supplies', 'Falcon Transport', 'Green Caterers', 'Bright Printers', 'Safe Uniforms'], i),
  category: pick(['Stationery', 'Furniture', 'IT', 'Laboratory', 'Transport', 'Catering', 'Printing', 'Uniform'], i),
  contact: `${LAST[(i * 7) % LAST.length]} ${LAST[i % LAST.length]}`,
  phone: `0342${String(7000000 + i * 3319).slice(0, 7)}`,
  rating: (3.5 + (i % 3) * 0.5).toFixed(1),
  purchases: 3 + i,
  outstanding: i % 3 === 0 ? 0 : 45000 + i * 9000,
  status: 'Active',
}));

export const PURCHASE_ORDERS = Array.from({ length: 10 }, (_, i) => ({
  id: `pur-${4700 + i}`,
  number: `PO-2026-${String(i + 1).padStart(3, '0')}`,
  vendor: pick(VENDORS, i).name,
  items: pick(['Laboratory glassware', 'Student desks (20)', 'Desktop computers (5)', 'Stationery bundle', 'Sports equipment'], i),
  amount: 35000 + i * 12500,
  raisedOn: day(-i * 5),
  raisedBy: pick(STAFF, i).name,
  approval: i % 4 === 0 ? 'Pending approval' : 'Approved',
  delivery: pick(['Pending', 'Partially delivered', 'Delivered'], i),
  payment: pick(['Unpaid', 'Part paid', 'Paid'], i),
}));

export const PAYROLL = Array.from({ length: 12 }, (_, i) => {
  const t = TEACHERS[i % TEACHERS.length];
  return {
    id: `pay-${4800 + i}`,
    employee: t.name,
    role: 'Teacher',
    department: 'Academics',
    period: 'October 2026',
    basic: 45000 + i * 2500,
    allowances: 4000 + i * 250,
    deductions: 1500 + i * 120,
    net: 47500 + i * 2630,
    status: pick(['Pending approval', 'Approved', 'Paid'], i),
    paidOn: i % 3 === 2 ? day(-4) : '—',
  };
});

export const SURVEYS = Array.from({ length: 6 }, (_, i) => ({
  id: `srv-${4900 + i}`,
  title: pick(['Term experience survey', 'Parent satisfaction survey', 'Facilities feedback', 'Teaching quality feedback', 'Canteen feedback', 'Transport service feedback'], i),
  audience: pick(['Parents', 'Students', 'Staff'], i),
  anonymous: i % 3 !== 0,
  opens: day(-10 + i),
  closes: day(5 + i * 2),
  responses: 30 + i * 24,
  invited: 120 + i * 40,
  status: pick(['Open', 'Open', 'Closed', 'Draft'], i),
}));

export const POLICIES = Array.from({ length: 8 }, (_, i) => ({
  id: `pol-${5000 + i}`,
  name: pick(['Attendance policy', 'Assessment and promotion policy', 'Fee and refund policy', 'Child protection policy', 'Data protection policy', 'Code of conduct', 'Examination policy', 'Transport safety policy'], i),
  category: pick(['Academic', 'Finance', 'Welfare', 'Operations'], i),
  version: `v${1 + (i % 3)}.0`,
  effective: day(-200 + i * 30),
  review: day(60 + i * 15),
  acknowledgements: 40 + i * 12,
  required: 60 + i * 10,
  status: pick(['Active', 'Active', 'Under review'], i),
}));

export const CONSENTS = Array.from({ length: 10 }, (_, i) => ({
  id: `con-${5100 + i}`,
  purpose: pick(['School policy acknowledgement', 'Educational trip consent', 'Online learning services', 'Media publication consent', 'Communication channel consent', 'Optional activity consent'], i),
  audience: pick(['Parents', 'Parents and students', 'Staff'], i),
  version: `v1.${i % 4}`,
  given: 40 + i * 18,
  pending: 10 + i * 6,
  withdrawn: i % 5,
  status: 'Active',
}));

export const INCIDENTS = Array.from({ length: 10 }, (_, i) => ({
  id: `inc-${5200 + i}`,
  reference: `RSK-2026-${String(i + 1).padStart(3, '0')}`,
  category: pick(['Facility safety', 'Student incident', 'IT security', 'Transport', 'Compliance', 'Health and safety'], i),
  severity: pick(['Low', 'Medium', 'High', 'Critical'], i),
  date: day(-i * 5),
  location: pick(['Laboratory 1', 'Sports Ground', 'Canteen', 'Block B stairs', 'Server room'], i),
  department: pick(['Operations', 'Academics', 'Admin', 'Transport'], i),
  assigned: pick(STAFF, i).name,
  mitigation: 'Corrective action recorded with a due date and follow-up review.',
  due: day(5 + i * 3),
  status: pick(['Open', 'In progress', 'Monitoring', 'Closed'], i),
  restricted: i % 3 === 0,
}));

export const VISITORS = Array.from({ length: 12 }, (_, i) => ({
  id: `vis-${5300 + i}`,
  name: `${FIRST[(i * 3) % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`,
  purpose: pick(['Parent meeting', 'Vendor delivery', 'Interview', 'Maintenance visit', 'Document submission'], i),
  host: pick(STAFF, i).name,
  checkIn: day(-(i % 5)) + ' ' + pick(['09:20', '10:15', '11:40', '14:05'], i),
  checkOut: i % 4 === 0 ? '—' : day(-(i % 5)) + ' ' + pick(['10:00', '11:30', '12:50', '15:30'], i),
  badge: `V-${200 + i}`,
  status: i % 4 === 0 ? 'On campus' : 'Checked out',
  note: i % 6 === 0 ? 'Escorted to the admissions office.' : '—',
}));

export const MAINTENANCE = Array.from({ length: 10 }, (_, i) => ({
  id: `mnt-${5400 + i}`,
  request: pick(['Air conditioner servicing', 'Projector replacement', 'Laboratory sink repair', 'Classroom painting', 'Electrical fault', 'Furniture repair', 'Water cooler service', 'Whiteboard replacement'], i),
  location: pick(ROOMS, i).name,
  priority: pick(['Low', 'Medium', 'High'], i),
  reportedOn: day(-i * 3),
  assignedTo: pick(['Maintenance lead', 'IT support', 'Caretaker'], i),
  cost: i % 4 === 0 ? 0 : 3000 + i * 1400,
  status: pick(['Reported', 'Assigned', 'In progress', 'Completed'], i),
  completedOn: i % 4 === 3 ? day(-1) : '—',
}));

export const DOCUMENT_TEMPLATES = Array.from({ length: 12 }, (_, i) => ({
  id: `dct-${5500 + i}`,
  name: pick(['Admission letter', 'Student ID card', 'Staff ID card', 'Fee invoice', 'Fee receipt', 'Attendance summary', 'Report card', 'Transfer certificate', 'Enrolment confirmation', 'Bonafide certificate', 'Leaving certificate', 'Official letter'], i),
  category: pick(['Admissions', 'Finance', 'Academic', 'Identity', 'Official'], i),
  numbering: pick(['TA-ADM-{yy}-{seq}', 'TA-INV-{yy}-{seq}', 'TA-CERT-{yy}-{seq}', 'TA-ID-{yy}-{seq}'], i),
  signature: pick(['Principal', 'Owner', 'Finance officer'], i),
  status: pick(['Active', 'Active', 'Draft'], i),
  generated: 20 + i * 14,
}));

export const ALUMNI = Array.from({ length: 12 }, (_, i) => {
  const nm = name(i * 6 + 1);
  return {
    id: `aln-${5600 + i}`,
    name: nm,
    graduationYear: 2019 + (i % 6),
    program: pick(['Matric', 'Intermediate — Pre-medical', 'Intermediate — Pre-engineering', 'Accounting certificate'], i),
    email: email(nm, 'gmail.com'),
    phone: `0303${String(8000000 + i * 2237).slice(0, 7)}`,
    current: pick(['University of Engineering and Technology, Lahore', 'King Edward Medical University', 'Punjab University', 'Working professional', 'Preparing for entry tests'], i),
    consentToContact: i % 4 !== 0,
    mentoring: i % 5 === 0,
    achievements: pick(['Position holder in board examination', 'State athletics medal', 'Scholarship recipient', '—'], i),
  };
});

export const DOCUMENTS = Array.from({ length: 16 }, (_, i) => {
  const st = STUDENTS[(i * 5) % STUDENTS.length];
  return {
    id: `doc-${5700 + i}`,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    category: pick(['Birth certificate', 'Previous result card', 'School leaving certificate', 'Photograph', 'Guardian CNIC', 'Medical record', 'Transfer certificate'], i),
    uploadedOn: day(-i * 4),
    reviewedBy: i % 3 === 0 ? '—' : 'Admissions officer',
    status: pick(['Approved', 'Approved', 'Pending review', 'Rejected - reupload requested'], i),
    visibility: 'Private — admissions and academic staff only',
    expiry: i % 5 === 0 ? day(90) : '—',
    size: `${(0.2 + (i % 5) * 0.4).toFixed(1)} MB`,
  };
});

export const MEETING_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const t = TEACHERS[i % TEACHERS.length];
  const st = STUDENTS[(i * 4) % STUDENTS.length];
  return {
    id: `mee-${5800 + i}`,
    teacher: t.name,
    subject: t.subject,
    slot: `${pick(['Saturday 25 Oct', 'Saturday 1 Nov', 'Friday 31 Oct'], i)} · ${pick(['09:00', '09:30', '10:00', '10:30', '11:00'], i)}`,
    guardian: `${st.guardianName} (${st.name} guardian)`,
    student: st.name,
    mode: pick(['In person', 'Online'], i),
    status: pick(['Requested', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'], i),
    note: 'Meeting notes are visible only to the teacher and the guardian.',
  };
});

export const STUDY_PLANS = Array.from({ length: 6 }, (_, i) => ({
  id: `stp-${5900 + i}`,
  title: pick(['8-week board revision plan', 'Weekly mathematics practice', 'Chemistry concept plan', 'English writing plan', 'Entry test foundation', 'Attendance recovery plan'], i),
  student: STUDENTS[(i * 9) % STUDENTS.length].name,
  className: STUDENTS[(i * 9) % STUDENTS.length].className,
  createdBy: pick(TEACHERS, i).name,
  weeks: 4 + i,
  hoursPerWeek: 6 + i,
  progress: 20 + i * 12,
  nextMilestone: day(3 + i),
  status: pick(['Active', 'Active', 'Completed'], i),
}));

export const FLASHCARDS = Array.from({ length: 18 }, (_, i) => ({
  id: `flc-${6000 + i}`,
  deck: pick(['Algebra formulas', 'Physics units', 'Periodic table symbols', 'Biology terms', 'English vocabulary', 'Accounting entries'], i),
  subject: pick(SUBJECT_LIST, i),
  className: pick(CLASSES, i).name,
  front: 'Definition or question for the selected topic.',
  back: 'Answer with a worked example.',
  mastered: i % 4 === 0 ? 'Needs revision' : i % 3 === 0 ? 'Learning' : 'Mastered',
  lastReviewed: i % 5 === 0 ? '—' : day(-(i % 7)),
}));

export const MASTERY = Array.from({ length: 16 }, (_, i) => {
  const st = STUDENTS[(i * 6) % STUDENTS.length];
  const level = pick(['Emerging', 'Developing', 'Secure', 'Mastered'], i);
  return {
    id: `mst-${6100 + i}`,
    studentId: st.id,
    studentName: st.name,
    className: st.className,
    subject: pick(SUBJECT_LIST, i),
    topic: `Topic ${(i % 4) + 1} of chapter ${(i % 5) + 1}`,
    level,
    evidence: pick(['Chapter quiz', 'Assignment', 'Class assessment', 'Teacher observation'], i),
    reviewedBy: pick(TEACHERS, i).name,
    reviewedOn: day(-i * 2),
    remediation: level === 'Emerging' || level === 'Developing' ? 'Assigned revision material and a practice set.' : 'Extension activity provided.',
  };
});

export const LEARNING_PATHS = Array.from({ length: 8 }, (_, i) => ({
  id: `lnp-${6200 + i}`,
  title: `${pick(SUBJECT_LIST, i)} learning path`,
  className: pick(CLASSES, i).name,
  subject: pick(SUBJECT_LIST, i),
  steps: 5 + (i % 4),
  prerequisites: 1 + (i % 3),
  enrolled: 20 + i * 7,
  completed: 8 + i * 3,
  status: pick(['Active', 'Active', 'Draft'], i),
}));

export const CURRICULUM_MAP = Array.from({ length: 14 }, (_, i) => ({
  id: `cum-${6300 + i}`,
  className: pick(CLASSES, i).name,
  subject: pick(SUBJECT_LIST, i),
  outcome: `Outcome ${(i % 6) + 1}: apply the concept to unfamiliar problems`,
  topicsMapped: 3 + (i % 4),
  materials: 6 + i,
  assessments: 1 + (i % 3),
  coverage: `${60 + i * 2}%`,
  gap: i % 5 === 0 ? 'Two topics have no published material yet.' : 'No gaps detected',
}));

export const BLUEPRINTS = Array.from({ length: 8 }, (_, i) => ({
  id: `blp-${6400 + i}`,
  title: `${pick(SUBJECT_LIST, i)} paper blueprint`,
  className: pick(CLASSES, i).name,
  totalMarks: pick([50, 75, 85, 100], i),
  duration: pick(['1.5 hours', '2 hours', '3 hours'], i),
  mcq: `${10 + i} questions · ${20 + i} marks`,
  shortAnswer: `${6 + (i % 4)} questions · ${24 + i} marks`,
  longAnswer: `${2 + (i % 3)} questions · ${20 + i} marks`,
  difficulty: 'Easy 30% · Medium 50% · Hard 20%',
  status: pick(['Draft', 'Approved', 'Approved', 'Used for paper'], i),
}));

export const ACCOMMODATIONS = Array.from({ length: 6 }, (_, i) => {
  const st = STUDENTS[(i * 13) % STUDENTS.length];
  return {
    id: `acc-${6500 + i}`,
    studentName: st.name,
    className: st.className,
    type: pick(['Extra time 25%', 'Separate room', 'Reader support', 'Rest breaks', 'Large-print paper'], i),
    approvedBy: 'Academic administrator',
    validUntil: day(120 + i * 20),
    notes: 'Accommodation settings are separate from the student profile and visible only to examination staff.',
    status: pick(['Active', 'Active', 'Expired'], i),
  };
});

export const MODERATION = Array.from({ length: 8 }, (_, i) => ({
  id: `mod-${6600 + i}`,
  assessment: pick(EXAMS, i).title,
  secondMarker: pick(TEACHERS, i).name,
  scripts: 20 + i * 6,
  sampled: 5 + i,
  variance: pick(['Within tolerance', 'Two scripts adjusted', 'Review required'], i),
  comment: 'Marking consistency checked against the rubric.',
  status: pick(['Pending', 'In progress', 'Completed'], i),
  completedOn: i % 3 === 2 ? day(-2) : '—',
}));

export const RECHECKS = Array.from({ length: 8 }, (_, i) => {
  const st = STUDENTS[(i * 7) % STUDENTS.length];
  return {
    id: `rck-${6700 + i}`,
    studentName: st.name,
    className: st.className,
    exam: pick(EXAMS, i).title,
    subject: pick(SUBJECT_LIST, i),
    requestedOn: day(-i * 2),
    reason: pick(['Marks appear incomplete for question 4.', 'Total does not match the subject total.', 'Requesting a re-total of the paper.'], i),
    reviewedBy: i % 3 === 0 ? '—' : 'Examination controller',
    outcome: pick(['Pending', 'No change', 'Marks corrected', 'Forwarded to moderator'], i),
  };
});

export const SUBSTITUTES = Array.from({ length: 8 }, (_, i) => ({
  id: `sub-${6800 + i}`,
  absentTeacher: pick(TEACHERS, i).name,
  date: day(i),
  periods: `${1 + (i % 3)} period(s) · ${pick(['08:00 – 09:30', '09:45 – 11:15', '11:30 – 13:00'], i)}`,
  className: pick(CLASSES, i).name,
  section: pick(['A', 'B'], i),
  subject: pick(SUBJECT_LIST, i),
  substitute: i % 4 === 0 ? 'Not assigned — needs decision' : pick(TEACHERS, i + 4).name,
  conflict: i % 4 === 0 ? 'No available teacher in that period' : 'None',
  status: i % 4 === 0 ? 'Pending' : 'Allocated',
  notified: i % 4 === 0 ? 'No' : 'Yes',
}));

export const LESSON_PLANS = Array.from({ length: 10 }, (_, i) => ({
  id: `lpn-${6900 + i}`,
  title: `${pick(SUBJECT_LIST, i)} — lesson plan ${i + 1}`,
  teacher: pick(TEACHERS, i).name,
  className: pick(CLASSES, i).name,
  subject: pick(SUBJECT_LIST, i),
  objectives: 2 + (i % 3),
  activities: pick(['Group problem solving', 'Guided practice', 'Demonstration and discussion', 'Individual work with feedback'], i),
  resources: pick(['Board and marker, worksheets', 'Laboratory apparatus', 'Projector slides', 'Textbook and notes'], i),
  homework: 'Practice questions from the chapter and a short reading task.',
  observation: i % 3 === 0 ? pick(['Scheduled', 'Completed', 'Not scheduled'], i) : 'Not scheduled',
  status: pick(['Draft', 'Submitted', 'Approved'], i),
  updated: day(-i * 2),
}));

export const PORTFOLIOS = Array.from({ length: 8 }, (_, i) => {
  const st = STUDENTS[(i * 10) % STUDENTS.length];
  return {
    id: `por-${7000 + i}`,
    studentName: st.name,
    className: st.className,
    projects: 2 + (i % 4),
    assignments: 4 + i,
    certificates: i % 3,
    achievements: i % 4,
    visibility: pick(['Teachers only', 'Teachers and guardians', 'Shared with student'], i),
    lastUpdated: day(-i * 3),
  };
});

export const PROJECTS = Array.from({ length: 8 }, (_, i) => ({
  id: `prj-${7100 + i}`,
  title: pick(['Solar water heater model', 'Local history research', 'Recycling campaign', 'Business plan simulation', 'Plant growth experiment', 'Coding mini-project'], i),
  className: pick(CLASSES, i).name,
  teacher: pick(TEACHERS, i).name,
  type: pick(['Group', 'Individual'], i),
  members: 1 + (i % 5),
  milestones: 3 + (i % 3),
  completed: 1 + (i % 3),
  due: day(10 + i * 4),
  rubric: pick(['Project rubric v1', 'Project rubric v2'], i),
  status: pick(['Open', 'In progress', 'Submitted', 'Assessed'], i),
}));

export const AWARDS = Array.from({ length: 12 }, (_, i) => {
  const st = STUDENTS[(i * 5 + 2) % STUDENTS.length];
  return {
    id: `awd-${7200 + i}`,
    studentName: st.name,
    className: st.className,
    award: pick(['Best in mathematics', 'Science exhibition winner', 'Debate champion', 'Sports medal', 'Perfect attendance', 'Reading challenge'], i),
    activity: pick(['Science Club', 'Debate Society', 'Sports', 'Reading Circle', 'Quiz Society'], i),
    date: day(-i * 6),
    awardedBy: pick(TEACHERS, i).name,
    certificate: i % 3 === 0 ? 'Pending generation' : 'Issued',
  };
});

export const SUBJECT_FEEDBACK = Array.from({ length: 12 }, (_, i) => {
  const st = STUDENTS[(i * 8 + 3) % STUDENTS.length];
  return {
    id: `sbf-${7300 + i}`,
    studentName: st.name,
    className: st.className,
    subject: pick(SUBJECT_LIST, i),
    teacher: pick(TEACHERS, i).name,
    term: pick(['First term', 'Second term'], i),
    strengths: 'Consistent practice and clear written work.',
    improvement: 'Needs to show full working steps in numerical questions.',
    nextSteps: 'Complete the extra practice set and attend the revision class.',
    status: pick(['Draft', 'Shared with guardian', 'Shared with student and guardian'], i),
    sharedOn: i % 3 === 0 ? '—' : day(-i * 2),
  };
});

export const DOWNLOADS = Array.from({ length: 14 }, (_, i) => ({
  id: `dwn-${7400 + i}`,
  item: pick(NOTES, i).title,
  type: pick(['Notes', 'Past paper', 'Worksheet', 'Report card', 'Certificate'], i),
  student: STUDENTS[(i * 6 + 1) % STUDENTS.length].name,
  downloadedOn: day(-i),
  size: `${(0.3 + (i % 6) * 0.5).toFixed(1)} MB`,
}));

export const BOOKMARKS = Array.from({ length: 12 }, (_, i) => ({
  id: `bkm-${7500 + i}`,
  item: pick(NOTES, i).title,
  subject: pick(SUBJECT_LIST, i),
  className: pick(CLASSES, i).name,
  type: pick(['Notes', 'Past paper', 'Lesson', 'Flashcard deck'], i),
  savedOn: day(-i),
  progress: `${(i % 5) * 20}%`,
}));

export const FORUMS = Array.from({ length: 8 }, (_, i) => ({
  id: `frm-${7600 + i}`,
  title: pick(['Mathematics doubt corner', 'Physics numerical help', 'English writing practice', 'Computer science projects', 'Exam preparation tips'], i),
  className: pick(CLASSES, i).name,
  posts: 12 + i * 5,
  members: 20 + i * 8,
  lastActivity: day(-(i % 6)),
  moderated: true,
  status: pick(['Open', 'Open', 'Read only'], i),
}));

export const GROUPS = Array.from({ length: 8 }, (_, i) => ({
  id: `grp-${7700 + i}`,
  name: pick(['Class 10 study group', 'Matric revision circle', 'Science club members', 'Debate team', 'Sports squad', 'Pre-medical group'], i),
  className: pick(CLASSES, i).name,
  members: 8 + i * 3,
  owner: pick(TEACHERS, i).name,
  purpose: 'Peer support and shared revision resources.',
  privacy: pick(['Class members only', 'Invitation only'], i),
  status: pick(['Active', 'Active', 'Archived'], i),
}));

export const ACCREDITATION = Array.from({ length: 8 }, (_, i) => ({
  id: `acr-${7800 + i}`,
  document: pick(['Institutional registration', 'Fire safety certificate', 'Building safety certificate', 'Health and hygiene certificate', 'Staff police verification', 'Fee schedule approval', 'Examination affiliation', 'Board registration'], i),
  authority: pick(['District Education Authority', 'Rescue 1122', 'Local Government', 'Punjab Boards', 'Welfare Department'], i),
  issued: day(-500 + i * 40),
  expires: day(30 + i * 25),
  responsible: pick(['Admin office', 'Operations manager', 'Principal'], i),
  status: i % 4 === 0 ? 'Renewal due soon' : 'Valid',
}));

export const EMERGENCY_CONTACTS = Array.from({ length: 10 }, (_, i) => {
  const st = STUDENTS[(i * 12) % STUDENTS.length];
  return {
    id: `emc-${7900 + i}`,
    studentName: st.name,
    className: st.className,
    contact1: `${st.guardianName} · ${st.guardianPhone}`,
    contact2: `${LAST[(i * 4) % LAST.length]} family · 0300${String(9000000 + i * 1234).slice(0, 7)}`,
    pickupAuthorized: pick(['Guardian only', 'Guardian and one authorised person', 'Guardian plus transport'], i),
    medicalNote: i % 5 === 0 ? 'Asthma inhaler kept with the class teacher.' : 'None recorded',
    verified: i % 4 !== 0,
  };
});

export const DATA_DICTIONARY = [
  { entity: 'Students', purpose: 'Enrolment, class and section placement, guardian links', key: 'student code', retention: 'Permanent while enrolled, then archived', owner: 'Academic office' },
  { entity: 'Attendance', purpose: 'Daily and subject attendance records', key: 'student + date + session', retention: '5 years', owner: 'Academic office' },
  { entity: 'Invoices', purpose: 'Fee obligations per student and term', key: 'invoice number', retention: '7 years', owner: 'Finance office' },
  { entity: 'Payments', purpose: 'Payment submissions and verification decisions', key: 'transaction reference', retention: '7 years', owner: 'Finance office' },
  { entity: 'Results', purpose: 'Marks, grades and publication state', key: 'exam + student + subject', retention: 'Permanent', owner: 'Examination controller' },
  { entity: 'Audit logs', purpose: 'Traceability of privileged actions', key: 'request id', retention: '2 years', owner: 'Owner' },
];

export const DATASETS = {
  academicYears: ACADEMIC_YEARS,
  terms: TERMS,
  classes: CLASSES,
  sections: SECTIONS,
  students: STUDENTS,
  guardians: GUARDIANS,
  teachers: TEACHERS,
  staff: STAFF,
  roles: ROLES,
  permissions: PERMISSIONS,
  subjects: SUBJECTS,
  chapters: CHAPTERS,
  topics: TOPICS,
  courses: COURSES,
  lessons: LESSONS,
  notes: NOTES,
  papers: PAPERS,
  questions: QUESTIONS,
  quizzes: QUIZZES,
  exams: EXAMS,
  results: RESULTS,
  reportCards: REPORT_CARDS,
  attendance: ATTENDANCE,
  timetable: TIMETABLE,
  assignments: ASSIGNMENTS,
  submissions: SUBMISSIONS,
  feeStructures: FEE_STRUCTURES,
  invoices: INVOICES,
  payments: PAYMENTS,
  scholarships: SCHOLARSHIPS,
  refunds: REFUNDS,
  certificates: CERTIFICATES,
  announcements: ANNOUNCEMENTS,
  events: EVENTS,
  tickets: TICKETS,
  notifications: NOTIFICATIONS,
  messages: MESSAGES,
  auditLogs: AUDIT_LOGS,
  media: MEDIA,
  pages: SITE_PAGES,
  navigation: NAV_ITEMS,
  emailTemplates: EMAIL_TEMPLATES,
  integrations: INTEGRATIONS,
  aiProviders: AI_PROVIDERS,
  aiUsage: AI_USAGE,
  paymentMethods: PAYMENT_METHODS,
  dataQuality: DATA_QUALITY,
  kpis: KPIS,
  featureFlags: FEATURE_FLAGS,
  systemHealth: SYSTEM_HEALTH,
  jobs: JOBS,
  backups: BACKUPS,
  approvals: APPROVALS,
  admissions: ADMISSIONS,
  activities: ACTIVITIES,
  wellbeing: WELLBEING,
  rooms: ROOMS,
  libraryBooks: LIBRARY_BOOKS,
  libraryLoans: LIBRARY_LOANS,
  transport: TRANSPORT,
  assets: ASSETS,
  expenses: EXPENSES,
  budgets: BUDGETS,
  vendors: VENDORS,
  purchaseOrders: PURCHASE_ORDERS,
  payroll: PAYROLL,
  surveys: SURVEYS,
  policies: POLICIES,
  consents: CONSENTS,
  incidents: INCIDENTS,
  visitors: VISITORS,
  maintenance: MAINTENANCE,
  documentTemplates: DOCUMENT_TEMPLATES,
  alumni: ALUMNI,
  documents: DOCUMENTS,
  meetings: MEETING_SLOTS,
  studyPlans: STUDY_PLANS,
  flashcards: FLASHCARDS,
  mastery: MASTERY,
  learningPaths: LEARNING_PATHS,
  curriculumMap: CURRICULUM_MAP,
  blueprints: BLUEPRINTS,
  accommodations: ACCOMMODATIONS,
  moderation: MODERATION,
  rechecks: RECHECKS,
  substitutes: SUBSTITUTES,
  lessonPlans: LESSON_PLANS,
  portfolios: PORTFOLIOS,
  projects: PROJECTS,
  awards: AWARDS,
  feedback: SUBJECT_FEEDBACK,
  downloads: DOWNLOADS,
  bookmarks: BOOKMARKS,
  forums: FORUMS,
  groups: GROUPS,
  accreditation: ACCREDITATION,
  emergencyContacts: EMERGENCY_CONTACTS,
  dictionary: DATA_DICTIONARY,
};