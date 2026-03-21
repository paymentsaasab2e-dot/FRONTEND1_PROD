'use client';

import { Users, Cpu, Network, Building2 } from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import type { InterviewPrepData } from '../../types/interview.types';

const ICONS = {
  hr: Users,
  technical: Cpu,
  system: Network,
  company: Building2,
} as const;

type QuestionGeneratorGridProps = {
  items: InterviewPrepData['questionGenerator'];
  onGenerate: (type: string) => void;
};

export function QuestionGeneratorGrid({ items, onGenerate }: QuestionGeneratorGridProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">AI question generator</h2>
        <p className="mt-1 text-sm font-normal text-gray-500">
          One-tap sets — wire to your prompt API. Voice + transcript hooks ready in{' '}
          <code className="text-xs bg-gray-100 px-1 rounded">useInterviewPrep</code>.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {items.map((item) => (
          <QuestionCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={ICONS[item.id]}
            onGenerate={() => onGenerate(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
