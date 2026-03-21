/** Matches Applications page background */
export const LMS_PAGE_BG =
  'linear-gradient(135deg, #e0f2fe 0%, #ecf7fd 12%, #fafbfb 30%, #fdf6f0 55%, #fef5ed 85%, #fef5ed 100%)';

export const LMS_CONTENT_CLASS =
  'mx-auto max-w-[1320px] px-6 lg:px-8 py-6 sm:py-8 lg:py-10 w-full';

/** Base card — static panels */
export const LMS_CARD_CLASS =
  'rounded-xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6';

/**
 * Interactive section cards: hover lift, shadow, pointer.
 * Use for dashboard / module cards that should feel clickable.
 */
export const LMS_CARD_INTERACTIVE = `${LMS_CARD_CLASS} cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]`;

export const LMS_SECTION_TITLE = 'text-lg font-bold text-gray-900 tracking-tight';
export const LMS_PAGE_SUBTITLE = 'text-gray-500 font-normal text-base';
