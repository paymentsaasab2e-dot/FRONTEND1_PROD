/** Matches Applications page background but polished for premium learning environments */
export const LMS_PAGE_BG =
  'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #f8fafc 50%, #fefcfb 75%, #fdf5f0 100%)';

export const LMS_CONTENT_CLASS =
  'mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 w-full';

/** Base card — static panels, premium glassmorphic border */
export const LMS_CARD_CLASS =
  'rounded-2xl bg-white/95 border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-7 relative overflow-hidden backdrop-blur-sm';

/** Interactive section cards: hover lift, rich shadow, pointer */
export const LMS_CARD_INTERACTIVE = `${LMS_CARD_CLASS} cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-[2px] active:scale-[0.98]`;

export const LMS_SECTION_TITLE = 'text-[1.15rem] font-bold text-slate-900 tracking-tight flex items-center gap-2 relative';
export const LMS_PAGE_SUBTITLE = 'text-slate-500 font-medium text-[1.05rem] leading-relaxed max-w-2xl mt-1.5';
