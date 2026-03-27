'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, Save, Sparkles, Printer, RotateCcw, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { LMS_CARD_CLASS, LMS_PAGE_SUBTITLE, LMS_SECTION_TITLE } from '../../constants';
import { useLmsState } from '../../state/LmsStateProvider';
import { useLmsToast } from '../../components/ux/LmsToastProvider';
import { LmsCtaButton } from '../../components/ux/LmsCtaButton';
import { LmsStatusBadge } from '../../components/ux/LmsStatusBadge';
import { ResumeExperience, ResumeEducation } from '../../state/LmsStateProvider';
import { LmsSkeleton } from '../../components/states/LmsSkeleton';

function ResumeEditorPageFallback() {
  return (
    <div className={LMS_CARD_CLASS}>
      <LmsSkeleton lines={6} />
    </div>
  );
}

function ResumeEditorPageContent() {
  const router = useRouter();
  const search = useSearchParams();
  const toast = useLmsToast();
  const { state, setResumeTemplate, setResumeDraftSections, markResumeSaved, resetResumeDraft, addPlannedItem } = useLmsState();

  const template = search.get('template');
  const focus = search.get('focus');

  // Preview toggle for mobile/desktop
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (template) setResumeTemplate(template);
  }, [setResumeTemplate, template]);

  useEffect(() => {
    if (!focus) return;
    const el = document.querySelector(`[data-resume-section="${focus}"]`);
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focus]);

  const draft = state.resumeDraft;
  const sections = draft.sections;

  const handleBasicsChange = (field: keyof typeof sections.basics, value: string) => {
    setResumeDraftSections({ basics: { ...sections.basics, [field]: value } });
  };

  const handleUpdateExperience = (id: string, field: keyof ResumeExperience, value: string) => {
    setResumeDraftSections({
      experience: sections.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    });
  };

  const handleAddExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      duration: '',
      bullets: ''
    };
    setResumeDraftSections({ experience: [...sections.experience, newExp] });
  };

  const handleRemoveExperience = (id: string) => {
    setResumeDraftSections({ experience: sections.experience.filter((e) => e.id !== id) });
  };

  const handleUpdateEducation = (id: string, field: keyof ResumeEducation, value: string) => {
    setResumeDraftSections({
      education: sections.education.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    });
  };

  const handleAddEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      duration: ''
    };
    setResumeDraftSections({ education: [...sections.education, newEdu] });
  };

  const handleRemoveEducation = (id: string) => {
    setResumeDraftSections({ education: sections.education.filter((e) => e.id !== id) });
  };

  // Trigger browser print
  const handlePrint = () => {
      window.print();
  };

  const handleSaveToCareerPath = () => {
      markResumeSaved();
      addPlannedItem({
          id: 'res-1',
          type: 'resume',
          label: 'Completed Resume Draft',
          href: '/lms/resume-builder',
          sourceModule: 'resume-builder',
          sourceLabel: 'Resume Builder'
      });
      toast.push({ title: 'Synced to Career Path', message: 'Your resume draft was saved and completion tracked natively.', tone: 'success' });
      router.push('/lms/career-path');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
        }
      `}} />

      <div className="space-y-8 pb-10">
        <div className="min-w-0 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between hide-on-print">
          <div>
            <Link
              href="/lms/resume-builder"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Back to dashboard
            </Link>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Resume editor</h1>
            <p className={LMS_PAGE_SUBTITLE}>Structured editor generating a real print-ready layout.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <LmsStatusBadge label={draft.template ? `Template: ${draft.template}` : 'Template: unspecified'} tone="info" />
              <span className="text-gray-300">·</span>
              <span className="text-xs font-semibold text-gray-500">{draft.updatedAtLabel}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <LmsCtaButton
              variant="secondary"
              leftIcon={<RotateCcw className="h-4 w-4" strokeWidth={2} />}
              onClick={() => {
                if (confirm('Are you sure you want to reset everything? All unsaved work will be lost.')) {
                  resetResumeDraft();
                  toast.push({ title: 'Draft reset', message: 'Loaded clean starting point.', tone: 'info' });
                }
              }}
            >
              Reset
            </LmsCtaButton>
            <LmsCtaButton
              variant="secondary"
              leftIcon={<Eye className="h-4 w-4" strokeWidth={2} />}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide preview' : 'View layout'}
            </LmsCtaButton>
            <LmsCtaButton
              variant="secondary"
              leftIcon={<Printer className="h-4 w-4" strokeWidth={2} />}
              onClick={handlePrint}
            >
              Print / PDF
            </LmsCtaButton>
            <LmsCtaButton
              variant="primary"
              leftIcon={<Save className="h-4 w-4" strokeWidth={2} />}
              onClick={() => {
                markResumeSaved();
                toast.push({ title: 'Saved draft', message: 'Document states saved seamlessly to local LMS hooks.', tone: 'success' });
              }}
            >
              Save draft
            </LmsCtaButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* EDITOR COLUMN */}
          <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : 'block'}`}>
            
            <div className={`${LMS_CARD_CLASS} space-y-4 shadow-sm border-gray-100`} data-resume-section="basics">
              <h2 className={LMS_SECTION_TITLE}>Basics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input
                        value={sections.basics.name}
                        onChange={(e) => handleBasicsChange('name', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Headline</label>
                    <input
                        value={sections.basics.headline}
                        onChange={(e) => handleBasicsChange('headline', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <input
                        value={sections.basics.email}
                        onChange={(e) => handleBasicsChange('email', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone & Location</label>
                    <div className="flex gap-2">
                        <input
                            placeholder="Phone..."
                            value={sections.basics.phone}
                            onChange={(e) => handleBasicsChange('phone', e.target.value)}
                            className="mt-1 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                         <input
                            placeholder="City, ST"
                            value={sections.basics.location}
                            onChange={(e) => handleBasicsChange('location', e.target.value)}
                            className="mt-1 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                 </div>
              </div>
            </div>

            <div className={`${LMS_CARD_CLASS} space-y-4 shadow-sm border-gray-100`} data-resume-section="summary">
              <div className="flex items-center justify-between gap-2">
                <h2 className={LMS_SECTION_TITLE}>Professional Summary</h2>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#28A8E1] hover:underline flex items-center gap-1 bg-sky-50 px-2 py-1 rounded-md border border-sky-100 transition-all hover:bg-sky-100"
                  onClick={() => {
                    setResumeDraftSections({
                      summary: `${sections.summary}\n\nAI tweak (mock): Integrated one measurable metric related to feature shipping velocity.`
                    });
                    toast.push({ title: 'AI suggestion applied', message: 'Mock appended string seamlessly.', tone: 'info' });
                  }}
                >
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                  Improve (mock)
                </button>
              </div>
              <textarea
                value={sections.summary}
                onChange={(e) => setResumeDraftSections({ summary: e.target.value })}
                rows={4}
                className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className={`${LMS_CARD_CLASS} space-y-4 shadow-sm border-gray-100`} data-resume-section="experience">
              <h2 className={LMS_SECTION_TITLE}>Experience</h2>
              
              <div className="space-y-4">
                 {sections.experience.length === 0 ? (
                     <p className="text-sm text-gray-500 italic">No experience entries mapped yet.</p>
                 ) : (
                     <div className="space-y-4">
                        {sections.experience.map((exp) => (
                          <div key={exp.id} className="relative rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                             <button 
                                onClick={() => handleRemoveExperience(exp.id)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-rose-500 transition-colors bg-white rounded-md p-1 border border-transparent hover:border-rose-100"
                             >
                                 <Trash2 className="h-4 w-4" />
                             </button>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                <input
                                    placeholder="Company name"
                                    value={exp.company}
                                    onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] outline-none"
                                />
                                <input
                                    placeholder="Role / Title"
                                    value={exp.role}
                                    onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] outline-none"
                                />
                             </div>
                             <input
                                placeholder="Duration (e.g. Jan 2024 - Present)"
                                value={exp.duration}
                                onChange={(e) => handleUpdateExperience(exp.id, 'duration', e.target.value)}
                                className="w-full sm:w-1/2 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600 focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] outline-none"
                             />
                             <textarea
                                placeholder="Bullets (one per line)&#10;- Delivered feature X&#10;- Scaled service Y"
                                value={exp.bullets}
                                onChange={(e) => handleUpdateExperience(exp.id, 'bullets', e.target.value)}
                                rows={4}
                                className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] outline-none"
                             />
                          </div>
                        ))}
                     </div>
                 )}
              </div>

              <button
                type="button"
                onClick={handleAddExperience}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-3 text-sm font-semibold text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-[0.99]"
              >
                <Plus className="h-4 w-4" />
                Add Experience Entry
              </button>
            </div>


            <div className={`${LMS_CARD_CLASS} space-y-4 shadow-sm border-gray-100`} data-resume-section="education">
              <h2 className={LMS_SECTION_TITLE}>Education</h2>
              
              <div className="space-y-4">
                 {sections.education.length === 0 ? (
                     <p className="text-sm text-gray-500 italic">No education entries added.</p>
                 ) : (
                     <div className="space-y-4">
                        {sections.education.map((edu) => (
                          <div key={edu.id} className="relative rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                             <button 
                                onClick={() => handleRemoveEducation(edu.id)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-rose-500 transition-colors bg-white rounded-md p-1 border border-transparent hover:border-rose-100"
                             >
                                 <Trash2 className="h-4 w-4" />
                             </button>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                <input
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] outline-none"
                                />
                                <input
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] outline-none"
                                />
                             </div>
                             <input
                                placeholder="Year or Duration"
                                value={edu.duration}
                                onChange={(e) => handleUpdateEducation(edu.id, 'duration', e.target.value)}
                                className="w-full sm:w-1/2 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600 focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] outline-none"
                             />
                          </div>
                        ))}
                     </div>
                 )}
              </div>

              <button
                type="button"
                onClick={handleAddEducation}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-3 text-sm font-semibold text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-[0.99]"
              >
                <Plus className="h-4 w-4" />
                Add Education Entry
              </button>
            </div>

            <div className={`${LMS_CARD_CLASS} space-y-4 shadow-sm border-gray-100`} data-resume-section="skills">
              <h2 className={LMS_SECTION_TITLE}>Skills</h2>
              <textarea
                value={sections.skills}
                onChange={(e) => setResumeDraftSections({ skills: e.target.value })}
                rows={3}
                placeholder="Comma separated list of keywords and skills..."
                className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-text font-medium"
              />
            </div>

            <div className={`${LMS_CARD_CLASS} border-violet-100 bg-violet-50/20 shadow-sm mt-8`}>
              <p className="text-sm font-bold text-gray-900">Configure Layout Matrix</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['modern-minimal', 'impact-focused', 'technical-depth'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setResumeTemplate(t);
                      toast.push({ title: 'Template swapped natively', message: t, tone: 'info' });
                    }}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all shadow-sm ${
                      draft.template === t
                        ? 'border-[#28A8E1] bg-[#28A8E1] text-white'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
             <div className="pt-2"></div>
             
          </div>

          {/* PREVIEW COLUMN */}
          <div className={`${!showPreview ? 'hidden lg:flex' : 'flex'} flex-col gap-6 lg:sticky lg:top-[calc(var(--app-header-height,5.75rem)+1rem)] self-start`}>
            
            <div className="flex items-center justify-between lg:hidden mb-[-1rem]">
                 <h3 className="text-xl font-bold">Print layout</h3>
                 <button onClick={() => setShowPreview(false)} className="text-sm font-semibold underline text-gray-500">Back to editor</button>
            </div>

            <div id="resume-preview" className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden aspect-[1/1.414] w-full max-w-[800px] mx-auto text-gray-900 transform-gpu origin-top">
               {/* Resume document content isolated styling */}
               <div className={`p-8 sm:p-12 h-full ${draft.template === 'modern-minimal' ? 'font-sans' : draft.template === 'impact-focused' ? 'font-sans' : 'font-serif'}`}>
                  
                  {/* Basics Header */}
                  <div className={`mb-6 pb-4 ${draft.template === 'impact-focused' ? 'border-b-2 border-gray-900' : draft.template === 'modern-minimal' ? 'border-b border-gray-300' : ''}`}>
                     <h1 className={`text-2xl sm:text-4xl font-black tracking-tight text-gray-900 capitalize ${draft.template === 'impact-focused' ? 'text-center' : ''}`}>{sections.basics.name || 'Your Name'}</h1>
                     <p className={`text-sm font-bold text-gray-700 mt-1 uppercase tracking-widest ${draft.template === 'impact-focused' ? 'text-center' : ''}`}>{sections.basics.headline || 'Headline'}</p>
                     
                     <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] sm:text-xs text-gray-600 font-medium ${draft.template === 'impact-focused' ? 'justify-center' : ''}`}>
                         {sections.basics.location && <span>{sections.basics.location}</span>}
                         {sections.basics.location && (sections.basics.phone || sections.basics.email) && <span>•</span>}
                         {sections.basics.phone && <span>{sections.basics.phone}</span>}
                         {sections.basics.phone && sections.basics.email && <span>•</span>}
                         {sections.basics.email && <span>{sections.basics.email}</span>}
                     </div>
                  </div>

                  {sections.summary && (
                      <div className="mb-6">
                         {draft.template !== 'modern-minimal' && <h2 className="text-sm font-black uppercase text-gray-900 mb-2 tracking-wider">Summary</h2>}
                         <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed font-medium">
                            {sections.summary}
                         </p>
                      </div>
                  )}

                  {sections.skills && (
                      <div className="mb-6">
                         <h2 className="text-sm font-black uppercase text-gray-900 mb-2 tracking-wider border-b border-gray-200 pb-1">Core Competencies</h2>
                         <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed font-semibold">
                            {sections.skills}
                         </p>
                      </div>
                  )}

                  {sections.experience.length > 0 && (
                      <div className="mb-6">
                         <h2 className="text-sm font-black uppercase text-gray-900 mb-4 tracking-wider border-b border-gray-200 pb-1">Professional Experience</h2>
                         <div className="space-y-5">
                             {sections.experience.map(exp => (
                                 <div key={exp.id}>
                                     <div className="flex justify-between items-baseline mb-1">
                                         <h3 className="text-xs sm:text-sm font-bold text-gray-900">{exp.role}</h3>
                                         <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 whitespace-nowrap ml-2">{exp.duration}</span>
                                     </div>
                                     <div className="text-[11px] sm:text-xs font-semibold text-gray-600 mb-2 italic">
                                         {exp.company}
                                     </div>
                                     <ul className="list-disc pl-4 space-y-1 text-[10px] sm:text-[11px] text-gray-700 leading-relaxed font-medium">
                                         {exp.bullets.split('\n').filter(b => b.trim()).map((bullet, i) => (
                                             <li key={i}>{bullet.replace(/^- /, '')}</li>
                                         ))}
                                     </ul>
                                 </div>
                             ))}
                         </div>
                      </div>
                  )}

                  {sections.education.length > 0 && (
                      <div className="mb-6">
                         <h2 className="text-sm font-black uppercase text-gray-900 mb-3 tracking-wider border-b border-gray-200 pb-1">Education</h2>
                         <div className="space-y-3">
                             {sections.education.map(edu => (
                                 <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">{edu.institution}</h3>
                                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 whitespace-nowrap ml-2">{edu.duration}</span>
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] font-semibold text-gray-600">
                                        {edu.degree}
                                    </div>
                                 </div>
                             ))}
                         </div>
                      </div>
                  )}

               </div>
            </div>

            <div className={`${LMS_CARD_CLASS} border-[#28A8E1]/20 bg-[#28A8E1]/5 shadow-sm`}>
              <p className="text-sm font-bold text-[#208bc0]">Finish Profile Binding</p>
              <p className="mt-1 text-sm font-normal text-gray-700 leading-relaxed">
                Wire this completed artifact back into your Career Path trajectory engine seamlessly.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98] w-full"
                  onClick={handleSaveToCareerPath}
                >
                  Confirm & Sync to Career Path
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function ResumeEditorPage() {
  return (
    <Suspense fallback={<ResumeEditorPageFallback />}>
      <ResumeEditorPageContent />
    </Suspense>
  );
}
