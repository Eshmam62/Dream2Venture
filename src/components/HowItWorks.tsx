'use client';

import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

/* ─────────────────────────────────────────────
   Step data
   ───────────────────────────────────────────── */
const stepsData = [
  {
    id: '01',
    stepLabel: 'Step 01',
    title: 'Apply',
    description:
      'Submit your idea through our simple application form. Tell us about your vision, target audience, and goals. We review every application personally.',
    image: '/Apply.png',
    // fan-out: leftmost card tilts most negative, rightmost most positive
    tiltClass: 'lg:-rotate-[4deg] lg:translate-y-4',
  },
  {
    id: '02',
    stepLabel: 'Step 02',
    title: 'Submit & Refine',
    description:
      'Share your initial prototype, slide deck, or business roadmap. Our team collaborates directly with you to sharpen your value proposition.',
    image: '/submit.jpeg',
    tiltClass: 'lg:-rotate-[2deg] lg:translate-y-1',
  },
  {
    id: '03',
    stepLabel: 'Step 03',
    title: 'Evaluation',
    description:
      'Our industry mentors and technical advisors thoroughly evaluate market feasibility, scalability, and execution strategy.',
    image: '/Evaluation.png',
    tiltClass: 'lg:rotate-0 lg:-translate-y-1',
  },
  {
    id: '04',
    stepLabel: 'Step 04',
    title: 'Support & Invest',
    description:
      'Receive early-stage funding, direct hands-on mentorship, tech infrastructure, and investor introductions to build fast.',
    image: '/support.jpeg',
    tiltClass: 'lg:rotate-[2deg] lg:translate-y-1',
  },
  {
    id: '05',
    stepLabel: 'Step 05',
    title: 'Grow & Scale',
    description:
      'Scale your venture into a category-defining company with global market access, enterprise partners, and follow-on rounds.',
    image: '/grow.png',
    tiltClass: 'lg:rotate-[4deg] lg:translate-y-4',
  },
];

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
export default function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="how-it-works"
      className="relative w-full bg-[#f8fbff] pt-20 pb-20 sm:pt-24 sm:pb-24 scroll-mt-24"
    >

      {/* ── Atmospheric background glows ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-[15%] w-[680px] h-[680px] rounded-full bg-blue-200/18 blur-[140px]" />
        <div className="absolute top-[30%] -right-48 w-[560px] h-[560px] rounded-full bg-indigo-200/12 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] rounded-full bg-sky-100/22 blur-[100px]" />
      </div>


      {/* ── Section header ── */}
      <ScrollReveal>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 mb-16 sm:mb-20">

          {/* Pill label */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFF3EC] border border-[#E64A19]/25 shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E64A19] flex-shrink-0" />
            <span className="text-[#E64A19] text-[11px] font-bold tracking-[0.16em] uppercase select-none">
              How It Works
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-[#0f172a] leading-[1.1] tracking-tight mb-5 md:whitespace-nowrap">
            Transforming{' '}
            <span className="text-[#1855BF]">Vision</span>{' '}
            <span className="text-[#E64A19]">into</span>{' '}
            Action<span className="text-[#E64A19]">.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-500 text-base sm:text-[1.05rem] font-normal leading-relaxed max-w-xl mx-auto">
            Every Step Brings Your Vision Closer to Reality.
          </p>
        </div>
      </ScrollReveal>

      {/* ── Cards row ──────────────────────────────────────────────────────
          Mobile / tablet  : horizontal snap-scroll (flex, overflow-x-auto)
          Desktop (lg+)    : 5-column grid, fan-out tilt, no overflow
          ─────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        <div
          className={[
            /* shared */
            'max-w-[1500px] mx-auto',
            /* mobile/tablet: scrollable row */
            'flex gap-4 sm:gap-5 overflow-x-auto pb-4 lg:pb-0',
            /* desktop: 5-column grid */
            'lg:overflow-visible lg:grid lg:grid-cols-5 lg:gap-5 xl:gap-6',
          ].join(' ')}
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {stepsData.map((step, idx) => (
            <div
              key={step.id}
              /* mobile fixed width; desktop = full grid cell */
              className="flex-shrink-0 w-[240px] sm:w-[258px] lg:w-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ScrollReveal delay={0.07 * idx}>
                {/*
                  Tilt wrapper
                  On desktop: each card has a unique rotation angle.
                  On hover  : rotation resets to 0 and card lifts up.
                */}
                <div
                  className={[
                    'relative h-[390px] sm:h-[410px] lg:h-[430px] cursor-pointer',
                    'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                    hoveredIndex === idx
                      ? 'lg:!rotate-0 lg:!translate-y-0 scale-[1.04] z-30'
                      : `${step.tiltClass} z-10 scale-100`,
                  ].join(' ')}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >

                  {/* White card shell */}
                  <div
                    className={[
                      'absolute inset-0 rounded-[26px] sm:rounded-[30px] overflow-hidden',
                      'border transition-all duration-500',
                      hoveredIndex === idx
                        ? 'shadow-[0_40px_80px_-16px_rgba(15,23,42,0.22)] border-slate-200/80'
                        : 'shadow-[0_10px_38px_rgba(0,0,0,0.08)] border-white',
                    ].join(' ')}
                  >

                    {/* ── Image ── */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className={[
                        'absolute inset-0 w-full h-full object-cover',
                        'transition-all duration-700 ease-out',
                        hoveredIndex === idx
                          ? 'grayscale-0 scale-[1.06]'
                          : 'grayscale contrast-[1.12] scale-100',
                      ].join(' ')}
                    />

                    {/* ── Dark gradient overlay — heavier at bottom ── */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/28 to-slate-900/4" />

                    {/* ── Subtle top vignette ── */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-transparent" />

                    {/* ── Step badge — frosted glass pill, top-left ── */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/22 text-white/88 text-[9.5px] font-bold tracking-[0.14em] uppercase shadow-sm">
                        {step.stepLabel}
                      </span>
                    </div>

                    {/* ── Bottom content area ── */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">

                      {/* Title — always visible */}
                      <h3 className="text-[1.05rem] sm:text-[1.1rem] font-bold text-white leading-snug tracking-tight">
                        {step.title}
                      </h3>

                      {/* Description — slides in on hover */}
                      <div
                        className={[
                          'overflow-hidden transition-all duration-500 ease-out',
                          hoveredIndex === idx
                            ? 'max-h-32 opacity-100 mt-2.5'
                            : 'max-h-0 opacity-0 mt-0',
                        ].join(' ')}
                      >
                        <p className="text-slate-300/90 text-[12px] sm:text-[12.5px] leading-[1.65] font-normal">
                          {step.description}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}