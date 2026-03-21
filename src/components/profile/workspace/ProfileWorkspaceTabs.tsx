'use client';

import { forwardRef } from 'react';

export type WorkspaceTabItem = {
  id: string;
  label: string;
  incomplete?: boolean;
};

type ProfileWorkspaceTabsProps = {
  tabs: WorkspaceTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

export const ProfileWorkspaceTabs = forwardRef<HTMLDivElement, ProfileWorkspaceTabsProps>(
  function ProfileWorkspaceTabs({ tabs, activeId, onSelect }, ref) {
  return (
    <div
      ref={ref}
      className="sticky top-0 z-20 -mx-1 mb-5 border-b border-gray-200/90 bg-[#f4f6f9]/95 pb-0 backdrop-blur-sm lg:top-2"
    >
      <div className="flex gap-1.5 overflow-x-auto pb-3 pt-0.5 scrollbar-thin">
        {tabs.map((t) => {
          const active = activeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
                active
                  ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{t.label}</span>
              {t.incomplete ? (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-amber-300' : 'bg-amber-500'}`}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
},
);

ProfileWorkspaceTabs.displayName = 'ProfileWorkspaceTabs';
