'use client';

import { LMS_CARD_CLASS } from '../../constants';
import type { LmsResumeAnalysisResult } from '../../state/LmsStateProvider';
import {
  SECTION_DEFINITIONS,
  SectionStatusIcon,
  type DerivedSectionState,
  type SectionId,
} from './studio-config';

export function ResumeStudioNavigator({
  activeSection,
  completionState,
  editorProgress,
  keywordCoverage,
  atsReadiness,
  onSelect,
  sectionStates,
  analysis,
}: {
  activeSection: SectionId;
  completionState: DerivedSectionState;
  editorProgress: number;
  keywordCoverage: number;
  atsReadiness: number;
  onSelect: (id: SectionId) => void;
  sectionStates: Record<SectionId, DerivedSectionState>;
  analysis?: LmsResumeAnalysisResult;
}) {
  return (
    <div className={`${LMS_CARD_CLASS} border-slate-200/90 bg-white shadow-[0_18px_48px_-32px_rgba(15,23,42,0.24)]`}>
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Section map</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Navigate the resume studio</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep this as your control strip. Jump between sections, see completion clearly, and let the main workspace breathe below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:min-w-[560px]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Studio progress</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{editorProgress}%</p>
            <p className="mt-1 text-xs text-slate-500">Overall editor completion</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Keyword coverage</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{keywordCoverage}%</p>
            <p className="mt-1 text-xs text-slate-500">Role-relevant skills</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">ATS readiness</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{atsReadiness}%</p>
            <p className="mt-1 text-xs text-slate-500">Document confidence</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 shadow-[0_12px_24px_-16px_rgba(40,168,225,0.4)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">AI Confidence</p>
            <p className="mt-2 text-lg font-bold text-sky-900">{analysis?.readinessScore ?? '??'}%</p>
            <p className="mt-1 text-xs text-sky-600 font-medium">Recruiter Simulation</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SECTION_DEFINITIONS.map((section) => {
          const stateForSection =
            section.id === 'completion' ? completionState : sectionStates[section.id];
          const Icon = section.icon;
          const active = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`flex w-full items-start gap-3 rounded-[1.4rem] border px-4 py-4 text-left transition-all duration-200 ${
                active
                  ? 'border-sky-200 bg-sky-50 shadow-[0_14px_30px_-22px_rgba(40,168,225,0.75)]'
                  : 'border-slate-200/80 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                  active ? 'bg-sky-600 text-white' : 'bg-white text-slate-500'
                }`}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={2.1} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{section.label}</p>
                  <SectionStatusIcon status={stateForSection.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{section.helper}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        stateForSection.status === 'complete'
                          ? 'bg-emerald-500'
                          : stateForSection.status === 'warning'
                            ? 'bg-amber-400'
                            : 'bg-sky-500'
                      }`}
                      style={{ width: `${stateForSection.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {stateForSection.progress}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
