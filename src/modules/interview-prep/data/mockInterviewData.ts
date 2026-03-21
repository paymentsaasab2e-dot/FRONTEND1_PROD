import type { InterviewPrepData } from '../types/interview.types';

export const interviewData: InterviewPrepData = {
  goal: 'Frontend Developer',
  readiness: 73,
  nextAction: 'Practice React Performance Interview',

  todayFocus: ['Complete 1 quiz', 'Review 1 weak topic', 'Attend 1 session'],

  feedback: {
    strengths: ['Clear structure in answers', 'Good use of examples', 'Calm pacing'],
    improvements: ['Deep dives on trade-offs', 'Estimation under time pressure'],
  },

  revisionTopics: [
    { id: 'rev-1', title: 'Caching strategies & CDN edge cases', type: 'technical' },
    { id: 'rev-2', title: 'React concurrent features', type: 'technical' },
    { id: 'rev-3', title: 'Behavioral outcomes storytelling', type: 'behavioral' },
    { id: 'rev-4', title: 'System boundary design', type: 'system' },
  ],

  confidenceScore: 72,

  scores: {
    overall: 73,
    technical: 76,
    behavioral: 81,
    systemDesign: 58,
    communication: 74,
  },

  aiInsight:
    'Connected (mock): System design + async patterns detected from notes — prioritize scalability drills before your next UI screen.',

  questionGenerator: [
    {
      id: 'hr',
      title: 'HR questions',
      description: 'Behavioral prompts tailored to your saved target companies (mock).',
    },
    {
      id: 'technical',
      title: 'Technical questions',
      description: 'Language and framework drills matched to your resume stack.',
    },
    {
      id: 'system',
      title: 'System design',
      description: 'Scenario cards with hints and follow-up questions.',
    },
    {
      id: 'company',
      title: 'Company-specific',
      description: 'Culture and product questions using public signals only (mock).',
    },
  ],

  questionBank: [
    {
      title: 'HR',
      description: 'Behavioral prompts, culture fit, and salary conversations.',
      count: '120+ prompts',
    },
    {
      title: 'Technical',
      description: 'Language fundamentals, debugging stories, and code walkthroughs.',
      count: '200+ prompts',
    },
    {
      title: 'System design',
      description: 'High-level architecture, trade-offs, and scaling discussions.',
      count: '45+ scenarios',
    },
  ],

  suggestedCompanies: ['Stripe', 'Notion', 'Figma', 'Linear', 'Vercel'],
};

export const mockInterviewDifficulties = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const mockInterviewRoles = [
  'UI Engineer',
  'Frontend Developer',
  'Full-stack Engineer',
  'Product Designer (tech)',
] as const;
