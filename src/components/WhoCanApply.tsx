'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const cards = [
  {
    id: 1,
    tag: "BACHELOR'S",
    title: "Undergraduate Students",
    subtitle: "Currently pursuing a bachelor's degree with bold ideas ready to innovate.",
    initialDeltaX: "210%",
    zIndex: 10,
    isCenter: false
  },
  {
    id: 2,
    tag: "MASTER'S",
    title: "Graduate Students",
    subtitle: "Pursuing a master's degree aiming to scale practical technology ventures.",
    initialDeltaX: "105%",
    zIndex: 20,
    isCenter: false
  },
  {
    id: 3,
    tag: "PHD / RESEARCH",
    title: "Postgraduate Students",
    subtitle: "Pursuing MPhil / PhD or equivalent dedicated to deep-tech and IP creation.",
    initialDeltaX: "0%",
    zIndex: 30,
    isCenter: true
  },
  {
    id: 4,
    tag: "ENGINEERING",
    title: "Engineering & Tech Students",
    subtitle: "From any engineering, software, robotics, or hardware architecture background.",
    initialDeltaX: "-105%",
    zIndex: 20,
    isCenter: false
  },
  {
    id: 5,
    tag: "ANY DISCIPLINE",
    title: "Students from Any Discipline",
    subtitle: "All creative, business, design, and academic disciplines are heartily welcome.",
    initialDeltaX: "-210%",
    zIndex: 10,
    isCenter: false
  }
];

const CardContent = ({ card }: { card: typeof cards[0] }) => (
  <div className="flex flex-col h-full">
    {/* Tag & Number */}
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1855BF]">
        {card.tag}
      </span>
      <span className="text-xs font-bold text-[#E64A19]">0{card.id}</span>
    </div>

    {/* Title */}
    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 leading-snug">
      {card.title}
    </h3>

    {/* Brand Accent Divider */}
    <div className="h-0.5 w-7 my-3 rounded-full bg-[#E64A19]" />

    {/* Subtitle */}
    <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed line-clamp-4">
      {card.subtitle}
    </p>
  </div>
);

export default function WhoCanApply() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 95%", "center 55%"]
  });

  const spreadProgress = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const outerOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0.3, 1]);

  return (
    <section id="who-can-apply" ref={containerRef} className="relative w-full bg-white py-12 md:py-16 overflow-hidden select-none scroll-mt-24">
      <div className="w-full flex flex-col justify-center items-center px-4">

        {/* Section Header */}
        <div className="text-center mb-10 z-30 pointer-events-none">
          <div className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#FFF3EC] border border-[#E64A19]/30 shadow-sm text-[#E64A19] text-xs sm:text-sm font-bold tracking-wider uppercase mb-3">
            <span>WHO CAN APPLY?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight">
            Your Background Doesn't Define Your Future.
          </h2>
          <p className="mt-4 text-slate-500 text-sm sm:text-base md:text-[1.05rem] max-w-2xl mx-auto leading-relaxed font-medium">
            Connecting young talent with the resources, mentorship, and opportunities needed to build a meaningful future.
          </p>
        </div>

        {/* Desktop Flex Grid Row */}
        <div className="hidden lg:flex relative w-full max-w-[1360px] mx-auto items-stretch justify-center gap-4 xl:gap-6 px-4">
          {cards.map((card) => {
            const x = useTransform(spreadProgress, [0, 1], [card.initialDeltaX, "0%"]);
            const opacity = card.isCenter ? 1 : outerOpacity;
            const scale = useTransform(spreadProgress, [0, 1], [card.isCenter ? 1.02 : 0.94, card.isCenter ? 1.04 : 1]);

            return (
              <motion.div
                key={card.id}
                style={{ x, opacity, scale, zIndex: card.zIndex }}
                className="shrink-0 w-[190px] xl:w-[220px] 2xl:w-[250px] min-h-[225px] rounded-3xl p-5 bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_40px_rgba(24,85,191,0.14)] hover:border-[#1855BF]/40 transition-shadow duration-300"
              >
                <CardContent card={card} />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Carousel */}
        <div className="flex lg:hidden w-full overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 relative z-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="snap-center shrink-0 w-[75vw] max-w-[280px] min-h-[225px] rounded-3xl p-5 flex flex-col justify-start bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>

        {/* Focus Areas Card - Positioned Directly Below Cards */}
        <div className="relative z-30 mt-8 sm:mt-12 max-w-4xl w-full mx-auto px-6 py-10 sm:py-12 rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.06)] text-center select-none">
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-widest text-[#E64A19] uppercase mb-4">
            <span className="h-[1.5px] w-8 bg-[#E64A19]"></span>
            <span>FOCUS AREAS</span>
            <span className="h-[1.5px] w-8 bg-[#E64A19]"></span>
          </div>

          <h3 className="mt-4 text-slate-900 text-xl sm:text-2xl lg:text-3xl font-bold font-serif max-w-2xl mx-auto leading-snug">
            If you have an ambition to <span className="text-[#1855BF]">Explore</span> & <span className="text-[#E64A19]">Build</span><br className="hidden sm:block" />
            You Belong <span className="text-[#1855BF]">Here</span><span className="text-[#E64A19]">.</span>
          </h3>
          
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            We welcome students from all backgrounds. Your vision has the power to <span className="text-[#1855BF] italic underline decoration-1 underline-offset-4">create real</span> <span className="text-[#E64A19] italic underline decoration-1 underline-offset-4">impact.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
