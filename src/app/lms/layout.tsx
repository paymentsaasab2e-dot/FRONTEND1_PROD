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
    <div className="min-h-screen flex flex-col" style={{ background: LMS_PAGE_BG }}>
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row w-full min-w-0">
        {/* Mobile / small: horizontal strip */}
        <aside className="lg:hidden w-full shrink-0 border-b border-gray-200/80 bg-white/90 backdrop-blur-sm">
          <nav
            className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:thin]"
            aria-label="LMS sections"
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isSidebarActive(pathname, href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? 'bg-[#28A8E1] text-white shadow-sm'
                      : 'bg-gray-50 text-slate-600 border border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Desktop: vertical sidebar */}
        <aside className="hidden lg:flex w-56 shrink-0 flex-col px-4 py-6 lg:py-8">
          <nav
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 space-y-1"
            aria-label="LMS sections"
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isSidebarActive(pathname, href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? 'bg-[#28A8E1] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} />
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 flex flex-col">
          <div className={LMS_CONTENT_CLASS}>
            <LmsCareerEngineStrip />
            <LmsDailyMomentum />
            <LmsSharedIntelligenceHint />
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
