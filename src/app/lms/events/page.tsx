import { CalendarDays, Monitor, MapPin, Sparkles, Users, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { LMS_CARD_INTERACTIVE, LMS_PAGE_SUBTITLE, LMS_SECTION_TITLE } from '../constants';
import { AISectionHeading } from '../components/ai';
import { eventsRecommendedIntro, eventsWithAI } from '../data/ai-mock';

function modeBadge(mode: 'Online' | 'Offline') {
  if (mode === 'Online') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
        <Monitor className="h-3 w-3" strokeWidth={2} />
        Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-900">
      <MapPin className="h-3 w-3" strokeWidth={2} />
      Offline
    </span>
  );
}

function typeBadge(type: string) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
      {type}
    </span>
  );
}

export default function LmsEventsPage() {
  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Events</h1>
        <p className={LMS_PAGE_SUBTITLE}>
          Career-relevant sessions with urgency cues — tied to your path, notes, and quiz gaps (mock).
        </p>
      </div>

      <section className="space-y-4">
        <AISectionHeading title="Recommended live sessions" />
        <p className="text-sm font-normal text-gray-500 -mt-2">{eventsRecommendedIntro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventsWithAI.map((ev) => (
            <div key={ev.title} className={LMS_CARD_INTERACTIVE}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
                  <CalendarDays className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">{ev.title}</h2>
                    <p className="mt-1 text-sm text-gray-500 font-normal">{ev.date}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {typeBadge(ev.type)}
                    {modeBadge(ev.mode)}
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-violet-100 bg-violet-50/50 px-3 py-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" strokeWidth={2} />
                    <p className="text-xs font-medium text-violet-900 leading-relaxed">{ev.matchLabel}</p>
                  </div>
                  <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2">
                    <p className="text-xs font-bold text-gray-800">Why attend?</p>
                    <ul className="mt-1 space-y-0.5 list-disc pl-4 text-xs font-normal text-gray-600">
                      {ev.whyAttend.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs font-semibold text-gray-600">
                    <span className="inline-flex items-center gap-1.5 text-amber-800">
                      <Users className="h-3.5 w-3.5" strokeWidth={2} />
                      {ev.registeredCount} people already registered
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-700">
                      <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                      {ev.startsIn}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-[0.98] cursor-pointer"
                    >
                      Register
                    </button>
                    <Link
                      href="/lms/career-path"
                      className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#28A8E1]/10 border border-[#28A8E1]/30 px-4 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-[#28A8E1]/15 hover:shadow-sm"
                    >
                      Add to plan
                    </Link>
                  </div>
                  <p className="text-[11px] font-normal text-gray-400">
                    “Add to plan” will sync to Career Path timeline when backend stores planned items.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={LMS_SECTION_TITLE}>Urgency tips</h2>
        <div className="flex gap-2 rounded-xl border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={2} />
          <span>
            High-registration workshops often fill first — mock data above simulates social proof for UX testing.
          </span>
        </div>
      </section>
    </div>
  );
}
