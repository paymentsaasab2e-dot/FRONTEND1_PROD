'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { notesUserNotes, type NoteType } from '../data/ai-mock';

export type LmsPlannedItemType = 'course' | 'quiz' | 'event' | 'topic' | 'note' | 'resume';

export type LmsPlannedItem = {
  id: string;
  type: LmsPlannedItemType;
  label: string;
  href?: string;
  createdAt: number;
};

export type ResumeExperience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  bullets: string;
};

export type ResumeEducation = {
  id: string;
  institution: string;
  degree: string;
  duration: string;
};

type LmsState = {
  savedCourseIds: string[];
  registeredEventTitles: string[];
  plannedItems: LmsPlannedItem[];
  lastActiveCourseId: string | null;
  courseProgress: Record<string, number>;
  courseLessonIndex: Record<string, number>;
  selectedSkill: string | null;
  quizAttempts: Record<string, { score: number; completedAt: number }>;
  notes: Array<{
    id: string;
    title: string;
    body: string;
    updated: string;
    type: NoteType;
  }>;
  resumeDraft: {
    template: string | null;
    updatedAtLabel: string;
    sections: {
      basics: {
        name: string;
        headline: string;
        email: string;
        phone: string;
        location: string;
      };
      summary: string;
      skills: string;
      experience: ResumeExperience[];
      education: ResumeEducation[];
    };
  };
  careerPath: {
    started: boolean;
    completedStepIds: string[];
  };
};

type Action =
  | { type: 'toggleSaveCourse'; courseId: string }
  | { type: 'registerEvent'; title: string }
  | { type: 'unregisterEvent'; title: string }
  | { type: 'addPlannedItem'; item: Omit<LmsPlannedItem, 'createdAt'> }
  | { type: 'removePlannedItem'; id: string }
  | { type: 'setLastActiveCourseId'; courseId: string | null }
  | { type: 'setCourseProgress'; courseId: string; progress: number }
  | { type: 'setCourseLessonIndex'; courseId: string; index: number }
  | { type: 'setSelectedSkill'; skill: string | null }
  | { type: 'setQuizAttempt'; quizId: string; score: number }
  | {
      type: 'createNote';
      note: { id: string; title: string; body: string; type: NoteType; updated: string };
    }
  | { type: 'updateNote'; id: string; patch: Partial<{ title: string; body: string; type: NoteType; updated: string }> }
  | { type: 'deleteNote'; id: string }
  | { type: 'setResumeTemplate'; template: string | null }
  | { type: 'setResumeDraftSections'; sections: Partial<LmsState['resumeDraft']['sections']> }
  | { type: 'resetResumeDraft' }
  | { type: 'markResumeSaved' }
  | { type: 'careerStart' }
  | { type: 'careerToggleStep'; stepId: string }
  | { type: 'careerReset' }
  | { type: 'hydrate'; state: LmsState };

const STORAGE_KEY = 'lmsState:v1';

const initialResumeDraft: LmsState['resumeDraft'] = {
  template: null,
  updatedAtLabel: 'Not saved yet',
  sections: {
    basics: {
      name: 'Alex Developer',
      headline: 'Frontend Engineer',
      email: 'alex@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
    },
    summary:
      'Frontend engineer focused on clean UI, performance, and product impact. Strong React fundamentals; improving system design and testing coverage.',
    skills: 'React, TypeScript, CSS, Accessibility, Performance, Testing (Jest/RTL)',
    experience: [
      {
        id: 'exp-1',
        company: 'Tech Corp',
        role: 'Frontend Engineer',
        duration: 'Jan 2024 - Present',
        bullets: 'Built reusable UI components and improved dashboard performance.\nReduced feature dev time and improved Lighthouse scores (mock).',
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'State University',
        degree: 'BS Computer Science',
        duration: '2019 - 2023',
      }
    ],
  },
};

const initialState: LmsState = {
  savedCourseIds: [],
  registeredEventTitles: [],
  plannedItems: [],
  lastActiveCourseId: null,
  courseProgress: {},
  courseLessonIndex: {},
  selectedSkill: null,
  quizAttempts: {},
  notes: notesUserNotes.map((n) => ({
    ...n,
    body: `Mock note body for “${n.title}”.\n\n- Add highlights\n- Add links\n- Convert into quiz prompts`,
  })),
  resumeDraft: initialResumeDraft,
  careerPath: {
    started: false,
    completedStepIds: ['step-1', 'step-2'],
  },
};

function clampPct(n: number) {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function reducer(state: LmsState, action: Action): LmsState {
  switch (action.type) {
    case 'hydrate': {
      // Safe migration for older resume drafts
      let hydratedResumeDraft = action.state.resumeDraft;
      if (typeof hydratedResumeDraft?.sections?.experience === 'string') {
          hydratedResumeDraft = initialResumeDraft;
      }
      return { ...action.state, resumeDraft: hydratedResumeDraft || initialResumeDraft };
    }
    case 'toggleSaveCourse': {
      const has = state.savedCourseIds.includes(action.courseId);
      return {
        ...state,
        savedCourseIds: has
          ? state.savedCourseIds.filter((id) => id !== action.courseId)
          : [action.courseId, ...state.savedCourseIds],
      };
    }
    case 'registerEvent': {
      if (state.registeredEventTitles.includes(action.title)) return state;
      return { ...state, registeredEventTitles: [action.title, ...state.registeredEventTitles] };
    }
    case 'unregisterEvent':
      return { ...state, registeredEventTitles: state.registeredEventTitles.filter((t) => t !== action.title) };
    case 'addPlannedItem': {
      if (state.plannedItems.find((i) => i.id === action.item.id)) return state;
      return {
        ...state,
        plannedItems: [{ ...action.item, createdAt: Date.now() }, ...state.plannedItems].slice(0, 40),
      };
    }
    case 'removePlannedItem':
      return { ...state, plannedItems: state.plannedItems.filter((i) => i.id !== action.id) };
    case 'setLastActiveCourseId':
      return { ...state, lastActiveCourseId: action.courseId };
    case 'setCourseProgress':
      return {
        ...state,
        courseProgress: { ...state.courseProgress, [action.courseId]: clampPct(action.progress) },
      };
    case 'setCourseLessonIndex':
      return {
        ...state,
        courseLessonIndex: {
          ...state.courseLessonIndex,
          [action.courseId]: Math.max(0, Math.floor(action.index)),
        },
      };
    case 'setSelectedSkill':
      return { ...state, selectedSkill: action.skill };
    case 'setQuizAttempt':
      return {
        ...state,
        quizAttempts: {
          ...state.quizAttempts,
          [action.quizId]: { score: clampPct(action.score), completedAt: Date.now() },
        },
      };
    case 'createNote':
      return { ...state, notes: [action.note, ...state.notes] };
    case 'updateNote':
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === action.id ? { ...n, ...action.patch } : n)),
      };
    case 'deleteNote':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.id) };
    case 'setResumeTemplate':
      return { ...state, resumeDraft: { ...state.resumeDraft, template: action.template } };
    case 'setResumeDraftSections':
      return {
        ...state,
        resumeDraft: {
          ...state.resumeDraft,
          updatedAtLabel: 'Unsaved changes',
          sections: { ...state.resumeDraft.sections, ...action.sections },
        },
      };
    case 'resetResumeDraft':
      return {
        ...state,
        resumeDraft: initialResumeDraft,
      };
    case 'markResumeSaved':
      return {
        ...state,
        resumeDraft: { ...state.resumeDraft, updatedAtLabel: 'Just now' },
      };
    case 'careerStart':
      return { ...state, careerPath: { ...state.careerPath, started: true } };
    case 'careerToggleStep': {
      const has = state.careerPath.completedStepIds.includes(action.stepId);
      return {
        ...state,
        careerPath: {
          ...state.careerPath,
          completedStepIds: has
            ? state.careerPath.completedStepIds.filter((id) => id !== action.stepId)
            : [action.stepId, ...state.careerPath.completedStepIds],
        },
      };
    }
    case 'careerReset':
      return {
        ...state,
        careerPath: { ...state.careerPath, started: false, completedStepIds: [] },
      };
    default:
      return state;
  }
}

type LmsStateApi = {
  state: LmsState;
  toggleSaveCourse: (courseId: string) => void;
  registerEvent: (title: string) => void;
  unregisterEvent: (title: string) => void;
  addPlannedItem: (item: Omit<LmsPlannedItem, 'createdAt'>) => void;
  removePlannedItem: (id: string) => void;
  setLastActiveCourseId: (courseId: string | null) => void;
  setCourseProgress: (courseId: string, progress: number) => void;
  setCourseLessonIndex: (courseId: string, index: number) => void;
  setSelectedSkill: (skill: string | null) => void;
  setQuizAttempt: (quizId: string, score: number) => void;
  createNote: (note: { title: string; body: string; type: NoteType }) => string;
  updateNote: (id: string, patch: Partial<{ title: string; body: string; type: NoteType }>) => void;
  deleteNote: (id: string) => void;
  setResumeTemplate: (template: string | null) => void;
  setResumeDraftSections: (sections: Partial<LmsState['resumeDraft']['sections']>) => void;
  resetResumeDraft: () => void;
  markResumeSaved: () => void;
  careerStart: () => void;
  careerToggleStep: (stepId: string) => void;
  careerReset: () => void;
};

const LmsStateContext = createContext<LmsStateApi | null>(null);

export function LmsStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as LmsState;
      if (!parsed || typeof parsed !== 'object') return;
      dispatch({ type: 'hydrate', state: { ...initialState, ...parsed } });
    } catch {
      // ignore hydration errors (corrupt storage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota/serialization errors
    }
  }, [state]);

  const toggleSaveCourse = useCallback((courseId: string) => dispatch({ type: 'toggleSaveCourse', courseId }), []);
  const registerEvent = useCallback((title: string) => dispatch({ type: 'registerEvent', title }), []);
  const unregisterEvent = useCallback((title: string) => dispatch({ type: 'unregisterEvent', title }), []);
  const addPlannedItem = useCallback(
    (item: Omit<LmsPlannedItem, 'createdAt'>) => dispatch({ type: 'addPlannedItem', item }),
    []
  );
  const removePlannedItem = useCallback((id: string) => dispatch({ type: 'removePlannedItem', id }), []);
  const setLastActiveCourseId = useCallback(
    (courseId: string | null) => dispatch({ type: 'setLastActiveCourseId', courseId }),
    []
  );
  const setCourseProgress = useCallback(
    (courseId: string, progress: number) => dispatch({ type: 'setCourseProgress', courseId, progress }),
    []
  );
  const setCourseLessonIndex = useCallback(
    (courseId: string, index: number) => dispatch({ type: 'setCourseLessonIndex', courseId, index }),
    []
  );
  const setSelectedSkill = useCallback((skill: string | null) => dispatch({ type: 'setSelectedSkill', skill }), []);
  const setQuizAttempt = useCallback(
    (quizId: string, score: number) => dispatch({ type: 'setQuizAttempt', quizId, score }),
    []
  );
  const createNote = useCallback((note: { title: string; body: string; type: NoteType }) => {
    const id = `n-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const updated = 'Just now';
    dispatch({ type: 'createNote', note: { id, updated, ...note } });
    return id;
  }, []);
  const updateNote = useCallback((id: string, patch: Partial<{ title: string; body: string; type: NoteType }>) => {
    dispatch({ type: 'updateNote', id, patch: { ...patch, updated: 'Just now' } });
  }, []);
  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'deleteNote', id });
  }, []);
  const setResumeTemplate = useCallback((template: string | null) => dispatch({ type: 'setResumeTemplate', template }), []);
  const setResumeDraftSections = useCallback(
    (sections: Partial<LmsState['resumeDraft']['sections']>) =>
      dispatch({ type: 'setResumeDraftSections', sections }),
    []
  );
  const resetResumeDraft = useCallback(() => dispatch({ type: 'resetResumeDraft' }), []);
  const markResumeSaved = useCallback(() => dispatch({ type: 'markResumeSaved' }), []);
  const careerStart = useCallback(() => dispatch({ type: 'careerStart' }), []);
  const careerToggleStep = useCallback((stepId: string) => dispatch({ type: 'careerToggleStep', stepId }), []);
  const careerReset = useCallback(() => dispatch({ type: 'careerReset' }), []);

  const api = useMemo<LmsStateApi>(
    () => ({
      state,
      toggleSaveCourse,
      registerEvent,
      unregisterEvent,
      addPlannedItem,
      removePlannedItem,
      setLastActiveCourseId,
      setCourseProgress,
      setCourseLessonIndex,
      setSelectedSkill,
      setQuizAttempt,
      createNote,
      updateNote,
      deleteNote,
      setResumeTemplate,
      setResumeDraftSections,
      resetResumeDraft,
      markResumeSaved,
      careerStart,
      careerToggleStep,
      careerReset,
    }),
    [
      state,
      toggleSaveCourse,
      registerEvent,
      unregisterEvent,
      addPlannedItem,
      setLastActiveCourseId,
      setCourseProgress,
      setCourseLessonIndex,
      setSelectedSkill,
      setQuizAttempt,
      createNote,
      updateNote,
      deleteNote,
      setResumeTemplate,
      setResumeDraftSections,
      resetResumeDraft,
      markResumeSaved,
      careerStart,
      careerToggleStep,
    ]
  );

  return <LmsStateContext.Provider value={api}>{children}</LmsStateContext.Provider>;
}

export function useLmsState() {
  const ctx = useContext(LmsStateContext);
  if (!ctx) throw new Error('useLmsState must be used within LmsStateProvider');
  return ctx;
}

