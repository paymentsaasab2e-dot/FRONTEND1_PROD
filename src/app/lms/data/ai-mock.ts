/**
 * Centralized mock data for LMS AI-layer UI.
 * Replace with API/model responses when backend is ready.
 */

import type { AIRecommendationItem } from '../components/ai';

export const dashboardAIScores = [
  {
    id: 'interview-readiness',
    title: 'Interview readiness',
    score: 78,
    supportingText: 'Strong on take-home narratives; add one more system design dry run.',
    visual: 'ring' as const,
  },
  {
    id: 'resume-strength',
    title: 'Resume strength',
    score: 84,
    supportingText: 'Impact bullets read well; keyword coverage for UI roles is good.',
    visual: 'bar' as const,
  },
  {
    id: 'weekly-goal',
    title: 'Weekly learning goal',
    score: 55,
    supportingText: 'You’re halfway through this week’s goal—two short modules left.',
    visual: 'bar' as const,
  },
];

export const dashboardPrimaryInsight = {
  title: 'Personalized coaching tip',
  recommendation:
    'You are strong in React fundamentals, but should revise system design before your next UI Engineer interview.',
  badge: 'High priority',
  ctaLabel: 'Open system design path',
};

export const dashboardNextActions = [
  { id: 'resume', label: 'Improve Resume' },
  { id: 'questions', label: 'Generate Questions' },
  { id: 'notes', label: 'Summarize Notes' },
  { id: 'mock', label: 'Start Mock Interview' },
];

export const dashboardModuleRecommendations: AIRecommendationItem[] = [
  {
    id: 'm1',
    label: 'React performance patterns',
    text: 'Suggested module based on your goal: Frontend Developer and recent quiz gaps.',
    ctaLabel: 'Add to queue',
  },
  {
    id: 'm2',
    label: 'Behavioral STAR drills',
    text: 'Short daily practice to lift interview readiness before upcoming screens.',
    ctaLabel: 'Start module',
  },
  {
    id: 'm3',
    label: 'API design basics',
    text: 'Complements your system design revision plan for the next two weeks.',
    ctaLabel: 'Preview outline',
  },
];

export const dashboardRolePath = {
  title: 'Role-focused path',
  recommendation:
    'Your learning path is tuned for a UI Engineer track: polish system design, then schedule a mock focused on component architecture.',
  badge: 'UI Engineer',
  ctaLabel: 'View full path',
};

export const interviewQuestionGeneratorCards = [
  {
    id: 'hr',
    title: 'HR questions',
    description: 'Behavioral prompts tailored to your saved target companies (mock).',
    cta: 'Generate set',
  },
  {
    id: 'tech',
    title: 'Technical questions',
    description: 'Language and framework drills matched to your resume stack.',
    cta: 'Generate set',
  },
  {
    id: 'sd',
    title: 'System design',
    description: 'Scenario cards with hints and follow-up questions.',
    cta: 'Generate set',
  },
  {
    id: 'co',
    title: 'Company-specific',
    description: 'Culture and product questions using public signals only (mock).',
    cta: 'Generate set',
  },
];

export const interviewMockDifficulties = ['Beginner', 'Intermediate', 'Advanced'] as const;
export const interviewMockRoles = [
  'UI Engineer',
  'Frontend Developer',
  'Full-stack Engineer',
  'Product Designer (tech)',
] as const;

export const interviewFeedbackSummary = {
  strengths: ['Clear structure in answers', 'Good use of examples', 'Calm pacing'],
  weakAreas: ['Deep dives on trade-offs', 'Estimation under time pressure'],
  confidenceScore: 72,
};

export const interviewRevisionTopics = [
  'Caching strategies & CDN edge cases',
  'React concurrent features & when to use them',
  'Leading with outcomes in behavioral answers',
  'Drawing system boundaries in 5 minutes',
];

export type CourseIconKey = 'code2' | 'palette' | 'lineChart' | 'bookOpen';

export const lmsCoursesWithAI: Array<{
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate';
  progress: number | null;
  iconKey: CourseIconKey;
  aiContext: string;
}> = [
  {
    id: 'c1',
    title: 'Frontend interview readiness',
    description: 'Components, state, and how to explain your projects under pressure.',
    duration: '4h',
    level: 'Intermediate',
    progress: 62,
    iconKey: 'code2',
    aiContext: 'Recommended for your Frontend Developer goal.',
  },
  {
    id: 'c2',
    title: 'UI craft & accessibility',
    description: 'Layout, contrast, and inclusive patterns hiring teams notice.',
    duration: '3h',
    level: 'Beginner',
    progress: null,
    iconKey: 'palette',
    aiContext: 'Suggested because of interview prep gaps in accessibility talking points.',
  },
  {
    id: 'c3',
    title: 'Data literacy for product roles',
    description: 'Metrics, experiments, and communicating impact with numbers.',
    duration: '5h',
    level: 'Intermediate',
    progress: 18,
    iconKey: 'lineChart',
    aiContext: 'Best next course based on your recent quiz performance.',
  },
  {
    id: 'c4',
    title: 'Professional communication',
    description: 'Email, async updates, and stakeholder updates that build trust.',
    duration: '2h',
    level: 'Beginner',
    progress: null,
    iconKey: 'bookOpen',
    aiContext: 'Recommended for your Frontend Developer goal.',
  },
  {
    id: 'c5',
    title: 'System design warm-up',
    description: 'APIs, caching, and scaling vocabulary before deep dives.',
    duration: '6h',
    level: 'Intermediate',
    progress: null,
    iconKey: 'code2',
    aiContext: 'Suggested because of interview prep gaps.',
  },
  {
    id: 'c6',
    title: 'Career narrative lab',
    description: 'Turn scattered experience into a clear story for recruiters.',
    duration: '2.5h',
    level: 'Beginner',
    progress: 100,
    iconKey: 'bookOpen',
    aiContext: 'Completed — AI suggests a refresher before your next application wave.',
  },
];

export const quizzesAIRecommended = {
  title: 'Full-stack JavaScript deep dive',
  topic: 'JavaScript & async',
  questions: 20,
  difficulty: 'Medium' as const,
  blurb: 'Top pick based on your last two quiz attempts and career path focus.',
  estMinutes: 10,
  whyThisQuiz: [
    'You scored 42% in System Design',
    'Missed “scalability” questions in the last attempt',
    'Required for the next interview stage on your target role',
  ],
};

export const quizzesRetryWeak = [
  { id: 'rw1', title: 'Closures & scope', topic: 'JavaScript', questions: 12, difficulty: 'Medium' as const },
  { id: 'rw2', title: 'React rendering cycle', topic: 'React', questions: 10, difficulty: 'Hard' as const },
];

export const quizzesMasteryByTopic = [
  { topic: 'JavaScript', pct: 68 },
  { topic: 'React', pct: 74 },
  { topic: 'System design', pct: 42 },
  { topic: 'Behavioral', pct: 81 },
];

export const quizzesRecentPerformance = { score: 76, label: 'Last quiz · 2 days ago' };

export const quizzesCatalog: Array<{
  id: string;
  title: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}> = [
  { id: 'q1', title: 'JavaScript essentials', questions: 24, difficulty: 'Easy', topic: 'JavaScript' },
  { id: 'q2', title: 'React & hooks', questions: 18, difficulty: 'Medium', topic: 'React' },
  { id: 'q3', title: 'Async & networking', questions: 15, difficulty: 'Hard', topic: 'JavaScript' },
  { id: 'q4', title: 'Behavioral scenarios', questions: 12, difficulty: 'Easy', topic: 'Behavioral' },
  { id: 'q5', title: 'SQL & data modeling', questions: 20, difficulty: 'Medium', topic: 'Data' },
  { id: 'q6', title: 'System design quiz', questions: 10, difficulty: 'Hard', topic: 'System design' },
];

export const quizzesAIExplanation =
  'Based on your progress, revise JavaScript closures and React rendering before taking the advanced quiz.';

export const eventsRecommendedIntro =
  'Live sessions aligned with your UI Engineer preparation goal (mock recommendations).';

export const eventsWithAI: Array<{
  title: string;
  date: string;
  mode: 'Online' | 'Offline';
  type: string;
  matchLabel: string;
  whyAttend: string[];
  registeredCount: number;
  startsIn: string;
}> = [
  {
    title: 'UI portfolio critique live',
    date: 'Thu, Mar 27 · 4:00 PM',
    mode: 'Online',
    type: 'Workshop',
    matchLabel: 'Highly relevant for your UI Engineer preparation',
    whyAttend: ['Sharpens portfolio round stories', 'Common format in UI interviews'],
    registeredCount: 23,
    startsIn: 'Starts in 2 days',
  },
  {
    title: 'Meet the talent team',
    date: 'Sat, Mar 29 · 10:00 AM',
    mode: 'Offline',
    type: 'Networking',
    matchLabel: 'Matches your networking goal this month',
    whyAttend: ['Practice elevator pitch', 'Learn hiring bar signals'],
    registeredCount: 41,
    startsIn: 'Starts in 4 days',
  },
  {
    title: 'Negotiation office hours',
    date: 'Tue, Apr 1 · 7:00 PM',
    mode: 'Online',
    type: 'Office hours',
    matchLabel: 'Suggested after your recent offer-stage notes',
    whyAttend: ['Aligns with salary research notes', 'Q&A on competing offers'],
    registeredCount: 58,
    startsIn: 'Starts in 6 days',
  },
  {
    title: 'Networking breakfast',
    date: 'Fri, Apr 4 · 8:30 AM',
    mode: 'Offline',
    type: 'Meetup',
    matchLabel: 'Good fit for local hiring market research',
    whyAttend: ['Local hiring intel', 'Warm intros practice'],
    registeredCount: 17,
    startsIn: 'Starts in 9 days',
  },
  {
    title: 'Tech talk: AI in hiring',
    date: 'Wed, Apr 9 · 6:00 PM',
    mode: 'Online',
    type: 'Webinar',
    matchLabel: 'Optional — broaden context on recruiter tooling',
    whyAttend: ['Context on how recruiters screen', 'Low time commitment'],
    registeredCount: 120,
    startsIn: 'Starts in 14 days',
  },
  {
    title: 'Campus hiring prep',
    date: 'Mon, Apr 14 · 3:00 PM',
    mode: 'Offline',
    type: 'Bootcamp',
    matchLabel: 'Relevant if you are targeting new-grad pipelines',
    whyAttend: ['Resume + OA patterns', 'Group mock practice'],
    registeredCount: 34,
    startsIn: 'Starts in 19 days',
  },
];

export const resumeAIScores = [
  { id: 'ats', title: 'ATS score', score: 82, text: 'Structure and headings parse cleanly in mock scans.' },
  { id: 'kw', title: 'Keyword coverage', score: 76, text: 'Strong on UI stack; add 2–3 testing keywords.' },
  { id: 'impact', title: 'Impact writing', score: 71, text: 'Bullets show outcomes—tighten metrics on recent role.' },
];

export const resumeAIImprovements = [
  'Quantify the design system adoption impact on your last team.',
  'Add “accessibility” and “design tokens” if targeting design-engineering roles.',
  'Move certifications above skills for ATS variants that weight them higher.',
];

export const resumeAIChips = [
  { id: 'bullets', label: 'Improve bullet points' },
  { id: 'kw', label: 'Add missing keywords' },
  { id: 'tailor', label: 'Tailor for job' },
  { id: 'summary', label: 'Rewrite summary' },
];

export const notesAIChips = [
  { id: 'sum', label: 'Summarize notes' },
  { id: 'flash', label: 'Convert to flashcards' },
  { id: 'quiz', label: 'Generate quiz' },
  { id: 'keys', label: 'Extract key concepts' },
  { id: 'interview', label: 'Convert to interview answers' },
  { id: 'mockq', label: 'Generate mock questions' },
  { id: 'eli5', label: 'Explain like interviewer' },
];

export const notesAIInsight = {
  title: 'Note-taking pattern',
  recommendation:
    'Your recent notes are focused on React and system design. Consider taking the Frontend Architecture quiz next.',
  badge: 'Insight',
  ctaLabel: 'Open quizzes',
};

export const careerAITarget = {
  role: 'Frontend Developer',
  readinessScore: 73,
  strengths: ['HTML', 'CSS', 'React'],
  gaps: ['Testing', 'Performance', 'System design'],
  nextStep:
    'Complete the React Performance course and take one mock interview focused on component architecture.',
  roadmapMilestones: [
    { id: '1', label: 'Foundations', done: true },
    { id: '2', label: 'Depth', done: true },
    { id: '3', label: 'Interview ready', done: false },
    { id: '4', label: 'Offer', done: false },
  ],
};

/** Persistent “AI Career Engine” strip — all LMS routes */
export const lmsCareerEngine = {
  goalLabel: 'Frontend Developer',
  progressPct: 73,
  readinessStage: 'Interview Ready',
  nextAction: 'Practice React Performance Quiz',
  nextActionHref: '/lms/quizzes',
};

export const lmsDailyMomentum = {
  title: "Today's focus",
  items: [
    { id: 'quiz', text: 'Complete 1 quiz', optional: false as const },
    { id: 'weak', text: 'Review 1 weak topic', optional: false as const },
    { id: 'session', text: 'Attend 1 session (optional)', optional: true as const },
  ],
};

/** Cross-page intelligence copy (mock “memory”) */
export const lmsSharedIntelligence = {
  weakTopicSummary: 'System design & async patterns from quizzes + notes',
  notesToQuizzes: 'Last 3 notes mention React rendering → quiz queue updated',
  resumeToReadiness: 'Resume keyword gaps reduce interview readiness by ~6% (mock)',
  careerAdaptive:
    'Path auto-prioritizes weak topics from quizzes and highlights matching events.',
};

export const quizzesSkillHeatmap = [
  {
    topic: 'JavaScript',
    pct: 68,
    tier: 'building' as const,
    slug: 'javascript',
    hoverMistakes: 'Hoisting + microtask ordering',
    hoverSuggestion: 'Try the JavaScript essentials practice set',
  },
  {
    topic: 'React',
    pct: 74,
    tier: 'strong' as const,
    slug: 'react',
    hoverMistakes: 'Fewer misses on hooks',
    hoverSuggestion: 'Level up with React optimization quiz',
  },
  {
    topic: 'System design',
    pct: 42,
    tier: 'risk' as const,
    slug: 'system',
    hoverMistakes: 'Scalability & caching prompts',
    hoverSuggestion: 'Start system design warm-up + live workshop',
  },
  {
    topic: 'Behavioral',
    pct: 81,
    tier: 'strong' as const,
    slug: 'behavioral',
    hoverMistakes: 'STAR endings sometimes vague',
    hoverSuggestion: 'Generate HR question set',
  },
];

export const quizzesLastSessionFeedback = {
  improvementPct: 12,
  weakAreas: ['Async handling', 'Memoization'],
  nextQuizTitle: 'React optimization quiz',
  nextStepCta: 'Start practice (12 min)',
};

export const quizzesEngagement = {
  streakDays: 4,
  confidenceLabel: 'Medium → Improving',
};

export const notesLearningEngineOutput = {
  concepts: ['Closure scope rules', 'React render batching', 'Memoization trade-offs'],
  quizQuestions: [
    'When should you prefer useCallback vs inline handlers?',
    'Walk through a stale closure bug in a timer.',
  ],
  weakArea: 'Explaining async flow in interviews under time pressure',
};

export const notesSmartLinkDemo = {
  trigger: 'React rendering issue',
  related: [
    { label: 'React rendering quiz', href: '/lms/quizzes' },
    { label: 'Performance course', href: '/lms/courses' },
  ],
};

export const notesEmptyState = {
  title: 'Start your first note',
  body: 'Your notes feed quizzes, resume coaching, and career path priorities. In guided mode we estimate up to 30% better quiz targeting once notes exist.',
  cta: 'Create your first note',
};

export type NoteType = 'Interview Prep' | 'Learning Notes' | 'Company Research' | 'Salary Research';

/** Set to `false` to preview the empty-state UX locally. */
export const LMS_NOTES_SEED_ENABLED = true;

export const notesUserNotes: Array<{
  id: string;
  title: string;
  updated: string;
  type: NoteType;
}> = [
  { id: 'n1', title: 'Talking points for NovaTech screen', updated: '2 hours ago', type: 'Interview Prep' },
  { id: 'n2', title: 'Salary range research — senior IC', updated: 'Yesterday', type: 'Salary Research' },
  { id: 'n3', title: 'Questions to ask hiring manager', updated: 'Mar 18, 2026', type: 'Company Research' },
  { id: 'n4', title: 'Study list: system design', updated: 'Mar 15, 2026', type: 'Learning Notes' },
];

export const resumeRecruiterSimulation = {
  scanSeconds: 6,
  missingKeywords: ['Jest', 'React Testing Library', 'Web Vitals'],
  weakBullets: ['Led frontend work on dashboard', 'Improved performance'],
};

export const resumeJobMatch = {
  title: 'Frontend Engineer',
  company: 'XYZ Labs',
  score: 78,
  improve: ['Add testing keywords', 'Highlight performance work with metrics'],
};

export const resumeBeforeAfter = {
  before: 'Responsible for building UI components for the product team.',
  after:
    'Shipped 12 reusable UI primitives, cutting feature dev time ~18% and improving Lighthouse performance score from 72 → 91.',
};

export const resumeAtsRisks = [
  'Missing measurable impact on 2 bullets',
  'Summary reads generic — add role-specific hook',
];

export const careerMission = {
  headline: 'Mission: Become Frontend Developer',
  phases: [
    {
      id: 'p1',
      title: 'Phase 1 · Foundations',
      done: true,
      steps: ['Complete JavaScript quiz ≥ 70%', 'Finish HTML/CSS refresher module'],
    },
    {
      id: 'p2',
      title: 'Phase 2 · Depth',
      done: true,
      steps: ['Complete React quiz', 'Build 2 portfolio projects', 'Publish case study note'],
    },
    {
      id: 'p3',
      title: 'Phase 3 · Interview ready',
      done: false,
      steps: ['Practice 3 mock interviews', 'System design quiz ≥ 60%', 'Update resume for ATS'],
    },
    {
      id: 'p4',
      title: 'Phase 4 · Offer',
      done: false,
      steps: ['Salary research notes', 'Negotiation workshop', 'Reference prep'],
    },
  ],
  risk: {
    label: 'AI risk indicator',
    text: 'Low System Design score may affect interviews — path boosted related quizzes & events.',
  },
  timeline: [
    { week: 'Week 1', focus: 'JS fundamentals & closures' },
    { week: 'Week 2', focus: 'React depth + performance' },
    { week: 'Week 3', focus: 'Mock interviews + system design' },
  ],
  adaptiveCopy:
    'If quiz scores drop below 60% in any pillar, the roadmap re-orders modules and surfaces matching notes → quizzes → events automatically (mock behavior).',
};

export const lmsCrossPageFlowHint =
  'Flow: Notes → generate quiz → weak area drills → career path → events → resume refresh.';
