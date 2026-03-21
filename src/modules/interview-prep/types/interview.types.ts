export type InterviewScore = {
  overall: number;
  technical: number;
  behavioral: number;
  systemDesign: number;
  communication: number;
};

export type Feedback = {
  strengths: string[];
  improvements: string[];
};

export type RevisionTopic = {
  id: string;
  title: string;
  type: 'technical' | 'behavioral' | 'system';
};

export type QuestionCategory = {
  title: string;
  description: string;
  count: string;
};

export type QuestionGeneratorKind = 'hr' | 'technical' | 'system' | 'company';

export type InterviewPrepData = {
  goal: string;
  readiness: number;
  nextAction: string;
  todayFocus: string[];
  feedback: Feedback;
  revisionTopics: RevisionTopic[];
  confidenceScore: number;
  scores: InterviewScore;
  aiInsight: string;
  questionGenerator: Array<{
    id: QuestionGeneratorKind;
    title: string;
    description: string;
  }>;
  questionBank: QuestionCategory[];
  suggestedCompanies: string[];
};

/** Future: AI session transcript chunk */
export type InterviewTranscriptSegment = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

/** Future: voice / scoring pipeline */
export type MockInterviewSessionMeta = {
  sessionId: string;
  difficulty: string;
  role: string;
  voiceEnabled: boolean;
};
