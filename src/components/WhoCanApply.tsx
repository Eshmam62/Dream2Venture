'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const cards = [
  {
    id: 1,
    tag: "BACHELOR'S",
    title: "Undergraduate Students",
    subtitle: "Currently pursuing a bachelor's degree with bold ideas ready to innovate.",
    targetX: -550,
    zIndex: 10
  },
  {
    id: 2,
    tag: "MASTER'S",
    title: "Graduate Students",
    subtitle: "Pursuing a master's degree aiming to scale practical technology ventures.",
    targetX: -330,
    zIndex: 15
  },
  {
    id: 3,
    tag: "PHD / RESEARCH",
    title: "Postgraduate Students",
    subtitle: "Pursuing MPhil / PhD or equivalent dedicated to deep-tech and IP creation.",
    targetX: -110,
    isCenter: true,
    zIndex: 30
  },
  {
    id: 4,
    tag: "ALL UNIVERSITIES",
    title: "Public & Private Universities",
    subtitle: "Open to eligible students from universities and colleges across Bangladesh.",
    targetX: 110,
    isCenter: true,
    zIndex: 30
  },
  {
    id: 5,
    tag: "ENGINEERING",
    title: "Engineering & Tech Students",
    subtitle: "From any engineering, software, robotics, or hardware architecture background.",
    targetX: 330,
    zIndex: 15
  },
  {
    id: 6,
    tag: "ANY DISCIPLINE",
    title: "Students from Any Discipline",
    subtitle: "All creative, business, design, and academic disciplines are heartily welcome.",
    targetX: 550,
    zIndex: 10
  }
];

export default function WhoCanApply() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 95%", "center 55%"]
  });

  const spreadProgress = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const outerOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0.3, 1]);

  return (
    <section id="who-can-apply" ref={containerRef} className="relative w-full bg-white py-6 sm:py-8 overflow-hidden select-none scroll-mt-24">
      <div className="w-full flex flex-col justify-center items-center px-4">

        {/* Section Header */}
        <div className="text-center pt-2 mb-4 z-30 pointer-events-none">
          <div className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#FFF3EC] border border-[#E64A19]/30 shadow-sm text-[#E64A19] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
            <span>WHO CAN APPLY?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Empowering Every Driven Student
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Scroll to explore the academic backgrounds and eligible applicant tiers.
          </p>
        </div>

        {/* Scroll Fan-out Card Deck */}
        <div className="relative w-full max-w-[1360px] h-[250px] sm:h-[270px] flex items-center justify-center">
          {cards.map((card, idx) => {
            const initialX = idx < 2 ? -110 : idx > 3 ? 110 : card.targetX;
            const x = useTransform(spreadProgress, [0, 1], [initialX, card.targetX]);
            const opacity = card.isCenter ? 1 : outerOpacity;
            const scale = useTransform(spreadProgress, [0, 1], [card.isCenter ? 1.02 : 0.94, card.isCenter ? 1.04 : 1]);

            return (
              <motion.div
                key={card.id}
                style={{
                  x,
                  opacity,
                  scale,
                  zIndex: card.zIndex
                }}
                className="absolute w-[170px] sm:w-[180px] lg:w-[190px] xl:w-[200px] h-[210px] sm:h-[225px] rounded-3xl p-4 sm:p-5 flex flex-col justify-start bg-white/95 border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_40px_rgba(24,85,191,0.14)] hover:border-[#1855BF]/40 transition-all duration-300 backdrop-blur-md"
              >
                <div>
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
              </motion.div>
            );
          })}
        </div>

        {/* Focus Areas Card - Positioned Directly Below Cards */}
        <div className="relative z-30 mt-6 sm:mt-8 mb-4 max-w-4xl w-full mx-auto px-6 py-10 sm:py-12 rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.06)] text-center select-none">
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-widest text-[#E64A19] uppercase mb-4">
            <span className="h-[1.5px] w-8 bg-[#E64A19]"></span>
            <span>FOCUS AREAS (BUT NOT LIMITED TO)</span>
            <span className="h-[1.5px] w-8 bg-[#E64A19]"></span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            If you have a bold idea, <br />
            you belong <span className="text-[#1855BF]">here</span><span className="text-[#E64A19]">.</span>
          </h3>

          <p className="mt-4 text-slate-500 text-sm sm:text-base italic max-w-2xl mx-auto leading-relaxed">
            We welcome students from all backgrounds and disciplines. Your idea has the power to{" "}
            <span className="text-[#1855BF] font-semibold not-italic">create real</span>{" "}
            <span className="text-[#E64A19] font-semibold not-italic">impact.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
