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
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Ensure video starts playing immediately
    video.play().catch(() => {});

    // 2. Handler to unmute smoothly
    const unmute = () => {
      video.muted = false;
      video.volume = 1.0;
      ['click', 'touchstart', 'keydown'].forEach((event) => {
        window.removeEventListener(event, unmute);
      });
    };

    // Try to unmute immediately if allowed
    video.muted = false;
    video.play()
      .then(() => {
        // Successfully playing unmuted
      })
      .catch(() => {
        // Blocked by Chrome autoplay policy: keep playing muted until first interaction
        video.muted = true;
        video.play().catch(() => {});
        ['click', 'touchstart', 'keydown'].forEach((event) => {
          window.addEventListener(event, unmute, { once: true, passive: true });
        });
      });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      ['click', 'touchstart', 'keydown'].forEach((event) => {
        window.removeEventListener(event, unmute);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-slate-900 overflow-hidden flex flex-col justify-center pt-28 sm:pt-32 px-6 sm:px-12">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-black">
        <video
          ref={videoRef}
          src="/heros1.mp4"
          autoPlay
          playsInline
          muted
          preload="auto"
          onEnded={(e) => {
            e.currentTarget.pause();
          }}
          className="w-full h-full object-cover object-center opacity-100 brightness-100 contrast-100"
        />
      </div>
      {/* Persistent Fixed Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 py-5 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div className="pointer-events-auto">
            <Link
              className="inline-flex items-center justify-center transition-transform duration-300 hover:scale-105"
              href="/"
            >
              <Image alt="Dream2Venture Logo" className="object-contain drop-shadow-md" height={80} priority src="/Fontlogo-clean.png" width={260} />
            </Link>
          </div>


        </div>
      </header>

      {/* Main Grid: Adjusted for a larger hero image */}
      <div className="relative z-20 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center py-4">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
          <h1 className="text-white font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight max-w-xl">
            <span className="text-[#E64A19]">WHERE</span> YOUR<br className="hidden sm:inline" />
            VISION BECOME<br className="hidden sm:inline" />
            <span className="text-[#0ea5e9] uppercase">Tomorrow's</span><br className="hidden sm:inline" />
            <span className="text-[#E64A19] uppercase">Success</span>
          </h1>

          <p className="mt-6 mb-8 text-lg sm:text-xl text-slate-200 max-w-2xl leading-relaxed font-serif">
            Your vision is where tomorrow begins. We provide the opportunity, support, and resources for your growth
          </p>


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
