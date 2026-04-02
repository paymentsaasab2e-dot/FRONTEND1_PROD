'use client';

import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LayoutTemplate,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import { LmsCtaButton } from '../../components/ux/LmsCtaButton';
import { LmsStatusBadge } from '../../components/ux/LmsStatusBadge';
import type { ResumeEducation, ResumeExperience, LmsResumeAnalysisResult } from '../../state/LmsStateProvider';
import {
  INPUT_CLASS,
  StudioField,
  StudioSectionCard,
  TEMPLATE_OPTIONS,
  TEXTAREA_CLASS,
  type DerivedSectionState,
  type ResumeSections,
} from './studio-config';

export function ResumeStudioExperienceSection({
  collapsed,
  onAddExperience,
  onToggleCollapse,
  onRemoveExperience,
  onUpdateExperience,
  sectionRef,
  sectionState,
  sections,
}: {
  collapsed: boolean;
  onAddExperience: () => void;
  onToggleCollapse: () => void;
  onRemoveExperience: (id: string) => void;
  onUpdateExperience: (id: string, field: keyof ResumeExperience, value: string) => void;
  sectionRef: (node: HTMLDivElement | null) => void;
  sectionState: DerivedSectionState;
  sections: ResumeSections;
}) {
  return (
    <StudioSectionCard
      id="experience"
      title="Experience"
      helper="Treat each role like a recruiter-ready story block: company, scope, timeline, and outcome-led bullets."
      progress={sectionState.progress}
      status={sectionState.status}
      statusLabel={sectionState.statusLabel}
      icon={Briefcase}
      accent="from-emerald-500 via-teal-400 to-cyan-200"
      collapsed={collapsed}
      collapsible
      onToggleCollapse={onToggleCollapse}
      sectionRef={sectionRef}
    >
      <div className="space-y-4">
        {sections.experience.length === 0 ? (
          <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
            <p className="text-base font-bold text-slate-900">Add your first experience entry</p>
            <p className="mt-2 text-sm text-slate-500">
              Roles become much stronger when they include specific responsibilities, measurable outcomes, and stack context.
            </p>
            <div className="mt-5">
              <LmsCtaButton
                variant="secondary"
                leftIcon={<Plus className="h-4 w-4" strokeWidth={2} />}
                onClick={onAddExperience}
              >
                Add experience entry
              </LmsCtaButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.experience.map((entry, index) => {
              const bulletCount = entry.bullets
                .split('\n')
                .map((bullet) => bullet.trim())
                .filter(Boolean).length;

              return (
                <article
                  key={entry.id}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50/70 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Experience {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {entry.role || 'Role title'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Shape this entry around scope, ownership, and impact.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveExperience(entry.id)}
                      className="inline-flex items-center gap-2 self-start rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <StudioField label="Company" helper="Where the work happened.">
                      <input
                        value={entry.company}
                        onChange={(event) => onUpdateExperience(entry.id, 'company', event.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Tech Corp"
                      />
                    </StudioField>

                    <StudioField label="Role" helper="Lead with the title recruiters will recognize.">
                      <input
                        value={entry.role}
                        onChange={(event) => onUpdateExperience(entry.id, 'role', event.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Frontend Engineer"
                      />
                    </StudioField>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
                    <div>
                      <StudioField label="Impact bullets" helper="Keep one bullet per line and lead with action plus result.">
                        <textarea
                          value={entry.bullets}
                          onChange={(event) => onUpdateExperience(entry.id, 'bullets', event.target.value)}
                          rows={6}
                          className={TEXTAREA_CLASS}
                          placeholder="- Shipped feature X and improved conversion by Y%&#10;- Reduced page load time by Z%"
                        />
                      </StudioField>
                    </div>

                    <div className="space-y-4">
                      <StudioField label="Dates" helper="Keep the timeline compact and easy to scan.">
                        <input
                          value={entry.duration}
                          onChange={(event) => onUpdateExperience(entry.id, 'duration', event.target.value)}
                          className={INPUT_CLASS}
                          placeholder="Jan 2024 - Present"
                        />
                      </StudioField>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          Bullet quality
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">{bulletCount}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Aim for 2-4 concise bullets with outcomes, systems, or metrics.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {sections.experience.length > 0 ? (
          <button
            type="button"
            onClick={onAddExperience}
            className="flex w-full items-center justify-center gap-2 rounded-[1.4rem] border border-dashed border-slate-300 bg-white py-4 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Add another experience entry
          </button>
        ) : null}
      </div>
    </StudioSectionCard>
  );
}

export function ResumeStudioEducationSection({
  collapsed,
  onAddEducation,
  onToggleCollapse,
  onRemoveEducation,
  onUpdateEducation,
  sectionRef,
  sectionState,
  sections,
}: {
  collapsed: boolean;
  onAddEducation: () => void;
  onToggleCollapse: () => void;
  onRemoveEducation: (id: string) => void;
  onUpdateEducation: (id: string, field: keyof ResumeEducation, value: string) => void;
  sectionRef: (node: HTMLDivElement | null) => void;
  sectionState: DerivedSectionState;
  sections: ResumeSections;
}) {
  return (
    <StudioSectionCard
      id="education"
      title="Education"
      helper="Keep this section compact, clear, and credible. It can also hold certifications or focused learning programs."
      progress={sectionState.progress}
      status={sectionState.status}
      statusLabel={sectionState.statusLabel}
      icon={GraduationCap}
      accent="from-violet-500 via-fuchsia-400 to-rose-200"
      collapsed={collapsed}
      collapsible
      onToggleCollapse={onToggleCollapse}
      sectionRef={sectionRef}
    >
      <div className="space-y-4">
        {sections.education.length === 0 ? (
          <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
            <p className="text-base font-bold text-slate-900">Add an education or certification block</p>
            <p className="mt-2 text-sm text-slate-500">
              This helps close trust gaps and supports ATS parsing for early-career or role-switching resumes.
            </p>
            <div className="mt-5">
              <LmsCtaButton
                variant="secondary"
                leftIcon={<Plus className="h-4 w-4" strokeWidth={2} />}
                onClick={onAddEducation}
              >
                Add education entry
              </LmsCtaButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.education.map((entry, index) => (
              <article
                key={entry.id}
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50/70 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Education {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {entry.institution || 'Institution'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveEducation(entry.id)}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Remove
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <StudioField label="Institution" helper="School, university, or issuing organization.">
                    <input
                      value={entry.institution}
                      onChange={(event) => onUpdateEducation(entry.id, 'institution', event.target.value)}
                      className={INPUT_CLASS}
                      placeholder="State University"
                    />
                  </StudioField>

                  <StudioField label="Degree or program" helper="Degree title, bootcamp, or certification name.">
                    <input
                      value={entry.degree}
                      onChange={(event) => onUpdateEducation(entry.id, 'degree', event.target.value)}
                      className={INPUT_CLASS}
                      placeholder="B.S. Computer Science"
                    />
                  </StudioField>
                </div>

                <div className="mt-4 md:max-w-xs">
                  <StudioField label="Year or duration" helper="Keep this concise for ATS-friendly scanning.">
                    <input
                      value={entry.duration}
                      onChange={(event) => onUpdateEducation(entry.id, 'duration', event.target.value)}
                      className={INPUT_CLASS}
                      placeholder="2019 - 2023"
                    />
                  </StudioField>
                </div>
              </article>
            ))}
          </div>
        )}

        {sections.education.length > 0 ? (
          <button
            type="button"
            onClick={onAddEducation}
            className="flex w-full items-center justify-center gap-2 rounded-[1.4rem] border border-dashed border-slate-300 bg-white py-4 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Add another education entry
          </button>
        ) : null}
      </div>
    </StudioSectionCard>
  );
}

export function ResumeStudioLayoutSection({
  collapsed,
  currentTemplate,
  onToggleCollapse,
  onSelectTemplate,
  sectionRef,
  sectionState,
}: {
  collapsed: boolean;
  currentTemplate: string | null;
  onToggleCollapse: () => void;
  onSelectTemplate: (templateId: string, templateLabel: string) => void;
  sectionRef: (node: HTMLDivElement | null) => void;
  sectionState: DerivedSectionState;
}) {
  return (
    <StudioSectionCard
      id="layout"
      title="Configure layout"
      helper="Choose the presentation mode that best fits the role you are targeting while keeping the same content and save logic."
      progress={sectionState.progress}
      status={sectionState.status}
      statusLabel={sectionState.statusLabel}
      icon={LayoutTemplate}
      accent="from-slate-900 via-slate-700 to-slate-400"
      collapsed={collapsed}
      collapsible
      onToggleCollapse={onToggleCollapse}
      sectionRef={sectionRef}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {TEMPLATE_OPTIONS.map((option) => {
          const selected = currentTemplate === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectTemplate(option.id, option.label)}
              className={`group rounded-[1.6rem] border p-5 text-left transition-all duration-200 ${
                selected
                  ? 'border-sky-300 bg-sky-50 shadow-[0_20px_36px_-30px_rgba(40,168,225,0.85)]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`rounded-[1.25rem] border border-slate-200 bg-gradient-to-br ${option.accent} p-4`}>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 rounded-full bg-slate-300/80" />
                  <div className="h-2 w-1/2 rounded-full bg-slate-200/80" />
                  <div className="mt-4 space-y-1.5">
                    <div className="h-1.5 w-full rounded-full bg-slate-200/80" />
                    <div className="h-1.5 w-5/6 rounded-full bg-slate-200/80" />
                    <div className="h-1.5 w-2/3 rounded-full bg-slate-200/80" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-slate-900">{option.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{option.hint}</p>
                </div>
                {selected ? <LmsStatusBadge label="Selected" tone="success" /> : null}
              </div>
            </button>
          );
        })}
      </div>
    </StudioSectionCard>
  );
}

export function ResumeStudioCompletionSection({
  atsReadiness,
  completionState,
  draftStatus,
  editorProgress,
  keywordCoverage,
  readinessHighlights,
  sectionRef,
  targetRole,
  onAnalyze,
  onSync,
  analysis,
  isAnalyzing,
}: {
  atsReadiness: number;
  completionState: DerivedSectionState;
  draftStatus: string;
  editorProgress: number;
  keywordCoverage: number;
  readinessHighlights: string[];
  sectionRef: (node: HTMLDivElement | null) => void;
  targetRole: string;
  onAnalyze: () => void;
  onSync: () => void;
  analysis?: LmsResumeAnalysisResult;
  isAnalyzing: boolean;
}) {
  return (
    <StudioSectionCard
      id="completion"
      title="Ready to lock this draft?"
      helper="This is the final studio step: review completion, confirm recruiter readiness, then sync the result into your LMS career path."
      progress={completionState.progress}
      status={completionState.status}
      statusLabel={completionState.statusLabel}
      icon={CheckCircle2}
      accent="from-sky-600 via-cyan-500 to-emerald-400"
      sectionRef={sectionRef}
      actions={
        <button
          type="button"
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 transition-colors hover:bg-sky-100 disabled:opacity-50"
          onClick={onAnalyze}
        >
          <Sparkles className={`h-3.5 w-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} strokeWidth={2} />
          {isAnalyzing ? 'Analyzing...' : 'Refresh AI Insights'}
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <LmsStatusBadge
                label={`${editorProgress}% studio complete`}
                tone={editorProgress >= 85 ? 'success' : 'warning'}
              />
              <LmsStatusBadge
                label={`${atsReadiness}% ATS readiness`}
                tone={atsReadiness >= 80 ? 'success' : 'warning'}
              />
              <LmsStatusBadge
                label={`${keywordCoverage}% keyword coverage`}
                tone={keywordCoverage >= 70 ? 'success' : 'warning'}
              />
              {analysis && (
                <LmsStatusBadge
                  label={`${analysis.readinessScore}% AI readiness`}
                  tone={analysis.readinessScore >= 80 ? 'success' : 'warning'}
                />
              )}
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400"
                style={{ width: `${editorProgress}%` }}
              />
            </div>

            {analysis ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sky-900">
                    <Briefcase className="h-4 w-4" />
                    <h4 className="text-sm font-bold">Recruiter's 3-Second View</h4>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    "{analysis.recruiterView}"
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Top Strengths</h4>
                    <ul className="mt-3 space-y-2">
                      {analysis.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700">Critical Gaps</h4>
                    <ul className="mt-3 space-y-2">
                      {analysis.gaps.map((g: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Suggested Next Steps</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.nextSteps.map((step: string, i: number) => (
                      <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white/50">
                <Sparkles className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-900">Run AI Recruit Analysis</p>
                <p className="mt-1 text-xs text-slate-500">
                  Get deep insights on how your resume performs against your target role.
                </p>
                <button
                  type="button"
                  onClick={onAnalyze}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  Analyze now
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-sky-100 bg-sky-50/70 p-4">
            <p className="text-sm font-bold text-slate-900">Before you sync</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {completionState.missing.length > 0 ? (
                completionState.missing.map((item) => (
                  <li key={item} className="flex gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" strokeWidth={2.1} />
                    {item}
                  </li>
                ))
              ) : (
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.1} />
                  The draft looks strong enough to save and sync into the LMS journey.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-sky-100 bg-[linear-gradient(180deg,rgba(239,248,255,0.9),rgba(255,255,255,0.96))] p-6 shadow-[0_18px_44px_-28px_rgba(40,168,225,0.45)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Final action</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            Confirm and sync this version
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Preserve the current draft state, keep the selected template, and mark resume completion in Career Path without changing your existing data logic.
          </p>

          <div className="mt-5 space-y-3 rounded-[1.3rem] border border-white/80 bg-white/90 p-4">
            <div className="flex items-start gap-3">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2.1} />
              <div>
                <p className="text-sm font-semibold text-slate-900">Target role</p>
                <p className="text-sm text-slate-500">{targetRole}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2.1} />
              <div>
                <p className="text-sm font-semibold text-slate-900">Current draft status</p>
                <p className="text-sm text-slate-500">{draftStatus}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2.1} />
              <div>
                <p className="text-sm font-semibold text-slate-900">ATS score snapshot</p>
                <p className="text-sm text-slate-500">{atsReadiness}% readiness with {keywordCoverage}% keyword coverage.</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <LmsCtaButton
              className="w-full"
              leftIcon={<ArrowRight className="h-4 w-4" strokeWidth={2.1} />}
              onClick={onSync}
            >
              Confirm & Sync to Career Path
            </LmsCtaButton>
          </div>
        </div>
      </div>
    </StudioSectionCard>
  );
}
