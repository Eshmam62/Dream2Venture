'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import ApplicationForm from '@/components/ApplicationForm';
import BrandLogo from '@/components/BrandLogo';

export default function PitchIdeaPage() {
  return (
    <main className="relative min-h-screen bg-[#030712] text-white overflow-hidden pt-20 sm:pt-22 pb-12 px-6">

      {/* Background Ambient Glow Orbs */}
      <div className="absolute -left-40 top-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute -right-40 top-1/3 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Persistent Fixed Floating Header matching Home Page */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between pointer-events-auto">
          {/* 1. Independent D2V Logo Pill (Exactly like Homepage) */}
          <div className="pointer-events-auto">
            <Link 
              className="inline-flex items-center justify-center px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md border hover:shadow-lg transition-all duration-300 bg-white/95 border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.12)]" 
              href="/"
            >
              <Image alt="Dream2Venture Logo" className="object-contain" height={34} priority src="/footerlogo.png" width={115}/>
            </Link>
          </div>

          {/* 2. Standalone EXIT Button on the Right */}
          <Link className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-[#0f172a] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md border border-slate-100 hover:bg-[#f35c24] hover:text-white hover:border-[#f35c24] hover:shadow-[0_6px_22px_rgba(243,92,36,0.38)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none" href="/">
            <span>EXIT</span>
            <svg
              className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HEADING & FORM CONTENT                                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-2 mt-2 sm:mt-4 mb-2 sm:mb-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Pitch Your <span className="text-[#6366f1]">Idea</span> 🚀
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-normal">
          Share your idea with us and let&apos;s turn it into real impact.
        </p>
      </div>

      {/* Form Card Container */}
      <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(99,102,241,0.2)] border border-slate-100 text-slate-900">
        <ApplicationForm />
      </div>

    </main>
  );
}
