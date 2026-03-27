'use client';

import { Bot, Mail, MapPin, Phone, Sparkles, UserRound, ScrollText } from 'lucide-react';
import { resumeAIImprovements } from '../../data/ai-mock';
import {
  INPUT_CLASS,
  StudioField,
  StudioSectionCard,
  TEXTAREA_CLASS,
  type DerivedSectionState,
  type ResumeSections,
} from './studio-config';

export function ResumeStudioBasicsSection({
  collapsed,
  onToggleCollapse,
  sections,
  sectionState,
  sectionRef,
  onBasicsChange,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  sections: ResumeSections;
  sectionState: DerivedSectionState;
  sectionRef: (node: HTMLDivElement | null) => void;
  onBasicsChange: (field: keyof ResumeSections['basics'], value: string) => void;
}) {
  return (
    <StudioSectionCard
      id="basics"
      title="Basics"
      helper="Start with a strong identity block: clear role targeting, complete contact details, and recruiter-friendly alignment."
      progress={sectionState.progress}
      status={sectionState.status}
      statusLabel={sectionState.statusLabel}
      icon={UserRound}
      accent="from-sky-500 via-cyan-400 to-sky-200"
      collapsed={collapsed}
      collapsible
      onToggleCollapse={onToggleCollapse}
      sectionRef={sectionRef}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StudioField label="Full name" helper="This is the first line recruiter eyes land on.">
            <input
              value={sections.basics.name}
              onChange={(event) => onBasicsChange('name', event.target.value)}
              className={INPUT_CLASS}
              placeholder="Alex Developer"
            />
          </StudioField>

          <StudioField label="Headline" helper="Anchor the role you want, not just the job you had.">
            <input
              value={sections.basics.headline}
              onChange={(event) => onBasicsChange('headline', event.target.value)}
              className={INPUT_CLASS}
              placeholder="Frontend Engineer"
            />
          </StudioField>

          <StudioField label="Email" helper="Use a clean professional address.">
            <input
              value={sections.basics.email}
              onChange={(event) => onBasicsChange('email', event.target.value)}
              className={INPUT_CLASS}
              placeholder="alex@example.com"
            />
          </StudioField>

          <StudioField label="Phone" helper="Recruiters should be able to reach you fast.">
            <input
              value={sections.basics.phone}
              onChange={(event) => onBasicsChange('phone', event.target.value)}
              className={INPUT_CLASS}
              placeholder="(555) 123-4567"
            />
          </StudioField>

          <div className="md:col-span-2">
            <StudioField label="Location" helper="Use city and region, not a full street address.">
              <input
                value={sections.basics.location}
                onChange={(event) => onBasicsChange('location', event.target.value)}
                className={INPUT_CLASS}
                placeholder="San Francisco, CA"
              />
            </StudioField>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Starter guidance
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2.1} />
              Keep headline aligned to the role you want recruiters to search for.
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2.1} />
              Make sure your phone and email read well on a quick scan.
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2.1} />
              Location helps hiring teams gauge market fit without adding clutter.
            </li>
          </ul>
        </div>
      </div>
    </StudioSectionCard>
  );
}

export function ResumeStudioSummarySection({
  collapsed,
  onToggleCollapse,
  sections,
  sectionState,
  sectionRef,
  summaryWordCount,
  onImproveSummary,
  onSummaryChange,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  sections: ResumeSections;
  sectionState: DerivedSectionState;
  sectionRef: (node: HTMLDivElement | null) => void;
  summaryWordCount: number;
  onImproveSummary: () => void;
  onSummaryChange: (value: string) => void;
}) {
  return (
    <StudioSectionCard
      id="summary"
      title="Professional Summary"
      helper="This should feel like an executive summary for your candidacy: who you are, what you drive, and where your strengths show up."
      progress={sectionState.progress}
      status={sectionState.status}
      statusLabel={sectionState.statusLabel}
      icon={ScrollText}
      accent="from-cyan-500 via-sky-400 to-cyan-200"
      collapsed={collapsed}
      collapsible
      onToggleCollapse={onToggleCollapse}
      sectionRef={sectionRef}
      actions={
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 transition-colors hover:bg-sky-100"
          onClick={onImproveSummary}
        >
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          Improve summary
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
        <div>
          <textarea
            value={sections.summary}
            onChange={(event) => onSummaryChange(event.target.value)}
            rows={7}
            className={TEXTAREA_CLASS}
            placeholder="Write a sharp overview of your experience, strengths, and recruiter-facing value."
          />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">{summaryWordCount} words</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Best when it states role, strengths, and impact in 3-5 lines
            </span>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <div className="flex items-center gap-2 text-slate-900">
            <Bot className="h-4 w-4 text-sky-600" strokeWidth={2.1} />
            <p className="text-sm font-bold">ATS + recruiter prompts</p>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {resumeAIImprovements.slice(0, 3).map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioSectionCard>
  );
}

export function ResumeStudioSkillsSection({
  collapsed,
  missingKeywords,
  onToggleCollapse,
  sectionRef,
  sectionState,
  sections,
  skillTokens,
  onAppendKeyword,
  onSkillsChange,
}: {
  collapsed: boolean;
  missingKeywords: string[];
  onToggleCollapse: () => void;
  sectionRef: (node: HTMLDivElement | null) => void;
  sectionState: DerivedSectionState;
  sections: ResumeSections;
  skillTokens: string[];
  onAppendKeyword: (keyword: string) => void;
  onSkillsChange: (value: string) => void;
}) {
  return (
    <StudioSectionCard
      id="skills"
      title="Skills"
      helper="Keep this section ATS-aware: list the stack, specialties, and keywords that hiring teams are likely to scan first."
      progress={sectionState.progress}
      status={sectionState.status}
      statusLabel={sectionState.statusLabel}
      icon={Sparkles}
      accent="from-amber-500 via-orange-400 to-rose-200"
      collapsed={collapsed}
      collapsible
      onToggleCollapse={onToggleCollapse}
      sectionRef={sectionRef}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <textarea
            value={sections.skills}
            onChange={(event) => onSkillsChange(event.target.value)}
            rows={5}
            className={TEXTAREA_CLASS}
            placeholder="React, TypeScript, Accessibility, Design Systems, Performance, Testing"
          />

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Current stack</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {skillTokens.length > 0 ? (
                  skillTokens.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-dashed border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400">
                    No keywords added yet
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Suggested keywords</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {missingKeywords.length > 0 ? (
                  missingKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => onAppendKeyword(keyword)}
                      className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 transition-colors hover:bg-sky-100"
                    >
                      Add {keyword}
                    </button>
                  ))
                ) : (
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                    Keyword coverage looks healthy
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Strength cluster</p>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            Target this section toward the role, not every tool you have ever touched.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Group related strengths so the section scans like a recruiter summary, not a raw dump.</li>
            <li>Keep testing, accessibility, performance, and design-system keywords visible for frontend roles.</li>
            <li>Use the suggested keywords only if they are genuinely represented in your work.</li>
          </ul>
        </div>
      </div>
    </StudioSectionCard>
  );
}
