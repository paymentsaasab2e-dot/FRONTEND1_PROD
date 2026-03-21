'use client';

import { mockInterviewDifficulties, mockInterviewRoles } from '../../data/mockInterviewData';

export function MockConfigPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Difficulty</span>
        <select
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cursor-pointer"
          defaultValue={mockInterviewDifficulties[1]}
        >
          {mockInterviewDifficulties.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Role focus</span>
        <select
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cursor-pointer"
          defaultValue={mockInterviewRoles[1]}
        >
          {mockInterviewRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
