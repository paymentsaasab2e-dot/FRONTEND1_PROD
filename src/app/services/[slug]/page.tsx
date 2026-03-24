'use client';

import { use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  FileInput, 
  Target, 
  Lightbulb 
} from 'lucide-react';
import { getServiceBySlug, getRelatedServices, type ServiceDefinition } from '../data/services';
import { SVC_PRIMARY_BTN, SVC_SECONDARY_BTN, SVC_CARD_CLASS } from '../constants';
import ServiceIcon from '../components/ServiceIcon';
import ServiceCard from '../components/ServiceCard';
import ServiceRequestModal from '../components/ServiceRequestModal';

const BADGE_STYLES: Record<string, string> = {
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
};

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const service = getServiceBySlug(resolvedParams.slug);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!service) {
    notFound();
  }

  const related = getRelatedServices(service.slug);
  const badgeStyle = BADGE_STYLES[service.badgeColor] || BADGE_STYLES.blue;

  return (
    <>
      <div className="space-y-8 pb-32">
        {/* 1. Breadcrumb / Back */}
        <nav aria-label="Breadcrumb">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all services
          </Link>
        </nav>

        {/* 2. Service Hero Block */}
        <section className={SVC_CARD_CLASS + " border-none shadow-md bg-white overflow-hidden relative"}>
          {/* Background decoration */}
          <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-${service.badgeColor}-400/10 blur-3xl pointer-events-none`} />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start">
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-${service.badgeColor}-50 border border-${service.badgeColor}-100`}>
              <ServiceIcon iconKey={service.iconKey} className={`h-10 w-10 text-${service.badgeColor}-600`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border mb-4 ${badgeStyle}`}>
                {service.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                {service.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-500 font-normal max-w-2xl">
                {service.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0 md:w-48">
              <button 
                onClick={() => setIsModalOpen(true)}
                className={SVC_PRIMARY_BTN + ' w-full shadow-md'}
              >
                {service.ctaLabel}
              </button>
            </div>
          </div>
        </section>

        {/* Two Column Layout for Details */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* 3. Overview */}
            <section className={SVC_CARD_CLASS}>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-gray-400" />
                Overview
              </h2>
              <p className="text-gray-600 font-normal leading-relaxed text-base">
                {service.shortDescription}
              </p>
            </section>

            {/* 4. Deliverables */}
            <section className={SVC_CARD_CLASS}>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-400" />
                What you'll get
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.fullDeliverables.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. How it works */}
            <section className={SVC_CARD_CLASS}>
              <h2 className="text-lg font-bold text-gray-900 mb-6">How it works</h2>
              <div className="space-y-6">
                {service.howItWorksSteps.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-${service.badgeColor}-50 text-${service.badgeColor}-600 font-bold text-sm border border-${service.badgeColor}-100`}>
                        {step.step}
                      </div>
                      {index < service.howItWorksSteps.length - 1 && (
                        <div className="w-px h-full bg-gray-200 my-2" />
                      )}
                    </div>
                    <div className="pb-2">
                      <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600 font-normal">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* 5. Who it's for */}
            <section className={SVC_CARD_CLASS + " bg-slate-50 border-none"}>
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                Who it's for
              </h2>
              <ul className="space-y-3">
                {service.whoItIsFor.map(item => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Required Inputs */}
            <section className={SVC_CARD_CLASS + " bg-slate-50 border-none"}>
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileInput className="h-4 w-4 text-gray-500" />
                What we need from you
              </h2>
              <ul className="space-y-3">
                {service.requiredInputs.map(item => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 8. Expected Outcomes */}
            <section className={SVC_CARD_CLASS + " bg-white"}>
              <h2 className="text-base font-bold text-gray-900 mb-3">Expected Outcomes</h2>
              <ul className="space-y-3">
                {service.expectedOutcomes.map(item => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* 9. Related Services */}
        {related.length > 0 && (
          <section className="pt-8 border-t border-gray-200/80">
            <h2 className="text-xl font-bold text-gray-900 mb-6">You might also be interested in</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(rel => (
                <ServiceCard 
                  key={rel.id} 
                  service={rel} 
                  onRequestService={() => {
                    router.push(`/services/${rel.slug}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 10. Sticky Bottom CTA (Mobile primarily, but works everywhere) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/80 p-4 sm:px-6 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1280px] flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900">{service.title}</p>
            <p className="text-xs text-gray-500 font-normal">{service.badge}</p>
          </div>
          <div className="flex flex-1 sm:flex-none justify-end gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className={SVC_PRIMARY_BTN + ' w-full sm:w-auto min-w-[160px] shadow-md'}
            >
              {service.ctaLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <ServiceRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        service={service} 
      />
    </>
  );
}
