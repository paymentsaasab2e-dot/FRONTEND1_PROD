'use client';

import { Fragment, useMemo } from 'react';
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
  Trash2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { LMS_CARD_CLASS, LMS_PAGE_SUBTITLE, LMS_SECTION_TITLE } from '../constants';
import { AISectionHeading, AIScoreCard, AIInsightCard } from '../components/ai';
import { careerAITarget, careerMission, lmsSharedIntelligence } from '../data/ai-mock';
import { useLmsState } from '../state/LmsStateProvider';
import { useLmsToast } from '../components/ux/LmsToastProvider';

export default function LmsCareerPathPage() {
  const toast = useLmsToast();
  const { state, careerStart, careerToggleStep, careerReset, removePlannedItem } = useLmsState();
  const { role, readinessScore, strengths, gaps, roadmapMilestones } = careerAITarget;
  const mission = careerMission;

  // 1. Derive total actionable steps from the real mission/phase data
  const totalActionableSteps = useMemo(() => {
    let count = 0;
    mission.phases.forEach((p) => { count += p.steps.length; });
    return count;
  }, [mission.phases]);

  // 2. Derive completed step count from state.careerPath.completedStepIds
  const completedStepIds = state.careerPath.completedStepIds || [];
  const completedCount = completedStepIds.length;
  const completionPercentage = totalActionableSteps > 0 ? Math.round((completedCount / totalActionableSteps) * 100) : 0;
  const hasStarted = state.careerPath.started;

  // Derive Light Insights based on real state
  const quizScores = Object.values(state.quizAttempts);
  const quizAvg = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : null;
  const lowestQuiz = quizScores.length > 0 ? Math.min(...quizScores) : null;
  const dynamicReadinessScore = quizAvg !== null ? Math.round((readinessScore + quizAvg) / 2) : readinessScore;
  
  const dynamicNextStep = hasStarted 
     ? (lowestQuiz !== null && lowestQuiz < 60 ? 'Review lowest performing quiz topics to improve readiness.' : 'Continue completing mission items and schedule mock interviews.') 
     : 'Start your path above to unlock tracking capabilities.';
     
  const handleReset = () => {
    if (confirm('Are you sure you want to completely reset your Career Path progress? This cannot be undone.')) {
      careerReset();
      toast.push({ title: 'Path reset', message: 'All career progress has been cleared natively.', tone: 'info' });
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="min-w-0 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Career path</h1>
          <p className={LMS_PAGE_SUBTITLE}>
            Mission system with adaptive roadmap — quizzes, notes, events, and resume feed this view natively.
          </p>
        </div>
        <div className="flex items-center gap-3">
            {hasStarted && (
               <button
                 type="button"
                 className="inline-flex items-center justify-center gap-2 text-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                 onClick={handleReset}
               >
                 <RotateCcw className="h-4 w-4" />
                 Reset Path
               </button>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#28A8E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              disabled={hasStarted}
              onClick={() => {
                careerStart();
                toast.push({ title: 'Path started', message: 'Mission modules have been unlocked globally.', tone: 'success' });
              }}
            >
              <Route className="h-4 w-4" strokeWidth={2} />
              {hasStarted ? 'Path Active' : 'Start path'}
            </button>
        </div>
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
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Active mission</p>
                   {hasStarted && (
                       <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                         {completionPercentage}% Complete
                       </span>
                   )}
                </div>
                <p className="text-xl font-bold text-gray-900">{role}</p>
                <p className="mt-2 text-sm font-normal text-gray-500">
                  Phases unlock as you complete quizzes, notes, and events natively updating mathematical completions globally.
                </p>
              </div>
            </div>
          </div>
          <AIScoreCard
            title="Role readiness"
            score={dynamicReadinessScore}
            supportingText={quizScores.length > 0 ? "Composite of local mock base and your active quiz aggregations." : "Composite of courses, quizzes, resume, and mocks (placeholder)."}
            visual="ring"
          />
        </div>

        <div className={`space-y-4 ${!hasStarted ? 'opacity-60 grayscale-[20%]' : ''}`}>
          <h3 className="text-base font-bold text-gray-900">Mission phases & actionable steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mission.phases.map((phase) => {
              // 3. Mathematical check replacing AI mock states safely dynamically tracking arrays
              const phaseCompletedSteps = phase.steps.filter(s => completedStepIds.includes(s));
              const isPhaseDone = phase.steps.length > 0 && phaseCompletedSteps.length === phase.steps.length;
              const isPhaseInProgress = phaseCompletedSteps.length > 0 && !isPhaseDone;

              return (
                 <div
                   key={phase.id}
                   className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md ${
                     isPhaseDone ? 'border-emerald-100 bg-emerald-50/10' : isPhaseInProgress ? 'border-amber-100 bg-amber-50/10' : 'border-gray-100'
                   }`}
                 >
                   <div className="flex items-center justify-between gap-2">
                     <p className="text-sm font-bold text-gray-900">{phase.title}</p>
                     {isPhaseDone ? (
                       <span className="text-xs font-bold text-emerald-700">Done</span>
                     ) : isPhaseInProgress ? (
                       <span className="text-xs font-bold text-amber-700">In progress</span>
                     ) : (
                       <span className="text-xs font-bold text-gray-400">Locked</span>
                     )}
                   </div>
                   <ul className="mt-3 space-y-2">
                     {phase.steps.map((s) => {
                        const stepDone = completedStepIds.includes(s);
                        return (
                          <li key={s}>
                            <button
                              type="button"
                              onClick={() => {
                                if (!hasStarted) {
                                  toast.push({ title: 'Start your path first', message: 'You must start the path to explicitly mark steps as completed natively.', tone: 'warning' });
                                  return;
                                }
                                careerToggleStep(s);
                              }}
                              className={`flex w-full items-start gap-2 rounded-xl border border-transparent px-2 py-1.5 text-left text-sm font-normal transition-all ${
                                hasStarted ? 'hover:border-gray-200 hover:bg-white/70' : 'cursor-default'
                              } ${stepDone ? 'opacity-50 grayscale' : 'text-gray-700'}`}
                            >
                              <Check className={`h-4 w-4 shrink-0 mt-0.5 ${stepDone ? 'text-gray-400' : 'text-[#28A8E1]'}`} strokeWidth={2} />
                              <span className={stepDone ? 'line-through text-gray-500' : ''}>{s}</span>
                            </button>
                          </li>
                        );
                     })}
                   </ul>
                 </div>
              );
            })}
          </div>
        </div>

        <div className={`${LMS_CARD_CLASS} flex gap-3 border-amber-100 bg-amber-50/30 transition-all duration-200 hover:shadow-md mt-6`}>
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-sm font-bold text-amber-950">{mission.risk.label}</p>
            <p className="mt-1 text-sm font-normal text-gray-700">{lowestQuiz !== null && lowestQuiz < 60 ? `Real-time risk identifying quiz average constraints beneath competitive scoring benchmarks natively (${lowestQuiz}% localized minimum).` : mission.risk.text}</p>
          </div>
        </div>

        <AIInsightCard
          icon={Route}
          title="Suggested next active LMS steps"
          recommendation={dynamicNextStep}
          scoreOrTag="Next action"
          ctaLabel="Launch targeting quizzes"
          ctaHref="/lms/quizzes"
        />

        <div className="space-y-3 mt-6">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-gray-700" strokeWidth={2} />
            <h3 className="text-base font-bold text-gray-900">Timeline expectation view</h3>
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

        <div className={`${LMS_CARD_CLASS} flex gap-3 border-violet-100 bg-violet-50/20 transition-all duration-200 hover:shadow-md mt-6`}>
          <RefreshCw className="h-5 w-5 shrink-0 text-violet-600 mt-0.5" strokeWidth={2} />
          <p className="text-sm font-normal text-gray-700">{mission.adaptiveCopy}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <Link href="/lms/notes" className="text-sm font-semibold text-[#28A8E1] hover:underline">Notes →</Link>
          <span className="text-gray-300">·</span>
          <Link href="/lms/quizzes" className="text-sm font-semibold text-[#28A8E1] hover:underline">Quizzes →</Link>
          <span className="text-gray-300">·</span>
          <Link href="/lms/events" className="text-sm font-semibold text-[#28A8E1] hover:underline">Events →</Link>
          <span className="text-gray-300">·</span>
          <Link href="/lms/resume-builder" className="text-sm font-semibold text-[#28A8E1] hover:underline">Resume →</Link>
        </div>

        {/* Keeping Legacy block merely visually mapping mathematical updates replacing original static boundaries */}
        <div className="space-y-3 mt-8">
          <AISectionHeading title="Roadmap conceptual overview" />
          <div className={`${LMS_CARD_CLASS} overflow-x-auto transition-all duration-200 hover:shadow-md`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-[280px]">
              {roadmapMilestones.map((m, i) => {
                 // Distribute checks proportionally tracking our newly calculated percentage dynamically visually resolving nodes 
                 const passVal = (i + 1) / roadmapMilestones.length * 100;
                 const thresholdMet = completionPercentage >= passVal || (i === 0 && completionPercentage > 0);
                 
                 return (
                  <Fragment key={m.id}>
                    <div className="flex flex-1 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                          thresholdMet
                            ? 'border-[#28A8E1] bg-[#28A8E1] text-white scale-105'
                            : 'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        {thresholdMet ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
                      </div>
                      <p className={`text-sm font-bold transition-colors ${thresholdMet ? 'text-gray-900' : 'text-gray-400'}`}>{m.label}</p>
                    </div>
                    {i < roadmapMilestones.length - 1 ? (
                      <ChevronRight className="hidden sm:block h-5 w-5 text-gray-300 shrink-0" aria-hidden />
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
            <div className="mt-5 h-1.5 w-full rounded-full bg-gray-100">
              <div 
                 className="h-full rounded-full bg-[#28A8E1] transition-all duration-700 ease-out shadow-sm"
                 style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className={LMS_SECTION_TITLE}>Planned items from modules globally (CRUD)</h2>
        {state.plannedItems.length === 0 ? (
          <div className={`${LMS_CARD_CLASS} text-sm text-gray-600 bg-gray-50 border-dashed border-2 py-8 text-center`}>
             <Target className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p>Nothing planned natively tracking across sessions yet.</p>
            <p className="mt-1 text-gray-400 text-xs">Items aggregated from Interview Prep, Events, Quizzes natively render here mapping context schemas effortlessly.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {state.plannedItems.map((p) => (
              <li key={p.id} className={`${LMS_CARD_CLASS} overflow-hidden group`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate pr-4">{p.label}</p>
                    <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-100 inline-block px-2 py-0.5 rounded-full">{p.type}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                     <button
                        title="Dismiss"
                        onClick={() => {
                           removePlannedItem(p.id);
                           toast.push({ title: 'Item removed', message: 'Cleared natively from global plan store.', tone: 'info' });
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                     >
                        <Trash2 className="h-4 w-4" />
                     </button>
                     <button
                        title="Mark Done"
                        onClick={() => {
                           removePlannedItem(p.id);
                           toast.push({ title: 'Task Concluded!', message: 'Planned item tracking cleared explicitly natively.', tone: 'success' });
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-emerald-600 hover:bg-emerald-50 text-xs font-bold transition-colors"
                     >
                         <CheckCircle2 className="h-4 w-4" />
                         Done
                     </button>
                     {p.href ? (
                        <Link
                          href={p.href}
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2 text-xs font-bold text-gray-900 shadow-sm transition-all duration-200 hover:border-[#28A8E1]/40 hover:text-[#28A8E1] active:bg-gray-50"
                        >
                          Open Target
                        </Link>
                      ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4 pt-4">
        <h2 className={LMS_SECTION_TITLE}>Strengths & contextual limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md border-emerald-50 bg-emerald-50/20`}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-600" strokeWidth={2} />
              <h3 className="text-sm font-bold text-gray-900 border-b border-emerald-100 pb-1 w-full">Current systemic strengths</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white shadow-sm border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"
                >
                  {s}
                </span>
              ))}
              {quizScores.some(s => s >= 80) && <span className="rounded-full bg-white shadow-sm border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">Quiz Overachiever</span>}
            </div>
          </div>
          <div className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md border-amber-50 bg-amber-50/20`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-600" strokeWidth={2} />
              <h3 className="text-sm font-bold text-gray-900 border-b border-amber-100 pb-1 w-full">Extracted skill limitations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {gaps.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white shadow-sm border border-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900"
                >
                  {s}
                </span>
              ))}
              {lowestQuiz !== null && lowestQuiz < 50 && <span className="rounded-full bg-white shadow-sm border border-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900">Quiz Blindspots Visible</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className={LMS_SECTION_TITLE}>Global Roadmap Progression Tracking Natively</h2>
        <div className={LMS_CARD_CLASS}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-1">
            {mission.phases.map((phase, i) => {
               const phaseCompletedSteps = phase.steps.filter(s => completedStepIds.includes(s));
               const isPhaseDone = phase.steps.length > 0 && phaseCompletedSteps.length === phase.steps.length;

               return (
                <Fragment key={phase.id}>
                  <div className={`flex items-center gap-3 min-w-0 md:flex-1 transition-opacity ${!hasStarted ? 'opacity-40' : ''}`}>
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                        isPhaseDone
                          ? 'border-[#28A8E1] bg-[#28A8E1] text-white shadow-sm scale-110'
                          : 'border-gray-200 bg-white text-gray-400'
                      }`}
                    >
                      {isPhaseDone ? <Check className="h-5 w-5" strokeWidth={2.5} /> : i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Phase {i + 1}</p>
                      <p className={`text-sm font-bold leading-snug truncate ${isPhaseDone ? 'text-gray-900' : 'text-gray-500'}`}>
                        {phase.title}
                      </p>
                    </div>
                  </div>
                  {i < mission.phases.length - 1 ? (
                    <div className="hidden md:flex shrink-0 items-center justify-center text-gray-300 px-0.5" aria-hidden>
                      <ChevronRight className="h-5 w-5" strokeWidth={2} />
                    </div>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
          <div className="mt-8 h-2 w-full rounded-full bg-gray-100 overflow-hidden shadow-inner flex items-center">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#28A8E1] to-[#1a7fbc] transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-bold text-gray-800 text-center uppercase tracking-wide">Globally processing {completionPercentage}% of native tracking parameters conclusively</p>
        </div>
      </section>
    </div>
  );
}
