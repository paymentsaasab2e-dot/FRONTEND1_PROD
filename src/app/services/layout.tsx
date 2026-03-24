'use client';

import type { ReactNode } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { SVC_PAGE_BG, SVC_CONTENT_CLASS } from './constants';

import { ServicesProvider } from './context/ServicesContext';

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: SVC_PAGE_BG }}>
      <Header />
      <main className="flex-1 min-w-0">
        <ServicesProvider>
          <div className={SVC_CONTENT_CLASS}>{children}</div>
        </ServicesProvider>
      </main>
      <Footer />
    </div>
  );
}
