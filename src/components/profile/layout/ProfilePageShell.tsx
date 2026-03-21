import type { ReactNode } from 'react';

/** Single soft neutral surface — aligned with dashboard SaaS chrome */
export function ProfilePageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {children}
    </div>
  );
}
