type LmsProgressBarProps = {
  value: number;
  className?: string;
};

export function LmsProgressBar({ value, className = '' }: LmsProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden border border-gray-100">
        <div
          className="h-full rounded-full bg-[#28A8E1] transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="mt-1.5 text-xs font-medium text-gray-500">{pct}% complete</p>
    </div>
  );
}
