"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Mail, AlertCircle, Sparkles, TrendingUp, CheckCircle2, Star } from "lucide-react";

import { API_BASE_URL } from '@/lib/api-base';

const countries = [
  { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
];

export default function WhatsAppLogin() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [whatsappNumberValue, setWhatsappNumberValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpDisplay, setOtpDisplay] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpDisplay("");

    // Validation
    if (!whatsappNumberValue.trim()) {
      setError("Please enter your WhatsApp number");
      return;
    }

    if (!emailValue.trim()) {
      setError("Please enter your Gmail address");
      return;
    }

    const normalizedEmail = emailValue.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(normalizedEmail)) {
      setError("Please enter a valid Gmail address");
      return;
    }

    const cleanNumber = whatsappNumberValue.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      setError("Please enter a valid WhatsApp number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          whatsappNumber: cleanNumber,
          countryCode: selectedCountry.dialCode,
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Store WhatsApp number and country code in sessionStorage for verify page
      sessionStorage.setItem("whatsappNumber", cleanNumber);
      sessionStorage.setItem("countryCode", selectedCountry.dialCode);
      sessionStorage.setItem("fullWhatsAppNumber", `${selectedCountry.dialCode}${cleanNumber}`);
      sessionStorage.setItem("otpEmail", normalizedEmail);

      // In development, show OTP on screen
      if (data.data.otp) {
        setOtpDisplay(data.data.otp);
        sessionStorage.setItem("otpPreview", data.data.otp);
      } else {
        sessionStorage.removeItem("otpPreview");
      }

      // Navigate to verify page
      router.push("/whatsapp/verify");
    } catch (err: unknown) {
      const isNetworkFail =
        err instanceof TypeError &&
        (err.message === "Failed to fetch" || err.message.includes("fetch"));
      setError(
        isNetworkFail
          ? `Cannot reach the API (${API_BASE_URL}). Start the backend on port 5000.`
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      );
      console.error("Error sending OTP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.12)_0%,rgba(255,255,255,0)_70%)] opacity-80" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.06)_0%,rgba(255,255,255,0)_70%)] opacity-80" />
      </div>

      {/* Header (Cleaned up, no floating Help) */}
      <header className="flex flex-none items-center justify-between px-8 py-8 relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Image
            src="/SAASA%20Logo.png"
            alt="SAASA B2E"
            width={130}
            height={38}
            className="h-9 w-auto hover:opacity-90 transition-opacity"
          />
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center relative z-10 w-full max-w-[1440px] px-6 lg:px-16 pb-16 mx-auto gap-12 lg:gap-20">
        
        {/* LEFT COMPONENT: The Card Shell */}
        <div className="w-full lg:w-[480px] flex flex-col items-center lg:items-end z-10">
          
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_24px_60px_rgba(0,0,0,0.04)] border border-slate-100/80 p-8 sm:p-12 relative overflow-visible">
            
            <div className="mb-8 text-center">
              <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
                Create your account
              </h1>
              <p className="mt-3 text-[15px] font-medium text-slate-500 leading-relaxed px-2">
                Enter your standard contact details safely. We'll send a code to your email.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSendOTP}>
              
              {/* WhatsApp number input group */}
              <div>
                <label className="block text-[12px] font-black text-slate-700 uppercase tracking-widest mb-2 ml-1">WhatsApp Number</label>
                <div className="flex relative rounded-[16px] border border-slate-200 shadow-sm overflow-visible bg-white focus-within:ring-4 focus-within:ring-sky-100/50 focus-within:border-sky-400 transition-all">
                  
                  {/* Country Dropdown trigger inside input */}
                  <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                      type="button"
                      className="flex h-[56px] px-4 items-center gap-2 hover:bg-slate-50 transition-colors rounded-l-[16px] text-slate-700 font-medium text-[15px]"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className="text-[22px] leading-none">{selectedCountry.flag}</span>
                      <span className="text-slate-400 text-[10px] ml-1">▼</span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[240px] max-h-[300px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] py-2">
                        {countries.map((country) => (
                          <div
                            key={country.code}
                            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                            onClick={() => handleCountrySelect(country)}
                          >
                            <span className="text-[20px] leading-none">{country.flag}</span>
                            <span className="font-bold text-slate-800 w-12 text-[14px]">{country.dialCode}</span>
                            <span className="text-[13px] font-semibold text-slate-600 truncate">{country.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Divider inside input */}
                  <div className="w-px h-7 bg-slate-200 my-auto" />

                  {/* Input itself */}
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-0 bottom-0 flex items-center text-slate-400 pointer-events-none font-semibold text-[15px]">
                      {selectedCountry.dialCode}
                    </div>
                    <input
                      type="tel"
                      value={whatsappNumberValue}
                      onChange={(e) => setWhatsappNumberValue(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-[56px] pl-[56px] pr-4 bg-transparent outline-none text-slate-900 font-bold text-[16px] placeholder:text-slate-300 placeholder:font-semibold rounded-r-[16px]"
                      placeholder="Mobile number"
                    />
                  </div>
                </div>
              </div>

              {/* Email input group */}
              <div>
                <label className="block text-[12px] font-black text-slate-700 uppercase tracking-widest mb-2 ml-1">Gmail Address</label>
                <div className="relative rounded-[16px] border border-slate-200 shadow-sm overflow-hidden bg-white focus-within:ring-4 focus-within:ring-sky-100/50 focus-within:border-sky-400 transition-all">
                  <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    className="w-full h-[56px] pl-[52px] pr-4 bg-transparent outline-none text-slate-900 font-bold text-[16px] placeholder:text-slate-300 placeholder:font-semibold"
                    placeholder="name@gmail.com"
                  />
                </div>
              </div>

              {/* Errors */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex gap-3 items-start mt-4">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[13px] font-bold text-red-700 leading-snug pt-0.5">{error}</p>
                </div>
              )}

              {/* Dev Mode OTP */}
              {otpDisplay && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 mt-4">
                  <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-3">Development Mode</p>
                  <div className="flex items-center gap-4">
                    <span className="bg-white border border-emerald-200 text-emerald-800 font-mono font-black text-xl px-4 py-2 rounded-xl shadow-sm tracking-[0.2em]">
                      {otpDisplay}
                    </span>
                    <p className="text-[13px] font-semibold text-emerald-700 leading-snug flex-1">
                      OTP delivery bypassed.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] flex justify-center items-center gap-2 rounded-[16px] bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-black text-[15px] shadow-[0_8px_16px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_24px_rgba(14,165,233,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 hover:-translate-y-0.5 transform"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending code...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Trust Strip */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="text-[13px] font-bold text-slate-500 tracking-tight">
                Secure passwordless entry
              </p>
            </div>

          </div>
          
          {/* Help & Terms Restructured Below */}
          <div className="mt-8 flex flex-col items-center lg:items-end w-full max-w-[440px] gap-3 px-2">
            <a href="#" className="text-[14px] font-bold text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1.5 hover:underline decoration-sky-300 underline-offset-4">
              Need help entering?
            </a>
            <p className="text-center lg:text-right text-[13px] font-semibold text-slate-400 leading-relaxed max-w-[320px]">
              By continuing, you agree to our <a href="#" className="text-slate-600 hover:text-sky-600 transition-colors">Terms of Service</a> & <a href="#" className="text-slate-600 hover:text-sky-600 transition-colors">Privacy Policy</a>
            </p>
          </div>

        </div>

        {/* RIGHT COMPONENT: Visual Storytelling */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-start relative pl-12 pr-6 z-10 lg:mt-[-40px]">
          
          <div className="w-full max-w-[540px] relative">
            {/* Atmospheric Glow behind cards */}
            <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-200/40 blur-[100px] rounded-full pointer-events-none" />

            <h2 className="text-[40px] font-black text-slate-900 tracking-tight leading-[1.1] mb-5 relative z-10 drop-shadow-sm">
              Enter the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-300">intelligent era</span><br />of hiring.
            </h2>
            <p className="text-[18px] font-medium text-slate-500 leading-relaxed mb-16 relative z-10 max-w-[420px]">
              Our OS builds your AI profile, validates your experience, and matches you with top-tier opportunities instantly.
            </p>

            <div className="relative w-full h-[320px]">
              
              {/* Card 1: ATS Match Score (Dark Mode) */}
              <div className="absolute top-0 left-0 w-[240px] bg-slate-900 shadow-[0_20px_40px_rgba(15,23,42,0.2)] rounded-[24px] p-6 text-white z-20 border border-slate-700/50 transform hover:-translate-y-2 transition-transform duration-500">
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1.5 rounded-full text-slate-300">ATS Match</span>
                 </div>
                 <p className="text-[46px] font-black leading-none mb-1 tracking-tighter">94<span className="text-[24px] text-slate-400 font-bold ml-1">%</span></p>
                 <p className="text-[14px] font-semibold text-slate-400">Exceptional Fit Profile</p>
              </div>

              {/* Card 2: Skill Engine (Glassmorphism overlap) */}
              <div className="absolute top-[50px] left-[180px] w-[300px] bg-white/95 backdrop-blur-xl border border-slate-100/80 shadow-[0_24px_50px_rgba(0,0,0,0.06)] rounded-[24px] p-6 z-10 transform hover:-translate-y-1 transition-transform duration-500">
                 <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center border border-sky-100">
                       <Sparkles className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Extraction</p>
                       <p className="text-[16px] font-black text-slate-800 tracking-tight leading-none">Skills Validated</p>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-[13px] font-bold text-slate-700">React</span>
                    <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-[13px] font-bold text-slate-700">TypeScript</span>
                    <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-[13px] font-bold text-slate-700">Node</span>
                    <span className="bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg text-[13px] font-black">+12</span>
                 </div>
              </div>

              {/* Card 3: Profile Strength Signal */}
              <div className="absolute bottom-[20px] left-[40px] w-[340px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-[20px] p-5 z-30 flex items-center gap-5 transform hover:scale-[1.02] transition-transform duration-500">
                 <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shrink-0">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-1.5">
                         <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                         <span className="text-[13px] font-black text-slate-800 tracking-tight">Top 5% Candidate</span>
                       </div>
                       <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-right shrink-0">Strong</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[95%] rounded-full shadow-sm" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
          
        </div>

      </main>
    </div>
  );
}
