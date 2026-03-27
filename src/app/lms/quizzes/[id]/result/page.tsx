import Link from "next/link";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import {
  LMS_CARD_CLASS,
  LMS_PAGE_SUBTITLE,
  LMS_SECTION_TITLE,
} from "../../../constants";
import { lmsQuizBank, lmsQuizIdForSkill } from "../../../data/ai-mock";
import { QuizResultClient } from "./quiz-result-client";

export default async function LmsQuizResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = lmsQuizBank[id];

  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <Link
          href="/lms/quizzes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to quizzes
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Results
        </h1>
        <p className={LMS_PAGE_SUBTITLE}>
          Review your answers (frontend-only mock).
        </p>
      </div>

      <QuizResultClient quizId={id} />

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Recommended next</h2>
        <div className={`${LMS_CARD_CLASS} border-violet-100 bg-violet-50/20`}>
          <div className="flex items-start gap-3">
            <Sparkles
              className="h-5 w-5 text-violet-700 mt-0.5"
              strokeWidth={2}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">Keep momentum</p>
              <p className="mt-1 text-sm font-normal text-gray-600">
                Try another short set focused on your weak skill (mock).
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/lms/quizzes/${lmsQuizIdForSkill(
                    quiz?.skill ?? "react",
                  )}/attempt?skill=${quiz?.skill ?? "react"}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={2} />
                  Start targeted practice
                </Link>
                <Link
                  href="/lms/courses"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
                >
                  View suggested lessons
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
