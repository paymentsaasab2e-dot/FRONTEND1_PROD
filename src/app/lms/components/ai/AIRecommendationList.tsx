import { LMS_CARD_CLASS } from '../../constants';

export type AIRecommendationItem = {
  id: string;
  label: string;
  text: string;
  ctaLabel: string;
};

export type AIRecommendationListProps = {
  sectionTitle: string;
  items: AIRecommendationItem[];
  className?: string;
};

export function AIRecommendationList({ sectionTitle, items, className = '' }: AIRecommendationListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-base font-bold text-gray-900">{sectionTitle}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`${LMS_CARD_CLASS} py-4 transition-all duration-200 hover:shadow-md border-violet-50/80`}
          >
            <p className="text-sm font-bold text-gray-900">{item.label}</p>
            <p className="mt-1 text-sm font-normal text-gray-500 leading-relaxed">{item.text}</p>
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-[#28A8E1] transition-colors duration-200 hover:underline cursor-pointer"
            >
              {item.ctaLabel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
