'use client';

import { useRouter } from 'next/navigation';
import {
  FileCheck,
  TrendingUp,
  Sparkles,
  Target,
} from 'lucide-react';
import { SVC_PRIMARY_BTN, SVC_SECONDARY_BTN } from '../constants';

const FLOATING_CARDS = [
  {
    icon: FileCheck,
    label: 'Resume Score',
    value: '+34%',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: Target,
    label: 'Interview Readiness',
    value: '88/100',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: TrendingUp,
    label: 'Skill Growth',
    value: '3 gaps found',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
];

export default function ServicesHero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-10 lg:p-14">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#28A8E1]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        {/* Left: Text + CTAs */}
        <div className="flex-1 min-w-0 space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#7dd3fc] backdrop-blur-sm border border-white/10">
            <Sparkles className="h-3.5 w-3.5" />
            Career Support
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight tracking-tight">
            Services to help you{' '}
            <span className="bg-gradient-to-r from-[#28A8E1] to-[#7dd3fc] bg-clip-text text-transparent">
              get hired faster
            </span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Improve your resume, optimize your professional profile, prepare for interviews,
            assess your skills, and explore guided growth support — all in one place.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const grid = document.getElementById('services-grid');
                grid?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={SVC_PRIMARY_BTN}
            >
              Explore Services
            </button>
            <button
              type="button"
              onClick={() => router.push('/services/my-services')}
              className={`${SVC_SECONDARY_BTN} !bg-white/10 !text-white !border-white/20 hover:!bg-white/20`}
            >
              View My Services
            </button>
          </div>
        </div>

        {/* Right: Floating card composition */}
        <div className="hidden md:flex flex-col gap-4 lg:w-[340px] shrink-0">
          {FLOATING_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 p-4 transition-all duration-300 hover:bg-white/[0.12] hover:border-white/20"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.border} border`}
              >
                <card.icon className={`h-5 w-5 ${card.color}`} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-400">{card.label}</p>
                <p className={`text-lg font-bold ${card.color === 'text-emerald-600' ? 'text-emerald-400' : card.color === 'text-blue-600' ? 'text-blue-400' : 'text-amber-400'}`}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
