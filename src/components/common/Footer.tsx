"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 font-sans">
      <div className="mx-auto max-w-[1240px] px-6 py-16">
        <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
          
          {/* Left: Brand + Social */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="inline-flex transition-opacity hover:opacity-90">
              <Image src="/SAASA%20Logo.png" alt="SAASA B2E" width={140} height={40} className="h-9 w-auto" />
            </Link>
            <p className="text-[15px] leading-relaxed font-medium">
              The modern ecosystem bridging the gap between world-class talent and leading employers through AI-driven intelligence.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition-all" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition-all" aria-label="Twitter">
                <Twitter className="w-4 h-4 text-sm" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Middle: Links Grid */}
          <div className="flex flex-wrap gap-x-16 gap-y-10 sm:gap-x-24">
            <div className="flex flex-col">
              <h4 className="font-bold text-slate-900 mb-5 tracking-tight">Platform</h4>
              <nav className="flex flex-col gap-4">
                <Link href="/explore-jobs" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Find Jobs</Link>
                <Link href="/courses" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Courses & LMS</Link>
                <Link href="/services" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Expert Services</Link>
                <Link href="/aicveditor" className="text-[15px] font-medium hover:text-sky-600 transition-colors">AI CV Tools</Link>
              </nav>
            </div>
            
            <div className="flex flex-col">
              <h4 className="font-bold text-slate-900 mb-5 tracking-tight">Company</h4>
              <nav className="flex flex-col gap-4">
                <Link href="#" className="text-[15px] font-medium hover:text-sky-600 transition-colors">About Us</Link>
                <Link href="/employers" className="text-[15px] font-medium hover:text-sky-600 transition-colors">For Employers</Link>
                <Link href="/help" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Help Center</Link>
                <Link href="#" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Contact</Link>
              </nav>
            </div>
            
            <div className="flex flex-col">
              <h4 className="font-bold text-slate-900 mb-5 tracking-tight">Legal</h4>
              <nav className="flex flex-col gap-4">
                <Link href="#" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Terms of Service</Link>
                <Link href="#" className="text-[15px] font-medium hover:text-sky-600 transition-colors">Trust & Safety</Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-[1240px] px-6 py-6 flex items-center justify-center text-center">
          <p className="text-sm font-medium">
            © {currentYear} SAASA B2E. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
