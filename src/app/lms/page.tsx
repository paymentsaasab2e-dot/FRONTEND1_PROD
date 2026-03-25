'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
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
import { useLmsOverlay } from './components/overlays/LmsOverlayProvider';
import { useLmsState } from './state/LmsStateProvider';
import { useLmsToast } from './components/ux/LmsToastProvider';
import {
  dashboardPrimaryInsight,
  dashboardNextActions,
  dashboardModuleRecommendations,
  dashboardRolePath,
  careerAITarget,
  careerMission
} from './data/ai-mock';

const RECOMMENDED = [
  {
    title: 'React patterns for interviews',
    description: 'Short modules on hooks, performance, and testing—built for frontend roles.',
    tag: 'Intermediate' as const,
    icon: Layers,
    href: '/lms/courses/c1'
  },
  {
    title: 'Communication & storytelling',
    description: 'Frame your experience clearly in behavioral rounds and take-home reviews.',
    tag: 'Beginner' as const,
    icon: Sparkles,
    href: '/lms/interview-prep'
  },
  {
    title: 'System design fundamentals',
    description: 'Trade-offs, scaling basics, and diagram practice without the fluff.',
    tag: 'Intermediate' as const,
    icon: Target,
    href: '/lms/quizzes'
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
  const router = useRouter();
  const overlay = useLmsOverlay();
  const toast = useLmsToast();
  const { state, registerEvent, addPlannedItem, setLastActiveCourseId } = useLmsState();

  // DERIVED STATE LAYER
  const quizScores = Object.values(state.quizAttempts);
  const quizAvg = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : null;
  const lowestQuiz = quizScores.length > 0 ? Math.min(...quizScores) : null;
  
  // Readiness Metric
  const compositeReadiness = quizAvg !== null ? Math.round((careerAITarget.readinessScore + quizAvg) / 2) : careerAITarget.readinessScore;
  
  // Resume Metric
  const hasSavedResume = state.resumeDraft.updatedAtLabel !== 'Not saved yet';
  const resumeExperienceCount = Array.isArray(state.resumeDraft?.sections?.experience) ? state.resumeDraft.sections.experience.length : 0;
  const compositeResumeStrength = hasSavedResume ? Math.min(65 + (resumeExperienceCount * 15), 98) : 20;
  
  // Weekly Goal Metric
  const activityCount = state.registeredEventTitles.length + state.notes.length + state.careerPath.completedStepIds.length + quizScores.length;
  const compositeWeeklyGoal = activityCount;

  // Active Course State
  const activeCourseId = state.lastActiveCourseId;
  const activeCourseProgress = activeCourseId && state.courseProgress[activeCourseId] ? state.courseProgress[activeCourseId] : 0;
  const hasActiveCourse = activeCourseId !== null && activeCourseProgress > 0;

  // Dynamic Coach Tip
  let dynamicCoachRec = dashboardPrimaryInsight.recommendation;
  if (lowestQuiz !== null && lowestQuiz < 60) dynamicCoachRec = 'Your recent quiz scores reveal a blindspot. Prioritize related topics in the Career Path.';
  else if (!hasSavedResume) dynamicCoachRec = 'Your resume remains untouched. Set up the foundational block first to unlock better targeting.';
  else if (!state.careerPath.started) dynamicCoachRec = 'Your learning is unguided. Start a Career Path to aggregate your actions into measurable bounds.';

  // Construct Dynamic Score Cards iteratively
  const dynamicScores = [
    {
       id: 'readiness',
       title: 'Role readiness',
       score: compositeReadiness,
       supportingText: quizAvg !== null ? `Averaged dynamically with ${quizScores.length} real quiz attempts natively.` : 'Mock baseline. Take quizzes to shift value natively.',
       visual: 'ring' as const
    },
    {
       id: 'resume',
       title: 'Resume strength',
       score: compositeResumeStrength,
       supportingText: hasSavedResume ? `Evaluated structuring ${resumeExperienceCount} experience modules correctly.` : 'Resume empty. Build structural components securely natively.',
       visual: 'ring' as const
    },
    {
       id: 'velocity',
       title: 'Weekly activity',
       score: compositeWeeklyGoal,
       supportingText: `Extracted ${compositeWeeklyGoal} valid executions securely across Quizzes, Notes, Events, Career Path.`,
       visual: 'trend' as const
    }
  ];

  const openRegister = (title: string) => {
    overlay.openSheet({
      title: 'Register for event',
      description: 'Frontend-only registration (mock).',
      content: (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-sm font-normal text-gray-600">
            This confirmation is stored locally so you can test “registered” UX natively.
          </p>
        </div>
      ),
      footer: (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
            onClick={() => {
              registerEvent(title);
              toast.push({ title: 'Registered', message: title, tone: 'success' });
              overlay.close();
            }}
          >
            Confirm registration
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
            onClick={overlay.close}
          >
            Cancel
          </button>
        </div>
      ),
      size: 'md',
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Welcome back</h1>
        <p className={LMS_PAGE_SUBTITLE}>The orchestration layer. Dynamically reading state from all LMS branches.</p>
      </div>

      <section className="space-y-4 rounded-2xl border border-violet-100 bg-white/60 p-5 sm:p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <AISectionHeading title="Dynamic LMS intelligence" />
        <p className="text-sm font-normal text-gray-500 -mt-1">
          Actively aggregating performance metrics processing `{activityCount}` localized interaction flags securely natively.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dynamicScores.map((s) => (
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
          recommendation={dynamicCoachRec}
          scoreOrTag={dashboardPrimaryInsight.badge}
          ctaLabel={!hasSavedResume ? "Open Resume Builder" : !state.careerPath.started ? "Launch Career Path" : "View specific recommendations"}
          onCta={() => {
             if (!hasSavedResume) router.push('/lms/resume-builder');
             else router.push('/lms/career-path');
          }}
        />

        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Recommended contextual actions</h3>
          <AIActionChips
            actions={dashboardNextActions.map(action => {
                // Mutate slightly dynamically
                if (action.id === 'resume' && hasSavedResume) return { ...action, label: 'Refine saved resume' };
                if (action.id === 'mock' && lowestQuiz !== null && lowestQuiz < 60) return { ...action, label: 'Practice weak quiz subjects' };
                return action;
            })}
            onAction={(a) => {
              if (a.id === 'resume') return router.push('/lms/resume-builder');
              if (a.id === 'questions') return router.push('/lms/interview-prep');
              if (a.id === 'notes') return router.push('/lms/notes');
              if (a.id === 'mock') return router.push('/lms/interview-prep');
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <AIRecommendationList
            sectionTitle="Suggested modules based on target"
            items={dashboardModuleRecommendations}
            onCta={(item) => {
              addPlannedItem({ id: `rec:${item.id}`, type: 'topic', label: item.label, href: '/lms/career-path' });
              toast.push({ title: 'Added to plan locally', message: item.label, tone: 'success' });
            }}
          />
          <AIInsightCard
            icon={Target}
            title={dashboardRolePath.title}
            recommendation={state.careerPath.started ? `Your active Career Path tracking ${state.careerPath.completedStepIds.length} completed actions securely aggregating milestones properly.` : dashboardRolePath.recommendation}
            scoreOrTag={state.careerPath.started ? "Active Tracking" : dashboardRolePath.badge}
            ctaLabel={state.careerPath.started ? "Jump back into Path" : dashboardRolePath.ctaLabel}
            onCta={() => router.push('/lms/career-path')}
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
              <p className="text-base font-bold text-gray-900">{hasActiveCourse ? 'Modern JavaScript for job seekers' : 'Foundations of Frontend Engineering'}</p>
              <p className="mt-1 text-sm text-gray-500 font-normal leading-relaxed">
                {hasActiveCourse ? `Module actively rendering dynamic progression natively.` : `No active module found natively. Initialize learning correctly.`}
              </p>
            </div>
            
            {hasActiveCourse && (
               <>
                  <LmsProgressBar value={activeCourseProgress} />
                  <p className="mt-2 text-xs font-semibold text-gray-500">{activeCourseProgress}% computed natively from Session state variables.</p>
               </>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98] cursor-pointer"
                onClick={() => {
                  const id = state.lastActiveCourseId ?? 'c1';
                  setLastActiveCourseId(id);
                  router.push(`/lms/courses/${id}`);
                }}
              >
                {hasActiveCourse ? 'Resume module' : 'Start learning'}
              </button>
              {hasActiveCourse && (
                 <Link
                   href="/lms/courses"
                   className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
                 >
                   View directory
                 </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Dynamically recommended for you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RECOMMENDED.map(({ title, description, tag, icon: Icon, href }) => (
            <Link key={title} href={href} className={LMS_CARD_INTERACTIVE}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-700 border border-gray-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{title}</h3>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed">{description}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">{levelBadge(tag)}</div>
                  <div className="mt-3 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#28A8E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]">
                    Open Path
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Upcoming events</h2>
        <div className="space-y-3">
          {EVENTS.map((ev) => {
            const isRegistered = state.registeredEventTitles.includes(ev.title);
            return (
              <div
                key={ev.title}
                className={`${LMS_CARD_INTERACTIVE} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${isRegistered ? 'bg-emerald-50/20 border-emerald-100' : ''}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${isRegistered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    <CalendarDays className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className={`text-base font-bold ${isRegistered ? 'text-gray-900' : 'text-gray-900'}`}>{ev.title}</p>
                    <p className="mt-0.5 text-sm text-gray-500 font-normal">{ev.date}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`shrink-0 rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] sm:min-w-[7.5rem] cursor-pointer ${
                     isRegistered ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => openRegister(ev.title)}
                >
                  {isRegistered ? 'Registered' : 'Register'}
                </button>
              </div>
            );
          })}
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
            Browse learning catalog
          </Link>
          <Link
            href="/lms/interview-prep"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <Mic2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            Launch interview prep drills
          </Link>
          <Link
            href="/lms/resume-builder"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <FileText className="h-4 w-4 shrink-0" strokeWidth={2} />
            Refine document formats
          </Link>
        </div>
      </section>
    </div>
  );
}
