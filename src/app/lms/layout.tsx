'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Mic2,
  ClipboardList,
  CalendarDays,
  FileText,
  StickyNote,
  Route,
} from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { LMS_PAGE_BG, LMS_CONTENT_CLASS } from './constants';
import { LmsCareerEngineStrip } from './components/LmsCareerEngineStrip';
import { LmsDailyMomentum } from './components/LmsDailyMomentum';
import { LmsSharedIntelligenceHint } from './components/LmsSharedIntelligenceHint';
import { LmsOverlayProvider } from './components/overlays/LmsOverlayProvider';
import { LmsToastProvider } from './components/ux/LmsToastProvider';
import { LmsStateProvider } from './state/LmsStateProvider';

const NAV_ITEMS = [
  { href: '/lms', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/lms/courses', label: 'Courses', icon: BookOpen, exact: false },
  { href: '/lms/interview-prep', label: 'Interview Prep', icon: Mic2, exact: false },
  { href: '/lms/quizzes', label: 'Quizzes', icon: ClipboardList, exact: false },
  { href: '/lms/events', label: 'Events', icon: CalendarDays, exact: false },
  { href: '/lms/resume-builder', label: 'Resume Builder', icon: FileText, exact: false },
  { href: '/lms/notes', label: 'Notes', icon: StickyNote, exact: false },
  { href: '/lms/career-path', label: 'Career Path', icon: Route, exact: false },
] as const;

function isSidebarActive(pathname: string | null, href: string, exact: boolean) {
  if (!pathname) return false;
  if (exact) return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function LmsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: LMS_PAGE_BG }}>
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row w-full min-w-0 max-w-[1550px] mx-auto">
        {/* Mobile / small: horizontal strip */}
        <aside className="lg:hidden w-full shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <nav
            className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="LMS sections"
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isSidebarActive(pathname, href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${active
                      ? 'bg-[#28A8E1] text-white shadow-md shadow-[#28A8E1]/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Desktop: vertical sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col px-6 py-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto [scrollbar-width:none]">
          <nav
            className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm p-4 space-y-1.5 sticky top-10"
            aria-label="LMS sections"
          >
            <div className="px-3 pb-4 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Learning Hub</span>
            </div>
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isSidebarActive(pathname, href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[0.95rem] font-bold transition-all duration-200 group ${active
                      ? 'bg-gradient-to-r from-[#28A8E1] to-[#1e85b4] text-white shadow-md shadow-[#28A8E1]/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200/50'
                    }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-transform ${active ? 'opacity-100 scale-110' : 'opacity-60 group-hover:scale-110 group-hover:opacity-100'}`} strokeWidth={active ? 2.5 : 2} />
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 flex flex-col relative z-10 w-full lg:max-w-[calc(100%-16rem)] overflow-hidden">
          <LmsToastProvider>
            <LmsStateProvider>
              <LmsOverlayProvider>
                <div className={LMS_CONTENT_CLASS}>
                  <LmsCareerEngineStrip />
                  <LmsDailyMomentum />
                  <LmsSharedIntelligenceHint />
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out fill-mode-both">
                    {children}
                  </div>
                </div>
              </LmsOverlayProvider>
            </LmsStateProvider>
          </LmsToastProvider>
        </main>
      </div>

      <Footer />
    </div>
  );
}
