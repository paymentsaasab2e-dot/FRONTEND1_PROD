'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { LMS_CARD_CLASS } from '../../../constants';
import { lmsQuizBank } from '../../../data/ai-mock';
import { LmsCtaButton } from '../../../components/ux/LmsCtaButton';
import { useLmsToast } from '../../../components/ux/LmsToastProvider';
import { useLmsState } from '../../../state/LmsStateProvider';

type StoredAttempt = {
  quizId: string;
  answers: Record<string, number>;
  completedAt?: number;
};

function storageKey(quizId: string) {
  return `lmsQuizAttempt:${quizId}`;
}

export function QuizAttemptClient({ quizId }: { quizId: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const toast = useLmsToast();
  const { setSelectedSkill, setQuizAttempt } = useLmsState();

  const quiz = lmsQuizBank[quizId];
  const skillFromUrl = search.get('skill');

  const questions = quiz?.questions ?? [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [confirmExit, setConfirmExit] = useState(false);

  useEffect(() => {
    if (skillFromUrl) setSelectedSkill(skillFromUrl);
  }, [setSelectedSkill, skillFromUrl]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(quizId));
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredAttempt;
      if (parsed?.quizId !== quizId) return;
      if (parsed.answers) setAnswers(parsed.answers);
    } catch {
      // ignore
    }
  }, [quizId]);

  useEffect(() => {
    try {
      const payload: StoredAttempt = { quizId, answers };
      sessionStorage.setItem(storageKey(quizId), JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [quizId, answers]);

  if (!quiz || questions.length === 0) {
    return (
      <div className="space-y-8 pb-8">
        <div className="min-w-0">
          <Link href="/lms/quizzes" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to quizzes
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-100 rounded-3xl">
          <p className="text-gray-500 font-medium">This quiz could not be found or has no active questions.</p>
          <Link href="/lms/quizzes" className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#208bc0]">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const answeredCount = Object.keys(answers).length;

  const select = (optIndex: number) => setAnswers((prev) => ({ ...prev, [q.id]: optIndex }));

  const canSubmit = answeredCount === questions.length;

  const handleExit = () => {
    if (answeredCount > 0 && !canSubmit && !confirmExit) {
      setConfirmExit(true);
      return;
    }
    router.push('/lms/quizzes');
  };

  const submit = () => {
    const correct = questions.reduce((acc, question) => {
      const chosen = answers[question.id];
      return acc + (chosen === question.correctIndex ? 1 : 0);
    }, 0);
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    setQuizAttempt(quizId, score);

    try {
      const payload: StoredAttempt = { quizId, answers, completedAt: Date.now() };
      sessionStorage.setItem(storageKey(quizId), JSON.stringify(payload));
    } catch {
      // ignore
    }

    toast.push({ title: 'Quiz submitted', message: `Score: ${score}% (mock).`, tone: score >= 70 ? 'success' : 'info' });
    const durSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    router.push(`/lms/quizzes/${quizId}/result?duration=${durSec}${skillFromUrl ? `&skill=${encodeURIComponent(skillFromUrl)}` : ''}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between min-w-0">
        <h1 className="text-xl font-bold text-gray-900 truncate pr-4">{quiz.title}</h1>
        <button onClick={handleExit} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <X className="w-4 h-4" /> Exit
        </button>
      </div>

      {confirmExit && (
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-between">
          <p className="text-sm text-amber-800 font-medium">You have unanswered questions. Are you sure you want to abandon this setup?</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setConfirmExit(false)} className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-2 py-1">Cancel</button>
            <button onClick={() => router.push('/lms/quizzes')} className="text-sm font-semibold text-rose-600 hover:text-rose-700 px-2 py-1">Leave Anyway</button>
          </div>
        </div>
      )}

      <div className={`${LMS_CARD_CLASS} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <span className="rounded-full bg-violet-50 border border-violet-100 px-3 py-1">
            Question {index + 1} / {questions.length}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-600">{answeredCount} answered</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Clock className="h-4 w-4" strokeWidth={2} aria-hidden />
          Mock timer running
        </div>
      </div>

      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#28A8E1] transition-[width] duration-300" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
      </div>

      <div className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md`}>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Prompt</p>
        <h2 className="mt-2 text-lg font-bold text-gray-900 leading-snug">{q.prompt}</h2>

        <ul className="mt-5 space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === i;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                    selected
                      ? 'border-[#28A8E1]/40 bg-[#28A8E1]/10 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm'
                  } focus:outline-none focus:ring-4 focus:ring-blue-100`}
                >
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5">
                      {selected ? (
                        <CheckCircle2 className="h-5 w-5 text-[#28A8E1]" strokeWidth={2} aria-hidden />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" strokeWidth={2} aria-hidden />
                      )}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{opt}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <LmsCtaButton
          variant="secondary"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          leftIcon={<ChevronLeft className="h-4 w-4" strokeWidth={2} />}
        >
          Previous
        </LmsCtaButton>
        {index < questions.length - 1 ? (
          <LmsCtaButton
            variant="primary"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            leftIcon={<ChevronRight className="h-4 w-4" strokeWidth={2} />}
          >
            Next
          </LmsCtaButton>
        ) : (
          <LmsCtaButton variant="primary" onClick={submit} disabled={!canSubmit}>
            Submit
          </LmsCtaButton>
        )}
      </div>

      {!canSubmit ? (
        <p className="text-xs font-medium text-gray-500">
          Answer all questions to submit. This is a frontend-only mock flow.
        </p>
      ) : null}
    </div>
  );
}

