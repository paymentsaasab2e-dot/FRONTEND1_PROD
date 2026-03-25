import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { lmsCourseContent, lmsCourseMeta, lmsCoursesWithAI, lmsLessonContent } from '../../../../data/ai-mock';
import { flattenCourseLessons } from '../../../course-utils';
import { LmsEmptyState } from '../../../../components/states/LmsEmptyState';
import { LessonPlayerClient } from './player-client';

export default async function CourseLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; lessonId: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  const { id, lessonId } = await params;
  const sp = (await searchParams) ?? {};
  const mode = sp.mode === 'review' ? 'review' : 'learn';

  const course = lmsCoursesWithAI.find((c) => c.id === id);
  const content = lmsCourseContent[id];
  if (!course || !content) {
    return (
      <div className="space-y-8">
        <Link href="/lms/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to courses
        </Link>
        <LmsEmptyState
          title="Course not found"
          body={`No course found for id “${id}”.`}
          action={
            <Link
              href="/lms/courses"
              className="inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
            >
              Browse courses
            </Link>
          }
        />
      </div>
    );
  }

  const flat = flattenCourseLessons(content.modules);
  const idx = flat.findIndex((l) => l.lessonId === lessonId);
  if (idx < 0) {
    return (
      <div className="space-y-8">
        <Link href={`/lms/courses/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to course
        </Link>
        <LmsEmptyState
          title="Lesson not found"
          body={`No lesson “${lessonId}” exists for this course.`}
          action={
            <Link
              href={`/lms/courses/${id}`}
              className="inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
            >
              Open course overview
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <LessonPlayerClient
      course={course}
      courseMeta={lmsCourseMeta[id]}
      modules={content.modules}
      flatLessons={flat}
      initialIndex={idx}
      mode={mode}
      lessonDetails={lmsLessonContent}
    />
  );
}

