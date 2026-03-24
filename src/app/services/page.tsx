'use client';

import { useState, useMemo } from 'react';
import ServicesHero from './components/ServicesHero';
import ServicesStatsStrip from './components/ServicesStatsStrip';
import RecommendedServicesSection from './components/RecommendedServicesSection';
import ServicesFilterBar from './components/ServicesFilterBar';
import ServicesGrid from './components/ServicesGrid';
import FeaturedServicesBanner from './components/FeaturedServicesBanner';
import ServicesHowItWorks from './components/ServicesHowItWorks';
import ServicesFaqPreview from './components/ServicesFaqPreview';
import ServicesBottomCta from './components/ServicesBottomCta';
import ServiceRequestModal from './components/ServiceRequestModal';
import { SERVICES, type ServiceCategory, type ServiceDefinition } from './data/services';

export default function ServicesLandingPage() {
  const [activeTab, setActiveTab] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevant');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    let result = SERVICES;

    // Filter by Category
    if (activeTab !== 'all') {
      result = result.filter(s => s.category === activeTab);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.shortDescription.toLowerCase().includes(q) ||
        s.previewDeliverables.some(d => d.toLowerCase().includes(q))
      );
    }

    // Sorting (Simple placeholder logic since it's mock data)
    // In a real app, 'relevant' would use search score or candidate profile match
    // 'popular' would sort by some usage metric.
    if (sortBy === 'az') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'popular') {
      // Mock popular sorting: artificially bring 'ai-resume-review' and 'mock-interview' to top
      const popularIds = ['svc-1', 'svc-6'];
      result = [...result].sort((a, b) => {
        const aPop = popularIds.includes(a.id) ? 1 : 0;
        const bPop = popularIds.includes(b.id) ? 1 : 0;
        return bPop - aPop;
      });
    }

    return result;
  }, [activeTab, searchQuery, sortBy]);

  const handleRequestService = (service: ServiceDefinition) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setSortBy('relevant');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section */}
      <ServicesHero />

      {/* 2. Trust / Stats Strip */}
      <ServicesStatsStrip />

      {/* 3. Recommended Services Block */}
      <RecommendedServicesSection />

      {/* 4 & 5. Filter Bar + Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Browse All Services</h2>
            <p className="text-gray-500 text-sm font-normal mt-1">
              Find the right expert guidance and tools for your career goals.
            </p>
          </div>
        </div>
        
        <ServicesFilterBar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        <ServicesGrid 
          services={filteredServices} 
          onRequestService={handleRequestService} 
          onResetFilters={handleResetFilters}
        />
      </section>

      {/* 6. Featured Banner */}
      <FeaturedServicesBanner />

      {/* 7. How It Works */}
      <ServicesHowItWorks />

      {/* 8. FAQ Preview */}
      <ServicesFaqPreview />

      {/* 9. Bottom CTA */}
      <ServicesBottomCta />

      {/* Request Modal */}
      <ServiceRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        service={selectedService} 
      />
    </div>
  );
}
