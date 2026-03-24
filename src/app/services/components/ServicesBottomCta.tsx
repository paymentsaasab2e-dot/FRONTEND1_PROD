'use client';

import { useRouter } from 'next/navigation';
import { SVC_PRIMARY_BTN, SVC_SECONDARY_BTN } from '../constants';

export default function ServicesBottomCta() {
  const router = useRouter();

  return (
    <section className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 py-10 px-6 text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
        Need help deciding where to start?
      </h2>
      <p className="text-sm sm:text-base text-gray-500 font-normal mb-6 max-w-lg mx-auto">
        Explore recommended services based on your profile and job-readiness needs.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
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
          className={SVC_SECONDARY_BTN}
        >
          View My Services
        </button>
      </div>
    </section>
  );
}
