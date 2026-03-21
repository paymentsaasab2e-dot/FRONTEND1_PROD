export type AIActionChipItem = {
  id: string;
  label: string;
};

export type AIActionChipsProps = {
  actions: AIActionChipItem[];
  className?: string;
};

export function AIActionChips({ actions, className = '' }: AIActionChipsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((a) => (
        <button
          key={a.id}
          type="button"
          className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-900 shadow-sm transition-all duration-200 hover:bg-violet-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
