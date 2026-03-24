"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { API_BASE_URL } from "@/lib/api-base";
import { 
  Search, MapPin, ChevronRight, PlayCircle, Star, ArrowRight, CheckCircle2, 
  Sparkles, Award, FileText, Target, Mic2, UploadCloud, Zap, Clock, Briefcase, 
  Map, UserRound, GraduationCap, ArrowUpRight, Building
} from "lucide-react";
import { SERVICES } from "@/app/services/data/services"; 

// ----------------------------------------------------------------------
// 1. TYPES & HELPERS
// ----------------------------------------------------------------------
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  workStyle: string; // Remote, Hybrid, Onsite
  type: string;
  salary: string;
  match: string;
  timeAgo: string;
  logo: string;
  experience: string;
}

const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const postedDate = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - postedDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Just now';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return `${Math.floor(diffInDays / 30)}mo ago`;
};

const formatSalary = (min: number | null, max: number | null, currency: string | null, type: string | null): string => {
  if (!min && !max) return 'Salary unspecified';
  const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency || '$';
  const typeLabel = type === 'ANNUAL' ? '/yr' : '/mo';
  
  if (min && max) return `${sym}${(min/1000)}k - ${sym}${(max/1000)}k${typeLabel}`;
  if (min) return `${sym}${(min/1000)}k+${typeLabel}`;
  return `${sym}${(max!/1000)}k${typeLabel}`;
};

// ----------------------------------------------------------------------
// 2. AUTH INTERCEPT MODAL
// ----------------------------------------------------------------------
function AuthInterceptModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  redirectUrl 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  title: string;
  description: string;
  redirectUrl: string;
}) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleContinue = () => {
    sessionStorage.setItem("postLoginRedirect", redirectUrl);
    router.push("/whatsapp");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-[24px] bg-white shadow-2xl ring-1 ring-slate-900/5 transition-all outline-none" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 mb-5">
            <svg className="h-7 w-7 text-sky-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-center text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h2>
          <p className="text-center text-[15px] font-medium text-slate-500 mb-8 leading-relaxed">{description}</p>
          
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#28A8DF] py-3.5 px-4 text-[15px] font-semibold text-white shadow-sm hover:bg-[#1f97cb] transition-all"
            >
              Continue with WhatsApp
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-xl py-3.5 px-4 text-[15px] font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default function LandingPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authConfig, setAuthConfig] = useState({ title: "", description: "", redirectUrl: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("candidateId"));
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await fetch(`${API_BASE_URL}/jobs?limit=6`);
      if (res.ok) {
        const result = await res.json();
        const rawJobs = result?.data?.jobs || result?.data?.data || result?.data?.items || [];
        
        if (rawJobs.length > 0) {
          const formatted = rawJobs.slice(0, 6).map((job: any) => ({
            id: job.id || job._id,
            title: job.title || 'Job Title',
            company: job.client?.companyName || job.company || 'Company Name',
            location: job.location || 'Location not specified',
            workStyle: job.location?.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
            type: job.type === 'FULL_TIME' ? 'Full-time' : job.type === 'CONTRACT' ? 'Contract' : 'Part-time',
            salary: formatSalary(job.salary?.min ?? job.salaryMin, job.salary?.max ?? job.salaryMax, null, null),
            match: `${Math.floor(Math.random() * 10) + 85}% Match`,
            timeAgo: formatTimeAgo(job.postedDate || new Date()),
            experience: 'Mid-Senior level',
            logo: job.client?.logo || job.companyLogo || '',
          }));
          setJobs(formatted);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch jobs for homepage", err);
    } finally {
      setLoadingJobs(false);
    }
    
    // Fallback Mock Jobs
    if (jobs.length === 0 && !loadingJobs) {
      setJobs([
        { id: '1', title: 'Senior Frontend Engineer', company: 'TechNova', location: 'San Francisco, CA', workStyle: 'Remote', type: 'Full-time', salary: '$120k - $150k/yr', match: '94% Match', timeAgo: '2h ago', experience: 'Senior level', logo: '' },
        { id: '2', title: 'Product Manager', company: 'BuildIn', location: 'Austin, TX', workStyle: 'Hybrid', type: 'Full-time', salary: '$110k - $140k/yr', match: '88% Match', timeAgo: '5h ago', experience: 'Mid level', logo: '' },
        { id: '3', title: 'Machine Learning Engineer', company: 'Quant AI', location: 'New York, NY', workStyle: 'Onsite', type: 'Full-time', salary: '$140k - $180k/yr', match: '85% Match', timeAgo: '1d ago', experience: 'Senior level', logo: '' },
        { id: '4', title: 'Lead UX Designer', company: 'Creative Labs', location: 'Seattle, WA', workStyle: 'Remote', type: 'Contract', salary: '$80k+ /yr', match: '96% Match', timeAgo: '1d ago', experience: 'Director level', logo: '' },
        { id: '5', title: 'DevOps Engineer', company: 'CloudStream', location: 'Austin, TX', workStyle: 'Hybrid', type: 'Full-time', salary: '$115k - $145k/yr', match: '81% Match', timeAgo: '2d ago', experience: 'Mid level', logo: '' },
        { id: '6', title: 'Marketing Operations', company: 'Growthly', location: 'Chicago, IL', workStyle: 'Remote', type: 'Full-time', salary: '$90k - $120k/yr', match: '89% Match', timeAgo: '3d ago', experience: 'Associate level', logo: '' },
      ]);
    }
  };

  const triggerGatedAction = (title: string, description: string, redirectUrl: string) => {
    if (isLoggedIn) {
      router.push(redirectUrl);
    } else {
      setAuthConfig({ title, description, redirectUrl });
      setIsAuthModalOpen(true);
    }
  };

  const [heroSearch, setHeroSearch] = useState({ title: '', location: '' });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.title.trim() || heroSearch.location.trim()) {
      const q = new URLSearchParams();
      if (heroSearch.title) q.append("q", heroSearch.title);
      router.push(`/explore-jobs?${q.toString()}`);
    } else {
      router.push('/explore-jobs');
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#FCFDFE] flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION WITH REAL SEARCH */}
        {/* ========================================================= */}
        <section className="relative pt-6 pb-24 lg:pt-10 lg:pb-32 overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute top-0 right-0 -mr-[30%] -mt-[10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(40,168,225,0.06)_0,rgba(255,255,255,0)_60%)] pointer-events-none" />
          
          <div className="relative z-10 mx-auto max-w-[1240px] px-6">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">
              
              <div className="max-w-2xl pt-2 text-center sm:text-left mx-auto sm:mx-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 mb-6 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                  AI-Powered Career OS
                </div>
                
                <h1 className="text-[2.75rem] sm:text-5xl lg:text-[4rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                  Search jobs.<br/>
                  Understand your fit.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28A8DF] to-indigo-600">
                    Grow your career.
                  </span>
                </h1>
                
                <p className="text-lg lg:text-[19px] text-slate-600 mb-10 max-w-[36rem] leading-relaxed font-medium mx-auto sm:mx-0">
                  Skip the guesswork. Our platform matches you to the right roles instantly, reveals your exact ATS score, and suggests AI-driven skill paths so you always land the offer.
                </p>

                {/* Hero Search Box */}
                <form onSubmit={handleSearchSubmit} className="bg-white rounded-[24px] p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-200 mb-6 flex flex-col sm:flex-row gap-2 relative z-20">
                  <div className="flex-1 flex items-center bg-slate-50/70 rounded-[16px] px-4 py-3.5 border border-transparent focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-50 focus-within:border-sky-200 transition-all">
                    <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Job title, skills, or company" 
                      className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-semibold text-[15px]"
                      value={heroSearch.title}
                      onChange={e => setHeroSearch({...heroSearch, title: e.target.value})}
                    />
                  </div>
                  <div className="flex-[0.8] items-center bg-slate-50/70 rounded-[16px] px-4 py-3.5 border border-transparent focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-50 focus-within:border-sky-200 transition-all hidden sm:flex border-l border-slate-200/50 sm:border-none">
                    <MapPin className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="City or Remote" 
                      className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-semibold text-[15px]"
                      value={heroSearch.location}
                      onChange={e => setHeroSearch({...heroSearch, location: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="bg-[#28A8DF] hover:bg-sky-500 text-white rounded-[16px] px-8 py-3.5 font-bold transition-all flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-[0.98]">
                    Search Jobs
                  </button>
                </form>

                <div className="flex flex-wrap flex-col sm:flex-row items-center sm:items-center gap-3 justify-center sm:justify-start">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Popular:</span>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {['Software Engineer', 'Product Manager', 'Remote', 'Data Science'].map(tag => (
                      <button key={tag} type="button" onClick={() => router.push(`/explore-jobs?q=${tag}`)} className="text-[13px] font-semibold bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-full transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hero Premium UI Showcase (Right side) */}
              <div className="relative hidden lg:flex h-[520px] items-center justify-center mt-4">
                {/* Background decorative blob */}
                <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-sky-400/20 to-indigo-500/15 rounded-full blur-[80px]" />
                
                {/* Main Product Card */}
                <div className="absolute right-0 w-[420px] rounded-[24px] bg-white border-[1.5px] border-slate-200/70 shadow-[0_24px_50px_rgba(15,23,42,0.08)] p-7 z-20 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)] transition-shadow duration-500">
                  <div className="border-b border-slate-100 pb-5 mb-5 space-y-1">
                     <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">AI Profile Scan</p>
                     <h3 className="font-bold text-slate-900 text-[19px] tracking-tight">Senior React Engineer</h3>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-[16px] bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
                         <span className="text-[22px] font-black tracking-tighter">94<span className="text-xs">&nbsp;%</span></span>
                       </div>
                       <div>
                         <p className="text-[14px] font-bold text-slate-900">Exceptional Fit</p>
                         <p className="text-[12px] font-medium text-slate-500">Based on 14 criteria points</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="bg-slate-50/80 p-3.5 rounded-[16px] border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500"/> 
                        <span className="text-[14px] font-semibold text-slate-700 tracking-tight">React Performance</span>
                      </div>
                      <span className="text-emerald-700 text-[12px] font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/50">+15 pts</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-[16px] shadow-sm border border-slate-200/70 flex items-center justify-between relative overflow-hidden ring-1 ring-amber-500/10">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                      <div className="flex items-center gap-3 pl-1">
                        <div className="w-4 h-4 rounded-full border-[2.5px] border-amber-300 border-t-amber-500 animate-spin" />
                        <span className="text-[14px] font-semibold text-slate-800 tracking-tight">GraphQL Mutators</span>
                      </div>
                      <span className="text-amber-700 text-[12px] font-bold bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/50">Missing</span>
                    </div>
                    <div className="bg-slate-50/80 p-3.5 rounded-[16px] border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500"/> 
                        <span className="text-[14px] font-semibold text-slate-700 tracking-tight">TypeScript Patterns</span>
                      </div>
                      <span className="text-emerald-700 text-[12px] font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/50">+10 pts</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => triggerGatedAction("Access AI Analyzer", "Sign in to securely upload and analyze your real CV against live job descriptions.", "/aicveditor")}
                    className="w-full rounded-[16px] bg-slate-900 hover:bg-slate-800 text-white py-3.5 font-bold text-[14px] shadow-md transition-all flex items-center justify-center gap-2 group">
                    <UploadCloud className="w-4 h-4 text-sky-400 group-hover:-translate-y-0.5 transition-transform" /> Measure Your CV Now
                  </button>
                </div>

                {/* Floating Notification */}
                <div className="absolute top-16 -left-20 w-[300px] rounded-[20px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_12px_40px_rgba(15,23,42,0.1)] p-5 z-30 animate-in slide-in-from-bottom-5 duration-1000 delay-300 hidden xl:block ring-1 ring-black/5">
                  <div className="flex gap-4">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2 h-max shrink-0">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1.5">AI Insight</p>
                      <p className="text-[13px] font-semibold text-slate-800 leading-snug tracking-tight">Adding <span className="bg-indigo-100 text-indigo-800 px-1 rounded-md border border-indigo-200">GraphQL</span> to your profile increases your interview rate by 34%.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PUBLIC LIVE JOBS / TRENDING SECTION */}
        {/* ========================================================= */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1240px] px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Live Opportunities</h2>
                <p className="text-slate-500 text-lg font-medium">Real-time roles actively hiring through our ecosystem. Ready for your profile.</p>
              </div>
              <button 
                onClick={() => router.push('/explore-jobs')}
                className="group flex flex-shrink-0 items-center justify-center gap-2 bg-white border border-slate-200 text-[#28A8DF] font-bold text-[15px] px-6 py-3.5 rounded-2xl hover:bg-[#28A8DF] hover:border-transparent hover:text-white transition-all shadow-sm w-full md:w-auto"
              >
                Browse 10k+ roles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div 
                  key={job.id} 
                  onClick={() => router.push(`/explore-jobs`)}
                  className="bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-xl hover:-translate-y-1 hover:border-sky-300 transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-2.5 group-hover:shadow-md transition-shadow">
                        {job.logo ? (
                          <Image src={job.logo} alt={job.company} width={40} height={40} className="object-contain" />
                        ) : (
                          <Building className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-exrabold text-[17px] text-slate-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-1 font-bold">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-[13px] font-medium text-slate-500 mt-1">
                          <span className="font-semibold text-slate-700">{job.company}</span>
                          <span className="mx-2 w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="flex items-center text-slate-600 bg-slate-50 border border-slate-100 text-[12px] px-2.5 py-1.5 rounded-lg font-semibold">
                      <Map className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.workStyle}
                    </span>
                    <span className="flex items-center text-slate-600 bg-slate-50 border border-slate-100 text-[12px] px-2.5 py-1.5 rounded-lg font-semibold">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.type}
                    </span>
                    <span className="flex items-center text-slate-600 bg-slate-50 border border-slate-100 text-[12px] px-2.5 py-1.5 rounded-lg font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.timeAgo}
                    </span>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Salary</p>
                      <span className="font-extrabold text-[16px] text-slate-800">{job.salary}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerGatedAction(
                          "Verify Identity to Apply", 
                          `Secure your application to ${job.company}. We'll route you right back to this job after you sign in.`,
                          "/explore-jobs"
                        );
                      }}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* POLISHED AI INTERFACE SECTION */}
        {/* ========================================================= */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-[1240px] px-6 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl lg:text-[42px] font-black text-slate-900 mb-6 tracking-tight leading-tight">
                Preview the invisible filters. <br/>
                <span className="text-[#28A8DF]">Beat the ATS algorithm.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                Our suite of intelligent tools reads your resume exactly like enterprise hiring software does, exposing the exact gaps holding you back before you hit apply.
              </p>
            </div>

            {/* Alternating Feature Showcases */}
            <div className="space-y-20 lg:space-y-24">
              
              {/* Feature 1: The ATS Scanner Simulation */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 relative rounded-[24px] bg-slate-50 border border-slate-200 p-8 shadow-inner overflow-hidden h-full min-h-[380px] flex items-center">
                   {/* Background Setup */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                  
                  <div className="bg-white rounded-[20px] border border-slate-200 shadow-xl p-7 relative z-10 w-full">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-full border-[3px] border-slate-100 border-t-emerald-500 animate-spin flex items-center justify-center shrink-0"></div>
                      <div>
                         <p className="text-[15px] font-bold text-slate-900">Scanning Resume Integrity...</p>
                         <p className="text-[13px] font-semibold text-slate-500">Cross-referencing 10,402 JDs</p>
                      </div>
                    </div>
                    <div className="space-y-4 opacity-70 mb-6">
                      <div className="h-3.5 bg-slate-100 rounded-md w-[85%]"></div>
                      <div className="h-3.5 bg-slate-100 rounded-md w-[60%]"></div>
                      <div className="h-3.5 bg-slate-100 rounded-md w-[90%]"></div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100/60 rounded-xl p-4 flex gap-3 align-start">
                      <Target className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[14px] font-semibold text-rose-900 leading-snug">Action verbs are weak in 3 roles. Consider swapping "helped" with <span className="underline decoration-rose-300">architected</span> or <span className="underline decoration-rose-300">spearheaded</span>.</p>
                    </div>
                  </div>
                </div>
                
                <div className="order-1 lg:order-2 pl-0 lg:pl-10">
                  <div className="w-14 h-14 bg-sky-50 text-[#28A8DF] rounded-[16px] border border-sky-100 flex items-center justify-center mb-8 shadow-sm">
                    <Target strokeWidth={2.5} className="w-6 h-6" />
                  </div>
                  <h3 className="text-[32px] font-bold text-slate-900 mb-6 tracking-tight leading-tight">X-Ray your application</h3>
                  <p className="text-lg text-slate-500 leading-relaxed mb-8 font-medium">
                    Stop applying blindly. Get an instant compatibility health score covering exact formatting errors, readability issues, and the weak action verbs costing you interviews.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {['Detects invisible formatting triggers', 'Quantifies bullet point strength', 'Industry-specific benchmarking'].map((t,i) => (
                      <li key={i} className="flex items-center font-bold text-slate-700 text-[15px]">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0"/> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 2: Keyword Magic Simulation */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="pr-0 lg:pr-10">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-[16px] flex items-center justify-center mb-8 shadow-sm">
                    <FileText strokeWidth={2.5} className="w-6 h-6" />
                  </div>
                  <h3 className="text-[32px] font-bold text-slate-900 mb-6 tracking-tight leading-tight">Bridge the keyword gap</h3>
                  <p className="text-lg text-slate-500 leading-relaxed mb-8 font-medium">
                    Our AI cross-references your experience against specific job descriptions to uncover exact missing keywords, and automatically refactors your resume to naturally include them.
                  </p>
                  <button 
                    onClick={() => triggerGatedAction("Access CV Editor", "Log in to use the AI CV Editor and rewrite your resume.", "/aicveditor")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-[15px] font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 group transition-all"
                  >
                    Try the AI Editor <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="relative rounded-[24px] bg-slate-900 border border-slate-800 p-8 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-center">
                  <div className="flex items-center gap-2.5 mb-8">
                     <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <div className="text-slate-300 font-mono text-[13px] leading-relaxed space-y-6">
                     <p>
                       <span className="text-rose-400 line-through opacity-70">- Built web application for handling user data securely.</span>
                     </p>
                     <p className="flex items-start">
                       <span className="text-emerald-400 mr-3 mt-0.5">+</span>
                       <span className="text-emerald-100 font-semibold bg-emerald-500/10 py-2.5 px-3 rounded-xl border border-emerald-500/20 leading-relaxed">
                         Architected a scalable web application utilizing <span className="text-white bg-indigo-500/30 px-1 rounded border-b border-indigo-400">Node.js</span> and <span className="text-white bg-indigo-500/30 px-1 rounded border-b border-indigo-400">OAuth</span>, securely processing user data while reducing latency by 40%.
                       </span>
                     </p>
                  </div>
                  <div className="absolute top-6 right-6 bg-indigo-500/20 text-indigo-300 font-bold text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-indigo-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> AI Refactoring
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LMS / CAREER GROWTH TEASER */}
        {/* ========================================================= */}
        <section className="py-24 bg-slate-900 text-white relative">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
          
          <div className="relative z-10 mx-auto max-w-[1240px] px-6">
            <div className="grid lg:grid-cols-[450px_1fr] gap-16 items-center">
              
              <div>
                <div className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-sky-300 mb-8 shadow-sm">
                  <GraduationCap className="mr-2 h-4 w-4" /> Integrated Upskilling
                </div>
                <h2 className="text-[36px] lg:text-[44px] font-black mb-6 tracking-tight leading-[1.05]">Turn rejections <br/>into roadmaps.</h2>
                <p className="text-slate-300 text-[18px] leading-relaxed mb-10 font-medium">
                  We don't just tell you what you're missing. We give you the structured learning path to acquire it. Access targeted technical courses and interview prep effortlessly.
                </p>
                
                <button 
                  onClick={() => router.push('/lms')}
                  className="bg-white text-slate-900 font-bold px-8 py-4 rounded-[16px] hover:bg-sky-50 hover:text-[#28A8DF] transition-all inline-flex items-center gap-2 shadow-xl shadow-white/5 active:scale-95 text-[15px]"
                >
                  Browse Course Library <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Polished Course Cards Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "React Patterns for Interviews", tag: "Intermediate", icon: PlayCircle, color: "text-blue-400", bg: "bg-blue-500/10", border: 'border-blue-500/20' },
                  { title: "System Design Frameworks", tag: "Advanced", icon: Target, color: "text-rose-400", bg: "bg-rose-500/10", border: 'border-rose-500/20' },
                  { title: "Storytelling for PMs", tag: "Beginner", icon: Mic2, color: "text-amber-400", bg: "bg-amber-500/10", border: 'border-amber-500/20' },
                  { title: "Resume Teardowns", tag: "Workshop", icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10", border: 'border-emerald-500/20' },
                ].map((course, idx) => (
                  <div key={idx} className={`bg-slate-800/40 border ${course.border} rounded-[24px] p-7 backdrop-blur-md hover:bg-slate-800 transition-all cursor-pointer group`}
                       onClick={() => triggerGatedAction("Start Learning", "Sign in to access premium courses, track your progress, and join live workshops.", "/lms")}>
                    <div className="flex justify-between items-start mb-10">
                      <div className={`w-14 h-14 rounded-[16px] ${course.bg} ${course.color} flex items-center justify-center`}>
                        <course.icon className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">{course.tag}</span>
                    </div>
                    <h4 className="font-bold text-[18px] text-white flex items-start justify-between group-hover:text-blue-300 transition-colors pr-2">
                      <span className="leading-snug">{course.title}</span>
                      <ArrowUpRight className="w-5 h-5 ml-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 shrink-0"/>
                    </h4>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PREMIUM SERVICES TEASER */}
        {/* ========================================================= */}
        <section className="py-24 bg-[#FCFDFE] border-b border-slate-100">
          <div className="mx-auto max-w-[1240px] px-6">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-[32px] lg:text-[40px] font-black text-slate-900 tracking-tight mb-4">Executive-level support.</h2>
                <p className="text-slate-500 text-[18px] font-medium leading-relaxed">When algorithms aren't enough, connect with verified industry leaders for personalized resume rewriting and mock interviews.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {SERVICES.slice(0, 3).map((service) => (
                <div key={service.id} className="bg-white border border-slate-200 rounded-[24px] p-8 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden group"
                     onClick={() => router.push('/services')}>
                  {/* Decorative background shape */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-slate-900 text-white shadow-md">
                      {service.iconKey === 'scan-search' ? <Search className="w-6 h-6" /> : 
                       service.iconKey === 'file-pen-line' ? <FileText className="w-6 h-6" /> : 
                       <Target className="w-6 h-6" />}
                    </span>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border border-indigo-100">1-on-1 Expert</span>
                  </div>
                  <h3 className="font-black text-[22px] tracking-tight text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-500 text-[15px] font-medium leading-relaxed mb-10 flex-1">{service.shortDescription}</p>
                  
                  <div className="mt-auto border-t border-slate-100 pt-6 flex items-center justify-between font-bold text-slate-900">
                     <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-[13px]">From $49</span>
                     <span className="flex items-center text-[14px] text-slate-600 group-hover:text-indigo-600 transition-colors">Details <ArrowRight className="w-4 h-4 ml-1.5" /></span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
               <button 
                  onClick={() => router.push('/services')}
                  className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-2xl font-bold text-[15px] shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all inline-flex items-center gap-2"
                >
                  Explore all executive services
               </button>
            </div>
          </div>
        </section>



        {/* ========================================================= */}
        {/* FINAL CTA ENCOURAGEMENT */}
        {/* ========================================================= */}
        <section className="py-32 bg-slate-900 relative portrait:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
            <div className="w-16 h-16 mx-auto bg-sky-500 rounded-[18px] flex items-center justify-center mb-8 shadow-2xl shadow-sky-500/50 rotate-3 border border-sky-400">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[36px] lg:text-[52px] font-black text-white tracking-tight leading-[1.1] mb-6">
              Ready to take control <br className="hidden md:block"/>of your hiring journey?
            </h2>
            <p className="text-[18px] text-slate-400 mb-12 max-w-[40rem] mx-auto font-medium leading-relaxed">
              Start exploring thousands of open positions instantly. When you're ready to apply or benchmark your resume against the market, our AI takes over to ensure you stand out.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => router.push('/explore-jobs')}
                className="w-full sm:w-auto bg-[#28A8DF] text-white px-8 py-4 rounded-2xl font-bold text-[16px] hover:bg-sky-500 transition-colors shadow-xl shadow-sky-500/20 active:scale-95 flex justify-center items-center"
              >
                Search Live Jobs
              </button>
              <button 
                onClick={() => triggerGatedAction("Start AI Analysis", "Register or sign in to upload your CV and receive instant platform insights.", "/uploadcv")}
                className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-[16px] hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 active:scale-95"
               >
                 <UploadCloud className="w-5 h-5"/> Upload CV for AI Scan
               </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Global Gated Action Modal */}
      <AuthInterceptModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        title={authConfig.title}
        description={authConfig.description}
        redirectUrl={authConfig.redirectUrl}
      />
    </div>
  );
}
