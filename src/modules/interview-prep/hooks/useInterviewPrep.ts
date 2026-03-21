'use client';

import { useCallback, useState } from 'react';
import { interviewData as initialInterviewData } from '../data/mockInterviewData';
import type { InterviewPrepData } from '../types/interview.types';

export function useInterviewPrep() {
  const [data, setData] = useState<InterviewPrepData>(initialInterviewData);

  const onStartMock = useCallback(() => {
    console.log('Trigger AI Interview Flow');
    // Future: POST /api/interview/mock/start, voice session, transcript store
  }, []);

  const onGenerateQuestions = useCallback((type: string) => {
    console.log('Generate', type);
    // Future: POST /api/interview/questions/generate { type }
  }, []);

  const onAddToPlan = useCallback((topic: string) => {
    console.log('Add to Career Path', topic);
    // Future: PATCH /api/career/plan { topicId }
  }, []);

  /** Future: ingest scoring engine results */
  const applyScoreUpdate = useCallback((partial: Partial<InterviewPrepData['scores']>) => {
    setData((prev) => ({
      ...prev,
      scores: { ...prev.scores, ...partial },
    }));
  }, []);

  return {
    data,
    setData,
    onStartMock,
    onGenerateQuestions,
    onAddToPlan,
    applyScoreUpdate,
  };
}
