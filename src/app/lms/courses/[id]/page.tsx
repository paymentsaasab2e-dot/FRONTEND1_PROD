import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, ListChecks, Sparkles } from 'lucide-react';
import { LMS_CARD_CLASS, LMS_PAGE_SUBTITLE, LMS_SECTION_TITLE } from '../../constants';
import { lmsCourseContent, lmsCourseMeta, lmsCoursesWithAI } from '../../data/ai-mock';
import { CoursePlayerClient } from './player-client';
import { CourseLessonsClient } from './CourseLessonsClient';
import { LmsEmptyState } from '../../components/states/LmsEmptyState';

export default async function LmsCourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  // Next.js 16 (Turbopack) may provide params/searchParams as Promises.
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const mode = sp.mode === 'review' ? 'review' : 'learn';

  const course = lmsCoursesWithAI.find((c) => c.id === id);
  const content = lmsCourseContent[id];
  const meta = lmsCourseMeta[id];
  if (!course || !content) {
    return (
      <div className="space-y-8">
        <div className="min-w-0">
          <Link
            href="/lms/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back to courses
          </Link>
        </div>
        <LmsEmptyState
          title="Course not found"
          body={`We couldn't find a course with id “${id}”.`}
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/lms/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back to courses
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{course.title}</h1>
          <p className={`${LMS_PAGE_SUBTITLE} mt-1`}>{course.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 font-semibold">
              <BookOpen className="h-4 w-4 text-gray-500" strokeWidth={2} />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-100 px-3 py-1 font-semibold text-violet-900">
              <ListChecks className="h-4 w-4 text-violet-700" strokeWidth={2} />
              {content.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1 font-semibold text-gray-800">
              Mode: {mode === 'review' ? 'Review' : 'Learn'}
            </span>
          </div>
        </div>

        <div className={`${LMS_CARD_CLASS} sm:max-w-sm`}>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Progress</p>
          <div className="mt-3">
            <CoursePlayerClient courseId={course.id} modules={content.modules} recommendedNextId={meta?.recommendedNextId} />
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className={`${LMS_CARD_CLASS} xl:col-span-2 transition-all duration-200 hover:shadow-md`}>
          <h2 className={LMS_SECTION_TITLE}>What you'll learn</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1.5">
            {(meta?.outcomes ?? ['Build confidence in this topic area.', 'Practice interview-ready explanations.']).map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
        <div className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md`}>
          <h2 className={LMS_SECTION_TITLE}>Skills & relevance</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(meta?.skills ?? []).map((s) => (
              <span key={s} className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                {s}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">{meta?.whyRecommended ?? course.aiContext}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Modules</h2>
        <CourseLessonsClient courseId={course.id} modules={content.modules} mode={mode} />
      </section>

      <section className={`${LMS_CARD_CLASS} border-emerald-100 bg-emerald-50/20`}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5" strokeWidth={2} aria-hidden />
          <div>
            <p className="text-sm font-bold text-emerald-900">Mock completion</p>
            <p className="mt-1 text-sm font-normal text-emerald-950/70">
              This course player is frontend-only. Completion state is stored locally (session) for UX testing.
            </p>
          </div>
        </div>
      </section>

      <section className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md`}>
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-violet-700 mt-0.5" strokeWidth={2} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900">Recommended next</p>
            <p className="mt-1 text-sm text-gray-600">
              Continue momentum with a related course after this one.
            </p>
            {meta?.recommendedNextId ? (
              <Link
                href={`/lms/courses/${meta.recommendedNextId}`}
                className="mt-3 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
              >
                Open next recommended course
              </Link>
            ) : (
              <Link
                href="/lms/courses"
                className="mt-3 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
              >
                Browse all courses
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

