'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Image from 'next/image';
import ApplicationSuccessModal from '../../components/modals/ApplicationSuccessModal';
import DashboardContainer from '../../components/layout/DashboardContainer';
import { Sparkles } from 'lucide-react';

// Use backend1 directly (it shares the same MongoDB as backendphase2).
import { API_BASE_URL } from '@/lib/api-base';
const PAGE_BG =
  'linear-gradient(135deg, #e0f2fe 0%, #ecf7fd 12%, #fafbfb 30%, #fdf6f0 55%, #fef5ed 85%, #fef5ed 100%)';

interface JobListing {
  id: number | string
  title: string
  company: string
  logo: string
  location: string
  salary: string
  type: string
  skills: string[]
  match: string
  matchScore?: number
  normalizedScore?: number
  timeAgo: string
  isHighlighted?: boolean
  description: string
  responsibilities: string[]
  requiredSkills: string[]
  niceToHaveSkills?: string[]
  companyOverview: string
  experienceLevel: string
  department?: string
  workMode: string
  industry: string
  visaAvailability: string
  applicantCount: string
  postedDate: string
  strengths?: string[]
  gaps?: string[]
  confidenceTag?: string
  reasoning?: string
  matchedSkills?: string[]
  missingSkills?: string[]
  transferableSkills?: string[]
  skillGaps?: string[]
  hiringRecommendation?: string
  breakdown?: any
}

const DashboardPage = () => {
  const router = useRouter()
  const detailsRef = useRef<HTMLDivElement | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid')
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set())

  // Screening form states
  const [experienceAnswer, setExperienceAnswer] = useState<string | null>('yes')
  const [nightShiftFocused, setNightShiftFocused] = useState(false)
  const [nightShiftValue, setNightShiftValue] = useState('')
  const [excelProficiency, setExcelProficiency] = useState(0) // 0 = Beginner, 100 = Expert
  const [joiningAvailability, setJoiningAvailability] = useState<string | null>(null)

  // Filters UI state (local only)
  const [smartFiltersOpen, setSmartFiltersOpen] = useState(true)
  const [experienceOpen, setExperienceOpen] = useState(true)
  const [salaryOpen, setSalaryOpen] = useState(true)
  const [matchOpen, setMatchOpen] = useState(true)
  const [industryOpen, setIndustryOpen] = useState(true)
  const [departmentOpen, setDepartmentOpen] = useState(true)
  const [citiesOpen, setCitiesOpen] = useState(true)

  const [smartFilterSkills, setSmartFilterSkills] = useState(false)
  const [smartFilterHighMatch, setSmartFilterHighMatch] = useState(false)
  const [smartFilterLikelyRespond, setSmartFilterLikelyRespond] = useState(false)
  const [smartFilterRemoteFriendly, setSmartFilterRemoteFriendly] = useState(false)

  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'Office' | null>(null)
  const [experienceYears, setExperienceYears] = useState(0)
  const [salaryRanges, setSalaryRanges] = useState<Record<string, boolean>>({
    '3-6 Lakhs': false,
    '6-10 Lakhs': false,
    '10-15 Lakhs': false,
    '15-25 Lakhs': false,
  })
  const [matchScore, setMatchScore] = useState<Record<string, boolean>>({
    '80%+ Match': false,
    '70%+ Match': false,
    '60%+ Match': false,
  })
  const [industry, setIndustry] = useState<Record<string, boolean>>({
    'IT Services & Consulting': false,
    'Software Product': false,
    'Recruitment / Staffing': false,
    'Miscellaneous': false,
  })
  const [department, setDepartment] = useState<Record<string, boolean>>({
    'Engineering - Software': false,
    'Data Science & Analytics': false,
    'UX, Design & Architecture': false,
    'IT & Information Security': false,
  })
  const [cities, setCities] = useState<Record<string, boolean>>({
    'Navi Mumbai': false,
    'Panvel': false,
    'Mumbai': false,
    'Bengaluru': false,
  })

  const resetFilters = () => {
    setSearchQuery('')
    setSmartFilterSkills(false)
    setSmartFilterHighMatch(false)
    setSmartFilterLikelyRespond(false)
    setSmartFilterRemoteFriendly(false)
    setWorkMode(null)
    setExperienceYears(0)
    setSalaryRanges({ '3-6 Lakhs': false, '6-10 Lakhs': false, '10-15 Lakhs': false, '15-25 Lakhs': false })
    setMatchScore({ '80%+ Match': false, '70%+ Match': false, '60%+ Match': false })
    setIndustry({ 'IT Services & Consulting': false, 'Software Product': false, 'Recruitment / Staffing': false, 'Miscellaneous': false })
    setDepartment({ 'Engineering - Software': false, 'Data Science & Analytics': false, 'UX, Design & Architecture': false, 'IT & Information Security': false })
    setCities({ 'Navi Mumbai': false, 'Panvel': false, 'Mumbai': false, 'Bengaluru': false })
  }

  useEffect(() => {
    loadJobListings()
  }, [])

  useEffect(() => {
    if (viewMode !== 'detail') return
    // Ensure the Job Details section is visible after selecting a job
    const t = setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => clearTimeout(t)
  }, [viewMode, selectedJob?.id])

  const formatTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const postedDate = typeof date === 'string' ? new Date(date) : date;
    const diffInMs = now.getTime() - postedDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Just now';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };

  const formatSalary = (min: number | null, max: number | null, currency: string | null, type: string | null): string => {
    if (!min && !max) return 'Salary not specified';
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency || '$';
    const typeLabel = type === 'ANNUAL' ? '/year' : type === 'MONTHLY' ? '/month' : type === 'HOURLY' ? '/hour' : '';
    
    if (min && max) {
      return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}${typeLabel}`;
    }
    if (min) {
      return `${currencySymbol}${min.toLocaleString()}+${typeLabel}`;
    }
    return `${currencySymbol}${max?.toLocaleString()}${typeLabel}`;
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const [isPersonalized, setIsPersonalized] = useState(false);

  const loadJobListings = async () => {
    try {
      setLoading(true);
      const candidateId = sessionStorage.getItem('candidateId');
      
      let url = `${API_BASE_URL}/jobs?limit=500`;
      let usingPersonalized = false;

      // Try personalized first if candidate is logged in
      if (candidateId) {
        url = `${API_BASE_URL}/jobs/personalized?candidateId=${candidateId}`;
        usingPersonalized = true;
      }

      // Fetch jobs
      let response: Response;
      try {
        response = await fetch(url, { method: 'GET' });
      } catch (fetchError: unknown) {
        console.error('Network error fetching jobs:', fetchError);
        throw new Error(`Failed to connect to server at ${API_BASE_URL}`);
      }

      if (!response.ok) {
        // If personalized failed (e.g. no profile), fallback to general if appropriate
        // OR just log it and show regular jobs
        if (usingPersonalized) {
          console.warn('Personalized fetch failed, falling back to general list');
          response = await fetch(`${API_BASE_URL}/jobs?limit=500`, { method: 'GET' });
          usingPersonalized = false;
        } else {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }
      }

      const result: any = await response.json();
      setIsPersonalized(usingPersonalized);
      
      const rawJobs = result?.data || [];

      if (result.success && Array.isArray(rawJobs)) {
        // Transform API response to JobListing format
        const transformedJobs: JobListing[] = rawJobs.map((job: any, index: number) => {
          const matchScoreFromApi = job.matchScore;
          const matchScore = matchScoreFromApi || Math.floor(Math.random() * 21) + 75;
          
          const jobId = job.id || `job-${index + 1}`;
          
          return {
            id: jobId,
            title: job.jobTitle || job.title || 'Job Title',
            company: job.company || 'Company Name',
            logo: job.logo || '/perosn_icon.png',
            location: job.location || 'Location not specified',
            salary: job.salary ? formatSalary(job.salary?.min ?? job.salaryMin, job.salary?.max ?? job.salaryMax, job.salary?.currency ?? job.salaryCurrency, job.salary?.type ?? job.salaryType) : 'Salary not specified',
            type: job.type || 'Full-time',
            skills: Array.isArray(job.skills) ? job.skills : (job.matchedSkills || []),
            match: `${matchScore}% Match`,
            matchScore: matchScore,
            normalizedScore: job.normalizedScore || matchScore,
            timeAgo: formatTimeAgo(job.postedDate || job.postedAt || job.createdAt || new Date()),
            isHighlighted: matchScore >= 85,
            description: job.overview || job.aboutRole || job.description || 'No description available.',
            responsibilities:
              Array.isArray(job.keyResponsibilities)
                ? job.keyResponsibilities
                : typeof job.responsibilities === 'string'
                ? job.responsibilities.split(/[.;]/).filter((r: string) => r.trim()).map((r: string) => r.trim() + (r.trim().endsWith('.') ? '' : '.'))
                : Array.isArray(job.responsibilities)
                ? job.responsibilities
                : [],
            requiredSkills: Array.isArray(job.skills) ? job.skills : [],
            niceToHaveSkills: [],
            companyOverview: `We are a leading company in the ${job.industry || job.department || 'technology'} industry.`,
            experienceLevel: job.experienceRequired || job.experienceLevel || 'Not specified',
            department: job.industry || job.department || undefined,
            workMode: job.workMode || 'On-site',
            industry: job.industry || job.department || 'Technology',
            visaAvailability: job.visaSponsorship || job.visaSponsorship === true ? 'Available' : 'Not Available',
            applicantCount: `${Math.floor(Math.random() * 200) + 20}+`,
            postedDate: formatDate(job.postedDate || job.postedAt || job.createdAt || new Date()),
            strengths: job.strongMatches || [],
            gaps: job.skillGaps || [],
            confidenceTag: job.confidenceTag,
            reasoning: job.reasoning,
            matchedSkills: job.matchedSkills,
            missingSkills: job.missingSkills,
            transferableSkills: job.transferableSkills,
            hiringRecommendation: job.hiringRecommendation,
            breakdown: job.breakdown
          };
        });

        setJobListings(transformedJobs);
        if (transformedJobs.length > 0) {
          setSelectedJob(transformedJobs[0]);
        } else {
          setSelectedJob(null);
        }
      } else {
        setJobListings([]);
        setSelectedJob(null);
      }
    } catch (error: any) {
      console.error('Failed to load job listings:', error);
      setJobListings([]);
    } finally {
      setLoading(false);
    }
  }

  const checkAppliedJobs = async () => {
    const candidateId = sessionStorage.getItem('candidateId');
    if (!candidateId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${candidateId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const appliedIds = new Set<string>(result.data.map((app: any) => String(app.jobId)));
          setAppliedJobIds(appliedIds);
        }
      }
    } catch (error) {
      console.error('Error checking applied jobs:', error);
    }
  }

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query)
  }

  const handleResetFilters = () => {
    resetFilters()
  }

  const handleJobClick = (job: JobListing) => {
    setSelectedJob(job)
  }

  const handleApplyNow = () => {
    setIsScreeningModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsScreeningModalOpen(false)
    setExperienceAnswer('yes')
    setNightShiftValue('')
    setNightShiftFocused(false)
    setExcelProficiency(0)
    setJoiningAvailability(null)
  }

  const handleSubmitScreening = async () => {
    const candidateId = sessionStorage.getItem('candidateId');
    if (!candidateId) {
      alert('Please log in to apply for jobs');
      return;
    }

    if (!selectedJob) {
      alert('No job selected');
      return;
    }

    try {
      const screeningAnswers = {
      experience: experienceAnswer,
      nightShift: nightShiftValue,
      excelProficiency,
        joiningAvailability,
      };

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId,
          jobId: selectedJob.id.toString(),
          screeningAnswers,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message =
          typeof result?.message === 'string' ? result.message : 'Failed to submit application';
        const lower = message.toLowerCase();

        // Backend can return a non-200 when the candidate already applied.
        // Treat this as a normal outcome so we don't show console errors.
        if (lower.includes('already applied')) {
          handleCloseModal();
          setIsSuccessModalOpen(true);
          loadJobListings();
          checkAppliedJobs();
          return;
        }

        alert(message);
        return;
      }

      if (result.success) {
        handleCloseModal();
        setIsSuccessModalOpen(true);
        // Reload job listings and check applied status
        loadJobListings();
        checkAppliedJobs();
      } else {
        alert(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    }
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
  }

  const getProficiencyLabel = (value: number) => {
    if (value === 0) return 'Beginner'
    if (value <= 25) return 'Basic'
    if (value <= 50) return 'Intermediate'
    if (value <= 75) return 'Advanced'
    return 'Expert'
  }

  const handleSaveJob = () => {
    // Implement save job logic
  }

  const handleBackToGrid = () => {
    setViewMode('grid')
    setSelectedJob(null)
  }

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return jobListings
    return jobListings.filter((j) => {
      const hay = `${j.title} ${j.company} ${j.location}`.toLowerCase()
      return hay.includes(q)
    })
  }, [jobListings, searchQuery])

  const Pill = ({
    label,
    active,
    onClick,
  }: {
    label: string
    active: boolean
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 ease-out ${
        active ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )

  const SectionHeader = ({
    title,
    open,
    onToggle,
    subtitle,
  }: {
    title: string
    open: boolean
    onToggle: () => void
    subtitle?: string
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-3 text-left"
      aria-expanded={open}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle ? <p className="text-xs font-semibold text-blue-600 mt-0.5">{subtitle}</p> : null}
      </div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )

  const renderJobCard = (job: JobListing, isCompact = false) => {
    const isSelected = selectedJob?.id === job.id && isCompact;
    const when = (job.timeAgo || job.postedDate || '').toString()

    return (
      <div
        key={job.id}
        onClick={() => {
          handleJobClick(job);
          if (!isCompact) setViewMode('detail');
        }}
        className={`group ${isCompact
          ? `py-5 px-3.5 mb-4 rounded-2xl border border-gray-100 ${isSelected ? 'bg-[#111827] text-white border-transparent shadow-xl' : 'bg-white text-gray-900 shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'}`
          : 'p-3 md:p-4 lg:p-4 mb-3 sm:mb-4 rounded-2xl bg-white text-gray-900 border border-gray-100 hover:bg-[#111827] hover:text-white hover:shadow-2xl hover:border-transparent'
          } cursor-pointer transition-all duration-500 relative w-full max-w-full overflow-hidden ${isCompact ? 'h-auto' : 'h-full'} flex flex-col`}
      >
        {/* Header: Logo, Date, Bookmark */}
        <div className={`flex justify-between items-start ${isCompact ? 'mb-1.5' : 'mb-1.5 sm:mb-2'} min-w-0`}>
          <div className="rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center shrink-0" style={{ width: isCompact ? "40px" : "48px", height: isCompact ? "40px" : "48px", padding: "4px" }}>
            <Image src="/perosn_icon.png" alt={job.company} width={isCompact ? 40 : 48} height={isCompact ? 40 : 48} className="object-contain" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`font-medium whitespace-nowrap transition-colors duration-500 ${isCompact ? (isSelected ? 'text-gray-400' : 'text-gray-500') : 'text-gray-500 group-hover:text-gray-400'}`}
              style={{ fontSize: isCompact ? "10px" : "12px" }}
            >
              {when}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`transition-colors duration-500 shrink-0 ${isCompact ? (isSelected ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900') : 'text-gray-400 group-hover:text-gray-400 group-hover:hover:text-white hover:text-gray-900'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: isCompact ? "18px" : "20px", height: isCompact ? "18px" : "20px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Company Name & Verified */}
        <div className={`flex items-center gap-2 ${isCompact ? 'mb-0.5' : 'mb-1'} min-w-0`}>
          <span className={`font-semibold wrap-break-word flex-1 min-w-0 transition-colors duration-500 ${isCompact ? (isSelected ? 'text-gray-200' : 'text-gray-900') : 'text-gray-900 group-hover:text-gray-200'}`} style={{ fontSize: isCompact ? "12px" : "13px" }}>{job.company}</span>
          <svg className="text-green-500 fill-current shrink-0" viewBox="0 0 20 20" style={{ width: "14px", height: "14px" }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Job Title */}
        <h3 className={`font-bold wrap-break-word line-clamp-2 transition-colors duration-500 ${isCompact ? 'mb-1' : 'mb-1.5'} ${isCompact ? (isSelected ? 'text-white' : 'text-gray-900') : 'text-gray-900 group-hover:text-white'}`} style={{ fontSize: isCompact ? "16px" : "18px" }}>{job.title}</h3>

        {/* Meta line (Location • Salary • Type) */}
        <div className={`flex flex-wrap items-center gap-2 ${isCompact ? 'mb-1' : 'mb-2'} min-w-0`}>
          <span
            className={`wrap-break-word transition-colors duration-500 ${isCompact ? (isSelected ? 'text-gray-400' : 'text-gray-500') : 'text-gray-500 group-hover:text-gray-300'}`}
            style={{ fontSize: isCompact ? "11px" : "12px" }}
          >
            {job.location}
          </span>
          <span className={`opacity-50 ${isCompact ? (isSelected ? 'text-gray-500' : 'text-gray-400') : 'text-gray-400 group-hover:text-gray-500'}`}>•</span>
          <span
            className={`wrap-break-word font-semibold transition-colors duration-500 ${isCompact ? (isSelected ? 'text-gray-300' : 'text-blue-700') : 'text-blue-700 group-hover:text-blue-300'}`}
            style={{ fontSize: isCompact ? "11px" : "12px" }}
          >
            {job.salary}
          </span>
          <span className={`opacity-50 ${isCompact ? (isSelected ? 'text-gray-500' : 'text-gray-400') : 'text-gray-400 group-hover:text-gray-500'}`}>•</span>
          <span
            className={`wrap-break-word transition-colors duration-500 ${isCompact ? (isSelected ? 'text-gray-400' : 'text-gray-500') : 'text-gray-500 group-hover:text-gray-300'}`}
            style={{ fontSize: isCompact ? "11px" : "12px" }}
          >
            {job.type}
          </span>
        </div>

        {/* Skills Tags */}
        <div className={`flex flex-wrap gap-1.5 ${isCompact ? 'mb-1.5' : 'mb-2'}`}>
          {job.skills.slice(0, isCompact ? 3 : 4).map((skill, index) => (
            <span
              key={index}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors duration-500 shrink-0 wrap-break-word ${
                isCompact
                  ? (isSelected ? 'bg-white/10 text-gray-200 border border-white/15' : 'bg-gray-100 text-gray-700 border border-gray-200')
                  : 'bg-gray-100 text-gray-700 border border-gray-200 group-hover:bg-gray-800 group-hover:text-gray-200 group-hover:border-white/10'
              }`}
              style={{ fontSize: "11px" }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Footer: Stats & Button */}
        <div className={`flex items-center justify-between ${isCompact ? 'mt-0.5' : 'mt-auto'} gap-2 min-w-0`}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex items-center gap-1.5 transition-colors duration-500 ${isCompact ? '' : ''}`}
              style={{ fontSize: "11px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`transition-colors ${isCompact ? (isSelected ? 'text-gray-400' : 'text-gray-400') : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-medium whitespace-nowrap transition-colors duration-500 ${isCompact ? (isSelected ? 'text-gray-400' : 'text-gray-500') : 'text-gray-500 group-hover:text-gray-300'}`}>
                {when}
              </span>
            </div>
            <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold shadow-sm border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-transparent transition-all duration-500 flex items-center gap-1" style={{ fontSize: "11px" }}>
              {isPersonalized && (
                <svg className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              )}
              {isPersonalized ? `AI Score: ${job.match}` : job.match}
            </div>
          </div>

          {job.confidenceTag && (
            <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              job.confidenceTag === 'Excellent Match' ? 'bg-purple-100 text-purple-700' :
              job.confidenceTag === 'Strong Match' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {job.confidenceTag}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleJobClick(job);
              if (!isCompact) setViewMode('detail');
            }}
            className={`rounded-full font-bold transition-all duration-500 active:scale-95 whitespace-nowrap shrink-0 ${isCompact
              ? (isSelected ? 'bg-[#28A8DF] text-white' : 'bg-[#28A8DF] text-white hover:bg-[#1f97cb]')
              : 'bg-[#28A8DF] text-white hover:bg-[#1f97cb] group-hover:bg-[#28A8DF] group-hover:text-white group-hover:px-8'
              }`} style={{
                fontSize: isCompact ? "12px" : "12px",
                padding: isCompact ? "8px 18px" : "8px 20px"
              }}>
            {isCompact ? "View" : "Details"}
          </button>
        </div>
      </div>
    );
  };

  const renderJobListItem = (job: JobListing) => {
    const when = (job.timeAgo || job.postedDate || '').toString()
    const skills = Array.isArray(job.skills) ? job.skills : []
    return (
      <div
        key={job.id}
        onClick={() => {
          handleJobClick(job);
          setViewMode('detail');
        }}
        className="group bg-white p-5 sm:p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300 ease-out border border-gray-100 w-full"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 grid place-items-center shrink-0">
            <Image src="/perosn_icon.png" alt={job.company} width={28} height={28} />
          </div>

          {/* Left content */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">{job.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 min-w-0">
              <span className="truncate">{job.company}</span>
              <span className="text-gray-300">•</span>
              <span className="truncate">{job.location}</span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-blue-700 truncate">{job.salary}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                {job.type}
              </span>
              {skills.slice(0, 4).map((s, idx) => (
                <span
                  key={`${job.id}-list-skill-${idx}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="whitespace-nowrap">{when}</span>
            </div>

            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 shadow-sm">
              {isPersonalized ? `AI Fit: ${job.match}` : job.match}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleJobClick(job)
                setViewMode('detail')
              }}
              className="inline-flex items-center justify-center rounded-xl bg-[#28A8DF] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-300 ease-out"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      <Header />

      <main className="w-full grow overflow-x-hidden">
        <DashboardContainer className="py-6 sm:py-8 lg:py-10">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
            {/* LIST/GRID VIEW */}
            {viewMode !== 'detail' ? (
              <>
                {/* Top Header Area */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Explore Jobs</h1>
                      {isPersonalized && (
                         <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100 uppercase tracking-wider">
                           Profile Matched
                         </span>
                      )}
                    </div>
                    <p className="text-gray-500 font-medium">
                      {isPersonalized 
                        ? "Currently showing only roles perfectly aligned with your active profile."
                        : "Find roles that match your profile and preferences."}
                    </p>
                  </div>
                  <div className="w-full sm:w-[360px]">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jobs, companies, or keywords…"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>

                {/* Main Grid */}
                <div className="mt-6 grid grid-cols-12 gap-5 relative">
              {/* Sidebar filters */}
              <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-out p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Filters</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Reset Filters
                    </button>
                  </div>

                  <div className="mt-5 max-h-[calc(100vh-160px)] overflow-y-auto pr-1 space-y-5">
                    {/* Smart Filters */}
                    <div className="space-y-4">
                      <SectionHeader
                        title="Smart Filters"
                        subtitle="Powered by SAASA AI"
                        open={smartFiltersOpen}
                        onToggle={() => setSmartFiltersOpen((v) => !v)}
                      />
                      {smartFiltersOpen ? (
                        <div className="space-y-3">
                          {[
                            { label: 'Jobs matching my skills', value: smartFilterSkills, onChange: setSmartFilterSkills },
                            { label: 'High match score (80%+)', value: smartFilterHighMatch, onChange: setSmartFilterHighMatch },
                            { label: 'Companies likely to respond', value: smartFilterLikelyRespond, onChange: setSmartFilterLikelyRespond },
                            { label: 'Remote-friendly companies', value: smartFilterRemoteFriendly, onChange: setSmartFilterRemoteFriendly },
                          ].map((row) => (
                            <label key={row.label} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={row.value}
                                onChange={(e) => row.onChange(e.target.checked)}
                                className="h-4 w-4"
                              />
                              <span className="text-sm text-gray-700">{row.label}</span>
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <p className="text-xs tracking-widest text-gray-400 font-bold uppercase">Job Preferences</p>

                    {/* Work Mode */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-900">Work Mode</p>
                      <div className="flex flex-wrap gap-2">
                        <Pill label="Remote" active={workMode === 'Remote'} onClick={() => setWorkMode(workMode === 'Remote' ? null : 'Remote')} />
                        <Pill label="Hybrid" active={workMode === 'Hybrid'} onClick={() => setWorkMode(workMode === 'Hybrid' ? null : 'Hybrid')} />
                        <Pill label="Office" active={workMode === 'Office'} onClick={() => setWorkMode(workMode === 'Office' ? null : 'Office')} />
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-3">
                      <SectionHeader title="Experience" open={experienceOpen} onToggle={() => setExperienceOpen((v) => !v)} />
                      {experienceOpen ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                            <span>0 Yrs</span>
                            <span>Any</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={20}
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(Number(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>
                      ) : null}
                    </div>

                    {/* Salary */}
                    <div className="space-y-3">
                      <SectionHeader title="Salary" open={salaryOpen} onToggle={() => setSalaryOpen((v) => !v)} />
                      {salaryOpen ? (
                        <div className="space-y-3">
                          {[
                            { label: '3-6 Lakhs', count: 49251 },
                            { label: '6-10 Lakhs', count: 63246 },
                            { label: '10-15 Lakhs', count: 35536 },
                            { label: '15-25 Lakhs', count: 19926 },
                          ].map((row) => (
                            <label key={row.label} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={Boolean(salaryRanges[row.label])}
                                  onChange={(e) => setSalaryRanges((prev) => ({ ...prev, [row.label]: e.target.checked }))}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm text-gray-700">{row.label}</span>
                              </span>
                              <span className="text-xs text-gray-500">{row.count}</span>
                            </label>
                          ))}
                          <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View More
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Match Score */}
                    <div className="space-y-3">
                      <SectionHeader title="Match Score" open={matchOpen} onToggle={() => setMatchOpen((v) => !v)} />
                      {matchOpen ? (
                        <div className="space-y-3">
                          {['80%+ Match', '70%+ Match', '60%+ Match'].map((label) => (
                            <label key={label} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={Boolean(matchScore[label])}
                                onChange={(e) => setMatchScore((prev) => ({ ...prev, [label]: e.target.checked }))}
                                className="h-4 w-4"
                              />
                              <span className="text-sm text-gray-700">{label}</span>
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <p className="text-xs tracking-widest text-gray-400 font-bold uppercase">Company Filters</p>

                    {/* Industry */}
                    <div className="space-y-3">
                      <SectionHeader title="Industry" open={industryOpen} onToggle={() => setIndustryOpen((v) => !v)} />
                      {industryOpen ? (
                        <div className="space-y-3">
                          {[
                            { label: 'IT Services & Consulting', count: 64428 },
                            { label: 'Software Product', count: 4255 },
                            { label: 'Recruitment / Staffing', count: 4108 },
                            { label: 'Miscellaneous', count: 1325 },
                          ].map((row) => (
                            <label key={row.label} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={Boolean(industry[row.label])}
                                  onChange={(e) => setIndustry((prev) => ({ ...prev, [row.label]: e.target.checked }))}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm text-gray-700">{row.label}</span>
                              </span>
                              <span className="text-xs text-gray-500">{row.count}</span>
                            </label>
                          ))}
                          <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View More
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Department */}
                    <div className="space-y-3">
                      <SectionHeader title="Department" open={departmentOpen} onToggle={() => setDepartmentOpen((v) => !v)} />
                      {departmentOpen ? (
                        <div className="space-y-3">
                          {[
                            { label: 'Engineering - Software', count: 74578 },
                            { label: 'Data Science & Analytics', count: 8033 },
                            { label: 'UX, Design & Architecture', count: 4939 },
                            { label: 'IT & Information Security', count: 2689 },
                          ].map((row) => (
                            <label key={row.label} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={Boolean(department[row.label])}
                                  onChange={(e) => setDepartment((prev) => ({ ...prev, [row.label]: e.target.checked }))}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm text-gray-700">{row.label}</span>
                              </span>
                              <span className="text-xs text-gray-500">{row.count}</span>
                            </label>
                          ))}
                          <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View More
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <p className="text-xs tracking-widest text-gray-400 font-bold uppercase">Location</p>

                    {/* Cities */}
                    <div className="space-y-3">
                      <SectionHeader title="Cities" open={citiesOpen} onToggle={() => setCitiesOpen((v) => !v)} />
                      {citiesOpen ? (
                        <div className="space-y-3">
                          {[
                            { label: 'Navi Mumbai', count: 990 },
                            { label: 'Panvel', count: 1 },
                            { label: 'Mumbai', count: 8540 },
                            { label: 'Bengaluru', count: 31120 },
                          ].map((row) => (
                            <label key={row.label} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={Boolean(cities[row.label])}
                                  onChange={(e) => setCities((prev) => ({ ...prev, [row.label]: e.target.checked }))}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm text-gray-700">{row.label}</span>
                              </span>
                              <span className="text-xs text-gray-500">{row.count}</span>
                            </label>
                          ))}
                          <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View More
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main results */}
              <section className="col-span-12 lg:col-span-8 xl:col-span-9">
                {/* Header + view switcher */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-out p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs tracking-widest text-[#28A8DF] font-black uppercase flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 16h2v2h-2v-2zm0-10h2v8h-2V6z"/></svg>
                        {isPersonalized ? "Elite AI Matches for your Profile" : "Recommended for you"}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 font-bold">
                        {loading ? 'Analyzing your profile…' : `Identified ${filteredJobs.length} potential career matches`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex p-1 bg-gray-100 rounded-xl">
                        <button
                          onClick={() => setDisplayMode('grid')}
                          className={`p-2 rounded-lg transition-all ${
                            displayMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Grid View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDisplayMode('list')}
                          className={`p-2 rounded-lg transition-all ${
                            displayMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="List View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-[140px] animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className={displayMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-5' : 'flex flex-col gap-5'}>
                      {filteredJobs.map((job) => {
                        const matchBadge = job.match || '80% Match'
                        const when = (job.timeAgo || job.postedDate || '').toString()
                        const skills = Array.isArray(job.skills) ? job.skills : []
                        return (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() => {
                              handleJobClick(job)
                              setViewMode('detail')
                            }}
                            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-out p-5"
                          >
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 grid place-items-center shrink-0">
                                <Image src="/perosn_icon.png" alt={job.company} width={28} height={28} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                                <p className="text-sm text-gray-500 truncate">{job.company}</p>

                                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                                  <span className="truncate">{job.location}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="font-semibold text-blue-700 truncate">{job.salary}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="truncate">{job.type}</span>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                    {job.workMode}
                                  </span>
                                  {skills.slice(0, 4).map((s, idx) => (
                                    <span
                                      key={`${job.id}-skill-${idx}`}
                                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>

                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="whitespace-nowrap">{when}</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-3 shrink-0">
                                <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                                  {matchBadge}
                                </span>
                                <span className="inline-flex items-center justify-center rounded-xl bg-[#28A8DF] px-4 py-2 text-sm font-semibold text-white">
                                  Details
                                </span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>
                </div>
              </>
            ) : null}

          {/* Main Content Area */}
          {viewMode === 'detail' ? (
            <div ref={detailsRef} className="w-full min-w-0">
              {/* Back Button */}
              <button
                onClick={handleBackToGrid}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 font-medium mb-3 sm:mb-4 md:mb-5 lg:mb-6 transition-colors"
                style={{ fontSize: "clamp(11px, 1.3vw, 14px)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "clamp(14px, 1.8vw, 20px)", height: "clamp(14px, 1.8vw, 20px)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="wrap-break-word">Back </span>
              </button>

              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 min-w-0">
                {/* Left Sidebar - Job Listings */}
                <div className="w-full lg:w-auto lg:max-w-[420px] lg:min-w-[340px] xl:max-w-[460px] xl:min-w-[360px] shrink-0 min-w-0">
                  <div
                    className="border border-white/60 p-4 sm:p-5 sticky top-1 backdrop-blur-md flex flex-col w-full max-w-full overflow-hidden"
                    style={{
                      borderRadius: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.4)",
                      height: "calc(100vh - 20px)",
                      minHeight: "1000px",
                      maxHeight: "2500px"
                    }}
                  >
                    <div className="flex items-center justify-between mb-5 px-2 shrink-0 min-w-0">
                      <h2 className="font-semibold text-gray-900 wrap-break-word flex-1 min-w-0" style={{ fontSize: "clamp(16px, 2.2vw, 22px)" }}>Most Recent Jobs</h2>
                      <span className="font-medium text-gray-500 cursor-pointer hover:text-gray-900 shrink-0 whitespace-nowrap ml-2" style={{ fontSize: "clamp(12px, 1.3vw, 15px)" }}>View All</span>
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-0 scrollbar-hide">
                      {jobListings.map(job => renderJobCard(job, true))}
                    </div>
                  </div>
                </div>

                {/* Right Content - Job Details */}
                <div className="flex-1 min-w-0">
                  {selectedJob ? (
                    <div
                      className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 backdrop-blur-md w-full max-w-full overflow-hidden"
                      style={{
                        borderRadius: "24px",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.8)",
                        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)"
                      }}
                    >
                      <div className="mb-0 min-w-0">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 gap-3 sm:gap-4 min-w-0">
                          <div className="mb-4 lg:mb-0 flex-1 min-w-0">
                            <h1 className="font-bold text-gray-900 mb-1.5 sm:mb-2 wrap-break-word" style={{ fontSize: "clamp(16px, 2.1vw, 28px)" }}>{selectedJob.title}</h1>
                            <p className="text-gray-500 mb-1 wrap-break-word" style={{ fontSize: "clamp(12px, 1.5vw, 16px)" }}>{selectedJob.company} - {selectedJob.location}</p>
                            <p className="text-gray-500 wrap-break-word" style={{ fontSize: "clamp(12px, 1.5vw, 16px)" }}>{selectedJob.salary} | {selectedJob.experienceLevel} Experience</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
                            <button onClick={handleApplyNow} className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap" style={{ fontSize: "clamp(12px, 1.3vw, 15px)" }}>
                              Apply Now
                            </button>
                            <button onClick={handleSaveJob} className="bg-white hover:bg-blue-50 text-blue-600 font-medium px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap" style={{ fontSize: "clamp(12px, 1.3vw, 15px)" }}>
                              Save Job
                            </button>
                          </div>
                        </div>

                        <div className="h-px bg-gray-200 w-full mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"></div>

                        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 min-w-0">
                          <div className="flex-1 min-w-0">
                             {/* About the Role */}
                             <section className="mb-8">
                               <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2" style={{ fontSize: "18px" }}>
                                 <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 About the Role
                               </h3>
                               <div className="space-y-4">
                                 {selectedJob.companyOverview && (
                                   <p className="text-gray-900 font-bold italic leading-relaxed" style={{ fontSize: "15px" }}>
                                     "{selectedJob.companyOverview}"
                                   </p>
                                 )}
                                 <p className="text-gray-600 leading-relaxed" style={{ fontSize: "15px", lineHeight: "1.7" }}>
                                   {selectedJob.description}
                                 </p>
                               </div>
                             </section>

                             {/* Responsibilities */}
                             <section className="mb-8">
                               <h3 className="font-bold text-gray-900 mb-4" style={{ fontSize: "18px" }}>Key Responsibilities</h3>
                               <div className="space-y-3">
                                 {selectedJob.responsibilities?.length ? selectedJob.responsibilities.map((item, idx) => (
                                   <div key={idx} className="flex items-start gap-3">
                                     <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                     <p className="text-gray-600 leading-relaxed font-medium" style={{ fontSize: "14.5px" }}>{item}</p>
                                   </div>
                                 )) : (
                                   <p className="text-gray-400 italic font-medium">Detailed responsibilities will be shared during the interview process.</p>
                                 )}
                               </div>
                             </section>

                             {/* Specialized Requirements & Education */}
                             <section className="mb-8 p-6 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontSize: "17px" }}>
                                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14v7" /><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M5.4 10.6L5 14.5l6.6 3 6.6-3-.4-3.9" /></svg>
                                 Education & Prerequisites
                               </h3>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 <div>
                                   <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">Degree Preferred</p>
                                   <p className="text-gray-900 font-bold text-sm">{(selectedJob as any).education || 'B.Tech / MCA / Equivalent'}</p>
                                 </div>
                                 <div>
                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">Experience Required</p>
                                    <p className="text-gray-900 font-bold text-sm">{selectedJob.experienceLevel}</p>
                                 </div>
                               </div>
                             </section>

                             {/* Technical Competencies */}
                             <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                  <h3 className="font-bold text-gray-900 mb-4" style={{ fontSize: "16px" }}>Core Skills</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedJob.requiredSkills?.map((skill, idx) => (
                                      <span key={idx} className="px-3 py-1.5 bg-gray-900 text-white font-bold rounded-lg shadow-sm" style={{ fontSize: "12px" }}>
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {selectedJob.niceToHaveSkills && selectedJob.niceToHaveSkills.length > 0 && (
                                  <div>
                                    <h3 className="font-bold text-gray-900 mb-4" style={{ fontSize: "16px" }}>Bonus / Tools</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedJob.niceToHaveSkills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 font-bold rounded-lg" style={{ fontSize: "12px" }}>
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                             </section>

                             {/* Benefits & Perks */}
                             <section className="mb-8">
                               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontSize: "17px" }}>
                                 <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 Benefits & Perks
                               </h3>
                               <div className="flex flex-wrap gap-3">
                                 {((selectedJob as any).benefits?.length ? (selectedJob as any).benefits : ['Health Insurance', 'Performance Bonus', 'Professional Development', 'Remote Options']).map((perk: string, i: number) => (
                                   <div key={i} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                      <span className="text-[13px] font-bold text-emerald-800">{perk}</span>
                                   </div>
                                 ))}
                               </div>
                             </section>

                             {/* Meta Information */}
                             <section className="mb-0 pt-6 border-t border-gray-100">
                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                 <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Employment</p>
                                   <p className="font-bold text-gray-900 text-sm">{selectedJob.type}</p>
                                 </div>
                                 <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Work Mode</p>
                                   <p className="font-bold text-gray-900 text-sm">{selectedJob.workMode}</p>
                                 </div>
                                 <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Priority</p>
                                   <p className="font-bold text-emerald-600 text-sm">{(selectedJob as any).priority || 'Standard'}</p>
                                 </div>
                                 <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">posted Date</p>
                                   <p className="font-bold text-gray-900 text-sm">{selectedJob.postedDate}</p>
                                 </div>
                               </div>
                             </section>

                            {/* AI Match Analysis Matrix (Global AI Assistant Integrated) */}
                            {selectedJob.reasoning || selectedJob.matchScore ? (
                              <section className="mb-8 mt-4 w-full">
                                <div 
                                  className="rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500 via-blue-400 to-emerald-400"
                                  style={{ boxShadow: "0 10px 40px -10px rgba(79, 70, 229, 0.2)" }}
                                >
                                  <div className="bg-white/95 backdrop-blur-xl rounded-[23px] overflow-hidden">
                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                      
                                      {/* Left: Score & Verdict */}
                                      <div className="w-full md:w-[240px] p-8 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50/30 to-transparent">
                                        <div className="text-[10px] font-black tracking-widest text-indigo-500 uppercase mb-4">Market Alignment</div>
                                        
                                        <div className="relative mb-6">
                                          <svg className="w-24 h-24 transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                            <circle 
                                              cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                              strokeDasharray={251.2} 
                                              strokeDashoffset={251.2 - (251.2 * (parseInt(selectedJob.match?.replace('%','') || '0') / 100))} 
                                              className="text-indigo-600 drop-shadow-sm" 
                                            />
                                          </svg>
                                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-gray-900">{selectedJob.match}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">AI FIT</span>
                                          </div>
                                        </div>

                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 ${
                                          selectedJob.confidenceTag === 'Excellent Match' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                                        }`}>
                                          {selectedJob.confidenceTag || 'Good Match'}
                                        </div>

                                        <button 
                                          onClick={() => router.push('/cveditor')}
                                          className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95"
                                        >
                                          Optimize My CV
                                        </button>
                                      </div>

                                      {/* Right: Insights & Skill Overlap */}
                                      <div className="flex-1 p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                           <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">AI Matching Insight</h4>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium italic">
                                          "{selectedJob.reasoning || "Based on your technical background and experience, you are a competitive candidate for this role. Key overlaps found in core technical stacks."}"
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                          <div>
                                            <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                               Matches
                                            </h5>
                                            <div className="flex flex-wrap gap-1.5">
                                              {(selectedJob.matchedSkills?.length ? selectedJob.matchedSkills : selectedJob.skills?.slice(0, 4)).map((s, i) => (
                                                <div key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100 flex items-center gap-1">
                                                   {s}
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          <div>
                                            <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                               Gap Risk
                                            </h5>
                                            <div className="flex flex-wrap gap-1.5">
                                              {(selectedJob.missingSkills?.length ? selectedJob.missingSkills : ['Advanced Scaling', 'System Optimization']).map((s, i) => (
                                                <div key={i} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-100">
                                                   {s}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            ) : null}
                          </div>

                          {/* Right Column: Company & Highlights */}
                          <div className="w-full xl:w-auto xl:max-w-[320px] xl:min-w-[260px] 2xl:max-w-[360px] 2xl:min-w-[280px] shrink-0 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 min-w-0">
                            {/* Company Overview Card */}
                            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 shadow-sm border border-gray-100 w-full max-w-full overflow-hidden">
                              <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 wrap-break-word" style={{ fontSize: "clamp(14px, 1.6vw, 18px)" }}>Company Overview</h3>
                              <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 wrap-break-word" style={{ fontSize: "clamp(12px, 1.4vw, 14px)", lineHeight: "1.6" }}>
                                {selectedJob.companyOverview}
                              </p>
                            </div>

                            {/* Quick Highlights Card */}
                            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 shadow-sm border border-gray-100 w-full max-w-full overflow-hidden">
                              <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6 wrap-break-word" style={{ fontSize: "clamp(14px, 1.6vw, 18px)" }}>Quick Highlights</h3>
                              <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-3 sm:gap-y-4 md:gap-y-5 lg:gap-y-6">
                                <div className="min-w-0">
                                  <p className="text-gray-500 mb-1 uppercase tracking-wide wrap-break-word" style={{ fontSize: "clamp(9px, 1vw, 12px)" }}>Experience</p>
                                  <p className="font-medium text-gray-900 wrap-break-word" style={{ fontSize: "clamp(12px, 1.4vw, 14px)" }}>{selectedJob.experienceLevel.includes('Year') ? 'Mid-Senior' : selectedJob.experienceLevel}</p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-gray-500 mb-1 uppercase tracking-wide wrap-break-word" style={{ fontSize: "clamp(9px, 1vw, 12px)" }}>Mode</p>
                                  <p className="font-medium text-gray-900 wrap-break-word" style={{ fontSize: "clamp(12px, 1.4vw, 14px)" }}>{selectedJob.workMode.split(' ')[0]}</p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-gray-500 mb-1 uppercase tracking-wide wrap-break-word" style={{ fontSize: "clamp(9px, 1vw, 12px)" }}>Visa</p>
                                  <p className="font-medium text-gray-900 wrap-break-word" style={{ fontSize: "clamp(12px, 1.4vw, 14px)" }}>{selectedJob.visaAvailability === 'Available' ? 'Available' : 'Unavailable'}</p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-gray-500 mb-1 uppercase tracking-wide wrap-break-word" style={{ fontSize: "clamp(9px, 1vw, 12px)" }}>Applicants</p>
                                  <p className="font-medium text-gray-900 wrap-break-word" style={{ fontSize: "clamp(12px, 1.4vw, 14px)" }}>{selectedJob.applicantCount}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-transparent p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 flex items-center justify-center min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] flex-col gap-3 sm:gap-4 text-center min-w-0">
                      <div className="bg-white/50 rounded-full flex items-center justify-center shrink-0" style={{ width: "clamp(48px, 6vw, 64px)", height: "clamp(48px, 6vw, 64px)" }}>
                        <svg className="text-[#9095A1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ width: "clamp(24px, 3vw, 32px)", height: "clamp(24px, 3vw, 32px)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 wrap-break-word" style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>Select a job to view details</h3>
                        <p className="text-gray-500 mt-1 wrap-break-word" style={{ fontSize: "clamp(11px, 1.3vw, 14px)" }}>Click on any job card from the list to see full requirements and apply.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          </div>
        </DashboardContainer>
      </main>

      {
        isScreeningModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pb-4 pt-24 sm:pt-28">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal} />
            <div
              className="z-10 w-full max-w-[520px] overflow-y-auto rounded-lg bg-white shadow-xl"
              style={{
                maxHeight: "calc(100vh - 140px)",
                borderRadius: "10px",
                boxShadow: "0 0 2px 0 rgba(23, 26, 31, 0.20), 0 0 1px 0 rgba(23, 26, 31, 0.07)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Screening Questions</h2>
                <p className="text-base text-gray-700 mb-1">{selectedJob.title} — {selectedJob.company}</p>
                <p className="text-sm text-gray-600 mb-2">These quick questions help us understand if you are a good fit for the role</p>
              </div>

              {/* Questions */}
              <div className="px-6 pt-2 pb-6 space-y-8">
                {/* Question 1: Experience */}
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-3">
                    Do you have at least 2 years of experience for this role?
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setExperienceAnswer('yes')}
                      className={`px-6 py-2.5 rounded-lg border-2 transition-colors ${experienceAnswer === 'yes'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                        : 'border-blue-200 bg-white text-gray-900 hover:border-blue-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setExperienceAnswer('no')}
                      className={`px-6 py-2.5 rounded-lg border-2 transition-colors ${experienceAnswer === 'no'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                        : 'border-blue-200 bg-white text-gray-900 hover:border-blue-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 2: Night Shift */}
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-3">
                    Are you willing to work in Night Shift?
                  </label>
                  <div className="relative">
                    <select
                      value={nightShiftValue}
                      onChange={(e) => setNightShiftValue(e.target.value)}
                      onFocus={() => setNightShiftFocused(true)}
                      onBlur={() => setNightShiftFocused(false)}
                      className={`w-full px-4 py-2.5 rounded-lg border-2 appearance-none bg-white text-gray-900 ${nightShiftFocused ? 'border-blue-500' : 'border-blue-200'
                        } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="maybe">Maybe</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Question 3: Excel Proficiency */}
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-3">
                    Rate your proficiency in Excel
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Beginner</span>
                      <span className="text-sm text-gray-600">Expert</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={excelProficiency}
                      onChange={(e) => setExcelProficiency(Number(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${excelProficiency}%, #e0e7ff ${excelProficiency}%, #e0e7ff 100%)`
                      }}
                    />
                    <p className="text-sm text-blue-600 font-medium">
                      Current selection: {excelProficiency < 50 ? 'Beginner' : 'Expert'}
                    </p>
                  </div>
                </div>

                {/* Question 4: Joining Availability */}
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-3">
                    How soon can you join?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Immediate', '15 Days', '30 Days', '60 Days'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setJoiningAvailability(option)}
                        className={`px-4 py-2.5 rounded-lg border-2 transition-colors ${joiningAvailability === option
                          ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                          : 'border-blue-200 bg-white text-gray-900 hover:border-blue-300'
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitScreening}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                >
                  Submit & Continue
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Application Success Modal */}
      {
        selectedJob && (
          <ApplicationSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={handleCloseSuccessModal}
            jobTitle={selectedJob.title}
            company={selectedJob.company}
            appliedDate={formatDate(new Date())}
            jobId={selectedJob.id}
          />
        )
      }

      <Footer />
    </div >
  )
}

export default DashboardPage
