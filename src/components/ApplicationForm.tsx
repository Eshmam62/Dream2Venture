"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Lightbulb, PenTool, Briefcase, UploadCloud, ArrowRight, Lock } from "lucide-react";

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.ppt', '.pptx'];

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    startupName: '',
    ideaDescription: '',
    problemSolved: '',
    category: '',
    stage: '',
    beneficiaries: '',
    supportNeeded: [] as string[],
    fundingNeeded: '',
    file: null as File | null,
  });

  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["AI & Technology", "AgriTech", "Cybersecurity", "Others"];
  const stages = [
    { label: "Idea", icon: <Lightbulb className="w-4 h-4 mb-1" /> },
    { label: "Prototype", icon: <PenTool className="w-4 h-4 mb-1" /> },
    { label: "Existing Business", icon: <Briefcase className="w-4 h-4 mb-1" /> }
  ];
  const supportOptions = ["Funding", "Mentorship", "Technology", "Marketing"];

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const fileExt = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    const isValidType =
      ALLOWED_TYPES.includes(selectedFile.type) ||
      ALLOWED_EXTENSIONS.includes(fileExt);

    if (!isValidType) {
      alert('Invalid file format. Please upload a PDF or PowerPoint (.ppt, .pptx) presentation.');
      setFileError('Invalid format');
      // Reset input value to allow selecting the same file again if user fixes it
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFormData({ ...formData, file: selectedFile });
    setFileError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Please enter a valid Email Address.");
      return;
    }
    if (!formData.university.trim()) {
      alert("Please enter your University / Institution.");
      return;
    }
    if (!formData.startupName.trim()) {
      alert("Please enter your Idea / Startup Name.");
      return;
    }
    if (!formData.ideaDescription.trim()) {
      alert("Please briefly describe your idea.");
      return;
    }
    if (!formData.problemSolved.trim()) {
      alert("Please explain what problem your idea solves.");
      return;
    }
    if (!formData.category) {
      alert("Please select a Category.");
      return;
    }
    if (!formData.stage) {
      alert("Please select your Current Stage.");
      return;
    }
    if (!formData.file) {
      alert("Please upload your Pitch Deck / Supporting File.");
      setFileError('Required');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        university: '',
        startupName: '',
        ideaDescription: '',
        problemSolved: '',
        category: '',
        stage: '',
        beneficiaries: '',
        supportNeeded: [],
        fundingNeeded: '',
        file: null,
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full relative z-10">
      


            {/* Form Fields Area */}
            <div className="w-full space-y-5 pb-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-slate-700 block">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="Enter your full name" className="w-full bg-slate-50 border border-slate-200 text-[15px] rounded-lg px-3.5 py-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-slate-700 block">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="w-full bg-slate-50 border border-slate-200 text-[15px] rounded-lg px-3.5 py-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-slate-700 block">University / Institution <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.university} onChange={e => setFormData({ ...formData, university: e.target.value })} placeholder="Enter your university or institution name" className="w-full bg-slate-50 border border-slate-200 text-[15px] rounded-lg px-3.5 py-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-slate-700 block">Idea / Startup Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.startupName} onChange={e => setFormData({ ...formData, startupName: e.target.value })} placeholder="Project / Startup Name" className="w-full bg-slate-50 border border-slate-200 text-[15px] rounded-lg px-3.5 py-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700 block">What is your idea? <span className="text-red-500">*</span></label>
                <textarea required rows={4} value={formData.ideaDescription} onChange={e => setFormData({ ...formData, ideaDescription: e.target.value })} placeholder="Briefly describe your idea and what you're building..." className="w-full bg-slate-50 border border-slate-200 text-[15px] rounded-lg px-3.5 py-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none transition-all placeholder:text-slate-400"></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700 block">What problem does it solve? <span className="text-red-500">*</span></label>
                <textarea required rows={4} value={formData.problemSolved} onChange={e => setFormData({ ...formData, problemSolved: e.target.value })} placeholder="Explain the problem you're solving..." className="w-full bg-slate-50 border border-slate-200 text-[15px] rounded-lg px-3.5 py-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none transition-all placeholder:text-slate-400"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-slate-700 block">Category <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button type="button" key={c} onClick={() => setFormData({ ...formData, category: c })} className={`px-4 py-2 text-[14px] font-medium rounded-full border transition-colors ${formData.category === c ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-slate-700 block">Current Stage <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
                  {stages.map(s => (
                    <button type="button" key={s.label} onClick={() => setFormData({ ...formData, stage: s.label })} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors gap-1.5 ${formData.stage === s.label ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {s.icon}
                      <span className="text-[14px] font-medium text-center leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pb-4">
                <label className="block text-[14px] font-semibold text-slate-800">
                  Upload Pitch Deck / Supporting File <span className="text-red-500">*</span>
                </label>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      handleFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed ${fileError ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-blue-500'} rounded-2xl bg-slate-50/50 hover:bg-blue-50/30 transition-all p-8 flex flex-col items-center justify-center cursor-pointer text-center relative group`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    required
                    accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2 transition-colors" />
                  <p className="text-[15px] text-slate-700 font-medium">
                    {formData.file ? (
                      <span className="text-emerald-600 font-semibold">{formData.file.name}</span>
                    ) : (
                      <><span className="text-blue-600 font-semibold group-hover:underline">Upload a file</span> or drag and drop</>
                    )}
                  </p>
                  <p className="text-[13px] text-slate-500 mt-1">PDF, PPT, PPTX only (Required)</p>
                </div>
              </div>
            </div>

            {/* Fixed Footer Area within Card */}
            <div className="pt-6 border-t border-slate-100 bg-white mt-2">
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${isSubmitted ? "cursor-default hover:translate-y-0 hover:shadow-lg" : "disabled:opacity-70 disabled:cursor-not-allowed"
                  }`}
              >
                <span className={`flex items-center gap-2 transition-opacity duration-300 text-sm md:text-[15px] ${isSubmitting ? "opacity-0" : "opacity-100"}`}>
                  {isSubmitted ? "Application Sent ✓" : (
                    <>
                      Submit Your Idea <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>

                <AnimatePresence>
                  {isSubmitting && !isSubmitted && (
                    <motion.div
                      initial={{ y: 0, x: "-50%", opacity: 1, scale: 1, rotate: 0 }}
                      animate={{ y: -350, x: "-50%", opacity: 0, scale: 1.6, rotate: -10 }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-0 left-1/2 z-50 pointer-events-none"
                    >
                      <Rocket className="w-6 h-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] md:text-[12px] text-slate-500 font-medium">
                <span className="text-slate-400">🔒</span>
                <span>Your information will be kept confidential and used only to evaluate your idea.</span>
              </div>
            </div>
    </form>
  );
}
