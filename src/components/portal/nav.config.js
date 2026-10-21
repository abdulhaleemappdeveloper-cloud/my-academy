/**
 * Portal navigation.
 * Each area has its own grouped menu, so students, teachers, parents, staff and
 * the owner only ever see the modules their role can open.
 */

export const PORTAL_NAV = {
  student: [
    { label: 'Overview', items: [
      { label: 'Dashboard', path: '/student', icon: 'LayoutDashboard' },
      { label: 'Notifications', path: '/student/notifications', icon: 'Bell' },
      { label: 'Messages', path: '/student/messages', icon: 'MessagesSquare' },
    ] },
    { label: 'Learning', items: [
      { label: 'My courses', path: '/student/courses', icon: 'BookOpen' },
      { label: 'Lessons & notes', path: '/student/lessons', icon: 'FileText' },
      { label: 'Past papers', path: '/student/papers', icon: 'Library' },
      { label: 'Flashcards', path: '/student/flashcards', icon: 'Layers' },
      { label: 'AI tutor', path: '/student/tutor', icon: 'Sparkles' },
      { label: 'Study planner', path: '/student/planner', icon: 'Target' },
    ] },
    { label: 'Assessments', items: [
      { label: 'Quizzes', path: '/student/quizzes', icon: 'ListChecks' },
      { label: 'Examinations', path: '/student/exams', icon: 'ClipboardList' },
      { label: 'Assignments', path: '/student/assignments', icon: 'PenLine' },
    ] },
    { label: 'My records', items: [
      { label: 'Attendance', path: '/student/attendance', icon: 'CalendarDays' },
      { label: 'Timetable', path: '/student/timetable', icon: 'Timer' },
      { label: 'Progress & mastery', path: '/student/progress', icon: 'TrendingUp' },
      { label: 'Results & report cards', path: '/student/results', icon: 'BarChart3' },
      { label: 'Certificates & awards', path: '/student/certificates', icon: 'Award' },
    ] },
    { label: 'Fees', items: [
      { label: 'Fees & invoices', path: '/student/fees', icon: 'Receipt' },
      { label: 'Payments & proof', path: '/student/payments', icon: 'Wallet' },
    ] },
    { label: 'Account', items: [
      { label: 'My profile', path: '/student/profile', icon: 'UserCog' },
      { label: 'Support & help', path: '/student/support', icon: 'LifeBuoy' },
    ] },
  ],

  teacher: [
    { label: 'Overview', items: [
      { label: 'Dashboard', path: '/teacher', icon: 'LayoutDashboard' },
      { label: 'Notifications', path: '/teacher/notifications', icon: 'Bell' },
      { label: 'Messages', path: '/teacher/messages', icon: 'MessagesSquare' },
    ] },
    { label: 'Teaching', items: [
      { label: 'My classes', path: '/teacher/classes', icon: 'School' },
      { label: 'Attendance', path: '/teacher/attendance', icon: 'CalendarDays' },
      { label: 'Lesson plans', path: '/teacher/lesson-plans', icon: 'ClipboardList' },
      { label: 'Course material', path: '/teacher/material', icon: 'BookOpen' },
      { label: 'Resource library', path: '/teacher/resources', icon: 'Library' },
      { label: 'Timetable & workload', path: '/teacher/timetable', icon: 'Timer' },
    ] },
    { label: 'Assessment', items: [
      { label: 'Question bank', path: '/teacher/questions', icon: 'Database' },
      { label: 'AI quiz generator', path: '/teacher/ai-quiz', icon: 'Sparkles' },
      { label: 'Quizzes', path: '/teacher/quizzes', icon: 'ListChecks' },
      { label: 'Examinations', path: '/teacher/exams', icon: 'ClipboardCheck' },
      { label: 'Grading', path: '/teacher/grading', icon: 'PenLine' },
      { label: 'Assignments', path: '/teacher/assignments', icon: 'FileText' },
    ] },
    { label: 'Students', items: [
      { label: 'Student progress', path: '/teacher/students', icon: 'TrendingUp' },
      { label: 'Feedback & reports', path: '/teacher/feedback', icon: 'MessagesSquare' },
      { label: 'Announcements', path: '/teacher/announcements', icon: 'Megaphone' },
    ] },
  ],

  parent: [
    { label: 'Overview', items: [
      { label: 'Dashboard', path: '/parent', icon: 'LayoutDashboard' },
      { label: 'Notifications', path: '/parent/notifications', icon: 'Bell' },
      { label: 'Messages', path: '/parent/messages', icon: 'MessagesSquare' },
    ] },
    { label: 'My children', items: [
      { label: 'Linked children', path: '/parent/children', icon: 'Users' },
      { label: 'Progress', path: '/parent/progress', icon: 'TrendingUp' },
      { label: 'Attendance', path: '/parent/attendance', icon: 'CalendarDays' },
      { label: 'Results & report cards', path: '/parent/results', icon: 'BarChart3' },
      { label: 'Assignments', path: '/parent/assignments', icon: 'FileText' },
    ] },
    { label: 'Academy', items: [
      { label: 'Meetings', path: '/parent/meetings', icon: 'CalendarClock' },
      { label: 'Calendar & events', path: '/parent/calendar', icon: 'CalendarDays' },
    ] },
    { label: 'Finance', items: [
      { label: 'Fees & ledger', path: '/parent/fees', icon: 'Receipt' },
      { label: 'Payments & receipts', path: '/parent/payments', icon: 'Wallet' },
    ] },
    { label: 'Account', items: [
      { label: 'Profile & consents', path: '/parent/profile', icon: 'UserCog' },
      { label: 'Support', path: '/parent/support', icon: 'LifeBuoy' },
    ] },
  ],

  admin: [
    { label: 'Command', items: [
      { label: 'Command centre', path: '/admin', icon: 'LayoutDashboard' },
      { label: 'Approvals inbox', path: '/admin/approvals', icon: 'Inbox' },
    ] },
    { label: 'People', items: [
      { label: 'Students', path: '/admin/students', icon: 'GraduationCap' },
      { label: 'Teachers & staff', path: '/admin/people', icon: 'Users' },
      { label: 'Accounts & roles', path: '/admin/roles', icon: 'ShieldCheck' },
    ] },
    { label: 'Academics', items: [
      { label: 'Academic structure', path: '/admin/academics', icon: 'School' },
      { label: 'Timetable', path: '/admin/timetable', icon: 'Timer' },
      { label: 'Attendance', path: '/admin/attendance', icon: 'CalendarDays' },
      { label: 'Admissions', path: '/admin/admissions', icon: 'UserPlus' },
    ] },
    { label: 'Assessment', items: [
      { label: 'Question bank', path: '/admin/questions', icon: 'Database' },
      { label: 'Quizzes & AI tools', path: '/admin/quizzes', icon: 'Sparkles' },
      { label: 'Examinations', path: '/admin/exams', icon: 'ClipboardCheck' },
      { label: 'Results & reports', path: '/admin/results', icon: 'BarChart3' },
      { label: 'Certificates', path: '/admin/certificates', icon: 'Award' },
    ] },
    { label: 'Finance', items: [
      { label: 'Fees & invoices', path: '/admin/fees', icon: 'Receipt' },
      { label: 'Payment verification', path: '/admin/payments', icon: 'Wallet' },
      { label: 'Scholarships & refunds', path: '/admin/scholarships', icon: 'Coins' },
    ] },
    { label: 'Website', items: [
      { label: 'Website pages', path: '/admin/pages', icon: 'PanelsTopLeft' },
      { label: 'Page builder', path: '/admin/builder', icon: 'PenLine' },
      { label: 'Media library', path: '/admin/media', icon: 'ImageIcon' },
      { label: 'Announcements & events', path: '/admin/communications', icon: 'Megaphone' },
    ] },
    { label: 'Operations', items: [
      { label: 'Documents', path: '/admin/documents', icon: 'FolderOpen' },
      { label: 'Library', path: '/admin/library', icon: 'Library' },
      { label: 'Transport', path: '/admin/transport', icon: 'Bus' },
      { label: 'Inventory & assets', path: '/admin/inventory', icon: 'Package' },
      { label: 'Facilities & maintenance', path: '/admin/facilities', icon: 'Building2' },
      { label: 'HR & payroll', path: '/admin/hr', icon: 'Briefcase' },
      { label: 'Budgets & expenses', path: '/admin/budgets', icon: 'Banknote' },
      { label: 'Wellbeing & incidents', path: '/admin/wellbeing', icon: 'HeartPulse' },
      { label: 'Activities & awards', path: '/admin/activities', icon: 'Trophy' },
    ] },
    { label: 'Insight', items: [
      { label: 'Reports & analytics', path: '/admin/reports', icon: 'TrendingUp' },
      { label: 'Data tools', path: '/admin/data', icon: 'Database' },
      { label: 'Audit logs', path: '/admin/audit', icon: 'History' },
    ] },
    { label: 'System', items: [
      { label: 'System health', path: '/admin/system', icon: 'Activity' },
      { label: 'Integrations & AI', path: '/admin/integrations', icon: 'Plug' },
      { label: 'Settings', path: '/admin/settings', icon: 'Cog' },
    ] },
  ],

  owner: [
    { label: 'Ownership', items: [
      { label: 'Owner control centre', path: '/owner', icon: 'Landmark' },
      { label: 'Privileged accounts', path: '/owner/accounts', icon: 'KeyRound' },
      { label: 'Security overview', path: '/owner/security', icon: 'ShieldCheck' },
      { label: 'Compliance & accreditation', path: '/owner/compliance', icon: 'ScrollText' },
      { label: 'Platform configuration', path: '/owner/configuration', icon: 'SlidersHorizontal' },
      { label: 'Feature flags', path: '/owner/features', icon: 'Cog' },
      { label: 'Backups & recovery', path: '/owner/backups', icon: 'Database' },
      { label: 'Audit investigation', path: '/owner/audit', icon: 'History' },
    ] },
  ],
};

export const AREA_LABELS = {
  student: 'Student portal',
  teacher: 'Teacher portal',
  parent: 'Parent portal',
  admin: 'Administration',
  owner: 'Owner control centre',
};