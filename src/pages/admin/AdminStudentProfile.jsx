import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';

const Row = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 border-b border-border/70 px-4 py-2.5 last:border-0">
    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-2 break-words text-sm text-foreground">{value === '' || value === undefined ? '—' : value}</dd>
  </div>
);

const TABS = [
  ['overview', 'Overview'], ['personal', 'Personal'], ['admission', 'Admission'], ['academic', 'Academic history'],
  ['placement', 'Class and section'], ['progress', 'Subjects and progress'], ['attendance', 'Attendance'],
  ['assignments', 'Assignments'], ['assessments', 'Quizzes and exams'], ['results', 'Results and reports'],
  ['fees', 'Fees'], ['discounts', 'Discounts and scholarships'], ['guardians', 'Guardians'], ['documents', 'Documents'],
  ['certificates', 'Certificates'], ['feedback', 'Teacher feedback'], ['communication', 'Communication'],
  ['transfers', 'Promotion and transfers'], ['account', 'Account status'], ['audit', 'Audit history'],
];

/** Complete student record with the twenty sections used by the academy office. */
export default function AdminStudentProfile() {
  const { id } = useParams();
  const students = useCollection('students');
  const guardians = useCollection('guardians');
  const results = useCollection('results');
  const attendance = useCollection('attendance');
  const submissions = useCollection('submissions');
  const invoices = useCollection('invoices');
  const payments = useCollection('payments');
  const scholarships = useCollection('scholarships');
  const documents = useCollection('documents');
  const certificates = useCollection('certificates');
  const feedback = useCollection('feedback');
  const messages = useCollection('messages');
  const mastery = useCollection('mastery');
  const auditLogs = useCollection('auditLogs');
  const exams = useCollection('exams');

  const student = students.find((row) => row.id === id);

  if (!student) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Student not found"
          description="This record may have been archived or merged. Search the directory to locate the current record."
          action={<Link to="/admin/students" className="text-sm font-semibold text-primary hover:underline">Back to students</Link>}
        />
      </div>
    );
  }

  const myResults = results.filter((r) => r.studentId === student.id);
  const myAttendance = attendance.filter((a) => a.studentId === student.id);
  const mySubmissions = submissions.filter((s) => s.studentId === student.id);
  const myInvoices = invoices.filter((i) => i.studentId === student.id);
  const myPayments = payments.filter((p) => myInvoices.some((i) => i.id === p.invoiceId));
  const myDocuments = documents.filter((d) => d.studentId === student.id);
  const myCertificates = certificates.filter((c) => c.studentId === student.id);
  const myScholarships = scholarships.filter((s) => s.studentId === student.id);
  const myGuardian = guardians.find((g) => (g.linkedChildren || []).includes(student.name));
  const marked = myAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const rate = myAttendance.length ? Math.round((marked / myAttendance.length) * 100) : student.attendancePct;
  const balance = myInvoices.reduce((sum, row) => sum + row.balance, 0);

  return (
    <div>
      <Link to="/admin/students" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Student directory
      </Link>

      <div className="mt-4">
        <PageHeader
          title={student.name}
          description={`${student.code} · ${student.className} · Section ${student.section} · ${student.academicYear}`}
          breadcrumbs={[{ label: 'Students', path: '/admin/students' }, { label: student.name }]}
          actions={
            <>
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-3.5 text-sm font-semibold text-foreground">
                <Printer className="h-4 w-4" /> Print record
              </button>
              <Link to="/admin/academics" className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
                Transfer, promote or suspend
              </Link>
            </>
          }
        />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Status', value: student.status },
          { label: 'Attendance', value: `${rate}%` },
          { label: 'Fee balance', value: balance ? `PKR ${balance.toLocaleString('en-PK')}` : 'Cleared' },
          { label: 'Certificates', value: `${myCertificates.filter((c) => c.status === 'Issued').length} issued` },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</span>
            <StatusBadge value={String(item.value)} tone="brand" />
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto flex-wrap">
          {TABS.map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="text-xs">{label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Summary</h2>
            <dl className="mt-4 overflow-hidden rounded-xl border border-border">
              <Row label="Class and section" value={`${student.className} · Section ${student.section}`} />
              <Row label="Class teacher" value={student.className ? 'Assigned by the academic office' : '—'} />
              <Row label="Guardian" value={myGuardian ? `${myGuardian.name} (${myGuardian.relation}) · ${myGuardian.phone}` : 'No verified guardian linked'} />
              <Row label="Attendance" value={`${rate}% across ${myAttendance.length} marked sessions`} />
              <Row label="Results published" value={`${myResults.filter((r) => r.status === 'Published').length} of ${myResults.length}`} />
              <Row label="Fee status" value={balance ? `PKR ${balance.toLocaleString('en-PK')} outstanding` : 'Cleared'} />
              <Row label="Documents" value={`${myDocuments.length} on file · ${myDocuments.filter((d) => d.status === 'Approved').length} approved`} />
            </dl>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Actions requiring confirmation</h2>
            <ul className="mt-4 space-y-2.5">
              {['Edit personal details', 'Transfer class or section', 'Promote to the next class', 'Suspend or reactivate the account', 'Archive the record', 'Link a guardian', 'Manage documents'].map((action) => (
                <li key={action} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{action}</span>
                  <span className="text-xs text-muted-foreground">Recorded with a reason</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-4">
          <dl className="overflow-hidden rounded-2xl border border-border bg-card">
            <Row label="Full name" value={student.name} />
            <Row label="Student code" value={student.code} />
            <Row label="Date of birth" value={student.dob} />
            <Row label="Gender" value={student.gender} />
            <Row label="Mobile" value={student.phone} />
            <Row label="Email" value={student.email} />
            <Row label="Address" value={student.address} />
            <Row label="Emergency contact" value={`${student.guardianName} · ${student.guardianPhone}`} />
          </dl>
        </TabsContent>

        <TabsContent value="admission" className="mt-4">
          <dl className="overflow-hidden rounded-2xl border border-border bg-card">
            <Row label="Admission number" value={student.admissionNumber} />
            <Row label="Admission date" value={student.admissionDate} />
            <Row label="Academic year" value={student.academicYear} />
            <Row label="Previous school" value={student.previousSchool} />
            <Row label="Admission status" value={student.status} />
          </dl>
        </TabsContent>

        <TabsContent value="academic" className="mt-4">
          <dl className="overflow-hidden rounded-2xl border border-border bg-card">
            {(student.sectionHistory || []).map((entry, index) => (
              <Row key={index} label={entry.term} value={`Section ${entry.section} · ${entry.reason}`} />
            ))}
            <Row label="Subjects enrolled" value={`${student.className} core subjects`} />
            <Row label="Assessments taken" value={`${myResults.length} recorded results`} />
          </dl>
        </TabsContent>

        <TabsContent value="placement" className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Current placement</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Class</dt><dd className="font-medium text-foreground">{student.className}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Section</dt><dd className="font-medium text-foreground">{student.section}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Roll number</dt><dd className="font-medium text-foreground">{student.rollNumber}</dd></div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Section A and Section B follow the same syllabus. Transfers require a reason and keep the previous
              placement in history.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Placement history</h2>
            <ul className="mt-4 space-y-3">
              {(student.sectionHistory || []).map((entry, index) => (
                <li key={index} className="rounded-xl border border-border bg-background p-3.5">
                  <p className="text-sm font-medium text-foreground">{entry.term} · Section {entry.section}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{entry.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Topic</th>
                  <th className="px-4 py-3">Mastery</th>
                  <th className="px-4 py-3">Evidence</th>
                  <th className="px-4 py-3">Reviewed by</th>
                </tr>
              </thead>
              <tbody>
                {mastery.filter((m) => m.studentId === student.id).map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.topic}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.level} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{row.evidence}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.reviewedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <dl className="mb-4 grid gap-3 sm:grid-cols-3">
            {[
              ['Attendance rate', `${rate}%`],
              ['Sessions marked', myAttendance.length],
              ['Absences', myAttendance.filter((a) => a.status === 'Absent').length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-4">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
                <dd className="mt-1.5 font-display text-xl font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Marked by</th>
                  <th className="px-4 py-3">Correction</th>
                </tr>
              </thead>
              <tbody>
                {myAttendance.slice(0, 12).map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3 text-foreground">{row.subject}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{row.markedBy}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.correction} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Assignment</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Timing</th>
                  <th className="px-4 py-3 text-right">Marks</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {mySubmissions.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.assignment}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.submittedOn}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.late ? 'Late' : 'On time'} /></td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.marks === '—' ? '—' : `${row.marks} / ${row.outOf}`}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Examination</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.filter((e) => e.className === student.className).map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Examination</th>
                  <th className="px-4 py-3 text-right">Marks</th>
                  <th className="px-4 py-3 text-right">Grade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Published</th>
                </tr>
              </thead>
              <tbody>
                {myResults.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.exam}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.marks} / {row.total}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{row.grade}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{row.publishedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="mt-4 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Payable</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {myInvoices.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.category}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{(row.amount - row.discount).toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.paid.toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.balance.toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <h3 className="border-b border-border px-4 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em]">Payments submitted</h3>
            <table className="w-full min-w-[560px] text-sm">
              <tbody>
                {myPayments.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{row.reference}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.method}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.amount.toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Scheme</th>
                  <th className="px-4 py-3 text-right">Concession</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3">Basis</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {myScholarships.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.type}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.percentage}%</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.appliedOn}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.note}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
                {myScholarships.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">No scholarship or discount is recorded for this student.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="guardians" className="mt-4">
          {myGuardian ? (
            <dl className="overflow-hidden rounded-2xl border border-border bg-card">
              <Row label="Guardian" value={myGuardian.name} />
              <Row label="Relationship" value={myGuardian.relation} />
              <Row label="Mobile" value={myGuardian.phone} />
              <Row label="WhatsApp" value={myGuardian.whatsapp} />
              <Row label="Email" value={myGuardian.email} />
              <Row label="Occupation" value={myGuardian.occupation} />
              <Row label="Verification" value={<StatusBadge value={myGuardian.status} />} />
              <Row label="Other children" value={(myGuardian.linkedChildren || []).filter((name) => name !== student.name).join(', ') || '—'} />
            </dl>
          ) : (
            <EmptyState title="No verified guardian linked" description="Link a guardian from the accounts screen after verifying the relationship." />
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Reviewed by</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {myDocuments.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.uploadedOn}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.reviewedBy}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.expiry}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Documents are stored privately and opened only by authorised staff.</p>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Identifier</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Issued</th>
                  <th className="px-4 py-3 text-right">Verifications</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {myCertificates.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{row.code}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.issuedOn}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.verifications}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4 grid gap-4 lg:grid-cols-2">
          {feedback.filter((f) => f.studentName === student.name).map((row) => (
            <article key={row.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-sm font-bold text-foreground">{row.subject} · {row.teacher}</h2>
                <StatusBadge value={row.status} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{row.improvement}</p>
              <p className="mt-2 text-xs text-muted-foreground">Next steps: {row.nextSteps}</p>
            </article>
          ))}
          {feedback.filter((f) => f.studentName === student.name).length === 0 && (
            <p className="text-sm text-muted-foreground">No teacher feedback recorded yet.</p>
          )}
        </TabsContent>

        <TabsContent value="communication" className="mt-4">
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {messages.filter((m) => m.about === student.name).map((row) => (
              <li key={row.id} className="bg-card px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{row.subject}</p>
                  <span className="text-xs text-muted-foreground">{row.sent}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{row.from} → {row.to}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.body}</p>
              </li>
            ))}
            {messages.filter((m) => m.about === student.name).length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No communication recorded for this student.</li>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="transfers" className="mt-4">
          <dl className="overflow-hidden rounded-2xl border border-border bg-card">
            {(student.sectionHistory || []).map((entry, index) => (
              <Row key={index} label={`Transfer ${index + 1}`} value={`${entry.term} · Section ${entry.section} · ${entry.reason}`} />
            ))}
            <Row label="Promotion status" value={student.status === 'Promoted' ? 'Promoted to the next class' : 'Not yet promoted this session'} />
            <Row label="Withdrawal" value={student.status === 'Withdrawn' ? 'Withdrawn — academic and financial history preserved' : 'Not applicable'} />
          </dl>
        </TabsContent>

        <TabsContent value="account" className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Account</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ['Account status', student.status],
                ['Portal access', student.status === 'Active' ? 'Enabled' : 'Restricted'],
                ['Verification', 'Email verified by the office'],
                ['Last sign-in', 'Recorded and reviewed by the office'],
              ].map(([label, value]) => (
                <li key={label} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Authorised actions</h2>
            <ul className="mt-4 space-y-2.5">
              {['Suspend account', 'Reactivate account', 'Require password reset', 'Revoke active sessions', 'Archive record'].map((action) => (
                <li key={action} className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground">{action}</li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 10).map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{row.time}</td>
                    <td className="px-4 py-3 text-foreground">{row.actor}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.action}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.reason}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.outcome} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}