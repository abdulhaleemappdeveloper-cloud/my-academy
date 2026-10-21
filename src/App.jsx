import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import PublicLayout from '@/components/site/PublicLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Campus from '@/pages/Campus';
import Contact from '@/pages/Contact';
import Admissions from '@/pages/Admissions';
import AdmissionApply from '@/pages/AdmissionApply';
import ApplicationStatus from '@/pages/ApplicationStatus';
import Classes from '@/pages/Classes';
import Subjects from '@/pages/Subjects';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Notes from '@/pages/Notes';
import NoteDetail from '@/pages/NoteDetail';
import PastPapers from '@/pages/PastPapers';
import SolvedPapers from '@/pages/SolvedPapers';
import ExamPreparation from '@/pages/ExamPreparation';
import Teachers from '@/pages/Teachers';
import TeacherProfile from '@/pages/TeacherProfile';
import Announcements from '@/pages/Announcements';
import Events from '@/pages/Events';
import FAQ from '@/pages/FAQ';
import HelpCenter from '@/pages/HelpCenter';
import Stories from '@/pages/Stories';
import Scholarships from '@/pages/Scholarships';
import PaymentInstructions from '@/pages/PaymentInstructions';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import RefundPolicy from '@/pages/RefundPolicy';
import Accessibility from '@/pages/Accessibility';
import Consent from '@/pages/Consent';
import Notices from '@/pages/Notices';
import Downloads from '@/pages/Downloads';
import SearchPage from '@/pages/Search';
import Support from '@/pages/Support';
import VerifyCertificate from '@/pages/VerifyCertificate';
import PublicPage from '@/pages/PublicPage';
import PortalSignIn from '@/pages/PortalSignIn';
import RoleSignIn from '@/components/portal/RoleSignIn';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import PortalLayout from '@/components/portal/PortalLayout';
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentCourses from '@/pages/student/StudentCourses';
import StudentLessons from '@/pages/student/StudentLessons';
import StudentQuizzes from '@/pages/student/StudentQuizzes';
import StudentExams from '@/pages/student/StudentExams';
import StudentAssignments from '@/pages/student/StudentAssignments';
import StudentAttendance from '@/pages/student/StudentAttendance';
import StudentTimetable from '@/pages/student/StudentTimetable';
import StudentProgress from '@/pages/student/StudentProgress';
import StudentResults from '@/pages/student/StudentResults';
import StudentCertificates from '@/pages/student/StudentCertificates';
import StudentFees from '@/pages/student/StudentFees';
import StudentPayments from '@/pages/student/StudentPayments';
import StudentProfile from '@/pages/student/StudentProfile';
import StudentInbox from '@/pages/student/StudentInbox';
import StudentTutor from '@/pages/student/StudentTutor';
import StudentSupport from '@/pages/student/StudentSupport';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import TeacherClasses from '@/pages/teacher/TeacherClasses';
import TeacherAttendance from '@/pages/teacher/TeacherAttendance';
import TeacherMaterial from '@/pages/teacher/TeacherMaterial';
import TeacherQuestions from '@/pages/teacher/TeacherQuestions';
import TeacherAIQuiz from '@/pages/teacher/TeacherAIQuiz';
import TeacherQuizzes from '@/pages/teacher/TeacherQuizzes';
import TeacherExams from '@/pages/teacher/TeacherExams';
import TeacherGrading from '@/pages/teacher/TeacherGrading';
import TeacherAssignments from '@/pages/teacher/TeacherAssignments';
import TeacherStudents from '@/pages/teacher/TeacherStudents';
import TeacherFeedback from '@/pages/teacher/TeacherFeedback';
import TeacherTimetable from '@/pages/teacher/TeacherTimetable';
import TeacherInbox from '@/pages/teacher/TeacherInbox';
import ParentDashboard from '@/pages/parent/ParentDashboard';
import ParentChildren from '@/pages/parent/ParentChildren';
import ParentAttendance from '@/pages/parent/ParentAttendance';
import ParentResults from '@/pages/parent/ParentResults';
import ParentProgress from '@/pages/parent/ParentProgress';
import ParentAssignments from '@/pages/parent/ParentAssignments';
import ParentFees from '@/pages/parent/ParentFees';
import ParentPayments from '@/pages/parent/ParentPayments';
import ParentMeetings from '@/pages/parent/ParentMeetings';
import ParentInbox from '@/pages/parent/ParentInbox';
import ParentProfile from '@/pages/parent/ParentProfile';
import AdminCommandCenter from '@/pages/admin/AdminCommandCenter';
import AdminApprovals from '@/pages/admin/AdminApprovals';
import AdminStudents from '@/pages/admin/AdminStudents';
import AdminStudentProfile from '@/pages/admin/AdminStudentProfile';
import AdminPeople from '@/pages/admin/AdminPeople';
import AdminRoles from '@/pages/admin/AdminRoles';
import AdminAcademics from '@/pages/admin/AdminAcademics';
import AdminTimetable from '@/pages/admin/AdminTimetable';
import AdminAttendance from '@/pages/admin/AdminAttendance';
import AdminAdmissions from '@/pages/admin/AdminAdmissions';
import AdminQuestions from '@/pages/admin/AdminQuestions';
import AdminQuizzes from '@/pages/admin/AdminQuizzes';
import AdminExams from '@/pages/admin/AdminExams';
import AdminResults from '@/pages/admin/AdminResults';
import AdminCertificates from '@/pages/admin/AdminCertificates';
import AdminFees from '@/pages/admin/AdminFees';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminScholarships from '@/pages/admin/AdminScholarships';
import AdminPages from '@/pages/admin/AdminPages';
import AdminBuilder from '@/pages/admin/AdminBuilder';
import AdminMedia from '@/pages/admin/AdminMedia';
import AdminCommunications from '@/pages/admin/AdminCommunications';
import AdminDocuments from '@/pages/admin/AdminDocuments';
import AdminOperations from '@/pages/admin/AdminOperations';
import AdminHR from '@/pages/admin/AdminHR';
import AdminBudgets from '@/pages/admin/AdminBudgets';
import AdminWellbeing from '@/pages/admin/AdminWellbeing';
import AdminActivities from '@/pages/admin/AdminActivities';
import AdminReports from '@/pages/admin/AdminReports';
import AdminData from '@/pages/admin/AdminData';
import AdminAudit from '@/pages/admin/AdminAudit';
import AdminSystem from '@/pages/admin/AdminSystem';
import AdminIntegrations from '@/pages/admin/AdminIntegrations';
import AdminSettings from '@/pages/admin/AdminSettings';
import OwnerCenter from '@/pages/owner/OwnerCenter';
import OwnerAccounts from '@/pages/owner/OwnerAccounts';
import OwnerSecurity from '@/pages/owner/OwnerSecurity';
import OwnerCompliance from '@/pages/owner/OwnerCompliance';
import OwnerConfiguration from '@/pages/owner/OwnerConfiguration';
import OwnerFeatures from '@/pages/owner/OwnerFeatures';
import OwnerBackups from '@/pages/owner/OwnerBackups';
import OwnerAudit from '@/pages/owner/OwnerAudit';
import { SessionProvider } from '@/lib/session';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/portal" element={<PortalSignIn />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/admin" element={<RoleSignIn role="admin" />} />
      <Route path="/login/student" element={<RoleSignIn role="student" />} />
      <Route path="/login/teacher" element={<RoleSignIn role="teacher" />} />
      <Route path="/login/parent" element={<RoleSignIn role="parent" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/admissions/apply" element={<AdmissionApply />} />
        <Route path="/admissions/status" element={<ApplicationStatus />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/past-papers" element={<PastPapers />} />
        <Route path="/solved-papers" element={<SolvedPapers />} />
        <Route path="/exam-preparation" element={<ExamPreparation />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/:id" element={<TeacherProfile />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/events" element={<Events />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/payment-instructions" element={<PaymentInstructions />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/verify-certificate" element={<VerifyCertificate />} />
        <Route path="/p/:slug" element={<PublicPage />} />
      </Route>
      <Route path="/student" element={<PortalLayout area="student" />}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="lessons" element={<StudentLessons />} />
        <Route path="papers" element={<StudentLessons />} />
        <Route path="quizzes" element={<StudentQuizzes />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="planner" element={<StudentProgress />} />
        <Route path="flashcards" element={<StudentProgress />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="notifications" element={<StudentInbox />} />
        <Route path="messages" element={<StudentInbox />} />
        <Route path="tutor" element={<StudentTutor />} />
        <Route path="support" element={<StudentSupport />} />
      </Route>
      <Route path="/teacher" element={<PortalLayout area="teacher" />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="material" element={<TeacherMaterial />} />
        <Route path="resources" element={<TeacherMaterial />} />
        <Route path="lesson-plans" element={<TeacherMaterial />} />
        <Route path="questions" element={<TeacherQuestions />} />
        <Route path="ai-quiz" element={<TeacherAIQuiz />} />
        <Route path="quizzes" element={<TeacherQuizzes />} />
        <Route path="exams" element={<TeacherExams />} />
        <Route path="grading" element={<TeacherGrading />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="feedback" element={<TeacherFeedback />} />
        <Route path="timetable" element={<TeacherTimetable />} />
        <Route path="notifications" element={<TeacherInbox />} />
        <Route path="messages" element={<TeacherInbox />} />
        <Route path="announcements" element={<TeacherInbox />} />
      </Route>
      <Route path="/parent" element={<PortalLayout area="parent" />}>
        <Route index element={<ParentDashboard />} />
        <Route path="children" element={<ParentChildren />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="results" element={<ParentResults />} />
        <Route path="progress" element={<ParentProgress />} />
        <Route path="assignments" element={<ParentAssignments />} />
        <Route path="fees" element={<ParentFees />} />
        <Route path="payments" element={<ParentPayments />} />
        <Route path="meetings" element={<ParentMeetings />} />
        <Route path="calendar" element={<ParentMeetings />} />
        <Route path="notifications" element={<ParentInbox />} />
        <Route path="messages" element={<ParentInbox />} />
        <Route path="profile" element={<ParentProfile />} />
        <Route path="support" element={<ParentProfile />} />
      </Route>
      <Route path="/admin" element={<PortalLayout area="admin" />}>
        <Route index element={<AdminCommandCenter />} />
        <Route path="approvals" element={<AdminApprovals />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="students/:id" element={<AdminStudentProfile />} />
        <Route path="people" element={<AdminPeople />} />
        <Route path="roles" element={<AdminRoles />} />
        <Route path="academics" element={<AdminAcademics />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="admissions" element={<AdminAdmissions />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="scholarships" element={<AdminScholarships />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="builder" element={<AdminBuilder />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="communications" element={<AdminCommunications />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="library" element={<AdminOperations />} />
        <Route path="transport" element={<AdminOperations />} />
        <Route path="inventory" element={<AdminOperations />} />
        <Route path="facilities" element={<AdminOperations />} />
        <Route path="hr" element={<AdminHR />} />
        <Route path="budgets" element={<AdminBudgets />} />
        <Route path="wellbeing" element={<AdminWellbeing />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="data" element={<AdminData />} />
        <Route path="audit" element={<AdminAudit />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="integrations" element={<AdminIntegrations />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="/owner" element={<PortalLayout area="owner" />}>
        <Route index element={<OwnerCenter />} />
        <Route path="accounts" element={<OwnerAccounts />} />
        <Route path="security" element={<OwnerSecurity />} />
        <Route path="compliance" element={<OwnerCompliance />} />
        <Route path="configuration" element={<OwnerConfiguration />} />
        <Route path="features" element={<OwnerFeatures />} />
        <Route path="backups" element={<OwnerBackups />} />
        <Route path="audit" element={<OwnerAudit />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <SessionProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
      </SessionProvider>
    </AuthProvider>
  )
}

export default App