import { Fragment } from 'react';
import {
  Check,
  ChevronRight,
  Route,
  Target,
  TrendingUp,
  AlertCircle,
  Flag,
  CalendarRange,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { LMS_CARD_CLASS, LMS_PAGE_SUBTITLE, LMS_SECTION_TITLE } from '../constants';
import { AISectionHeading, AIScoreCard, AIInsightCard } from '../components/ai';
import { careerAITarget, careerMission, lmsSharedIntelligence } from '../data/ai-mock';

const STEPS = [
  { n: 1, title: 'Clarify target role', done: true },
  { n: 2, title: 'Close skill gaps', done: true },
  { n: 3, title: 'Interview & offer', done: false },
];

export default function LmsCareerPathPage() {
  const { role, readinessScore, strengths, gaps, nextStep, roadmapMilestones } = careerAITarget;
  const mission = careerMission;

  return (
    <div className="space-y-8">
      <div className="min-w-0 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Career path</h1>
          <p className={LMS_PAGE_SUBTITLE}>
            Mission system with adaptive roadmap — quizzes, notes, events, and resume feed this view (mock).
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#28A8E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Route className="h-4 w-4" strokeWidth={2} />
          Start path
        </button>
      </div>

      <p className="text-xs font-medium text-gray-500 border-l-2 border-violet-200 pl-3 -mt-2">
        {lmsSharedIntelligence.careerAdaptive}
      </p>

      <section className="space-y-4 rounded-2xl border border-violet-100 bg-white/70 p-5 sm:p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <Flag className="h-6 w-6 text-violet-600" strokeWidth={2} />
          <h2 className="text-xl font-bold text-gray-900">{mission.headline}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`${LMS_CARD_CLASS} lg:col-span-2 transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#28A8E1] border border-blue-100">
                <Target className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Active mission</p>
                <p className="text-xl font-bold text-gray-900">{role}</p>
                <p className="mt-2 text-sm font-normal text-gray-500">
                  Phases unlock as you complete quizzes, notes, and events — backend will persist state.
                </p>
              </div>
            </div>
          </div>
          <AIScoreCard
            title="Role readiness"
            score={readinessScore}
            supportingText="Composite of courses, quizzes, resume, and mocks (placeholder)."
            visual="ring"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">Mission phases & actionable steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mission.phases.map((phase) => (
              <div
                key={phase.id}
                className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md ${
                  phase.done ? 'border-emerald-100 bg-emerald-50/10' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900">{phase.title}</p>
                  {phase.done ? (
                    <span className="text-xs font-bold text-emerald-700">Done</span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700">In progress</span>
                  )}
                </div>
                <ul className="mt-3 space-y-2">
                  {phase.steps.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm font-normal text-gray-600">
                      <Check className="h-4 w-4 shrink-0 text-[#28A8E1] mt-0.5" strokeWidth={2} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={`${LMS_CARD_CLASS} flex gap-3 border-amber-100 bg-amber-50/30 transition-all duration-200 hover:shadow-md`}>
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-sm font-bold text-amber-950">{mission.risk.label}</p>
            <p className="mt-1 text-sm font-normal text-gray-700">{mission.risk.text}</p>
          </div>
        </div>

        <AIInsightCard
          icon={Route}
          title="Suggested next learning steps"
          recommendation={nextStep}
          scoreOrTag="Next best"
          ctaLabel="Open quizzes"
          ctaHref="/lms/quizzes"
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-gray-700" strokeWidth={2} />
            <h3 className="text-base font-bold text-gray-900">Timeline view</h3>
          </div>
          <div className={`${LMS_CARD_CLASS} space-y-3 transition-all duration-200 hover:shadow-md`}>
            {mission.timeline.map((w) => (
              <div
                key={w.week}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm font-bold text-[#28A8E1]">{w.week}</span>
                <span className="text-sm font-normal text-gray-700">{w.focus}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${LMS_CARD_CLASS} flex gap-3 border-violet-100 bg-violet-50/20 transition-all duration-200 hover:shadow-md`}>
          <RefreshCw className="h-5 w-5 shrink-0 text-violet-600 mt-0.5" strokeWidth={2} />
          <p className="text-sm font-normal text-gray-700">{mission.adaptiveCopy}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/lms/notes"
            className="text-sm font-semibold text-[#28A8E1] hover:underline"
          >
            Notes →
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/lms/quizzes" className="text-sm font-semibold text-[#28A8E1] hover:underline">
            Quizzes →
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/lms/events" className="text-sm font-semibold text-[#28A8E1] hover:underline">
            Events →
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/lms/resume-builder" className="text-sm font-semibold text-[#28A8E1] hover:underline">
            Resume →
          </Link>
        </div>

        <div className="space-y-3">
          <AISectionHeading title="Legacy roadmap visual" />
          <div className={`${LMS_CARD_CLASS} overflow-x-auto transition-all duration-200 hover:shadow-md`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-[280px]">
              {roadmapMilestones.map((m, i) => (
                <Fragment key={m.id}>
                  <div className="flex flex-1 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        m.done
                          ? 'border-[#28A8E1] bg-[#28A8E1] text-white'
                          : 'border-gray-200 bg-white text-gray-400'
                      }`}
                    >
                      {m.done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
                    </div>
                    <p className={`text-sm font-bold ${m.done ? 'text-gray-900' : 'text-gray-500'}`}>{m.label}</p>
                  </div>
                  {i < roadmapMilestones.length - 1 ? (
                    <ChevronRight className="hidden sm:block h-5 w-5 text-gray-300 shrink-0" aria-hidden />
                  ) : null}
                </Fragment>
              ))}
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
              <div className="h-full w-1/2 rounded-full bg-[#28A8E1] transition-[width] duration-700 ease-out" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={LMS_SECTION_TITLE}>Strengths & gaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              <h3 className="text-sm font-bold text-gray-900">Current strengths</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" strokeWidth={2} />
              <h3 className="text-sm font-bold text-gray-900">Skill gaps</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {gaps.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-sm font-semibold text-amber-900"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={LMS_SECTION_TITLE}>Your progress</h2>
        <div className={LMS_CARD_CLASS}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-1">
            {STEPS.map((step, i) => (
              <Fragment key={step.n}>
                <div className="flex items-center gap-3 min-w-0 md:flex-1">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200 ${
                      step.done
                        ? 'border-[#28A8E1] bg-[#28A8E1] text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}
                  >
                    {step.done ? <Check className="h-5 w-5" strokeWidth={2.5} /> : step.n}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Step {step.n}</p>
                    <p className={`text-sm font-bold leading-snug ${step.done ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 ? (
                  <div className="hidden md:flex shrink-0 items-center justify-center text-gray-300 px-0.5" aria-hidden>
                    <ChevronRight className="h-5 w-5" strokeWidth={2} />
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
          <div className="mt-6 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#28A8E1] transition-[width] duration-700 ease-out"
              style={{ width: '66%' }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-gray-500">About 66% of milestones complete</p>
        </div>
      </section>
    </div>
  );
}
