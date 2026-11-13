"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroInlineMetric {
  value: string;
  label: string;
}

export interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  readMoreLabel?: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
  inlineMetrics?: HeroInlineMetric[];
  floatingBadges?: {
    topLeft: { value: string; sub: string };
    topRight: { value: string; sub: string };
    bottomRight: { value: string; sub: string };
  };
  className?: string;
  extraActions?: React.ReactNode;
}

const SocialIcon = ({
  href,
  icon: Icon,
}: {
  href: string;
  icon: LucideIcon;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.06 }}
    whileTap={{ scale: 0.95 }}
    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] text-[#5C5852] transition-colors hover:border-[#C05E3E] hover:text-[#C05E3E]"
  >
    <Icon className="h-4 w-4" />
  </motion.a>
);

export const MinimalistHero = ({
  mainText,
  readMoreLink,
  readMoreLabel = "Read More",
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  inlineMetrics = [],
  floatingBadges,
  className,
  extraActions,
}: MinimalistHeroProps) => {
  // Strip any trailing arrows from readMoreLabel so we never render "↓ →"
  const cleanReadMoreLabel = readMoreLabel.replace(/[↓→]+\s*$/g, "").trim();

  return (
    <div
      className={cn(
        "relative flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-between overflow-hidden bg-[#F5F3ED] px-4 py-8 font-sans sm:px-6 md:px-12 md:py-10",
        className
      )}
    >
      {/* Ambient Animated Background Orbs */}
      <motion.div
        aria-hidden="true"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16)_0%,transparent_70%)] blur-2xl"
      />

      {/* Main Content Area */}
      <div className="relative my-auto grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-8 py-6 md:grid-cols-12">
        {/* Left Text Content Card */}
        <motion.div
          initial={{ opacity: 0, x: -24, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="z-20 order-2 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 text-center shadow-sm transition-shadow hover:shadow-md md:col-span-4 md:order-1 md:text-left"
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-2.5 py-1 font-mono text-[11px] font-medium text-[#C05E3E]">
            <Sparkles className="h-3 w-3" />
            <span>01 // FULL-STACK MARKETING</span>
          </div>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#0E0E0E] line-clamp-3 md:mx-0">
            {mainText}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
            <motion.a
              href={readMoreLink}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-4 font-mono text-xs font-medium text-[#FAF9F6] shadow-sm shadow-indigo-500/20 transition-colors hover:bg-[#AD5234]"
            >
              <span>{cleanReadMoreLabel}</span>
              <span aria-hidden="true">↓</span>
            </motion.a>
            {extraActions}
          </div>
        </motion.div>

        {/* Center Image with Animated Orbital Ring & Floating KPI Badges */}
        <div className="relative order-1 flex h-full items-center justify-center py-4 md:col-span-4 md:order-2 md:py-0">
          {/* Outer Rotating Dashed Orbital Ring */}
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute h-[340px] w-[340px] rounded-full border border-dashed border-[#C05E3E]/30 md:h-[420px] md:w-[420px] lg:h-[476px] lg:w-[476px]"
          />

          {/* Floating Orbital Badge 1: Top-Left */}
          {floatingBadges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: -16 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -7, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.45 },
                scale: { duration: 0.5, delay: 0.45 },
                y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="z-30 hidden sm:flex absolute -left-2 top-8 md:-left-6 md:top-10 items-center gap-2.5 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6]/95 px-3.5 py-2 shadow-lg backdrop-blur-md"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#C05E3E]/15 text-[#C05E3E]">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <div className="text-left">
                <div className="font-mono text-xs font-bold text-[#0E0E0E]">
                  {floatingBadges.topLeft.value}
                </div>
                <div className="font-mono text-[10px] text-[#5C5852]">
                  {floatingBadges.topLeft.sub}
                </div>
              </div>
            </motion.div>
          )}

          {/* Floating Orbital Badge 2: Top-Right */}
          {floatingBadges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 16 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, 8, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.55 },
                scale: { duration: 0.5, delay: 0.55 },
                y: {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                },
              }}
              className="z-30 hidden sm:flex absolute -right-2 top-12 md:-right-6 md:top-14 items-center gap-2 rounded-2xl border border-[#C05E3E] bg-[#C05E3E] px-3.5 py-2 text-[#FAF9F6] shadow-lg shadow-indigo-500/20"
            >
              <Zap className="h-3.5 w-3.5" />
              <div className="text-left">
                <div className="font-mono text-xs font-bold">
                  {floatingBadges.topRight.value}
                </div>
                <div className="font-mono text-[10px] opacity-90">
                  {floatingBadges.topRight.sub}
                </div>
              </div>
            </motion.div>
          )}

          {/* Floating Orbital Badge 3: Bottom-Right */}
          {floatingBadges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -6, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.65 },
                scale: { duration: 0.5, delay: 0.65 },
                y: {
                  duration: 3.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.1,
                },
              }}
              className="z-30 hidden sm:flex absolute -bottom-2 right-0 md:bottom-4 md:-right-4 items-center gap-2 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6]/95 px-3.5 py-2 shadow-lg backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-[#C05E3E]" />
              <div className="text-left">
                <div className="font-mono text-xs font-bold text-[#C05E3E]">
                  {floatingBadges.bottomRight.value}
                </div>
                <div className="font-mono text-[10px] text-[#5C5852]">
                  {floatingBadges.bottomRight.sub}
                </div>
              </div>
            </motion.div>
          )}

          {/* Center Portrait Circle */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
            className="relative flex h-[300px] w-[300px] items-end justify-center overflow-hidden rounded-full border border-[#D1CCC4] bg-[#E6E2DA] shadow-inner md:h-[370px] md:w-[370px] lg:h-[430px] lg:w-[430px]"
          >
            {/* Inner Concentric Indigo Pulse Circle */}
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute h-[82%] w-[82%] rounded-full border border-[#C05E3E]/35 bg-[#C05E3E]/15"
            />
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className="relative z-10 h-[94%] w-auto object-contain object-bottom transition-transform duration-500 hover:scale-[1.03]"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25,
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://cdn.21st.dev/assets/mirror/69/69f133c713200aa29789f9f07a83f105cc28793926179eb4a224b0454a743a00.svg`;
              }}
            />
          </motion.div>
        </div>

        {/* Right Oversized Display Typography */}
        <motion.div
          initial={{ opacity: 0, x: 24, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="z-20 order-3 flex flex-col items-center justify-center text-center md:col-span-4 md:items-start md:pl-4 md:text-left"
        >
          <span className="mb-3 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-1 font-mono text-[11px] font-medium text-[#5C5852]">
            MARCOM STRATEGY × PERFORMANCE ROAS
          </span>
          <h1 className="font-sans text-5xl font-bold leading-[0.94] tracking-tight text-[#0E0E0E] sm:text-6xl lg:text-7xl">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block text-[#C05E3E]"
            >
              {overlayText.part1}
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-block"
            >
              {overlayText.part2}
            </motion.span>
          </h1>
        </motion.div>
      </div>

      {/* Bottom Executive Bar: Socials + 4 Inline KPI Pills + Location */}
      <motion.footer
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45 }}
        className="z-30 flex w-full max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] px-5 py-3.5 lg:flex-row"
      >
        {/* Left: Social Icons */}
        <div className="flex items-center space-x-2.5">
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </div>

        {/* Center: 4 Compact Executive Impact KPI Pills filling the bar */}
        {inlineMetrics.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
            {inlineMetrics.map((metric, idx) => (
              <motion.a
                key={idx}
                href="#work"
                whileHover={{ y: -2, scale: 1.02 }}
                className="group flex items-center gap-2.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-1.5 transition-colors hover:border-[#C05E3E] hover:bg-[#EBE7DF]"
              >
                <span className="font-mono text-xs font-bold text-[#C05E3E] sm:text-sm">
                  {metric.value}
                </span>
                <span className="truncate font-mono text-[10px] text-[#5C5852] group-hover:text-[#0E0E0E]">
                  {metric.label}
                </span>
              </motion.a>
            ))}
          </div>
        )}

        {/* Right: Location Pill */}
        <div className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3.5 py-1.5 font-mono text-xs font-medium text-[#5C5852]">
          {locationText}
        </div>
      </motion.footer>
    </div>
  );
};
