import type { Metadata } from 'next';
import { FrontendShell } from '../components/layouts/frontend-shell';
import { HeroSection } from '../features/portfolio/components/hero-section';
import { BenefitsSection } from '../features/portfolio/components/benefits-section';
import { FeaturedProjects } from '../features/projects/components/featured-projects';
import { WhyChooseMeSection } from '../features/portfolio/components/why-choose-me';
import { ServicesSection } from '../features/portfolio/components/services-section';
import { ProcessSection } from '../features/portfolio/components/process-section';
import { TestimonialsSection } from '../features/portfolio/components/testimonials-section';
import { ResumeSection } from '../features/portfolio/components/resume-section';
import { InquirySection } from '../features/inquiries/components/inquiry-section';
import { Footer } from '../components/layouts/footer';

export const metadata: Metadata = {
  title: 'Lincent Huang | Senior Frontend Architect & Product Engineer',
  description: 'A premium portfolio showcasing modern frontend architecture, enterprise design systems, and high-performance web applications.',
};

export default function HomePage() {
  return (
    <FrontendShell>
      <div className="w-full pt-4 sm:pt-6">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Benefits Bento */}
        <BenefitsSection />

        {/* 3. Selected Work Grid */}
        <FeaturedProjects />

        {/* 4. Core Values & Why Choose Me */}
        <WhyChooseMeSection />

        {/* 5. Creative Services */}
        <ServicesSection />

        {/* 6. 6-Step Process Flow */}
        <ProcessSection />

        {/* 7. Client Testimonials */}
        <TestimonialsSection />

        {/* 8. Career Journey & Expertise */}
        <ResumeSection />

        {/* 9. Contact & Inquiry Section */}
        <InquirySection />

        {/* 10. Clean Minimal Footer */}
        <Footer />
      </div>
    </FrontendShell>
  );
}
