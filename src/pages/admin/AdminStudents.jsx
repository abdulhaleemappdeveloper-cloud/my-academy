import { Link } from 'react-router-dom';
import ModulePage from '@/components/common/ModulePage';
import StatusBadge from '@/components/common/StatusBadge';
import { STUDENT_STATUSES, CLASSES as CLASS_RECORDS } from '@/data/records';

const CLASS_OPTIONS = [...new Set(CLASS_RECORDS.map((c) => c.name))];

export default function AdminStudents() {
  return (
    <ModulePage
      title="Students"
      description="The full student directory: search, filter, sort, bulk update and export. Open a profile to see the complete academic, attendance, fee and document history."
      breadcrumbs={[{ label: 'Administration', path: '/admin' }, { label: 'Students' }]}
      collection="students"
      searchKeys={['name', 'code', 'rollNumber', 'admissionNumber', 'guardianName', 'guardianPhone']}
      searchPlaceholder="Search by name, student code, roll number or guardian…"
      filters={[
        { key: 'className', label: 'Class', options: CLASS_OPTIONS },
        { key: 'section', label: 'Section', options: ['A', 'B'] },
        { key: 'status', label: 'Status', options: STUDENT_STATUSES },
        { key: 'scholarship', label: 'Scholarship', options: ['None', 'Merit 25%', 'Need-based 40%'] },
      ]}
      bulkStatus={{ key: 'status', options: STUDENT_STATUSES }}
      columns={[
        { key: 'name', label: 'Student', render: (row) => (
          <span className="flex items-center gap-2.5">
            <img src={row.photo} alt="" className="h-8 w-8 rounded-lg object-cover" loading="lazy" />
            <span>
              <span className="block font-medium text-foreground">{row.name}</span>
              <span className="block text-xs text-muted-foreground">{row.code}</span>
            </span>
          </span>
        ) },
        { key: 'className', label: 'Class' },
        { key: 'section', label: 'Section' },
        { key: 'rollNumber', label: 'Roll number' },
        { key: 'guardianName', label: 'Guardian' },
        { key: 'attendancePct', label: 'Attendance', align: 'right', render: (row) => (
          <StatusBadge value={`${row.attendancePct}%`} tone={row.attendancePct >= 85 ? 'success' : 'warning'} />
        ) },
        { key: 'feeBalance', label: 'Fee balance', align: 'right', render: (row) => (row.feeBalance ? `PKR ${row.feeBalance.toLocaleString('en-PK')}` : 'Cleared') },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]}
      createFields={[
        { key: 'name', label: 'Student name', required: true },
        { key: 'className', label: 'Class', type: 'select', options: CLASS_OPTIONS },
        { key: 'section', label: 'Section', type: 'select', options: ['A', 'B'] },
        { key: 'guardianName', label: 'Guardian name' },
        { key: 'guardianPhone', label: 'Guardian mobile' },
        { key: 'admissionDate', label: 'Admission date', type: 'date' },
      ]}
      createLabel="Enrol a student"
      detailFields={['code', 'className', 'section', 'status', 'admissionNumber', 'rollNumber', 'dob', 'guardianName', 'guardianPhone', 'guardianRelation', 'phone', 'email', 'address', 'previousSchool', 'admissionDate', 'academicYear', 'attendancePct', 'feeBalance', 'scholarship']}
      detailExtra={(row) => (
        <Link
          to={`/admin/students/${row.id}`}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground"
        >
          Open full student profile
        </Link>
      )}
      pageSize={10}
      footerNote="Ordinary removals are soft-deleted and stay in history"
    />
  );
}