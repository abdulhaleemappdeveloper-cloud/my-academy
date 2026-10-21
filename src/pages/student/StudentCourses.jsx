import { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Play, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import RecordDrawer from '@/components/common/RecordDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/data/store';
import { useSession } from '@/lib/session';

export default function StudentCourses() {
  const { account } = useSession();
  const students = useCollection('students');
  const courses = useCollection('courses');
  const lessons = useCollection('lessons');
  const chapters = useCollection('chapters');
  const student = students.find((s) => s.name === account?.name) || students[9];

  const [openCourse, setOpenCourse] = useState(null);
  const [openLesson, setOpenLesson] = useState(null);

  const myCourses = courses.filter((row) => row.className === student.className || row.className === 'Class 9');
  const courseLessons = (courseId) => lessons.filter((row) => row.courseId === courseId);
  const courseChapters = (subject) => chapters.filter((row) => row.subject === subject).slice(0, 6);

  return (
    <div>
      <PageHeader
        title="My courses"
        description={`Courses for ${student.className} · Section ${student.section}. Open a course to see its chapters, lessons and progress.`}
        breadcrumbs={[{ label: 'Student portal', path: '/student' }, { label: 'My courses' }]}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {myCourses.map((course) => {
          const done = Math.round(courseLessons(course.id).filter((l) => l.status === 'Published').length * 1.5);
          const percent = Math.min(96, done * 2 + 20);
          return (
            <article key={course.id} className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tint text-primary">
                  <BookOpen className="h-4 w-4" />
                </span>
                <StatusBadge value={course.status} />
              </div>
              <h2 className="mt-3.5 font-heading text-base font-bold leading-snug tracking-tight text-foreground">{course.title}</h2>
              <p className="mt-1.5 text-xs text-muted-foreground">{course.teacher} · {course.chapters} chapters · {course.lessons} lessons</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-semibold text-foreground">{percent}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="mt-4 flex flex-1 items-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenCourse(course)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground"
                >
                  <Play className="h-3.5 w-3.5" /> Continue learning
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <RecordDrawer
        open={Boolean(openCourse)}
        onClose={() => setOpenCourse(null)}
        title={openCourse?.title}
        subtitle={`${openCourse?.chapters || 0} chapters · ${openCourse?.lessons || 0} lessons`}
        badge={openCourse?.status}
      >
        {openCourse && (
          <Tabs defaultValue="chapters">
            <TabsList className="w-full">
              <TabsTrigger value="chapters" className="flex-1">Chapters</TabsTrigger>
              <TabsTrigger value="lessons" className="flex-1">Lessons</TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="mt-4 space-y-2.5">
              {courseChapters(openCourse.subject).map((chapter, index) => (
                <div key={chapter.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-bold ${chapter.covered ? 'bg-brand text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{chapter.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {chapter.topics} topics · {chapter.materials} materials · {chapter.covered ? 'covered in class' : 'coming up'}
                    </p>
                  </div>
                  {chapter.covered && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-primary" />}
                </div>
              ))}
              {courseChapters(openCourse.subject).length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">Chapters are being prepared for this course.</p>
              )}
            </TabsContent>

            <TabsContent value="lessons" className="mt-4 space-y-2.5">
              {courseLessons(openCourse.id).map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setOpenLesson(lesson)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:border-primary/40"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{lesson.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {lesson.type} · {lesson.duration} · {lesson.chapter}
                    </span>
                  </span>
                  <StatusBadge value={lesson.status} />
                </button>
              ))}
              {courseLessons(openCourse.id).length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No lessons published for this course yet.</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </RecordDrawer>

      <RecordDrawer
        open={Boolean(openLesson)}
        onClose={() => setOpenLesson(null)}
        title={openLesson?.title}
        subtitle={`${openLesson?.type} · ${openLesson?.duration}`}
        badge={openLesson?.status}
        footer={
          <>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Mark lesson complete
            </button>
            <button type="button" className="inline-flex h-10 items-center rounded-xl border border-input px-4 text-sm font-semibold text-foreground">
              Save to my notes
            </button>
          </>
        }
      >
        {openLesson && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Lesson content</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {openLesson.type === 'PDF notes'
                  ? 'This lesson opens as a document that can be read, enlarged or printed.'
                  : openLesson.type === 'Video lesson'
                  ? 'This lesson plays as an approved video. Playback controls and a transcript are available.'
                  : openLesson.type === 'Practice set'
                  ? 'This lesson contains practice questions with an answer key at the end.'
                  : 'This lesson contains reading material with worked examples and revision points.'}
              </p>
            </div>
            <div className="grid place-items-center rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
              <p className="text-xs text-muted-foreground">
                Media players and document viewers load here once the file storage connection is live. Your progress is
                recorded against this lesson, not the medium used to deliver it.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Last updated {openLesson.updated} · prepared by {openLesson.author}
            </div>
          </div>
        )}
      </RecordDrawer>

      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5 text-primary" /> Lessons and notes are published by subject teachers and reviewed
        by the academic office before students see them.
      </p>
    </div>
  );
}