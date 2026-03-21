import { Brain } from 'lucide-react';
import { lmsSharedIntelligence, lmsCrossPageFlowHint } from '../data/ai-mock';

/** One-line mock “context memory” tying LMS surfaces together. */
export function LmsSharedIntelligenceHint() {
  return (
    <div className="mb-8 flex gap-2 rounded-xl border border-violet-100 bg-violet-50/30 px-3 py-2.5 text-xs text-gray-600 transition-all duration-200 hover:bg-violet-50/50">
      <Brain className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" strokeWidth={2} aria-hidden />
      <p className="leading-relaxed">
        <span className="font-semibold text-gray-800">Connected (mock): </span>
        {lmsSharedIntelligence.weakTopicSummary}. {lmsSharedIntelligence.notesToQuizzes}.{' '}
        <span className="text-gray-500">{lmsCrossPageFlowHint}</span>
      </p>
    </div>
  );
}
