'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, BookOpen, Code2, Palette, LineChart, Search } from 'lucide-react';
import { LMS_CARD_INTERACTIVE, LMS_PAGE_SUBTITLE } from '../constants';
import { LmsProgressBar } from '../components/LmsProgressBar';
import { AISectionHeading } from '../components/ai';
import { lmsCourseContent, lmsCourseMeta, lmsCoursesWithAI, type CourseIconKey } from '../data/ai-mock';
import { useLmsState } from '../state/LmsStateProvider';
import { useLmsToast } from '../components/ux/LmsToastProvider';
import { LmsStatusBadge } from '../components/ux/LmsStatusBadge';
import { LmsEmptyState } from '../components/states/LmsEmptyState';
import { LmsSkeleton } from '../components/states/LmsSkeleton';
import { courseStatusFromPct, flattenCourseLessons, normalizePct, parseDurationToMinutes } from './course-utils';

const ICON_MAP: Record<CourseIconKey, typeof Code2> = {
  code2: Code2,
  palette: Palette,
  lineChart: LineChart,
  bookOpen: BookOpen,
};

const COURSE_COVER_MAP: Record<
  string,
  {
    src: string;
    alt: string;
    eyebrow: string;
  }
> = {
  c1: {
    src: '/lms/course-covers/frontend-interview-readiness.svg',
    alt: 'Frontend interview readiness course cover',
    eyebrow: 'Interview prep',
  },
  c2: {
    src: '/lms/course-covers/ui-craft-accessibility.svg',
    alt: 'UI craft and accessibility course cover',
    eyebrow: 'Design systems',
  },
  c3: {
    src: '/lms/course-covers/data-literacy-product-roles.svg',
    alt: 'Data literacy for product roles course cover',
    eyebrow: 'Analytics',
  },
  c4: {
    src: '/lms/course-covers/professional-communication.svg',
    alt: 'Professional communication course cover',
    eyebrow: 'Collaboration',
  },
  c5: {
    src: '/lms/course-covers/system-design-warm-up.svg',
    alt: 'System design warm-up course cover',
    eyebrow: 'Architecture',
  },
  c6: {
    src: '/lms/course-covers/career-narrative-lab.svg',
    alt: 'Career narrative lab course cover',
    eyebrow: 'Storytelling',
  },
};

function courseCtaLabel(progress: number | null) {
  if (progress === 100) return 'Review';
  if (progress != null && progress > 0) return 'Continue';
  return 'Start';
}

function levelBadge(level: 'Beginner' | 'Intermediate') {
  if (level === 'Beginner') {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
        Beginner
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
      Intermediate
    </span>
  );
}

function courseMatchesFocus(
  course: (typeof lmsCoursesWithAI)[number],
  focus: string
) {
  if (!focus) return false;
  const normalizedFocus = focus.trim().toLowerCase();
  if (!normalizedFocus) return false;

  const meta = lmsCourseMeta[course.id];
  const haystack = [
    course.title,
    course.description,
    course.aiContext,
    meta?.category ?? '',
    ...(meta?.keywords ?? []),
    ...(meta?.skills ?? []),
    ...(meta?.outcomes ?? []),
  ]
    .join(' ')
    .toLowerCase();

  if (haystack.includes(normalizedFocus)) return true;
  return normalizedFocus
    .split(/[\s-]+/)
    .filter((token) => token.length > 2)
    .some((token) => haystack.includes(token));
}

function LmsCoursesPageFallback() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <LmsSkeleton lines={5} />
    </div>
  );
}

function LmsCoursesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, toggleSaveCourse, setLastActiveCourseId } = useLmsState();
  const toast = useLmsToast();
  const focus = searchParams.get('focus')?.trim() ?? '';
  const source = searchParams.get('from')?.trim() ?? '';
  const topic = searchParams.get('topic')?.trim() ?? '';
  const recommendedCourseId = searchParams.get('recommendedCourseId')?.trim() ?? '';
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<'all' | 'Beginner' | 'Intermediate'>('all');
  const [status, setStatus] = useState<'all' | 'in_progress' | 'completed' | 'saved'>('all');
  const [category, setCategory] = useState<'all' | string>('all');
  const [durationBand, setDurationBand] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'progress' | 'duration' | 'alphabetical'>('recommended');

  const categories = useMemo(() => {
    const set = new Set<string>();
    lmsCoursesWithAI.forEach((c) => set.add(lmsCourseMeta[c.id]?.category ?? 'General'));
    return ['all', ...Array.from(set)];
  }, []);

  const courses = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = lmsCoursesWithAI.filter((course) => {
      const pct = normalizePct(state.courseProgress[course.id] ?? course.progress);
      const st = courseStatusFromPct(pct);
      const saved = state.savedCourseIds.includes(course.id);
      const mins = parseDurationToMinutes(course.duration);
      const meta = lmsCourseMeta[course.id];
      const keywords = [course.title, course.description, course.aiContext, ...(meta?.keywords ?? []), ...(meta?.skills ?? [])]
        .join(' ')
        .toLowerCase();

      if (q && !keywords.includes(q)) return false;
      if (level !== 'all' && course.level !== level) return false;
      if (status === 'saved' && !saved) return false;
      if (status === 'in_progress' && st !== 'in_progress') return false;
      if (status === 'completed' && st !== 'completed') return false;
      if (category !== 'all' && (meta?.category ?? 'General') !== category) return false;
      if (durationBand === 'short' && mins >= 180) return false;
      if (durationBand === 'medium' && (mins < 180 || mins > 300)) return false;
      if (durationBand === 'long' && mins <= 300) return false;
      return true;
    });

    const sorted = [...base];
    if (sortBy === 'alphabetical') sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'duration') sorted.sort((a, b) => parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration));
    else if (sortBy === 'progress') {
      sorted.sort(
        (a, b) =>
          normalizePct(state.courseProgress[b.id] ?? b.progress) - normalizePct(state.courseProgress[a.id] ?? a.progress)
      );
    }
    if (focus) {
      sorted.sort((a, b) => {
        const aIsRecommended = recommendedCourseId && a.id === recommendedCourseId;
        const bIsRecommended = recommendedCourseId && b.id === recommendedCourseId;
        if (aIsRecommended !== bIsRecommended) return aIsRecommended ? -1 : 1;
        const aMatches = courseMatchesFocus(a, focus);
        const bMatches = courseMatchesFocus(b, focus);
        if (aMatches === bMatches) return 0;
        return aMatches ? -1 : 1;
      });
    }

    return sorted;
  }, [category, durationBand, focus, level, query, recommendedCourseId, sortBy, state.courseProgress, state.savedCourseIds, status]);

  const focusMatchCount = useMemo(
    () => (focus ? courses.filter((course) => courseMatchesFocus(course, focus)).length : 0),
    [courses, focus]
  );
  const highlightedCourse = useMemo(
    () =>
      (recommendedCourseId ? courses.find((course) => course.id === recommendedCourseId) : null) ??
      courses.find((course) => (focus ? courseMatchesFocus(course, focus) : false)) ??
      null,
    [courses, focus, recommendedCourseId]
  );

  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Courses</h1>
        <p className={LMS_PAGE_SUBTITLE}>Structured learning paths to support your job search and interviews.</p>
      </div>

      <div className="space-y-3">
        <AISectionHeading title="AI course picks" />
        <p className="text-sm font-normal text-gray-500">
          Context lines are mock recommendations — ready to bind to your ranking service.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <label className="lg:col-span-4 block">
            <span className="sr-only">Search courses</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, skill, or keyword"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
            className="lg:col-span-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="lg:col-span-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">All status</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="saved">Saved</option>
          </select>
          <select
            value={durationBand}
            onChange={(e) => setDurationBand(e.target.value as typeof durationBand)}
            className="lg:col-span-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Any duration</option>
            <option value="short">Short (&lt;3h)</option>
            <option value="medium">Medium (3-5h)</option>
            <option value="long">Long (&gt;5h)</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="lg:col-span-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="progress">Sort: Progress</option>
            <option value="duration">Sort: Duration</option>
            <option value="alphabetical">Sort: Alphabetical</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${category === cat
                  ? 'border-[#28A8E1]/40 bg-[#28A8E1]/10 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              {cat === 'all' ? 'All categories' : cat}
            </button>
          ))}
        </div>
      </section>

      {focus ? (
        <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Suggested lessons for <span className="text-[#28A8E1]">{topic || focus}</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {focusMatchCount > 0
                  ? `${focusMatchCount} matching course${focusMatchCount === 1 ? '' : 's'} surfaced first${source === 'quizzes' ? ` because Quizzes flagged ${topic || focus} as your next review area.` : ' based on your quiz context.'}`
                  : `No direct matches were found for ${topic || focus}, so the full catalog is still available for broader browsing.`}
              </p>
              {highlightedCourse ? (
                <p className="mt-1 text-sm font-semibold text-sky-900">
                  Start with: {highlightedCourse.title}
                </p>
              ) : null}
            </div>
            <Link href="/lms/courses" className="text-sm font-semibold text-[#28A8E1] hover:underline">
              Clear suggestion focus
            </Link>
          </div>
        </section>
      ) : null}

      {courses.length === 0 ? (
        <LmsEmptyState
          title="No courses match your filters"
          body="Try clearing filters or using fewer keywords."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setLevel('all');
                setStatus('all');
                setCategory('all');
                setDurationBand('all');
                setSortBy('recommended');
              }}
              className="inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
            >
              Reset filters
            </button>
          }
        />
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const isFocusMatch = focus ? courseMatchesFocus(course, focus) : false;
          const Icon = ICON_MAP[course.iconKey];
          const cover = COURSE_COVER_MAP[course.id] ?? COURSE_COVER_MAP.c1;
          const saved = state.savedCourseIds.includes(course.id);
          const pct = state.courseProgress[course.id] ?? course.progress ?? 0;
          const meta = lmsCourseMeta[course.id];
          const lessons = flattenCourseLessons(lmsCourseContent[course.id]?.modules ?? []);
          const currentLesson = lessons[Math.min(lessons.length - 1, Math.max(0, state.courseLessonIndex[course.id] ?? 0))];
          const courseHref =
            pct >= 100
              ? `/lms/courses/${course.id}?mode=review`
              : lessons.length > 0
                ? `/lms/courses/${course.id}/lessons/${lessons[Math.min(lessons.length - 1, Math.max(0, state.courseLessonIndex[course.id] ?? 0))].lessonId}`
                : `/lms/courses/${course.id}`;
          return (
            <div
              key={course.id}
              className={`${LMS_CARD_INTERACTIVE} group ${isFocusMatch ? 'border-[#28A8E1]/30 bg-sky-50/20' : ''}`}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('a,button')) return;
                setLastActiveCourseId(course.id);
                router.push(`/lms/courses/${course.id}`);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLastActiveCourseId(course.id);
                  router.push(`/lms/courses/${course.id}`);
                }
              }}
            >
              <div className="-mx-6 -mt-6 overflow-hidden border-b border-slate-200/70 sm:-mx-7 sm:-mt-7">
                <div className="relative aspect-[16/9] bg-slate-100">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-900/5 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-800 shadow-sm">
                      {cover.eyebrow}
                    </span>
                  </div>
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/88 text-[#28A8E1] shadow-sm backdrop-blur-sm">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>
              </div>
              <div className="min-w-0 space-y-4 pt-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/lms/courses/${course.id}`}
                      onClick={() => setLastActiveCourseId(course.id)}
                      className="text-lg font-bold text-gray-900 leading-snug hover:underline"
                    >
                      {course.title}
                    </Link>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {isFocusMatch ? <LmsStatusBadge label={`Focus: ${focus}`} tone="success" /> : null}
                      {saved ? <LmsStatusBadge label="Saved" tone="info" /> : null}
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500 font-normal leading-relaxed">{course.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {levelBadge(course.level)}
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                      {course.duration}
                    </span>
                    {meta?.category ? (
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        {meta.category}
                      </span>
                    ) : null}
                  </div>

                    {pct > 0 && pct < 100 ? (
                      <LmsProgressBar value={pct} />
                    ) : null}
                    {pct >= 100 ? (
                      <p className="text-xs font-semibold text-emerald-700">Completed — revisit anytime</p>
                    ) : null}

                    {pct > 0 && pct < 100 && currentLesson ? (
                      <p className="text-xs font-medium text-gray-500">Resume: {currentLesson.lessonTitle}</p>
                    ) : null}

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap pt-2">
                      <Link
                        href={courseHref}
                        onClick={() => setLastActiveCourseId(course.id)}
                        className="flex-1 min-w-[6rem] rounded-xl bg-[#28A8E1] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98] text-center"
                      >
                        {courseCtaLabel(pct)}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          toggleSaveCourse(course.id);
                          toast.push({
                            title: saved ? 'Removed from saved' : 'Saved course',
                            message: course.title,
                            tone: 'info',
                          });
                        }}
                        className="flex-1 min-w-[6rem] rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] cursor-pointer"
                      >
                        {saved ? 'Unsave' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LmsCoursesPage() {
  return (
    <Suspense fallback={<LmsCoursesPageFallback />}>
      <LmsCoursesPageContent />
    </Suspense>
  );
}
