'use client';

import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface StepItem {
  id: string;
  stepLabel: string;
  title: string;
  description: string;
  image: string;
  tiltClass: string;
}

const stepsData: StepItem[] = [
  {
    id: '01',
    stepLabel: 'Step 01',
    title: 'Apply',
    description:
      'Submit your idea through our simple application form. Tell us about your vision, target audience, and goals. We review every application personally.',
    image:
      '/Apply.png',
    tiltClass: 'lg:rotate-[-5deg] lg:translate-y-2 hover:rotate-0',
  },
  {
    id: '02',
    stepLabel: 'Step 02',
    title: 'Submit & Refine',
    description:
      'Share your initial prototype, slide deck, or business roadmap. Our team collaborates directly with you to sharpen your value proposition.',
    image:
      '/submit$refine.jpeg',
    tiltClass: 'lg:rotate-[-2deg] lg:-translate-y-1 hover:rotate-0',
  },
  {
    id: '03',
    stepLabel: 'Step 03',
    title: 'Evaluation',
    description:
      'Our industry mentors and technical advisors thoroughly evaluate market feasibility, scalability, and execution strategy.',
    image:
      '/Evaluation.png',
    tiltClass: 'rotate-0 lg:-translate-y-2 hover:rotate-0',
  },
  {
    id: '04',
    stepLabel: 'Step 04',
    title: 'Support & Invest',
    description:
      'Receive early-stage funding, direct hands-on mentorship, tech infrastructure, and investor introductions to build fast.',
    image:
      '/support&innovation.jpeg',
    tiltClass: 'lg:rotate-[2deg] lg:-translate-y-1 hover:rotate-0',
  },
  {
    id: '05',
    stepLabel: 'Step 05',
    title: 'Grow & Scale',
    description:
      'Scale your venture into a category-defining company with global market access, enterprise partners, and follow-on rounds.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    tiltClass: 'lg:rotate-[5deg] lg:translate-y-2 hover:rotate-0',
  },
];

export default function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative w-full bg-[#f8fbff] pt-10 pb-4 sm:pt-12 sm:pb-4 px-4 sm:px-6 lg:px-8 overflow-visible [touch-action:pan-y] scroll-mt-24">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-blue-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Header Section */}
      <ScrollReveal>
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center mb-16 px-4">
          <div className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#FFF3EC] border border-[#E64A19]/30 shadow-sm text-[#E64A19] text-xs font-bold tracking-wider uppercase mb-4">
            HOW IT WORKS
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0f172a] leading-tight tracking-tight whitespace-normal sm:whitespace-nowrap">
            A <span className="text-[#1855BF]">proven</span>{' '}
            <span className="text-[#E64A19]">process</span> from idea to{' '}
            <span className="text-[#1855BF]">launch</span>
            <span className="text-[#E64A19]">.</span>
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Five clear steps. No surprises. You see real progress every single day.
          </p>
        </div>
      </ScrollReveal>

      {/* Larger Step Cards Row */}
      <div
        className="relative z-10 max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-7 items-start justify-items-center px-2 py-4 [touch-action:pan-y]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {stepsData.map((step, idx) => (
          <ScrollReveal key={step.id} delay={0.1 * idx} className="w-full flex justify-center self-start">
            {/* Fixed slot so the layout never expands */}
            <div
              className="relative w-full max-w-[270px] xl:max-w-[285px] h-[330px] sm:h-[350px] flex-shrink-0"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Floating Card Overlay */}
              <div
                className={`absolute top-0 left-0 w-full bg-white rounded-[30px] sm:rounded-[36px] p-4 sm:p-[18px] border transition-all duration-500 cursor-pointer overflow-hidden will-change-transform transform-gpu ${hoveredIndex === idx
                    ? 'border-slate-900 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)] -translate-y-2.5 z-40 scale-[1.03]'
                    : `border-slate-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.06)] z-10 ${step.tiltClass}`
                  }`}
                style={{ transform: 'translateZ(0)' }}
              >
                {/* Image Container - Enlarged view */}
                <div className="w-full aspect-[4/4.2] rounded-[22px] sm:rounded-[26px] overflow-hidden relative bg-slate-900 shadow-inner">
                  <img
                    src={step.image}
                    alt={step.title}
                    className={`w-full h-full object-cover transition-all duration-500 ease-out ${hoveredIndex === idx ? 'grayscale-0 contrast-100' : 'grayscale contrast-125'
                      }`}
                  />

                  {/* Initial Bottom Overlay (Picture 2 style) */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent transition-opacity duration-300 delay-75 ${hoveredIndex === idx ? 'opacity-0' : 'opacity-100'
                    }`} />

                  <div className={`absolute bottom-4 left-4 right-4 text-white transition-opacity duration-300 delay-75 pointer-events-none ${hoveredIndex === idx ? 'opacity-0' : 'opacity-100'
                    }`}>
                    <div className="inline-block bg-slate-800/90 backdrop-blur-sm text-slate-100 px-3 py-1 rounded-lg text-[10px] font-medium tracking-wider mb-1.5 shadow-md">
                      {step.stepLabel}
                    </div>
                    <div className="text-base sm:text-lg font-serif font-bold truncate">
                      {step.title}
                    </div>
                  </div>

                  {/* Picture 3 Top-Left Badge (Reveals on hover) */}
                  <div className={`absolute top-3 left-3 transition-opacity duration-300 delay-75 ${hoveredIndex === idx ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <span className="inline-block bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-medium tracking-wider shadow-md">
                      {step.stepLabel}
                    </span>
                  </div>
                </div>

                {/* Hover Detailed Content (Picture 3 style) */}
                <div className={`transition-all duration-500 transform-gpu will-change-transform ease-out overflow-hidden px-3 text-left delay-75 ${hoveredIndex === idx ? 'max-h-64 opacity-100 pt-2 pb-2' : 'max-h-0 opacity-0'
                  }`}>
                  <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-[13px] leading-relaxed mt-2 pb-1">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
