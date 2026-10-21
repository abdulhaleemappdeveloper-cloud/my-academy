import { cn } from '@/lib/utils';

const TONES = {
  neutral: 'bg-muted text-muted-foreground border-border',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
  danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30',
  info: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30',
  brand: 'bg-brand-tint text-primary border-primary/20',
  gold: 'bg-gold-soft text-foreground border-gold/40',
};

const MAP = {
  // positive
  Active: 'success', Present: 'success', Approved: 'success', Published: 'success', Paid: 'success',
  Issued: 'success', Completed: 'success', Connected: 'success', Verified: 'success', Delivered: 'success',
  'Within budget': 'success', Healthy: 'success', Success: 'success', Marked: 'success', Secure: 'success',
  Mastered: 'success', Returned: 'success', Allocated: 'success', Confirmed: 'success', Succeeded: 'success',
  'Admission completed': 'success', Valid: 'success', Resolved: 'success', Enabled: 'success', 'In use': 'success',
  'No gaps detected': 'success', 'Not required': 'neutral',
  // attention
  Pending: 'warning', 'Pending approval': 'warning', 'Pending verification': 'warning', 'Pending marking': 'warning',
  Draft: 'warning', 'In review': 'warning', 'Under review': 'warning', 'Awaiting approval': 'warning',
  Overdue: 'danger', Unpaid: 'warning', 'Partially paid': 'warning', Late: 'warning', 'On leave': 'warning',
  Queued: 'warning', Scheduled: 'info', 'Scheduled review': 'warning', 'Needs attention': 'warning',
  'Renewal due soon': 'warning', 'Correction requested': 'warning', 'Information requested': 'warning',
  'Recheck requested': 'warning', 'Waiting on user': 'warning', 'Rollout': 'warning', Emerging: 'warning',
  Developing: 'warning', 'Needs revision': 'warning', 'Marking': 'warning', 'Grading': 'warning',
  // negative
  Rejected: 'danger', Failed: 'danger', Suspended: 'danger', Revoked: 'danger', Absent: 'danger',
  'Connection failed': 'danger', Breached: 'danger', Expired: 'danger', Withdrawn: 'danger',
  'Configuration incomplete': 'danger', 'Not configured': 'neutral', Degraded: 'danger', Disabled: 'neutral',
  'Not connected': 'neutral', Open: 'info', 'New': 'info', Applicant: 'info', Submitted: 'info',
  // academic states
  Admitted: 'info', Promoted: 'success', Graduated: 'brand', Archived: 'neutral', Waitlisted: 'warning',
  'Under maintenance': 'warning', Available: 'success', Issued_duplicate: 'success',
  Teacher: 'brand', Student: 'info', Parent: 'gold', Admin: 'brand', Owner: 'brand', Editor: 'info', Staff: 'neutral',
  High: 'danger', Urgent: 'danger', Critical: 'danger', Medium: 'warning', Low: 'neutral',
  'In progress': 'info', Submitted_duplicate: 'info', 'Follow-up scheduled': 'info', Monitoring: 'info',
  'On campus': 'info', 'Issued': 'success',
};

export function statusTone(value) {
  if (!value) return 'neutral';
  if (MAP[value]) return MAP[value];
  const text = String(value);
  if (/^Pending|Awaiting|Requested|Queued|Waiting/i.test(text)) return 'warning';
  if (/Approved|Published|Verified|Active|Completed|Paid|Success/i.test(text)) return 'success';
  if (/Rejected|Failed|Denied|Absent|Revoked|Expired/i.test(text)) return 'danger';
  if (/Draft|Review|Partial|Overdue/i.test(text)) return 'warning';
  return 'neutral';
}

export default function StatusBadge({ value, tone, className }) {
  const text = value === undefined || value === null || value === '' ? '—' : String(value);
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        TONES[tone || statusTone(text)],
        className
      )}
    >
      {text}
    </span>
  );
}