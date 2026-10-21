import { useState } from 'react';
import { AlertTriangle, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
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

export default function ParentChildren() {
  const { account } = useSession();
  const guardians = useCollection('guardians');
  const students = useCollection('students');
  const teachers = useCollection('teachers');
  const documents = useCollection('documents');
  const attendance = useCollection('attendance');
  const results = useCollection('results');

  const guardian = guardians.find((g) => g.name === account?.name) || guardians[0];
  const children = students.filter((s) => (guardian.linkedChildren || []).includes(s.name));
  const [active, setActive] = useState(children[0]?.id || null);
  const child = children.find((c) => c.id === active) || children[0];

  return (
    <div>
      <PageHeader
        title="Linked children"
        description="Each child's academic profile. A guardian link is created only after the campus office verifies the relationship, and it can be revoked when it is no longer valid."
        breadcrumbs={[{ label: 'Parent portal', path: '/parent' }, { label: 'Linked children' }]}
      />

      {children.length === 0 ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            No verified child is linked to this account yet. Please contact the campus office so the relationship can be
            verified. Access is never granted from a student ID alone.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Children linked" value={children.length} hint={children.map((c) => c.name.split(' ')[0]).join(', ')} icon={Users} />
            <StatCard label="Guardian verification" value={guardian.status} hint={`Verified by the campus office · ${guardian.relation}`} tone="brand" icon={ShieldCheck} />
            <StatCard label="Relationship" value={guardian.relation} hint={`Linked on ${guardian.lastContact}`} icon={GraduationCap} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {children.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  active === item.id ? 'border-primary/40 bg-brand-tint text-primary' : 'border-border bg-card text-foreground hover:border-primary/30'
                }`}
              >
                {item.name} · {item.className}
              </button>
            ))}
          </div>

          {child && (
            <Tabs defaultValue="profile" className="mt-5">
              <TabsList className="flex-wrap">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="placement">Class and section</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <img src={child.photo} alt={child.name} className="h-16 w-16 rounded-2xl object-cover" />
                    <div>
                      <h2 className="font-display text-xl font-semibold tracking-tight">{child.name}</h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">{child.code} · {child.className} · Section {child.section}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge value={child.status} />
                        {child.scholarship !== 'None' && <StatusBadge value={child.scholarship} tone="gold" />}
                      </div>
                    </div>
                  </div>

                  <dl className="mt-6 overflow-hidden rounded-xl border border-border">
                    <Row label="Admission number" value={child.admissionNumber} />
                    <Row label="Date of birth" value={child.dob} />
                    <Row label="Guardian" value={`${child.guardianName} (${child.guardianRelation})`} />
                    <Row label="Guardian contact" value={child.guardianPhone} />
                    <Row label="Address" value={child.address} />
                    <Row label="Admission date" value={child.admissionDate} />
                    <Row label="Academic year" value={child.academicYear} />
                  </dl>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Corrections to official details are requested from the campus office and reviewed before any change is
                    made.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="placement" className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="font-heading text-base font-bold tracking-tight">Current placement</h2>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Class</dt><dd className="font-medium text-foreground">{child.className}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Section</dt><dd className="font-medium text-foreground">{child.section}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Subject teachers</dt><dd className="text-right font-medium text-foreground">{teachers.filter((t) => t.classes.includes(child.className)).slice(0, 3).map((t) => t.name).join(', ') || 'Assigned by the office'}</dd></div>
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Section B is an academic-support arrangement with additional revision time, not a permanent label.
                    Placement is reviewed each term using overall performance.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="font-heading text-base font-bold tracking-tight">Placement history</h2>
                  <ul className="mt-4 space-y-3">
                    {(child.sectionHistory || []).map((entry, index) => (
                      <li key={index} className="rounded-xl border border-border bg-background p-3.5">
                        <p className="text-sm font-medium text-foreground">{entry.term} · Section {entry.section}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{entry.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="mt-4">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Session</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.filter((a) => a.studentId === child.id).slice(0, 12).map((row) => (
                        <tr key={row.id} className="border-b border-border/70 last:border-0">
                          <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                          <td className="px-4 py-3 text-foreground">{row.subject}</td>
                          <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{row.note}</td>
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
                      </tr>
                    </thead>
                    <tbody>
                      {results.filter((r) => r.studentId === child.id).map((row) => (
                        <tr key={row.id} className="border-b border-border/70 last:border-0">
                          <td className="px-4 py-3 font-medium text-foreground">{row.subject}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.exam}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{row.marks} / {row.total}</td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">{row.grade}</td>
                          <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                        <th className="px-4 py-3">Document</th>
                        <th className="px-4 py-3">Uploaded</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.filter((d) => d.studentId === child.id).map((row) => (
                        <tr key={row.id} className="border-b border-border/70 last:border-0">
                          <td className="px-4 py-3 font-medium text-foreground">{row.category}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.uploadedOn}</td>
                          <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Identity documents are stored privately. Downloads are recorded and only authorised staff and the
                  verified guardian can open them.
                </p>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}