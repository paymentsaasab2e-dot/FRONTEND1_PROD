import Link from 'next/link';
import { Flame, Circle } from 'lucide-react';
import { LMS_CARD_CLASS } from '../constants';
import { lmsDailyMomentum } from '../data/ai-mock';

export function LmsDailyMomentum() {
  const d = lmsDailyMomentum;
  return (
    <div className={`${LMS_CARD_CLASS} mb-6 border-orange-100 bg-gradient-to-br from-orange-50/40 to-white transition-all duration-200 hover:shadow-md`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <Flame className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{d.title}</h2>
            <ul className="mt-2 space-y-2">
              {d.items.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-sm font-normal text-gray-700">
                  <Circle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${item.optional ? 'text-gray-300' : 'text-orange-400'}`}
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>
                    {item.text}
                    {item.optional ? (
                      <span className="ml-1 text-xs font-medium text-gray-400">(optional)</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link
          href="/lms/quizzes"
          className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          Start now
        </Link>
      </div>
    </div>
  );
}
