"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { LMS_CARD_CLASS } from "../../../constants";
import { lmsQuizBank } from "../../../data/ai-mock";
import { LmsStatusBadge } from "../../../components/ux/LmsStatusBadge";
import { useLmsState } from "../../../state/LmsStateProvider";
import { useLmsToast } from "../../../components/ux/LmsToastProvider";

type StoredAttempt = {
  quizId: string;
  answers: Record<string, number>;
  completedAt?: number;
};

function storageKey(quizId: string) {
  return `lmsQuizAttempt:${quizId}`;
}

export function QuizResultClient({ quizId }: { quizId: string }) {
  const search = useSearchParams();
  const duration = Number(search.get("duration") ?? "0");
  const quiz = lmsQuizBank[quizId];
  const toast = useLmsToast();
  const { state, addPlannedItem } = useLmsState();

  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(quizId));
      setIsLoaded(true);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredAttempt;
      if (parsed?.quizId !== quizId) return;
      setAttempt(parsed);
    } catch {
      setIsLoaded(true);
      // ignore
    }
  }, [quizId]);

  const score = state.quizAttempts[quizId]?.score ?? 0;
  const questions = quiz?.questions ?? [];

  const breakdown = useMemo(() => {
    const answers = attempt?.answers ?? {};
    const rows = questions.map((q) => {
      const chosen = answers[q.id];
      const ok = chosen === q.correctIndex;
      return { q, chosen, ok };
    });
    const correct = rows.filter((r) => r.ok).length;
    return { rows, correct };
  }, [attempt?.answers, questions]);

  if (!isLoaded) return null;

  if (!quiz || !attempt) {
    return (
      <div className="space-y-8 pb-8">
        <div className="min-w-0">
          <Link
            href="/lms/quizzes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to quizzes
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-100 rounded-3xl">
          <p className="text-gray-500 font-medium">
            Session attempt could not be verified or the quiz does not exist.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/lms/quizzes/${quizId}/attempt`}
              className="inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50"
            >
              Retake quiz
            </Link>
            <Link
              href="/lms/quizzes"
              className="inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#208bc0]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${LMS_CARD_CLASS} border-violet-100 bg-violet-50/20`}>
        <div className="flex items-start gap-3">
          <Award
            className="h-5 w-5 text-violet-700 mt-0.5"
            strokeWidth={2}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Score
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{score}%</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>
                {breakdown.correct} / {questions.length} correct
              </span>
              {duration ? (
                <>
                  <span className="text-gray-300">·</span>
                  <span>{duration}s</span>
                </>
              ) : null}
              <span className="text-gray-300">·</span>
              <LmsStatusBadge
                label={score >= 70 ? "Good" : "Needs work"}
                tone={score >= 70 ? "success" : "warning"}
              />
            </div>
            {score < 100 && breakdown.correct < questions.length && (
              <p className="mt-3 text-sm text-gray-700 bg-white/50 px-3 py-2 border border-violet-100 rounded-lg inline-block">
                Weak areas:{" "}
                {breakdown.rows
                  .filter((r) => !r.ok)
                  .map((r) => r.q.prompt.substring(0, 20) + "...")
                  .join(" / ")}
              </p>
            )}
          </div>
          <Link
            href={`/lms/quizzes/${quizId}/attempt`}
            className="shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
          >
            Retry
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Review
        </h2>
        <ul className="space-y-3">
          {breakdown.rows.map(({ q, chosen, ok }) => (
            <li
              key={q.id}
              className={`${LMS_CARD_CLASS} ${
                ok ? "border-emerald-100" : "border-rose-100"
              }`}
            >
              <div className="flex items-start gap-3">
                {ok ? (
                  <CheckCircle2
                    className="h-5 w-5 text-emerald-700 mt-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : (
                  <XCircle
                    className="h-5 w-5 text-rose-700 mt-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">{q.prompt}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Your answer:{" "}
                    <span
                      className={`font-semibold ${
                        ok ? "text-emerald-800" : "text-rose-800"
                      }`}
                    >
                      {chosen != null ? q.options[chosen] : "Not answered"}
                    </span>
                  </p>
                  {!ok ? (
                    <p className="mt-1 text-sm text-gray-600">
                      Correct:{" "}
                      <span className="font-semibold text-emerald-800">
                        {q.options[q.correctIndex]}
                      </span>
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm font-normal text-gray-500">
                    {q.explanation}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/lms/quizzes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Back to Dashboard
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#28A8E1] hover:underline"
          onClick={() => {
            const label =
              score < 100
                ? `Review missed quiz topics: ${quiz.title}`
                : `Review: ${quiz.title}`;
            addPlannedItem({
              id: `quiz:${quizId}:review-${Date.now()}`,
              type: "quiz",
              label,
              href: `/lms/quizzes/${quizId}/attempt`,
              sourceModule: "quizzes",
              sourceLabel: "Quiz Performance",
              context:
                score < 100
                  ? `Recommended review based on your recent quiz attempt (${score}%). Focus on: ${breakdown.rows
                      .filter((r) => !r.ok)
                      .map((r) => r.q.prompt.substring(0, 15))
                      .join(" / ")}...`
                  : `Continue practicing to maintain your mastery of ${quiz.title}.`,
            });
            toast.push({
              title: "Added to plan",
              message: "Quiz review added to Career Path plan.",
              tone: "success",
            });
          }}
        >
          Add this practice to your plan (next)
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
