'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'what-we-offer', label: 'What We Offer' },
  { id: 'who-can-apply', label: 'Who Can Apply' },
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Toggle capsule background style
      setIsScrolled(window.scrollY > 80);

      // Top of page (Hero section)
      if (window.scrollY < 250) {
        setActiveSection('');
        return;
      }

      // Check which section intersects the central trigger line (viewport top + 200px)
      const triggerPoint = 220;
      let currentActive = '';

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active if top is above trigger line and bottom is still below trigger line
          if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
            currentActive = item.id;
            break;
          }
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const capsuleStyle = isScrolled
    ? 'bg-[#f1f5f9]/95 border-slate-300 shadow-[0_8px_25px_rgba(15,23,42,0.12)]'
    : 'bg-white/95 border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.12)]';

  return (
    <section className="relative w-full min-h-screen bg-black text-slate-900 overflow-hidden flex flex-col justify-center pt-28 sm:pt-32 px-6 sm:px-12">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-black">
        <video
          ref={videoRef}
          src="/heros1.mp4"
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={(e) => {
            e.currentTarget.pause();
          }}
          className="w-full h-full object-cover object-center opacity-100 brightness-100 contrast-100"
        />
      </div>
      {/* Persistent Fixed Floating Header with Enhanced Elevation Shadow */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 py-5 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo inside its own matching white pill */}
          <div className="pointer-events-auto">
            <Link 
              className={`inline-flex items-center justify-center px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md border hover:shadow-lg transition-all duration-300 ${capsuleStyle}`} 
              href="/"
            >
              <Image alt="Dream2Venture Logo" className="object-contain" height={34} priority src="/footerlogo.png" width={115}/>
            </Link>
          </div>


        </div>
      </header>

      {/* Main Grid: Adjusted for a larger hero image */}
      <div className="relative z-20 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center py-4">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-2xl leading-[1.1]">
            Transform Your Vision Into a{" "}
            <span className="text-[#38bdf8]">Market</span>{" "}
            <span className="text-[#E64A19]">Leader</span>
          </h1>

          <p className="mt-6 mb-8 text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed">
            We back bold founders with early-stage capital, hands-on mentorship, and the technology network required to build category-defining ventures.
          </p>

          <div className="flex flex-col items-start gap-4">

            <button
              type="button"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                /* Muted Speaker Icon */
                <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                /* Unmuted Speaker / Sound Wave Icon */
                <svg className="w-5 h-5 text-[#E64A19]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Shifted Further Left & Scaled Up One Size */}
        <div className="lg:col-span-7 relative flex justify-center lg:justify-start items-end w-full">


          {/* Scaled & Left-Shifted Wrapper */}
          <div className="relative w-full max-w-5xl xl:max-w-6xl flex items-end justify-center transform scale-110 sm:scale-115 lg:scale-125 origin-bottom lg:-translate-x-24 xl:-translate-x-32 transition-transform duration-300">


            {/* Spacer to maintain floating badge positioning without the inline element */}
            <div className="w-full h-[400px] lg:h-[550px]" />
          </div>
        </div>
      </div>

      <div className="h-6 w-full" />
    </section>
  );
}
