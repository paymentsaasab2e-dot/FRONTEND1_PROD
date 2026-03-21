import Link from 'next/link';
import { Plus, StickyNote, Sparkles, BookOpen, Link2 } from 'lucide-react';
import { LMS_CARD_CLASS, LMS_CARD_INTERACTIVE, LMS_PAGE_SUBTITLE, LMS_SECTION_TITLE } from '../constants';
import { AISectionHeading, AIActionChips, AIInsightCard } from '../components/ai';
import {
  notesAIChips,
  notesAIInsight,
  notesLearningEngineOutput,
  notesSmartLinkDemo,
  notesEmptyState,
  notesUserNotes,
  LMS_NOTES_SEED_ENABLED,
  type NoteType,
} from '../data/ai-mock';

function noteTypeStyle(t: NoteType) {
  const map: Record<NoteType, string> = {
    'Interview Prep': 'bg-indigo-50 text-indigo-800 border-indigo-100',
    'Learning Notes': 'bg-emerald-50 text-emerald-900 border-emerald-100',
    'Company Research': 'bg-sky-50 text-sky-900 border-sky-100',
    'Salary Research': 'bg-amber-50 text-amber-900 border-amber-100',
  };
  return map[t];
}

export default function LmsNotesPage() {
  const displayNotes = LMS_NOTES_SEED_ENABLED ? notesUserNotes : [];
  const hasNotes = displayNotes.length > 0;

  return (
    <div className="space-y-8">
      <div className="min-w-0 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Notes</h1>
          <p className={LMS_PAGE_SUBTITLE}>
            Learning engine — notes flow into quizzes, resume coaching, and career path (mock links).
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Create note
        </button>
      </div>

      <section className="space-y-4 rounded-2xl border border-violet-100 bg-white/70 p-5 sm:p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <AISectionHeading title="AI note actions" />
        <AIActionChips actions={notesAIChips} />
        <div className="pt-2">
          <AIInsightCard
            icon={Sparkles}
            title={notesAIInsight.title}
            recommendation={notesAIInsight.recommendation}
            scoreOrTag={notesAIInsight.badge}
            ctaLabel={notesAIInsight.ctaLabel}
            ctaHref="/lms/quizzes"
          />
        </div>
      </section>

      {hasNotes ? (
        <section className="space-y-4">
          <AISectionHeading title="From your notes (mock extraction)" />
          <div className={`${LMS_CARD_CLASS} grid grid-cols-1 md:grid-cols-3 gap-4 border-violet-50 transition-all duration-200 hover:shadow-md`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Key concepts</p>
              <ul className="space-y-1 text-sm font-semibold text-gray-800">
                {notesLearningEngineOutput.concepts.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 shrink-0 text-[#28A8E1] mt-0.5" strokeWidth={2} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Quiz questions generated</p>
              <ul className="space-y-2 text-sm font-normal text-gray-600 list-decimal pl-4">
                {notesLearningEngineOutput.quizQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-rose-800 mb-1">Weak area flagged</p>
              <p className="text-sm font-semibold text-gray-900">{notesLearningEngineOutput.weakArea}</p>
              <Link
                href="/lms/quizzes"
                className="mt-2 inline-block text-sm font-semibold text-[#28A8E1] hover:underline"
              >
                Open quizzes →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <AISectionHeading title="Smart note linking (example)" />
        <div className={`${LMS_CARD_CLASS} transition-all duration-200 hover:shadow-md`}>
          <p className="text-sm font-bold text-gray-900">
            When you write: <span className="text-violet-800">“{notesSmartLinkDemo.trigger}”</span>
          </p>
          <p className="mt-2 text-sm font-normal text-gray-500">Related (mock):</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {notesSmartLinkDemo.related.map((r) => (
              <li key={r.label}>
                <Link
                  href={r.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:border-[#28A8E1]/40 hover:shadow-sm"
                >
                  <Link2 className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Recent</h2>
        {!hasNotes ? (
          <div className={`${LMS_CARD_CLASS} text-center py-14 px-6 border-dashed border-2 border-gray-200 transition-all duration-200 hover:shadow-md`}>
            <StickyNote className="h-12 w-12 mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-bold text-gray-900">{notesEmptyState.title}</h3>
            <p className="mt-2 text-sm font-normal text-gray-500 max-w-md mx-auto">{notesEmptyState.body}</p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#28A8E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              {notesEmptyState.cta}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayNotes.map((note) => (
              <div key={note.id} className={LMS_CARD_INTERACTIVE}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-100">
                    <StickyNote className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${noteTypeStyle(note.type)}`}
                    >
                      {note.type}
                    </span>
                    <h2 className="mt-2 text-base font-bold text-gray-900 leading-snug">{note.title}</h2>
                    <p className="mt-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Last updated · {note.updated}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
