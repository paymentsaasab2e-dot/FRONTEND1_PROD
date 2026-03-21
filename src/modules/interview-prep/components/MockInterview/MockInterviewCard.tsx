'use client';

import { Mic2 } from 'lucide-react';
import { MockConfigPanel } from './MockConfigPanel';
import { MockStartButton } from './MockStartButton';

type MockInterviewCardProps = {
  onStartMock: () => void;
};

export function MockInterviewCard({ onStartMock }: MockInterviewCardProps) {
  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#28A8E1]/10 text-[#28A8E1] ring-1 ring-[#28A8E1]/20">
          <Mic2 className="h-7 w-7" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-gray-900">AI mock interview</h2>
          <p className="mt-1 text-sm font-normal text-gray-500 leading-relaxed">
            Session metadata, voice capture, and transcript storage map to{' '}
            <code className="text-xs bg-gray-100 px-1 rounded">MockInterviewSessionMeta</code> +{' '}
            <code className="text-xs bg-gray-100 px-1 rounded">InterviewTranscriptSegment</code>.
          </p>
        </div>
      </div>
      <MockConfigPanel />
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-xs font-medium text-gray-500">
        Voice input: <span className="text-gray-700">placeholder</span> — connect Web Speech / streaming API later.
      </div>
      <MockStartButton onStart={onStartMock} />
    </section>
  );
}
