'use client';

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { projectsAtom, inquiriesAtom, selectedProjectAtom } from '../store/atoms';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { CuteCardCarousel } from '../components/CuteCardCarousel';
import { AIDeepDiveShowcase } from '../components/AIDeepDiveShowcase';
import { ResumeSection } from '../components/ResumeSection';
import { InquirySection } from '../components/InquirySection';
import { Footer } from '../components/Footer';

export default function HomePage() {
  const [projects, setProjects] = useAtom(projectsAtom);
  const [, setInquiries] = useAtom(inquiriesAtom);
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);

  // Initial load from persistent storage API
  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, inqRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/inquiries'),
        ]);

        const projData = await projRes.json();
        const inqData = await inqRes.json();

        if (projData.success && projData.projects) {
          setProjects(projData.projects);
          if (!selectedProject && projData.projects.length > 0) {
            setSelectedProject(projData.projects[0]);
          }
        }

        if (inqData.success && inqData.inquiries) {
          setInquiries(inqData.inquiries);
        }
      } catch (err) {
        console.error('Failed to load initial storage data', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#08090C] text-white transition-colors duration-300 relative">
      {/* Framer Grid and Dot Ambient Canvas */}
      <div className="fixed inset-0 bg-framer-dots pointer-events-none z-0 opacity-40" />
      <div className="fixed inset-0 bg-framer-grid pointer-events-none z-0 opacity-30" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <Header />

        {/* Hero Section */}
        <HeroSection />

        {/* Cute Card Carousel (新作品可愛卡片輪播) */}
        <CuteCardCarousel />

        {/* AI Deep Dive Showcase (AI 作品深度剖析 & 客戶展示體驗) */}
        <AIDeepDiveShowcase />

        {/* Resume & Milestones Section (黃令成 完整履歷與專案成就系統) */}
        <ResumeSection />

        {/* Client Inquiry Section (合作與面試邀請表單) */}
        <InquirySection />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
