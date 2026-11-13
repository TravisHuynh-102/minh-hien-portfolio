"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { Command, FileDown, Menu, Moon, Sun, X } from "lucide-react";
import { SITE_CONFIG } from "@/data/site-config";
import { useUIStore } from "@/store/use-ui-store";
import { useCMSStore } from "@/store/use-cms-store";
import { cn, t } from "@/lib/utils";

export function StickyNavbar() {
  const { lang, setLang, theme, toggleTheme, setCommandOpen } = useUIStore();
  const { profile } = useCMSStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex !== -1) {
      const sectionId = href.slice(hashIndex + 1);
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        setMobileMenuOpen(false);
      } else {
        setMobileMenuOpen(false);
        router.push(href);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-[#D1CCC4] bg-[#F5F3ED]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left Cluster: Brand Name + Availability Pill */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[#0E0E0E] transition-colors hover:text-[#C05E3E]"
          >
            <motion.span
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#C05E3E] bg-[#C05E3E] font-mono text-xs font-semibold text-[#FAF9F6] shadow-sm shadow-indigo-500/20"
            >
              MH
            </motion.span>
            <span className="font-sans font-semibold tracking-tight">
              {profile.marketerName}
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1 lg:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C05E3E] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C05E3E]" />
            </span>
            <span className="font-mono text-[11px] text-[#5C5852]">
              {t(profile.availabilityBadge, lang)}
            </span>
          </div>
        </div>

        {/* Center Cluster: Smooth-Scroll Anchors */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {SITE_CONFIG.navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#5C5852] transition-all hover:-translate-y-0.5 hover:bg-[#EBE7DF] hover:text-[#0E0E0E]"
            >
              {t(item.label, lang)}
            </Link>
          ))}
        </nav>

        {/* Right Cluster: Dark/Light Toggle, Bilingual Toggle, Cmd+K Trigger, CV PDF CTA, Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Theme Segmented Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
            title={
              theme === "dark"
                ? lang === "vi"
                  ? "Chuyển sang giao diện Sáng (Light Mode)"
                  : "Switch to Light Mode"
                : lang === "vi"
                  ? "Chuyển sang giao diện Tối (Dark Mode)"
                  : "Switch to Dark Mode"
            }
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 font-mono text-[11px] font-medium text-[#0E0E0E] transition-all hover:-translate-y-0.5 hover:border-[#C05E3E] hover:bg-[#EBE7DF]"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[#C05E3E]" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-[#C05E3E]" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Bilingual Segmented Toggle [VI | EN] */}
          <div
            role="group"
            aria-label="Language Switcher"
            className="flex items-center rounded-lg border border-[#D1CCC4] bg-[#EFECE6] p-0.5 font-mono text-[11px]"
          >
            <button
              type="button"
              onClick={() => setLang("vi")}
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                lang === "vi"
                  ? "bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                  : "text-[#5C5852] hover:text-[#0E0E0E]"
              )}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                lang === "en"
                  ? "bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                  : "text-[#5C5852] hover:text-[#0E0E0E]"
              )}
            >
              EN
            </button>
          </div>

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Open Command Palette"
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 font-mono text-xs text-[#0E0E0E] transition-all hover:-translate-y-0.5 hover:bg-[#EBE7DF]"
          >
            <Command className="h-3.5 w-3.5 text-[#C05E3E]" />
            <span className="hidden sm:inline">⌘K</span>
          </button>

          {/* Primary CTA: Download CV PDF */}
          <a
            href={profile.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 items-center gap-1.5 rounded-lg border border-[#C05E3E] bg-[#C05E3E] px-3.5 font-mono text-xs font-medium text-[#FAF9F6] shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#AD5234] sm:inline-flex"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>{lang === "vi" ? "Tải CV" : "CV PDF"}</span>
          </a>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Mobile Navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] text-[#0E0E0E] hover:bg-[#EBE7DF] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Smooth Indigo Scroll Progress Indicator Line */}
      <motion.div
        style={{ scaleX }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500"
      />

      {/* Mobile Slide-Down Drawer (< 768px) */}
      {mobileMenuOpen && (
        <div className="border-b border-[#D1CCC4] bg-[#F5F3ED] px-4 py-4 md:hidden">
          <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C05E3E]" />
              <span className="font-mono text-xs text-[#5C5852]">
                {t(SITE_CONFIG.availabilityBadge, lang)}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D1CCC4] bg-[#EFECE6] px-2.5 py-1 font-mono text-[11px] text-[#0E0E0E]"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3 w-3 text-[#C05E3E]" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3 w-3 text-[#C05E3E]" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
          <nav className="flex flex-col space-y-1">
            {SITE_CONFIG.navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#0E0E0E] hover:bg-[#EBE7DF]"
              >
                {t(item.label, lang)}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-2 border-t border-[#D1CCC4] pt-3">
            <a
              href={profile.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#C05E3E] bg-[#C05E3E] py-2 font-mono text-xs font-medium text-[#FAF9F6]"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>
                {lang === "vi" ? "Tải CV (PDF)" : "Download CV (PDF)"}
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
