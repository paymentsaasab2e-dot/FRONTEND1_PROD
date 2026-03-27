'use client';

import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ClipboardList,
  HelpCircle,
  Sparkles,
  RotateCcw,
  TrendingUp,
  Award,
  Flame,
} from 'lucide-react';
import { LMS_CARD_CLASS, LMS_CARD_INTERACTIVE, LMS_PAGE_SUBTITLE } from '../constants';
import { AISectionHeading, AIInsightCard } from '../components/ai';
import {
  quizzesAIRecommended,
  quizzesRetryWeak,
  quizzesMasteryByTopic,
  quizzesRecentPerformance,
  quizzesCatalog,
  quizzesAIExplanation,
  quizzesSkillHeatmap,
  quizzesLastSessionFeedback,
} from '../data/ai-mock';
import { lmsQuizBank, lmsQuizIdForSkill } from '../data/ai-mock';
import { useQuizAnalytics } from './hooks/useQuizAnalytics';
import { useLmsState } from '../state/LmsStateProvider';
import { LmsSkeleton } from '../components/states/LmsSkeleton';

function difficultyBadge(d: 'Easy' | 'Medium' | 'Hard') {
  const map = {
    Easy: 'bg-emerald-100 text-emerald-800',
    Medium: 'bg-amber-100 text-amber-800',
    Hard: 'bg-rose-100 text-rose-800',
  } as const;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[d]}`}>{d}</span>
  );
}

function practiceMinutes(diff: 'Easy' | 'Medium' | 'Hard') {
  if (diff === 'Easy') return 8;
  if (diff === 'Medium') return 10;
  return 14;
}

function HeatmapBar({ pct, tier }: { pct: number; tier: 'strong' | 'building' | 'risk' }) {
  const segs = 10;
  const filled = Math.round((pct / 100) * segs);
  const empty = segs - filled;
  const fillClass =
    tier === 'strong'
      ? 'bg-emerald-500'
      : tier === 'building'
        ? 'bg-amber-500'
        : 'bg-rose-500';
  const trackClass = tier === 'strong' ? 'bg-emerald-100' : tier === 'building' ? 'bg-amber-100' : 'bg-rose-100';

  return (
    <div className="flex gap-px h-2.5 w-full max-w-[200px] rounded-sm overflow-hidden bg-gray-100" aria-hidden>
      {Array.from({ length: filled }).map((_, i) => (
        <div key={`f-${i}`} className={`flex-1 min-w-0 ${fillClass}`} />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <div key={`e-${i}`} className={`flex-1 min-w-0 ${trackClass} opacity-60`} />
      ))}
    </div>
  );
}

function QuizCardRow({
  title,
  topic,
  questions,
  difficulty,
  cta,
  href,
  bestScore,
}: {
  title: string;
  topic: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cta?: string;
  href: string;
  bestScore?: number;
}) {
  const m = practiceMinutes(difficulty);
  return (
    <div className={LMS_CARD_INTERACTIVE}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 border border-violet-100">
          <HelpCircle className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{title}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{topic}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 font-normal">
                <ClipboardList className="h-4 w-4 text-gray-400" strokeWidth={2} />
                {questions} questions
              </span>
              {bestScore !== undefined && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className={`text-sm font-semibold ${bestScore >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Best: {bestScore}%
                  </span>
                </>
              )}
            </div>
          </div>
          <div>{difficultyBadge(difficulty)}</div>
          <Link
            href={href}
            className="w-full inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
          >
            {cta ?? `Start practice (${m} min)`}
          </Link>
        </div>
      </div>
    </div>
  );
}

function LmsQuizzesPageFallback() {
  return (
    <div className={LMS_CARD_CLASS}>
      <LmsSkeleton lines={5} />
    </div>
  );
}

function LmsQuizzesPageContent() {
  const searchParams = useSearchParams();
  const skill = searchParams.get('skill');

  const { state } = useLmsState();
  const analytics = useQuizAnalytics();

  const filteredCatalog = useMemo(() => {
    if (!skill) return quizzesCatalog;
    const normalized = skill.toLowerCase();
    return quizzesCatalog.filter((q) => {
      const bank = lmsQuizBank[q.id];
      return bank?.skill === normalized || q.topic.toLowerCase().includes(normalized);
    });
  }, [skill]);

  // Derive Recommended logic securely
  let recQuizId = 'q1'; // Safe valid default
  
  if (analytics.hasAttempts && analytics.weakestTopic) {
    const match = Object.keys(lmsQuizBank).find(k => lmsQuizBank[k].skill === analytics.weakestTopic);
    if (match) recQuizId = match;
  } else {
    // If no attempts, map the AI mock's default topic to a real quiz
    const defaultTopicLC = quizzesAIRecommended.topic.toLowerCase();
    const fallbackMatch = Object.keys(lmsQuizBank).find(k => defaultTopicLC.includes(lmsQuizBank[k].skill));
    if (fallbackMatch) recQuizId = fallbackMatch;
  }

  const recQuizCatalog = quizzesCatalog.find(q => q.id === recQuizId);

  const recContent = {
    title: analytics.hasAttempts && analytics.weakestTopic && recQuizCatalog ? `Drill: ${recQuizCatalog.title}` : quizzesAIRecommended.title,
    topic: analytics.hasAttempts && analytics.weakestTopic ? analytics.weakestTopic : quizzesAIRecommended.topic,
    blurb: analytics.hasAttempts && analytics.weakestTopic ? `Your recent scores around ${analytics.weakestTopic} suggest a review.` : quizzesAIRecommended.blurb,
    why: analytics.hasAttempts && analytics.weakestTopic ? [`Score is currently ${analytics.lowestScore}%`, `Focusing here will improve overall readiness.`] : quizzesAIRecommended.whyThisQuiz,
    diff: recQuizCatalog?.difficulty || quizzesAIRecommended.difficulty,
    questions: recQuizCatalog?.questions || quizzesAIRecommended.questions,
    id: recQuizId
  };

  // Derive retry weaknesses
  const retryCards = useMemo(() => {
    const candidates = analytics.hasAttempts && analytics.retryQuizzes.length > 0 ? analytics.retryQuizzes : quizzesRetryWeak;
    return candidates.filter((quiz) => Boolean(lmsQuizBank[quiz.id]));
  }, [analytics.hasAttempts, analytics.retryQuizzes]);

  return (
    <div className="space-y-10">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Quizzes</h1>
        <p className={LMS_PAGE_SUBTITLE}>
          Adaptive practice linked to weak topics, notes, and career readiness (live mock layer).
        </p>
      </div>

      <section className="space-y-3">
        <div className={`${LMS_CARD_CLASS} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-orange-100 bg-orange-50/20`}>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" strokeWidth={2} />
            <p className="text-sm font-bold text-gray-900">
              {analytics.attemptCount > 0 ? `${analytics.attemptCount} quiz active streak` : '0-day streak'}
            </p>
            <span className="text-sm font-normal text-gray-500">·</span>
            <p className="text-sm font-semibold text-gray-700">
              Confidence: {analytics.avgScore >= 70 ? 'High' : analytics.avgScore > 0 ? 'Learning' : 'Needs Practice'}
            </p>
          </div>
          <p className="text-xs font-medium text-gray-500">Streaks & confidence derive from local session attempts.</p>
        </div>
      </section>

      <section className="space-y-4">
        <AISectionHeading title="AI recommended quiz" />
        <div className={LMS_CARD_INTERACTIVE}>
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{recContent.title}</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                  {recContent.topic}
                </p>
                <p className="mt-2 text-sm text-gray-500 font-normal">{recContent.blurb}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Why this quiz?</p>
                <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm font-normal text-gray-600">
                  {recContent.why.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                {difficultyBadge(recContent.diff)}
                <span className="text-xs font-medium text-gray-500 self-center">
                  {recContent.questions} questions
                </span>
              </div>
              <Link
                href={`/lms/quizzes/${recContent.id}/attempt${skill ? `?skill=${encodeURIComponent(skill)}` : ''}`}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
              >
                {`Start practice (${practiceMinutes(recContent.diff)} min)`}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" id="skill-heatmap">
        <AISectionHeading title="Skill map (visual grid)" />
        <p className="text-sm font-normal text-gray-500 -mt-2">
          Color-coded grid — hover a row for mistakes & suggestions. Click opens targeted practice (same page, skill
          focus).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quizzesSkillHeatmap.map((row) => {
            const actualPct = analytics.topicAverages[row.slug] !== undefined ? analytics.topicAverages[row.slug] : row.pct;
            const actualTier = actualPct >= 80 ? 'strong' : actualPct >= 60 ? 'building' : 'risk';
            
            const title = `${row.topic}: common misses — ${row.hoverMistakes}. Suggestion: ${row.hoverSuggestion}`;
            return (
              <Link
                key={row.slug}
                href={`/lms/quizzes?skill=${row.slug}`}
                className={`${LMS_CARD_CLASS} block transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer border-violet-50`}
                title={title}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-900 w-32 shrink-0">{row.topic}</span>
                  <HeatmapBar pct={actualPct} tier={actualTier} />
                  <span
                    className={`text-sm font-bold tabular-nums shrink-0 ${
                      actualTier === 'strong'
                        ? 'text-emerald-700'
                        : actualTier === 'building'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                    }`}
                  >
                    {actualPct}%
                  </span>
                </div>
                <p className="mt-2 text-xs font-normal text-gray-500 line-clamp-2">
                  {analytics.hasAttempts ? `Suggestion: Practice ${row.topic} essentials` : row.hoverSuggestion}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <AISectionHeading title={analytics.hasAttempts && analytics.retryQuizzes.length > 0 ? "Retry weakest topics" : "Retry weak topics (Suggested)"} />
        <p className="text-sm text-gray-500 -mt-2 font-normal">
          Pulled from your last attempts & local history.
        </p>
        {retryCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {retryCards.map((q) => (
              <div key={q.id} className={LMS_CARD_INTERACTIVE}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 border border-rose-100">
                    <RotateCcw className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h2 className="text-base font-bold text-gray-900">{q.title}</h2>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{q.topic}</p>
                    <p className="text-sm text-gray-500">{q.questions} questions</p>
                    {difficultyBadge(q.difficulty)}
                    <Link
                      href={`/lms/quizzes/${q.id}/attempt${skill ? `?skill=${encodeURIComponent(skill)}` : ''}`}
                      className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
                    >
                      {`Start practice (${practiceMinutes(q.difficulty)} min)`}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${LMS_CARD_CLASS} border-dashed border-gray-200 bg-gray-50/60`}>
            <p className="text-sm font-bold text-gray-900">No retry quiz is ready yet</p>
            <p className="mt-1 text-sm text-gray-600">
              Complete at least one quiz and we will surface a valid follow-up practice set here.
            </p>
          </div>
        )}
      </section>

      {analytics.recentScore !== null && (
      <section className="space-y-4">
        <AISectionHeading title="After your last quiz" />
        <div className={`${LMS_CARD_CLASS} space-y-4 border-emerald-100 bg-emerald-50/20 transition-all duration-200 hover:shadow-md`}>
          <p className="text-sm font-bold text-emerald-800">
            Recent output score: {analytics.recentScore}%
          </p>
          <div>
            <p className="text-sm font-bold text-gray-900">Recommended Next Step</p>
            <p className="text-sm font-normal text-gray-600 mt-1">
              Practice: <span className="font-semibold text-gray-900">{analytics.weakestTopic ? `Drill ${analytics.weakestTopic}` : quizzesLastSessionFeedback.nextQuizTitle}</span>
            </p>
            <Link
              href={`/lms/quizzes/${lmsQuizIdForSkill(skill || analytics.weakestTopic)}/attempt${skill ? `?skill=${encodeURIComponent(skill)}` : ''}`}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
            >
              Start target practice
            </Link>
          </div>
        </div>
      </section>
      )}

      <section className="space-y-4">
        <AISectionHeading title="Mastery by topic" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quizzesMasteryByTopic.map((m) => {
            const actualPct = analytics.topicAverages[m.topic.toLowerCase()] !== undefined ? analytics.topicAverages[m.topic.toLowerCase()] : m.pct;
            return (
              <Link
                key={m.topic}
                href={`/lms/quizzes?skill=${m.topic.toLowerCase()}`}
                className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md border-violet-50/80 block group cursor-pointer`}
                title={`Filter practice to ${m.topic}`}
              >
                <div className="flex items-center gap-2 text-gray-900 group-hover:text-[#28A8E1] transition-colors">
                  <TrendingUp className="h-4 w-4 text-[#28A8E1]" strokeWidth={2} />
                  <span className="text-sm font-bold">{m.topic}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#28A8E1] transition-[width] duration-700 ease-out"
                    style={{ width: `${actualPct}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-[#28A8E1]">{actualPct}%</p>
                  <span className="text-[10px] uppercase font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Focus &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <AISectionHeading title="Recent performance" />
        <div
          className={`${LMS_CARD_CLASS} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
              <Award className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Latest score</p>
              <p className="text-sm font-normal text-gray-500">{analytics.hasAttempts && analytics.lastAttemptDate ? `Last quiz · ${new Date(analytics.lastAttemptDate).toLocaleDateString()}` : quizzesRecentPerformance.label}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-3xl font-bold text-gray-900 text-right">{analytics.recentScoreStr}{analytics.hasAttempts ? '%' : ''}</p>
            {analytics.recentQuizId && (
              <Link
                href={`/lms/quizzes/${analytics.recentQuizId}/result`}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-100 transition-all active:scale-[0.98]"
              >
                Review Result
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <AIInsightCard
          icon={Sparkles}
          title="AI study tip"
          recommendation={analytics.weakestTopic ? `Since your score is lowest in ${analytics.weakestTopic}, drilling related courses is highly recommended.` : quizzesAIExplanation}
          ctaLabel="View suggested lessons"
          ctaHref={`/lms/courses${analytics.weakestTopic ? `?focus=${encodeURIComponent(analytics.weakestTopic)}` : ''}`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">All quizzes</h2>
        {skill ? (
          <p className="text-sm font-normal text-gray-500 -mt-2">
            Filtering by skill: <span className="font-semibold text-gray-900">{skill}</span> ·{' '}
            <Link href="/lms/quizzes" className="text-[#28A8E1] font-semibold hover:underline">
              Clear
            </Link>
          </p>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCatalog.map((quiz) => (
            <QuizCardRow
              key={quiz.id}
              title={quiz.title}
              topic={quiz.topic}
              questions={quiz.questions}
              difficulty={quiz.difficulty}
              href={`/lms/quizzes/${quiz.id}/attempt${skill ? `?skill=${encodeURIComponent(skill)}` : ''}`}
              bestScore={state.quizAttempts[quiz.id]?.score}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function LmsQuizzesPage() {
  return (
    <Suspense fallback={<LmsQuizzesPageFallback />}>
      <LmsQuizzesPageContent />
    </Suspense>
  );
}
