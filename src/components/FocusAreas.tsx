'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Building2,
  Cog,
  Users,
  Zap,
  Star,
  Cpu,
  Factory,
  Bot,
  Landmark,
  Sprout,
  Sparkles,
  Video,
  Scissors,
  Layers,
  ShieldCheck,
  Lightbulb,
  CreditCard
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import WhoCanApply from './WhoCanApply';





export default function FocusAreas() {
  return (
    <section className="relative w-full py-20 bg-[#FDFBF7] text-slate-900 overflow-hidden select-none">

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">



        {/* Interactive Scroll-Expanding Deck */}
        <WhoCanApply />



      </div>
    </section>
  );
}
