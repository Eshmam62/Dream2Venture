"use client";

import { useEffect, useState } from "react";

import HeroSection from "@/components/HeroSection";
import TrustedPartners from "@/components/TrustedPartners";
import HowItWorks from "@/components/HowItWorks";
import WhoCanApply from "@/components/WhoCanApply";
import WhatWeOffer from "@/components/WhatWeOffer";
import Footer from "@/components/Footer";
import FloatingRegistration from "@/components/FloatingRegistration";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);

    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <main className="min-h-screen w-full text-slate-900 relative flex flex-col bg-[#fafcff]">
      {/* Dynamic Cursor Light (Only visible on desktop/when moving) */}
      {isClient && (
        <div
          className="cursor-light hidden md:block"
          style={{
            transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
            opacity: mousePosition.x > 0 ? 0.6 : 0
          }}
        />
      )}

      {/* Global Ambient Atmosphere (Layer 2) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-400/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-400/5 blur-[120px]" />
      </div>



      {/* Content wrapper with z-index to stay above background but below cursor */}
      <div className="relative z-10 w-full">

        <HeroSection />

        <div className="relative z-20 w-full">
          {/* Subtle underlay for content sections */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] -z-10" />

          <TrustedPartners />
          <HowItWorks />
          <WhatWeOffer />
          <WhoCanApply />
        </div>
      </div>

      <Footer />

      {/* Floating Registration Widget */}
      <FloatingRegistration />
    </main>
  );
}
