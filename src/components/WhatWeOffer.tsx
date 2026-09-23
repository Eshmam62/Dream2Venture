'use client';

import { Cpu, Layers, CreditCard, ShieldCheck, Database, Sparkles, Rocket, Globe, Award, TrendingUp, Users, Video, Scissors, Leaf } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const offersList = [
  {
    id: '01',
    category: 'AI & DIGITAL',
    color: 'text-[#E64A19] bg-[#E64A19]',
    icon: <Cpu className="w-6 h-6 text-white" />,
    items: [
      { label: 'AI & Machine Learning', icon: <Sparkles size={16} /> },
      { label: 'Software & SaaS', icon: <Layers size={16} /> },
      { label: 'Fintech & Digital Payments', icon: <CreditCard size={16} /> },
      { label: 'Cybersecurity', icon: <ShieldCheck size={16} /> },
      { label: 'Data & Analytics', icon: <Database size={16} /> },
    ],
    image: '/digital.jpeg',
  },
  {
    id: '02',
    category: 'HARDWARE & ENGINEERING',
    color: 'text-emerald-500 bg-emerald-500',
    icon: <Rocket className="w-6 h-6 text-white" />,
    items: [
      { label: 'IoT & Smart Devices', icon: <Cpu size={16} /> },
      { label: 'EV & Mobility Technology', icon: <Sparkles size={16} /> },
      { label: 'Robotics & Automation', icon: <Layers size={16} /> },
    ],
    image: '/hardware and engineering.jpeg',
  },
  {
    id: '03',
    category: 'INDUSTRIAL & INFRASTRUCTURE',
    color: 'text-[#E64A19] bg-[#E64A19]',
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    items: [
      { label: 'Industrial Automation', icon: <Layers size={16} /> },
      { label: 'Security & Surveillance Tech', icon: <ShieldCheck size={16} /> },
      { label: 'Renewable Energy & Power', icon: <Sparkles size={16} /> },
      { label: 'Construction & Smart Building', icon: <Database size={16} /> },
      { label: 'Water & Waste Management', icon: <Globe size={16} /> },
    ],
    image: '/industry1.jpeg',
  },
  {
    id: '04',
    category: 'CREATIVE, FILM & MEDIA',
    color: 'text-purple-500 bg-purple-500',
    icon: <Video className="w-6 h-6 text-white" />,
    items: [
      { label: 'Film Production', icon: <Video size={16} /> },
      { label: 'TVC & Commercials', icon: <Sparkles size={16} /> },
      { label: 'Script Writing & Content Development', icon: <Layers size={16} /> },
      { label: 'Animation, VFX & 3D', icon: <Cpu size={16} /> },
      { label: 'Videography & Photography', icon: <Video size={16} /> },
    ],
    image: '/card4.png',
  },
  {
    id: '05',
    category: 'FASHION, DESIGN & LIFESTYLE',
    color: 'text-pink-500 bg-pink-500',
    icon: <Scissors className="w-6 h-6 text-white" />,
    items: [
      { label: 'Fashion Design', icon: <Scissors size={16} /> },
      { label: 'Product Design', icon: <Layers size={16} /> },
      { label: 'Apparel & Textile Innovation', icon: <Sparkles size={16} /> },
    ],
    image: '/card5.png',
  },
  {
    id: '06',
    category: 'SOCIAL CONSUMER & OTHER',
    color: 'text-teal-500 bg-teal-500',
    icon: <Leaf className="w-6 h-6 text-white" />,
    items: [
      { label: 'E-Commerce & Marketplace', icon: <CreditCard size={16} /> },
      { label: 'Food & Beverage', icon: <Sparkles size={16} /> },
      { label: 'Agriculture & Agritech', icon: <Leaf size={16} /> },
      { label: 'Tourism & Travel', icon: <Globe size={16} /> },
    ],
    image: '/social-consumer.jpeg',
  },
];

export default function WhatWeOffer() {
  const scrollToCard = (id: string) => {
    const targetElement = document.getElementById(`offer-card-${id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="what-we-offer" className="relative w-full pt-20 sm:pt-28 pb-4 sm:pb-6 bg-[#faf8f5] text-slate-900 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">

          {/* LEFT SIDE: Sticky Interactive Nav Card */}
          <div className="lg:col-span-5 sticky top-20 self-start z-10">
            <ScrollReveal>
              <div className="bg-white/95 backdrop-blur-md px-8 py-7 rounded-[32px] border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.07)] space-y-4 w-full max-w-[440px] mx-auto lg:mx-0">

                {/* Badge */}
                <div className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#FFF3EC] border border-[#E64A19]/30 shadow-sm text-[#E64A19] text-xs font-bold tracking-wider uppercase">
                  <span>WHAT WE OFFER</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-black tracking-tight text-[#0f172a] leading-[1.14]">
                  Every Great Product <br />
                  <span className="text-[#1855BF] drop-shadow-[0_0_20px_rgba(24,85,191,0.2)]">
                    Ready to <span className="text-[#E64A19]">Invest.</span>
                  </span>
                </h2>

                <div className="w-12 h-1.5 bg-[#E64A19] rounded-full" />

                {/* Description */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  We provide the support, resources, and opportunities they need to grow.
                </p>

                {/* Clickable Category Navigation List */}
                <div className="space-y-1 pt-3 border-t border-slate-100">
                  {offersList.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => scrollToCard(cat.id)}
                      className="w-full flex items-center gap-3 py-1.5 px-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 text-left group"
                    >
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#E64A19]/10 text-slate-700 group-hover:text-[#E64A19] text-xs font-black flex items-center justify-center shrink-0 transition-colors">
                        {cat.id}
                      </span>
                      <span className="text-[13px] font-bold text-slate-800 group-hover:text-slate-950 tracking-wide transition-colors">
                        {cat.category}
                      </span>
                    </button>
                  ))}
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT SIDE: Large Format Scrolling Cards */}
          <div className="lg:col-span-7 flex flex-col gap-10 sm:gap-14">
            {offersList.map((offer) => (
              <ScrollReveal key={offer.id}>
                <div
                  id={`offer-card-${offer.id}`}
                  className="bg-white rounded-[32px] border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 hover:shadow-2xl transition-all duration-300 min-h-[380px] sm:min-h-[420px] scroll-mt-28"
                >
                  {/* Information Area */}
                  <div className="p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className={`w-12 h-12 rounded-2xl ${offer.color} flex items-center justify-center mb-6 shadow-md`}>
                        {offer.icon}
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-[#E64A19] block mb-1">
                        {offer.id}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide mb-6">
                        {offer.category}
                      </h3>

                      <ul className="space-y-3.5">
                        {offer.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm sm:text-[15px] font-semibold text-slate-700">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Visual Cover Area */}
                  <div className="relative min-h-[260px] sm:min-h-full overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.category}
                      className="w-full h-full object-cover rounded-r-3xl"
                      draggable={false}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
