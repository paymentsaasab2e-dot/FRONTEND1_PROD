'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastTone = 'success' | 'warning' | 'info';

export type LmsToast = {
  id: string;
  title: string;
  message?: string;
  tone?: ToastTone;
};

type LmsToastApi = {
  push: (t: Omit<LmsToast, 'id'>) => void;
};

const LmsToastContext = createContext<LmsToastApi | null>(null);

function iconForTone(tone: ToastTone) {
  if (tone === 'success') return CheckCircle2;
  if (tone === 'warning') return AlertTriangle;
  return Info;
}

function toneClass(tone: ToastTone) {
  if (tone === 'success') return 'border-emerald-200 bg-emerald-50/90 text-emerald-900';
  if (tone === 'warning') return 'border-amber-200 bg-amber-50/90 text-amber-950';
  return 'border-sky-200 bg-sky-50/90 text-sky-950';
}

export function LmsToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<LmsToast[]>([]);

  const push = useCallback((t: Omit<LmsToast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const tone: ToastTone = t.tone ?? 'info';
    const toast: LmsToast = { id, ...t, tone };
    setToasts((prev) => [toast, ...prev].slice(0, 3));
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3200);
  }, []);

  const api = useMemo<LmsToastApi>(() => ({ push }), [push]);

  return (
    <LmsToastContext.Provider value={api}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed right-3 top-[calc(var(--app-header-height,5.75rem)+0.75rem)] z-[600] flex w-[min(360px,calc(100vw-1.5rem))] flex-col gap-2">
              {toasts.map((t) => {
                const Icon = iconForTone(t.tone ?? 'info');
                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl border shadow-lg backdrop-blur-sm px-4 py-3 ${toneClass(t.tone ?? 'info')}`}
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 shrink-0 mt-0.5" strokeWidth={2} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-snug">{t.title}</p>
                        {t.message ? <p className="mt-1 text-xs font-normal opacity-80">{t.message}</p> : null}
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-xl border border-black/5 bg-white/60 p-1.5 text-gray-600 hover:bg-white"
                        onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                        aria-label="Dismiss"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </LmsToastContext.Provider>
  );
}

export function useLmsToast() {
  const ctx = useContext(LmsToastContext);
  if (!ctx) throw new Error('useLmsToast must be used within LmsToastProvider');
  return ctx;
}

