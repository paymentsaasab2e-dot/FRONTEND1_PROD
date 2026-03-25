'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, Monitor, MapPin, Sparkles, Users, Clock, AlertTriangle, ArrowRight, Search, PlusCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LMS_CARD_INTERACTIVE, LMS_PAGE_SUBTITLE, LMS_SECTION_TITLE } from '../constants';
import { AISectionHeading } from '../components/ai';
import { eventsRecommendedIntro, eventsWithAI } from '../data/ai-mock';
import { useLmsState } from '../state/LmsStateProvider';
import { useLmsOverlay } from '../components/overlays/LmsOverlayProvider';
import { useLmsToast } from '../components/ux/LmsToastProvider';
import { EventRegisterSheet } from './EventRegisterSheet';

function modeBadge(mode: 'Online' | 'Offline') {
  if (mode === 'Online') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800 border border-sky-200">
        <Monitor className="h-3 w-3" strokeWidth={2} />
        Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-900 border border-orange-200">
      <MapPin className="h-3 w-3" strokeWidth={2} />
      Offline
    </span>
  );
}

function typeBadge(type: string) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 border border-gray-200">
      {type}
    </span>
  );
}

type TabKey = 'All' | 'Upcoming' | 'Registered' | 'Past';

export default function LmsEventsPage() {
  const router = useRouter();
  const overlay = useLmsOverlay();
  const toast = useLmsToast();
  const { state, registerEvent, unregisterEvent, addPlannedItem } = useLmsState();

  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedEvents = useMemo(() => {
    return eventsWithAI.filter(ev => {
      // 1. Tab filter
      if (activeTab === 'Upcoming' && ev.status !== 'upcoming') return false;
      if (activeTab === 'Past' && ev.status !== 'past') return false;
      if (activeTab === 'Registered' && !state.registeredEventTitles.includes(ev.id)) return false;

      // 2. Search filter
      const qs = searchQuery.toLowerCase();
      if (qs && !ev.title.toLowerCase().includes(qs) && !ev.skill.includes(qs) && !ev.speaker.toLowerCase().includes(qs) && !ev.type.toLowerCase().includes(qs)) {
        return false;
      }
      return true;
    });
  }, [activeTab, searchQuery, state.registeredEventTitles]);

  const recommendedIds = useMemo(() => {
    // Arbitrary recommendation logic based on a weak topic or just picking the first 2 that are upcoming and not registered
    return eventsWithAI
      .filter(e => e.status === 'upcoming' && !state.registeredEventTitles.includes(e.id))
      .slice(0, 2)
      .map(e => e.id);
  }, [state.registeredEventTitles]);

  const openRegister = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isRegistered = state.registeredEventTitles.includes(id);

    overlay.openSheet({
      title: isRegistered ? 'Cancel Registration' : 'Register for Event',
      description: isRegistered ? 'You are about to cancel your spot.' : 'Frontend-only (mock) registration.',
      content: (
        <EventRegisterSheet title={title} isRegistered={isRegistered} />
      ),
      footer: (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl bg-[#28A8E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98]"
            onClick={() => {
              if (isRegistered) {
                unregisterEvent(id);
                toast.push({ title: 'Registration Cancelled', message: title, tone: 'success' });
              } else {
                registerEvent(id);
                toast.push({ title: 'Registered', message: title, tone: 'success' });
              }
              overlay.close();
            }}
          >
            {isRegistered ? 'Unregister' : 'Confirm Registration'}
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
            onClick={overlay.close}
          >
            Cancel
          </button>
        </div>
      ),
      size: 'md',
    });
  };

  const handlePlanClick = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    addPlannedItem({
        id: `evt-${id}`,
        type: 'event',
        label: title,
        href: `/lms/events/${id}`
    });
    toast.push({ title: 'Added to plan', message: 'Event marked in Career Path plan.', tone: 'success' });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Events</h1>
        <p className={LMS_PAGE_SUBTITLE}>
          Career-relevant sessions with urgency cues — tied to your path, notes, and quiz gaps (mock).
        </p>
      </div>

      {activeTab === 'All' && !searchQuery && recommendedIds.length > 0 && (
        <section className="space-y-4">
          <AISectionHeading title="Recommended live sessions" />
          <p className="text-sm font-normal text-gray-500 -mt-2">{eventsRecommendedIntro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventsWithAI.filter(ev => recommendedIds.includes(ev.id)).map((ev) => {
              const registered = state.registeredEventTitles.includes(ev.id);
              return (
                 <EventCard key={`rec-${ev.id}`} ev={ev} registered={registered} onRegister={(e) => openRegister(e, ev.id, ev.title)} onPlan={(e) => handlePlanClick(e, ev.id, ev.title)} />
              )
            })}
          </div>
        </section>
      )}

      <section className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                {(['All', 'Upcoming', 'Registered', 'Past'] as TabKey[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab}
                        {tab === 'Registered' && state.registeredEventTitles.length > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#28A8E1]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#28A8E1]">
                                {state.registeredEventTitles.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#28A8E1] focus:ring-1 focus:ring-[#28A8E1] transition-all"
                />
            </div>
        </div>

        {displayedEvents.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-100 rounded-3xl">
              <CalendarDays className="h-10 w-10 text-gray-300 mb-3" strokeWidth={1.5} />
              <p className="text-gray-500 font-medium text-sm">No events found matching your criteria.</p>
              {(searchQuery || activeTab !== 'All') && (
                  <button onClick={() => { setSearchQuery(''); setActiveTab('All'); }} className="mt-4 text-sm font-semibold text-[#28A8E1] hover:underline">
                      Clear filters
                  </button>
              )}
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedEvents.map((ev) => {
                const registered = state.registeredEventTitles.includes(ev.id);
                return (
                    <EventCard key={`list-${ev.id}`} ev={ev} registered={registered} onRegister={(e) => openRegister(e, ev.id, ev.title)} onPlan={(e) => handlePlanClick(e, ev.id, ev.title)} />
                )
              })}
            </div>
        )}
      </section>

      <section className="space-y-3 pt-6">
        <h2 className={LMS_SECTION_TITLE}>Urgency tips</h2>
        <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/30 p-4 text-sm text-amber-900 shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" strokeWidth={2} />
          <span className="leading-relaxed">
            High-registration workshops often fill first — mock data above simulates social proof for UX testing. Frontend changes fully persist.
          </span>
        </div>
      </section>
    </div>
  );
}

function EventCard({ ev, registered, onRegister, onPlan }: { ev: typeof eventsWithAI[0], registered: boolean, onRegister: React.MouseEventHandler, onPlan: React.MouseEventHandler }) {
    return (
        <Link href={`/lms/events/${ev.id}`} className={LMS_CARD_INTERACTIVE}>
            <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${registered ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ev.status === 'past' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-amber-50 text-amber-800 border-amber-100'}`}>
                {registered ? <CheckCircle2 className="h-5 w-5" strokeWidth={2} /> : <CalendarDays className="h-5 w-5" strokeWidth={2} />}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
                <div className="pr-4 relative">
                <h2 className="text-lg font-bold text-gray-900 leading-snug">{ev.title}</h2>
                <ArrowRight className="absolute right-0 top-1 text-gray-300 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <p className="mt-1 text-sm text-gray-500 font-normal">{ev.date}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                {typeBadge(ev.type)}
                {modeBadge(ev.mode)}
                </div>
                {ev.status !== 'past' && (
                    <div className="flex items-start gap-2 rounded-lg border border-violet-100 bg-violet-50/50 px-3 py-2">
                        <Sparkles className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" strokeWidth={2} />
                        <p className="text-xs font-medium text-violet-900 leading-relaxed">{ev.matchLabel}</p>
                    </div>
                )}
                {ev.overview && (
                   <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{ev.overview}</p>
                )}
                
                <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-gray-500 pt-1">
                <span className={`inline-flex items-center gap-1.5 ${ev.status === 'past' ? 'text-gray-500' : 'text-emerald-700'}`}>
                    <Users className="h-3.5 w-3.5" strokeWidth={2} />
                    {ev.registeredCount} people {ev.status === 'past' ? 'attended' : 'already registered'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                    {ev.startsIn}
                </span>
                </div>
                
                {ev.status === 'upcoming' && (
                    <div className="flex flex-col gap-2 sm:flex-row pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        onClick={onRegister}
                        className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 hover:shadow-sm active:scale-[0.98] cursor-pointer ${registered ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'}`}
                    >
                        {registered ? 'Registered ✓' : 'Register'}
                    </button>
                    <button
                        type="button"
                        onClick={onPlan}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100"
                    >
                        <PlusCircle className="h-3 w-3" />
                        Plan
                    </button>
                    </div>
                )}
            </div>
            </div>
        </Link>
    );
}
