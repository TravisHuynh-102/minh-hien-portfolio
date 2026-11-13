import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCaseStudies } from "@/components/home/featured-case-studies";
import { CreativePerformanceLab } from "@/components/home/creative-performance-lab";
import { ExperienceSocialProof } from "@/components/home/experience-social-proof";
import { ConversionFooter } from "@/components/layout/conversion-footer";

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] bg-[#F5F3ED] text-[#0E0E0E]">
      {/* Section 1: Minimalist Editorial Hero */}
      <HeroSection />

      {/* Section 2: Featured Full-Funnel Case Studies (3D Coverflow Showcase) */}
      <FeaturedCaseStudies />

      {/* Section 3: 3D Perspective Tunnel Hero & Creative Asset Lab */}
      <CreativePerformanceLab />

      {/* Section 4: Career Timeline & Executive Social Proof */}
      <ExperienceSocialProof />

      {/* Section 5: Signature Pen Footer */}
      <ConversionFooter />
    </main>
  );
}
