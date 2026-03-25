'use client';

import { useCallback, useEffect, useState } from 'react';
import { interviewData as initialInterviewData, generateMockQuestions } from '../data/mockInterviewData';
import type { InterviewPrepData, QuestionSet, MockSessionResult } from '../types/interview.types';

type MockConfig = {
  difficulty: string;
  role: string;
};

export function useInterviewPrep() {
  const [data, setData] = useState<InterviewPrepData>(initialInterviewData);
  const [mockConfig, setMockConfig] = useState<MockConfig>({ difficulty: 'Intermediate', role: 'Frontend Developer' });
  const [generatedSet, setGeneratedSet] = useState<QuestionSet | null>(null);

  // We persist subsets of interview prep state in sessionStorage/localStorage for the Mock
  const [sessionResults, setSessionResults] = useState<MockSessionResult[]>([]);
  const [savedSets, setSavedSets] = useState<QuestionSet[]>([]);
  
  useEffect(() => {
    try {
      const storedSets = localStorage.getItem('ip:sets');
      if (storedSets) setSavedSets(JSON.parse(storedSets));
      const storedResults = localStorage.getItem('ip:sessions');
      if (storedResults) setSessionResults(JSON.parse(storedResults));
    } catch {}
  }, []);

  const onStartMock = useCallback(() => {
    return mockConfig;
  }, [mockConfig]);

  const onGenerateQuestions = useCallback((type: string) => {
    const questions = generateMockQuestions(type);
    const set: QuestionSet = {
      id: `set-${Date.now()}`,
      kind: type,
      questions,
      createdAt: Date.now()
    };
    setGeneratedSet(set);
    
    // Auto-save to local history so we can route to it
    setSavedSets(prev => {
      const next = [set, ...prev];
      try { localStorage.setItem('ip:sets', JSON.stringify(next)); } catch {}
      return next;
    });

    return set;
  }, []);

  const onAddToPlan = useCallback((topic: string | string[]) => {
    // Return array of topics to plan
    return Array.isArray(topic) ? topic : [topic];
  }, []);

  const saveMockSession = useCallback((result: MockSessionResult) => {
    setSessionResults(prev => {
      const next = [result, ...prev];
      try { localStorage.setItem('ip:sessions', JSON.stringify(next)); } catch {}
      return next;
    });
    
    // Update feedback/readiness loosely based on mock results
    setData(prev => ({
      ...prev,
      readiness: Math.min(100, prev.readiness + 2),
      confidenceScore: Math.min(100, prev.confidenceScore + 3),
      feedback: {
        strengths: Array.from(new Set([...result.strengths, ...prev.feedback.strengths])).slice(0, 4),
        improvements: Array.from(new Set([...result.improvements, ...prev.feedback.improvements])).slice(0, 4),
      }
    }));
  }, []);

  const applyScoreUpdate = useCallback((partial: Partial<InterviewPrepData['scores']>) => {
    setData((prev) => ({
      ...prev,
      scores: { ...prev.scores, ...partial },
    }));
  }, []);

  return {
    data,
    setData,
    mockConfig,
    setMockConfig,
    generatedSet,
    setGeneratedSet,
    savedSets,
    sessionResults,
    saveMockSession,
    onStartMock,
    onGenerateQuestions,
    onAddToPlan,
    applyScoreUpdate,
  };
}
