import { Link } from 'react-router-dom';
import { GraduationCap, Lock, ShieldCheck, UserCog, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

const Row = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 border-b border-border/70 px-4 py-2.5 last:border-0">
    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-2 break-words text-sm text-foreground">{value}</dd>
  </div>
);

export default function StudentProfile() {
  const { account } = useSession();
  const students = useCollection('students');
  const guardians = useCollection('guardians');
  const documents = useCollection('documents');
  const student = students.find((s) => s.name === account?.name) || students[9];
  const guardian = guardians.find((row) => row.linkedChildren?.includes(student.name));

  return (
    <div>
      <PageHeader
        title="My profile"
        description="Your personal record, guardian link, class placement and account security. Corrections to official details go through the campus office."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'My profile' }]}
      />

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-5">
          <img src={student.photo} alt={student.name} className="h-20 w-20 rounded-2xl object-cover" />
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold tracking-tight">{student.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {student.code} · {student.className} · Section {student.section} · Roll {student.rollNumber}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge value={student.status} />
              <StatusBadge value={`Admission ${student.admissionNumber}`} tone="neutral" />
              {student.scholarship !== 'None' && <StatusBadge value={student.scholarship} tone="gold" />}
            </div>
          </div>
          <div className="ml-auto grid gap-2 sm:grid-cols-2">
            <Link to="/student/results" className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              My results
            </Link>
            <Link to="/student/support" className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              Request a correction
            </Link>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="personal">Personal information</TabsTrigger>
          <TabsTrigger value="guardian">Guardian</TabsTrigger>
          <TabsTrigger value="academic">Class and subjects</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Account and privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <dl className="overflow-hidden rounded-2xl border border-border bg-card">
            <Row label="Full name" value={student.name} />
            <Row label="Student ID" value={student.code} />
            <Row label="Admission number" value={student.admissionNumber} />
            <Row label="Roll number" value={student.rollNumber} />
            <Row label="Date of birth" value={student.dob} />
            <Row label="Gender" value={student.gender} />
            <Row label="Email" value={student.email} />
            <Row label="Mobile" value={student.phone} />
            <Row label="Address" value={student.address} />
            <Row label="Previous school" value={student.previousSchool} />
            <Row label="Admission date" value={student.admissionDate} />
            <Row label="Academic year" value={student.academicYear} />
          </dl>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <UserCog className="h-3.5 w-3.5 text-primary" /> Name, date of birth and admission details are corrected only
            by the campus office, with a recorded reason.
          </p>
        </TabsContent>

        <TabsContent value="guardian" className="mt-4">
          {guardian ? (
            <>
              <dl className="overflow-hidden rounded-2xl border border-border bg-card">
                <Row label="Guardian" value={guardian.name} />
                <Row label="Relationship" value={guardian.relation} />
                <Row label="Mobile" value={guardian.phone} />
                <Row label="WhatsApp" value={guardian.whatsapp} />
                <Row label="Email" value={guardian.email} />
                <Row label="Occupation" value={guardian.occupation} />
                <Row label="Linked children" value={(guardian.linkedChildren || []).join(', ')} />
                <Row label="Verification" value={<StatusBadge value={guardian.status} />} />
              </dl>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-primary" /> A guardian sees your attendance, results, assignments and
                fee status only after the campus office verifies the relationship.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No guardian is linked to your record yet.</p>
          )}
        </TabsContent>

        <TabsContent value="academic" className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <GraduationCap className="h-4 w-4 text-primary" /> Placement
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {[
                ['Class', student.className],
                ['Section', `${student.section} — ${student.section === 'A' ? 'core group' : 'academic support group'}`],
                ['Academic year', student.academicYear],
                ['Class teacher', 'Assigned by the academic office'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Section placement is reviewed each term using overall performance, never a single score, and any transfer
              records a reason and keeps your previous placement in history.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Section history</h2>
            <ul className="mt-4 space-y-3">
              {(student.sectionHistory || []).map((entry, index) => (
                <li key={index} className="rounded-xl border border-border bg-background p-3.5">
                  <p className="text-sm font-medium text-foreground">{entry.term}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Section {entry.section} · {entry.reason}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Reviewed by</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.filter((row) => row.studentId === student.id).map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.uploadedOn}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.reviewedBy}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-primary" /> Identity documents are stored privately and opened only by
            authorised admissions and academic staff.
          </p>
        </TabsContent>

        <TabsContent value="security" className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold tracking-tight">
              <ShieldCheck className="h-4 w-4 text-primary" /> Account security
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ['Password', 'Change it from the sign-in screen if you forget it'],
                ['Sessions', 'Signing out ends the session on that device'],
                ['Two-step verification', 'Off — recommended if your account is shared with a guardian'],
                ['Last sign-in', 'Recorded and visible to the academy office'],
              ].map(([label, value]) => (
                <li key={label} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-5 inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Change password
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-base font-bold tracking-tight">Privacy settings</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your attendance, results, assignments and fee records are visible only to you, your verified guardian and
              the staff who need them. Your profile is never listed publicly.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                'Display name shown to teachers and classmates',
                'Guardian notifications for attendance and results',
                'Participation in discussion forums',
              ].map((line) => (
                <li key={line} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <span className="text-sm text-foreground">{line}</span>
                  <StatusBadge value="Enabled" />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Requests to change these settings are processed by the campus office on receipt.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}