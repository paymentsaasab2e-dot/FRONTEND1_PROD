'use client';

import { useRouter } from 'next/navigation';
import { useInterviewPrep } from './hooks/useInterviewPrep';
import { InterviewHeader } from './components/InterviewHeader';
import { TodayFocusCard } from './components/TodayFocusCard';
import { AIInsightBar } from './components/AIInsightBar';
import { QuestionGeneratorGrid } from './components/QuestionGenerator/QuestionGeneratorGrid';
import { MockInterviewCard } from './components/MockInterview/MockInterviewCard';
import { FeedbackSummary } from './components/Feedback/FeedbackSummary';
import { RevisionTopics } from './components/Revision/RevisionTopics';
import { QuestionBankGrid } from './components/QuestionBank/QuestionBankGrid';
import { CompanySearch } from './components/CompanyResearch/CompanySearch';
import { LMS_PAGE_SUBTITLE } from '@/app/lms/constants';

export default function InterviewPrepModulePage() {
  const router = useRouter();
  const { data, onStartMock, onGenerateQuestions, onAddToPlan } = useInterviewPrep();

  return (
    <div className="space-y-8 pb-2">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">AI interview operating system</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1 tracking-tight">Interview preparation</h1>
        <p className={LMS_PAGE_SUBTITLE}>
          Modular, API-ready shell — mock data and console hooks until your AI services ship.
        </p>
      </div>

      <InterviewHeader
        data={{
          goal: data.goal,
          readiness: data.readiness,
          nextAction: data.nextAction,
          scores: data.scores,
        }}
        onNextAction={() => router.push('/lms/quizzes')}
      />

      <TodayFocusCard items={data.todayFocus} onStartNow={() => router.push('/lms/quizzes')} />

      <AIInsightBar message={data.aiInsight} />

      <QuestionGeneratorGrid items={data.questionGenerator} onGenerate={onGenerateQuestions} />

      <MockInterviewCard onStartMock={onStartMock} />

      <FeedbackSummary feedback={data.feedback} confidenceScore={data.confidenceScore} />

      <RevisionTopics topics={data.revisionTopics} onAddToPlan={onAddToPlan} />

      <QuestionBankGrid
        categories={data.questionBank}
        onOpenCategory={(title) => console.log('Open question bank', title)}
      />

      <CompanySearch
        suggested={data.suggestedCompanies}
        onTag={(c) => console.log('Company tag', c)}
      />
    </div>
  );
}
