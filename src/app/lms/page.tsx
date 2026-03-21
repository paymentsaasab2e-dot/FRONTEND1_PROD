import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  CalendarDays,
  PlayCircle,
  Target,
  Layers,
  Mic2,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { LMS_CARD_CLASS, LMS_CARD_INTERACTIVE, LMS_SECTION_TITLE, LMS_PAGE_SUBTITLE } from './constants';
import { LmsProgressBar } from './components/LmsProgressBar';
import {
  AISectionHeading,
  AIScoreCard,
  AIInsightCard,
  AIActionChips,
  AIRecommendationList,
} from './components/ai';
import {
  dashboardAIScores,
  dashboardPrimaryInsight,
  dashboardNextActions,
  dashboardModuleRecommendations,
  dashboardRolePath,
} from './data/ai-mock';

const RECOMMENDED = [
  {
    title: 'React patterns for interviews',
    description: 'Short modules on hooks, performance, and testing—built for frontend roles.',
    tag: 'Intermediate' as const,
    icon: Layers,
  },
  {
    title: 'Communication & storytelling',
    description: 'Frame your experience clearly in behavioral rounds and take-home reviews.',
    tag: 'Beginner' as const,
    icon: Sparkles,
  },
  {
    title: 'System design fundamentals',
    description: 'Trade-offs, scaling basics, and diagram practice without the fluff.',
    tag: 'Intermediate' as const,
    icon: Target,
  },
];

const EVENTS = [
  { title: 'Live AMA: Hiring managers', date: 'Mar 26, 2026 · 6:00 PM' },
  { title: 'Workshop: Resume teardown', date: 'Mar 29, 2026 · 11:00 AM' },
  { title: 'Webinar: Offer negotiation', date: 'Apr 2, 2026 · 5:30 PM' },
];

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

export default function LmsDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Welcome back</h1>
        <p className={LMS_PAGE_SUBTITLE}>Pick up where you left off and keep moving toward your goals.</p>
      </div>

      <section className="space-y-4 rounded-2xl border border-violet-100 bg-white/60 p-5 sm:p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <AISectionHeading title="AI learning insights" />
        <p className="text-sm font-normal text-gray-500 -mt-1">
          Mock signals — swap for live model output when your AI service is connected.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardAIScores.map((s) => (
            <AIScoreCard
              key={s.id}
              title={s.title}
              score={s.score}
              supportingText={s.supportingText}
              visual={s.visual}
            />
          ))}
        </div>

        <AIInsightCard
          icon={Lightbulb}
          title={dashboardPrimaryInsight.title}
          recommendation={dashboardPrimaryInsight.recommendation}
          scoreOrTag={dashboardPrimaryInsight.badge}
          ctaLabel={dashboardPrimaryInsight.ctaLabel}
        />

        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Recommended next actions</h3>
          <AIActionChips actions={dashboardNextActions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <AIRecommendationList sectionTitle="Suggested modules based on goal" items={dashboardModuleRecommendations} />
          <AIInsightCard
            icon={Target}
            title={dashboardRolePath.title}
            recommendation={dashboardRolePath.recommendation}
            scoreOrTag={dashboardRolePath.badge}
            ctaLabel={dashboardRolePath.ctaLabel}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Continue learning</h2>
        <div className={`${LMS_CARD_INTERACTIVE} flex flex-col sm:flex-row sm:items-start gap-5`}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#28A8E1] border border-blue-100">
            <PlayCircle className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-base font-bold text-gray-900">Modern JavaScript for job seekers</p>
              <p className="mt-1 text-sm text-gray-500 font-normal leading-relaxed">
                Module 4 of 9 · Closures & async patterns
              </p>
            </div>
            <LmsProgressBar value={47} />
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98] cursor-pointer"
              >
                Resume
              </button>
              <Link
                href="/lms/courses"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
              >
                View course
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Recommended for you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RECOMMENDED.map(({ title, description, tag, icon: Icon }) => (
            <div key={title} className={LMS_CARD_INTERACTIVE}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-700 border border-gray-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{title}</h3>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed">{description}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">{levelBadge(tag)}</div>
                  <Link
                    href="/lms/courses"
                    className="mt-3 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#28A8E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
                  >
                    Start
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Upcoming events</h2>
        <div className="space-y-3">
          {EVENTS.map((ev) => (
            <div
              key={ev.title}
              className={`${LMS_CARD_INTERACTIVE} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                  <CalendarDays className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{ev.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500 font-normal">{ev.date}</p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] sm:min-w-[7.5rem] cursor-pointer"
              >
                Register
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Quick actions</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Link
            href="/lms/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#28A8E1] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <BookOpen className="h-4 w-4 shrink-0" strokeWidth={2} />
            Go to courses
          </Link>
          <Link
            href="/lms/interview-prep"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <Mic2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            Start interview prep
          </Link>
          <Link
            href="/lms/resume-builder"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <FileText className="h-4 w-4 shrink-0" strokeWidth={2} />
            Open resume builder
          </Link>
        </div>
      </section>
    </div>
  );
}
