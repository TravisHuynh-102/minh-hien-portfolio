"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Expand,
  Film,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { FEATURED_PROJECTS } from "@/data/projects";
import type { FeaturedProject, MarcomShowcaseAsset } from "@/types/portfolio";
import { useUIStore } from "@/store/use-ui-store";
import { useCMSStore } from "@/store/use-cms-store";
import { ConversionFooter } from "@/components/layout/conversion-footer";
import { cn, t } from "@/lib/utils";

const STATIONS = [
  {
    id: "overview",
    code: "01",
    label: { vi: "01. Mở đầu & KPI", en: "01. Overview & KPIs" },
  },
  {
    id: "funnel",
    code: "02",
    label: { vi: "02. Bài toán & Phễu", en: "02. Bottlenecks & Funnel" },
  },
  {
    id: "marcom",
    code: "03",
    label: { vi: "03. Thực thi MarCom", en: "03. MarCom Execution" },
  },
  {
    id: "performance",
    code: "04",
    label: { vi: "04. Thực thi Ads & CRO", en: "04. Ads, CRO & Loop" },
  },
  {
    id: "impact",
    code: "05",
    label: { vi: "05. Tác động & Đúc kết", en: "05. Impact & Learnings" },
  },
] as const;

const SHOWCASE_GALLERY_FALLBACKS = [
  "https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg",
  "https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg",
  "https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg",
  "https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c627ae01916f68bcfa9a02ab6e24.jpg",
  "https://cdn.21st.dev/assets/mirror/10/10db8a40cf2d49dc2d2ef1d0b2edbd7287d4fb9d2c59d1ab47ac94ee74714ad8.jpg",
  "https://cdn.21st.dev/assets/mirror/25/250f91a21b930792b5da4ae54ef105204882efeeed88de6a203e7d532bf43354.jpg",
];

function MarcomAssetTile({
  asset,
  index,
  onInspect,
}: {
  asset: MarcomShowcaseAsset;
  index: number;
  onInspect: (src: string, title: string, caption: string) => void;
}) {
  const { lang } = useUIStore();
  const fallbackImg =
    SHOWCASE_GALLERY_FALLBACKS[index % SHOWCASE_GALLERY_FALLBACKS.length];
  const [imgSrc, setImgSrc] = useState<string>(
    asset.mediaSrc.startsWith("http") ? asset.mediaSrc : fallbackImg
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() =>
        onInspect(imgSrc, t(asset.tag, lang), t(asset.caption, lang))
      }
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] transition-all hover:border-[#C05E3E]"
    >
      <div>
        <div className="flex items-center justify-between border-b border-[#D1CCC4] bg-[#EFECE6] px-4 py-2.5 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-[#5C5852]">
            {asset.mediaType === "video-9-16" ? (
              <Film className="h-3.5 w-3.5 text-[#C05E3E]" />
            ) : (
              <ImageIcon className="h-3.5 w-3.5 text-[#C05E3E]" />
            )}
            <span>{asset.aspectLabel}</span>
          </span>
          <span className="rounded-md border border-[#C05E3E]/40 bg-[#C05E3E]/12 px-2 py-0.5 text-[10px] font-semibold text-[#C05E3E]">
            {t(asset.tag, lang)}
          </span>
        </div>

        <div className="relative h-52 w-full overflow-hidden bg-[#F5F3ED]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={t(asset.tag, lang)}
            onError={() => setImgSrc(fallbackImg)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 font-mono text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
            <Expand className="h-3 w-3" />
            <span>{lang === "vi" ? "Phóng to" : "Inspect"}</span>
          </span>
        </div>
      </div>

      <div className="border-t border-[#D1CCC4] bg-[#FAF9F6] px-4 py-3">
        <p className="text-xs leading-relaxed text-[#5C5852] line-clamp-2">
          {t(asset.caption, lang)}
        </p>
      </div>
    </motion.div>
  );
}

export function CaseStudyDetailView({
  slug,
  project: initialProject,
  nextProject: initialNextProject,
}: {
  slug?: string;
  project: FeaturedProject;
  nextProject: FeaturedProject;
}) {
  const { lang } = useUIStore();
  const { featuredProjects } = useCMSStore();

  const allProjects =
    featuredProjects && featuredProjects.length > 0
      ? featuredProjects
      : FEATURED_PROJECTS;

  const targetSlug = slug || initialProject.slug;
  const foundIdx = allProjects.findIndex((p) => p.slug === targetSlug);
  const project = foundIdx !== -1 ? allProjects[foundIdx] : initialProject;
  const nextProject =
    foundIdx !== -1
      ? allProjects[(foundIdx + 1) % allProjects.length]
      : initialNextProject;

  const [activeStation, setActiveStation] = useState<string>("overview");
  const [coverError, setCoverError] = useState(false);
  const [lightboxAsset, setLightboxAsset] = useState<{
    src: string;
    title: string;
    caption: string;
  } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStation(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.05 }
    );

    STATIONS.forEach((st) => {
      const el = document.getElementById(st.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToStation = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveStation(id);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F3ED] text-[#0E0E0E]">
      {/* Top Interactive Case Study Switcher Strip */}
      <div className="border-b border-[#D1CCC4] bg-[#FAF9F6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-x-auto px-4 py-2.5 sm:px-6 no-scrollbar">
          <Link
            href="/#work"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-1.5 font-mono text-xs font-medium text-[#0E0E0E] transition-colors hover:border-[#C05E3E] hover:text-[#C05E3E]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#C05E3E]" />
            <span>
              {lang === "vi" ? "Về 3D Coverflow" : "Back to Coverflow"}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[11px] uppercase text-[#5C5852] md:inline">
              {lang === "vi" ? "Chuyển nhanh dự án:" : "Switch Case Study:"}
            </span>
            {allProjects.map((item, idx) => {
              const isCurrent = item.slug === project.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/work/${item.slug}`}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all",
                    isCurrent
                      ? "border-[#C05E3E] bg-[#C05E3E] font-semibold text-[#FAF9F6] shadow-sm"
                      : "border-[#D1CCC4] bg-[#FAF9F6] text-[#0E0E0E] hover:bg-[#EBE7DF]"
                  )}
                >
                  <span>0{idx + 1}</span>
                  <span className="max-w-[160px] truncate">
                    {t(item.title, lang)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Compact Sticky Station Jump Bar (<1024px) */}
      <div className="sticky top-16 z-30 border-b border-[#D1CCC4] bg-[#F5F3ED]/95 px-4 py-2.5 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {STATIONS.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => scrollToStation(st.id)}
              className={cn(
                "shrink-0 rounded-xl border px-2.5 py-1 font-mono text-[11px] transition-colors",
                activeStation === st.id
                  ? "border-[#C05E3E] bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                  : "border-[#D1CCC4] bg-[#FAF9F6] text-[#5C5852]"
              )}
            >
              {t(st.label, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Asymmetric 25% / 75% Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-10 lg:py-12">
        {/* LEFT COLUMN (25% -> lg:col-span-3): Sticky Sidebar */}
        <aside className="mb-10 lg:col-span-3 lg:mb-0">
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Project Snapshot Metadata Card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5"
            >
              <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#C05E3E]">
                  PROJECT SNAPSHOT
                </span>
                <ShieldCheck className="h-4 w-4 text-[#C05E3E]" />
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <span className="block font-mono text-[10px] uppercase text-[#5C5852]">
                    {lang === "vi" ? "NGÀNH HÀNG" : "INDUSTRY"}
                  </span>
                  <span className="mt-0.5 block font-medium text-[#0E0E0E]">
                    {t(project.industryPill, lang)}
                  </span>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-[#5C5852]">
                    {lang === "vi" ? "VAI TRÒ CỦA TÔI (MY ROLE)" : "MY ROLE"}
                  </span>
                  <span className="mt-0.5 block font-mono font-semibold text-[#C05E3E]">
                    {t(project.rolePill, lang)}
                  </span>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-[#5C5852]">
                    {lang === "vi" ? "THỜI GIAN TRIỂN KHAI" : "TIMEFRAME"}
                  </span>
                  <span className="mt-0.5 block font-mono text-[#0E0E0E]">
                    {project.timeframe}
                  </span>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-[#5C5852]">
                    {lang === "vi"
                      ? "QUY MÔ NGÂN SÁCH (NDA-SAFE)"
                      : "BUDGET SCALE (NDA-SAFE)"}
                  </span>
                  <span className="mt-0.5 block font-mono text-[#0E0E0E]">
                    {t(project.budgetScale, lang)}
                  </span>
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase text-[#5C5852]">
                    {lang === "vi" ? "KÊNH CHỦ LỰC" : "CORE CHANNELS"}
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {project.channels.map((ch) => (
                      <span
                        key={ch}
                        className="rounded-lg border border-[#D1CCC4] bg-[#EFECE6] px-2 py-0.5 font-mono text-[10px] text-[#0E0E0E]"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interactive ScrollSpy Table of Contents (TOC) */}
            <nav
              aria-label="Case Study Stations"
              className="hidden rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-4 lg:block"
            >
              <div className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-[#5C5852]">
                {lang === "vi"
                  ? "MỤC LỤC 5 TRẠM PHÂN TÍCH"
                  : "5 ANALYSIS STATIONS"}
              </div>
              <ul className="space-y-1">
                {STATIONS.map((st) => {
                  const active = activeStation === st.id;
                  return (
                    <li key={st.id}>
                      <button
                        type="button"
                        onClick={() => scrollToStation(st.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-mono text-xs transition-colors",
                          active
                            ? "bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                            : "text-[#5C5852] hover:bg-[#EFECE6] hover:text-[#0E0E0E]"
                        )}
                      >
                        <span>{t(st.label, lang)}</span>
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FAF9F6]" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom Quick-Jump Button Cycling to Next Project */}
            <Link
              href={`/work/${nextProject.slug}`}
              className="group block rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-4 transition-all hover:-translate-y-0.5 hover:border-[#C05E3E]"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-[#5C5852]">
                <span>
                  {lang === "vi" ? "DỰ ÁN TIẾP THEO →" : "NEXT CASE STUDY →"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:text-[#C05E3E]" />
              </div>
              <div className="mt-1.5 text-xs font-semibold text-[#0E0E0E] line-clamp-2 group-hover:text-[#C05E3E]">
                {t(nextProject.title, lang)}
              </div>
            </Link>
          </div>
        </aside>

        {/* RIGHT COLUMN (75% -> lg:col-span-9): 5 Visual Content Stations */}
        <div className="space-y-16 lg:col-span-9">
          {/* ===============================================================
              STATION 01: HERO & KPI BENCHMARK (#overview)
          =============================================================== */}
          <motion.section
            id="overview"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-24 space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-3 py-1 font-mono text-xs font-medium text-[#FAF9F6]">
                STATION 01 // EXECUTIVE OVERVIEW
              </span>
              <span className="rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1 font-mono text-xs text-[#5C5852]">
                {project.visualAccentCode}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0E0E0E] sm:text-3xl lg:text-4xl">
              {t(project.title, lang)}
            </h1>

            <p className="text-sm leading-relaxed text-[#5C5852] sm:text-base line-clamp-3">
              {t(project.shortSummary, lang)}
            </p>

            {/* Full-Width 16:9 Campaign Cover Banner */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] shadow-lg">
              {!coverError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={project.thumbnail}
                  alt={t(project.title, lang)}
                  onError={() => setCoverError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col justify-between bg-[#EFECE6] p-6 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D1CCC4] pb-4 font-mono text-xs text-[#5C5852]">
                    <span>{project.visualAccentCode}</span>
                    <span className="font-semibold text-[#C05E3E]">
                      {t(project.budgetScale, lang)}
                    </span>
                  </div>

                  <div className="my-auto">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#5C5852]">
                      VERIFIED CAMPAIGN RESULTS //
                    </span>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      {project.cardMiniMetrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] p-3 sm:p-4"
                        >
                          <div className="font-mono text-lg font-bold text-[#C05E3E] sm:text-2xl">
                            {m.value}
                          </div>
                          <div className="mt-1 text-xs text-[#5C5852]">
                            {t(m.label, lang)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Floating KPI Overlay Bar on Cover Image */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/20 bg-black/65 px-4 py-3 text-white backdrop-blur-md">
                <div className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  {t(project.industryPill, lang)} • {project.timeframe}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {project.cardMiniMetrics.map((m, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-indigo-600/90 px-2.5 py-1 font-mono text-xs font-bold text-white"
                    >
                      {m.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 KPI Comparison Cards */}
            <div>
              <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                {lang === "vi"
                  ? "BẢNG ĐỐI CHIẾU MỤC TIÊU BAN ĐẦU VS. KẾT QUẢ ĐẠT ĐƯỢC (KPI BENCHMARK)"
                  : "INITIAL TARGET VS. ACTUAL ACHIEVED KPI BENCHMARK"}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {project.kpiComparison.map((kpi, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3 }}
                    className="flex flex-col justify-between rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-4"
                  >
                    <div>
                      <span className="text-xs font-medium text-[#5C5852]">
                        {t(kpi.metric, lang)}
                      </span>
                      <div className="mt-2 font-mono text-xl font-bold text-[#0E0E0E]">
                        {kpi.achieved}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#D1CCC4] pt-2.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-[#5C5852]">
                        <span>{lang === "vi" ? "Mục tiêu:" : "Target:"}</span>
                        <span>{kpi.target}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between font-semibold text-[#C05E3E]">
                        <span>Delta:</span>
                        <span>{kpi.delta}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ===============================================================
              STATION 02: BOTTLENECKS & FULL-FUNNEL SYNERGY MAP (#funnel)
          =============================================================== */}
          <motion.section
            id="funnel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-24 space-y-6 border-t border-[#D1CCC4] pt-12"
          >
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-3 py-1 font-mono text-xs text-[#FAF9F6]">
              <Target className="h-3.5 w-3.5" />
              <span>STATION 02 // BOTTLENECKS & FULL-FUNNEL SYNERGY</span>
            </div>

            <h2 className="text-xl font-bold text-[#0E0E0E] sm:text-2xl">
              {lang === "vi"
                ? "Bối cảnh Thị trường, Nút thắt Kép & Ma trận Phối hợp TOFU–MOFU–BOFU"
                : "Market Context, Dual Bottlenecks & TOFU–MOFU–BOFU Synergy Matrix"}
            </h2>

            <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-4 sm:p-5">
              <div className="font-mono text-[11px] uppercase text-[#5C5852]">
                {lang === "vi"
                  ? "BỐI CẢNH THỊ TRƯỜNG (MARKET CONTEXT)"
                  : "MARKET CONTEXT"}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#0E0E0E] sm:text-sm line-clamp-3">
                {t(project.challenge.marketContext, lang)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#C05E3E]">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {lang === "vi"
                      ? "NÚT THẮT MARCOM / BRAND"
                      : "MARCOM / BRAND BOTTLENECK"}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[#5C5852] sm:text-sm line-clamp-3">
                  {t(project.challenge.marcomBottleneck, lang)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#C05E3E]">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {lang === "vi"
                      ? "NÚT THẮT PERFORMANCE / ADS"
                      : "PERFORMANCE / ADS BOTTLENECK"}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[#5C5852] sm:text-sm line-clamp-3">
                  {t(project.challenge.performanceBottleneck, lang)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#D1CCC4] bg-[#EFECE6] p-5 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0E0E0E]">
                  <Lightbulb className="h-3.5 w-3.5 text-[#C05E3E]" />
                  <span>
                    {lang === "vi"
                      ? "SỰ THẬT NGẦM HIỂU (CORE INSIGHT)"
                      : "CUSTOMER INSIGHT"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#5C5852] sm:text-sm line-clamp-3">
                  {t(project.challenge.customerInsight, lang)}
                </p>
              </div>

              <div className="border-t border-[#D1CCC4] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#C05E3E]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {lang === "vi"
                      ? "Ý TƯỞNG LỚN & GIẢI PHÁP (BIG IDEA)"
                      : "STRATEGIC BIG IDEA"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#0E0E0E] sm:text-sm line-clamp-3">
                  {t(project.challenge.bigIdea, lang)}
                </p>
              </div>
            </div>

            {/* Full-Funnel Architecture Table */}
            <div className="overflow-hidden rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6]">
              <div className="border-b border-[#D1CCC4] bg-[#E6E2DA] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#0E0E0E]">
                {lang === "vi"
                  ? "MA TRẬN ĐỒNG BỘ MARCOM × PERFORMANCE THEO 3 TẦNG PHỄU"
                  : "FULL-FUNNEL MARCOM × PERFORMANCE SYNERGY MATRIX"}
              </div>

              <div className="divide-y divide-[#D1CCC4]">
                {project.funnelSynergy.map((stage) => (
                  <div
                    key={stage.stageCode}
                    className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-12"
                  >
                    <div className="lg:col-span-3">
                      <span className="inline-block rounded-lg border border-[#C05E3E] bg-[#C05E3E] px-2.5 py-0.5 font-mono text-xs font-bold text-[#FAF9F6]">
                        {stage.stageCode}
                      </span>
                      <div className="mt-1.5 text-xs font-semibold text-[#0E0E0E]">
                        {t(stage.stageName, lang)}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stage.kpis.map((k) => (
                          <span
                            key={k}
                            className="rounded-md border border-[#D1CCC4] bg-[#EFECE6] px-2 py-0.5 font-mono text-[10px] text-[#5C5852]"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 lg:border-l lg:border-[#D1CCC4] lg:pl-4">
                      <span className="font-mono text-[10px] uppercase text-[#5C5852]">
                        {lang === "vi"
                          ? "MŨI NHỌN MARCOM / CONTENT"
                          : "MARCOM / CREATIVE ACTION"}
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-[#5C5852] line-clamp-3">
                        {t(stage.marcomAction, lang)}
                      </p>
                    </div>

                    <div className="lg:col-span-5 lg:border-l lg:border-[#D1CCC4] lg:pl-4">
                      <span className="font-mono text-[10px] font-semibold uppercase text-[#C05E3E]">
                        {lang === "vi"
                          ? "MŨI NHỌN PERFORMANCE / CRO"
                          : "PAID MEDIA & CRO ACTION"}
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-[#0E0E0E] line-clamp-3">
                        {t(stage.performanceAction, lang)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ===============================================================
              STATION 03: MARCOM EXECUTION SPEARHEAD (#marcom)
          =============================================================== */}
          <motion.section
            id="marcom"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-24 space-y-6 border-t border-[#D1CCC4] pt-12"
          >
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-3 py-1 font-mono text-xs text-[#FAF9F6]">
              <Layers className="h-3.5 w-3.5" />
              <span>STATION 03 // MARCOM EXECUTION SPEARHEAD</span>
            </div>

            <h2 className="text-xl font-bold text-[#0E0E0E] sm:text-2xl">
              {lang === "vi"
                ? "Hệ sinh thái Ấn phẩm Key Visual, Short-form 9:16 & Sự kiện O2O"
                : "Key Visual System, 9:16 Vertical Hooks & O2O Activations"}
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {project.marcomShowcase.map((asset, idx) => (
                <MarcomAssetTile
                  key={asset.id}
                  asset={asset}
                  index={idx}
                  onInspect={(src, title, caption) =>
                    setLightboxAsset({ src, title, caption })
                  }
                />
              ))}
            </div>
          </motion.section>

          {/* ===============================================================
              STATION 04: PERFORMANCE & CRO SPEARHEAD + DATA-TO-CREATIVE LOOP (#performance)
          =============================================================== */}
          <motion.section
            id="performance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-24 space-y-6 border-t border-[#D1CCC4] pt-12"
          >
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-3 py-1 font-mono text-xs text-[#FAF9F6]">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>STATION 04 // PERFORMANCE, CRO & DATA-TO-CREATIVE LOOP</span>
            </div>

            <h2 className="text-xl font-bold text-[#0E0E0E] sm:text-2xl">
              {lang === "vi"
                ? "Kiến trúc Phân bổ Ngân sách, Retargeting Đa tầng & Vòng lặp Tối ưu"
                : "Budget Allocation, Multi-Layer Retargeting & Data-to-Creative Loop"}
            </h2>

            <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold uppercase text-[#0E0E0E]">
                  {lang === "vi"
                    ? "TỶ TRỌNG PHÂN BỔ NGÂN SÁCH ĐA KÊNH (MEDIA SPLIT)"
                    : "MULTI-CHANNEL BUDGET ALLOCATION SPLIT"}
                </span>
                <span className="font-mono text-xs font-semibold text-[#C05E3E]">
                  {t(project.budgetScale, lang)}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-[#5C5852] line-clamp-2">
                {t(project.performanceProof.funnelDiagramNote, lang)}
              </p>

              {/* Visual Stacked Progress Bar */}
              <div className="mt-4 flex h-3.5 w-full overflow-hidden rounded-full border border-[#D1CCC4] bg-[#EFECE6]">
                {project.performanceProof.budgetSplit.map((b, i) => {
                  const shades = [
                    "bg-indigo-600",
                    "bg-indigo-400",
                    "bg-violet-500",
                    "bg-slate-400",
                  ];
                  return (
                    <div
                      key={i}
                      style={{ width: `${b.percentage}%` }}
                      className={cn(
                        "h-full border-r border-white last:border-r-0",
                        shades[i % shades.length]
                      )}
                      title={`${t(b.label, lang)}: ${b.percentage}%`}
                    />
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {project.performanceProof.budgetSplit.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6] p-3"
                  >
                    <div className="font-mono text-lg font-bold text-[#C05E3E]">
                      {b.percentage}%
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-[#0E0E0E] line-clamp-1">
                      {t(b.label, lang)}
                    </div>
                    <div className="mt-1 text-[11px] text-[#5C5852] line-clamp-1">
                      {t(b.channelNote, lang)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Layer Retargeting Flow Diagram */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {project.performanceProof.retargetingLayers.map((layer, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5"
                >
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#C05E3E]">
                      {layer.layerCode}
                    </span>
                    <div className="mt-3">
                      <span className="font-mono text-[10px] uppercase text-[#5C5852]">
                        {lang === "vi" ? "TỆP ĐỐI TƯỢNG:" : "TARGET COHORT:"}
                      </span>
                      <p className="mt-0.5 text-xs text-[#0E0E0E] line-clamp-2">
                        {t(layer.audience, lang)}
                      </p>
                    </div>
                    <div className="mt-3">
                      <span className="font-mono text-[10px] uppercase text-[#5C5852]">
                        {lang === "vi" ? "THÔNG ĐIỆP / HOOK:" : "CREATIVE HOOK:"}
                      </span>
                      <p className="mt-0.5 text-xs text-[#5C5852] line-clamp-2">
                        {t(layer.creativeHook, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#D1CCC4] pt-3">
                    <span className="font-mono text-[10px] uppercase text-[#C05E3E]">
                      {lang === "vi" ? "ĐÍCH CHUYỂN ĐỔI:" : "CONVERSION GOAL:"}
                    </span>
                    <p className="mt-0.5 font-mono text-xs font-medium text-[#0E0E0E] line-clamp-2">
                      {t(layer.conversionGoal, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* SIGNATURE HIGHLIGHT BOX: DATA-TO-CREATIVE FEEDBACK LOOP */}
            <div className="rounded-2xl border border-[#C05E3E] bg-[#FAF9F6] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D1CCC4] pb-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#C05E3E]">
                  <RefreshCw className="h-4 w-4" />
                  <span>
                    {lang === "vi"
                      ? "ĐIỂM NHẤN ĐẮT GIÁ // VÒNG LẶP DATA-TO-CREATIVE THỰC TẾ"
                      : "SIGNATURE PROOF // THE DATA-TO-CREATIVE FEEDBACK LOOP"}
                  </span>
                </div>
                <span className="rounded-lg border border-[#C05E3E]/40 bg-[#C05E3E]/12 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#C05E3E]">
                  CLOSED-LOOP ITERATION
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6] p-4">
                  <span className="font-mono text-xs font-bold text-[#C05E3E]">
                    {lang === "vi"
                      ? "01. PHÁT HIỆN TỪ DỮ LIỆU ADS"
                      : "01. AD DATA DISCOVERY"}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-[#5C5852] line-clamp-3">
                    {t(
                      project.performanceProof.dataToCreativeLoop.discovery,
                      lang
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6] p-4">
                  <span className="font-mono text-xs font-bold text-[#0E0E0E]">
                    {lang === "vi"
                      ? "02. QUYẾT ĐỊNH XOAY TRỤC CREATIVE & CRO"
                      : "02. CREATIVE & CRO PIVOT"}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-[#5C5852] line-clamp-3">
                    {t(
                      project.performanceProof.dataToCreativeLoop.actionTaken,
                      lang
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-[#C05E3E]/40 bg-[#C05E3E]/10 p-4">
                  <span className="font-mono text-xs font-bold text-[#C05E3E]">
                    {lang === "vi"
                      ? "03. BỨT PHÁ CHUYỂN ĐỔI ĐO LƯỜNG ĐƯỢC"
                      : "03. QUANTIFIED CONVERSION LIFT"}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-[#0E0E0E] line-clamp-3">
                    {t(
                      project.performanceProof.dataToCreativeLoop.outcomeLift,
                      lang
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-4 py-3">
                <p className="font-mono text-xs leading-relaxed text-[#5C5852] line-clamp-3">
                  <strong className="text-[#C05E3E]">
                    {lang === "vi" ? "Tóm tắt điều hành: " : "Executive Loop: "}
                  </strong>
                  {t(
                    project.performanceProof.dataToCreativeLoop.fullNarrative,
                    lang
                  )}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ===============================================================
              STATION 05: BUSINESS IMPACT & RETROSPECTIVE (#impact)
          =============================================================== */}
          <motion.section
            id="impact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-24 space-y-6 border-t border-[#D1CCC4] pt-12"
          >
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-3 py-1 font-mono text-xs text-[#FAF9F6]">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>STATION 05 // BUSINESS IMPACT & RETROSPECTIVE</span>
            </div>

            <h2 className="text-xl font-bold text-[#0E0E0E] sm:text-2xl">
              {lang === "vi"
                ? "Biểu đồ Trước / Sau Chiến dịch & Đúc kết Công thức Chiến thắng"
                : "Before / After Campaign Benchmarks & Strategic Retrospective"}
            </h2>

            {/* Before / After Visual Bar Chart */}
            <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3">
                <span className="font-mono text-xs font-semibold uppercase text-[#0E0E0E]">
                  {lang === "vi"
                    ? "ĐỐI CHIẾU HIỆU SUẤT TRƯỚC VÀ SAU KHI TỐI ƯU (BEFORE VS. AFTER)"
                    : "PRE-CAMPAIGN VS. POST-OPTIMIZATION BENCHMARK CHART"}
                </span>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-[#5C5852]">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                    {lang === "vi" ? "Trước (Baseline)" : "Before"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#C05E3E]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#C05E3E]" />
                    {lang === "vi" ? "Sau (Achieved)" : "After"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {project.retrospective.beforeAfterMetrics.map((m, idx) => {
                  const maxVal = Math.max(m.before, m.after, 1);
                  const beforePct = Math.max(
                    12,
                    Math.round((m.before / maxVal) * 100)
                  );
                  const afterPct = Math.max(
                    12,
                    Math.round((m.after / maxVal) * 100)
                  );

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0E0E0E]">
                          {t(m.label, lang)}
                        </span>
                        <span className="rounded-md border border-[#C05E3E]/40 bg-[#C05E3E]/12 px-2 py-0.5 font-mono text-[11px] font-bold text-[#C05E3E]">
                          {m.deltaBadge}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 font-mono text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] text-[#5C5852]">
                            <span>
                              {lang === "vi" ? "Trước chiến dịch" : "Baseline"}
                            </span>
                            <span>{m.displayBefore}</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#D1CCC4]">
                            <div
                              style={{ width: `${beforePct}%` }}
                              className="h-full rounded-full bg-slate-400"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-[#C05E3E]">
                            <span>
                              {lang === "vi" ? "Sau tối ưu" : "Post-Pivot"}
                            </span>
                            <span className="font-bold">{m.displayAfter}</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#D1CCC4]">
                            <div
                              style={{ width: `${afterPct}%` }}
                              className="h-full rounded-full bg-[#C05E3E]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dual Impact Bullet Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5">
                <div className="font-mono text-xs font-semibold uppercase text-[#C05E3E]">
                  {lang === "vi"
                    ? "TÁC ĐỘNG KINH DOANH & CHUYỂN ĐỔI"
                    : "COMMERCIAL & PIPELINE IMPACT"}
                </div>
                <ul className="mt-3 space-y-2.5">
                  {project.retrospective.businessImpact.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs leading-relaxed text-[#0E0E0E]"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C05E3E]" />
                      <span className="line-clamp-3">{t(b, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5">
                <div className="font-mono text-xs font-semibold uppercase text-[#0E0E0E]">
                  {lang === "vi"
                    ? "GIÁ TRỊ THƯƠNG HIỆU & TÀI SẢN ĐỂ LẠI"
                    : "BRAND EQUITY & EVERGREEN ASSET LEGACY"}
                </div>
                <ul className="mt-3 space-y-2.5">
                  {project.retrospective.brandImpact.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs leading-relaxed text-[#0E0E0E]"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5C5852]" />
                      <span className="line-clamp-3">{t(b, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Learnings Box */}
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#D1CCC4] bg-[#EFECE6] p-5 md:grid-cols-2">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-[#C05E3E]">
                  {lang === "vi"
                    ? "CÔNG THỨC CHIẾN THẮNG (WINNING FORMULA)"
                    : "WINNING FORMULA"}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#0E0E0E] sm:text-sm line-clamp-3">
                  {t(project.retrospective.winningFormula, lang)}
                </p>
              </div>

              <div className="border-t border-[#D1CCC4] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <span className="font-mono text-xs font-bold uppercase text-[#0E0E0E]">
                  {lang === "vi"
                    ? "ĐIỂM SẼ NÂNG CẤP NẾU LÀM LẠI (NEXT OPTIMIZATION)"
                    : "WHAT I WOULD OPTIMIZE NEXT"}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#5C5852] sm:text-sm line-clamp-3">
                  {t(project.retrospective.whatToImprove, lang)}
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Lightbox Modal for Inspecting Station 03 Creative Assets */}
      <AnimatePresence>
        {lightboxAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxAsset(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setLightboxAsset(null)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-indigo-600"
              >
                <X className="h-4 w-4" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxAsset.src}
                alt={lightboxAsset.title}
                className="max-h-[65vh] w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-base font-bold">{lightboxAsset.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-300">
                  {lightboxAsset.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Conversion Footer */}
      <ConversionFooter />
    </div>
  );
}
