import { Award, BadgeCheck, ShieldCheck, Trophy } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function StudentCertificates() {
  const { account } = useSession();
  const students = useCollection('students');
  const certificates = useCollection('certificates');
  const awards = useCollection('awards');
  const portfolios = useCollection('portfolios');
  const student = students.find((s) => s.name === account?.name) || students[9];
  const mine = certificates.filter((row) => row.studentId === student.id || row.studentName === student.name);
  const myAwards = awards.filter((row) => row.studentName === student.name);
  const portfolio = portfolios.find((row) => row.studentName === student.name);

  return (
    <div>
      <PageHeader
        title="Certificates and achievements"
        description="Certificates issued to you, activity achievements and your study portfolio. Each certificate carries an identifier that can be verified."
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'Certificates' }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Certificates issued" value={mine.filter((c) => c.status === 'Issued').length} hint="Available to print or download" tone="brand" icon={Award} />
        <StatCard label="Awaiting eligibility" value={mine.filter((c) => c.eligibility !== 'Verified').length} hint="Requirements checked by the office" tone="warning" />
        <StatCard label="Activity awards" value={myAwards.length} hint="Clubs, competitions and sport" icon={Trophy} />
        <StatCard label="Verifications" value={mine.reduce((sum, c) => sum + c.verifications, 0)} hint="Times your certificates were checked" icon={BadgeCheck} />
      </div>

      <Tabs defaultValue="certificates" className="mt-6">
        <TabsList>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="awards">Achievements</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="mt-4">
          <DataTable
            rows={mine}
            searchKeys={['code', 'type', 'className']}
            searchPlaceholder="Search certificates…"
            filters={[
              { key: 'type', label: 'Type', options: ['Course completion', 'Academic completion', 'Achievement', 'Participation'] },
              { key: 'status', label: 'Status', options: ['Issued', 'Draft', 'Revoked'] },
            ]}
            columns={[
              { key: 'code', label: 'Identifier', render: (row) => <span className="font-mono text-xs font-semibold">{row.code}</span> },
              { key: 'type', label: 'Type' },
              { key: 'className', label: 'Class' },
              { key: 'issuedOn', label: 'Issued' },
              { key: 'eligibility', label: 'Eligibility', render: (row) => <StatusBadge value={row.eligibility} /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            selectable={false}
            footerNote="Certificates are issued only after eligibility requirements are confirmed"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-cream p-4">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Anyone may confirm a certificate using its identifier on the public verification page. Only the type,
              recipient and validity are shown — never marks, attendance or guardian details.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="awards" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myAwards.map((award) => (
            <div key={award.id} className="rounded-2xl border border-border bg-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-soft text-foreground">
                <Trophy className="h-4 w-4" />
              </span>
              <h2 className="mt-3 font-heading text-sm font-bold text-foreground">{award.award}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{award.activity} · {award.date}</p>
              <p className="mt-3 text-xs text-muted-foreground">Awarded by {award.awardedBy}</p>
              <div className="mt-3">
                <StatusBadge value={award.certificate} />
              </div>
            </div>
          ))}
          {myAwards.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Activity awards appear here when you take part in a club, competition or sports team.
            </p>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="mt-4">
          {!portfolio ? (
            <p className="text-sm text-muted-foreground">
              Your portfolio is created as work samples are approved by teachers.
            </p>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight">Study portfolio</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{portfolio.className} · last updated {portfolio.lastUpdated}</p>
                </div>
                <StatusBadge value={portfolio.visibility} />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-4">
                {[
                  ['Projects', portfolio.projects],
                  ['Assignments', portfolio.assignments],
                  ['Certificates', portfolio.certificates],
                  ['Achievements', portfolio.achievements],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-border bg-background p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                    <p className="mt-1.5 font-display text-xl font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Only work you and your teachers have chosen to include appears in the portfolio. Private submissions are
                never published automatically.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}