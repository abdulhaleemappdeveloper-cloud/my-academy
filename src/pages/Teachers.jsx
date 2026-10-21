import DirectoryPage from '@/components/site/DirectoryPage';
import { CLASSES, SUBJECTS, TEACHERS } from '@/data/academy';
import TeacherCard from '@/components/site/TeacherCard';

export default function Teachers() {
  return (
    <DirectoryPage
      eyebrow="Teaching team"
      title="Teacher directory"
      description="Subject teachers, class teachers and coordinators. Every teacher profile lists qualifications, the classes they teach and the subjects they handle."
      items={TEACHERS}
      searchKeys={['name', 'subject', 'role', 'classes']}
      filters={[
        { key: 'subject', label: 'Subject', options: SUBJECTS },
        { key: 'classes', label: 'Class group', options: CLASSES.map((c) => c.name) },
      ]}
      renderCard={(teacher) => <TeacherCard teacher={teacher} />}
    />
  );
}