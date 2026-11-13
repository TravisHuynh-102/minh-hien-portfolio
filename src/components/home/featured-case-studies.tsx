"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";
import { useCMSStore } from "@/store/use-cms-store";
import type { ProjectCategory } from "@/types/portfolio";
import { cn, t } from "@/lib/utils";
import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";

const R2 = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images";
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

const PROJECT_COVER_IMAGES = [
  `${R2}/767d99bb371a54d0d36751e8cecae43c.jpg`,
  `${R2}/821d815affa6496c39cbdeeec7a84603.jpg`,
  `${R2}/937438c560ada1c83317f2c11b3454b0.jpg`,
  `${R2}/98f89cb9994f5c382ab964062c4039db.jpg`,
  `${R2}/ddcbee38be8b7274e19e132d7ab35b53.jpg`,
  UNSPLASH("1470071459604-3b5ec3a7fe05"),
  UNSPLASH("1500534314209-a25ddb2bd429"),
  UNSPLASH("1441974231531-c6227db76b6e"),
  UNSPLASH("1493246507139-91e8fad9978e"),
  UNSPLASH("1501785888041-af3ef285b470"),
  UNSPLASH("1465101162946-4377e57745c3"),
];

export function FeaturedCaseStudies() {
  const { lang, activeCategory, setActiveCategory } = useUIStore();
  const { featuredProjects, archiveProjects } = useCMSStore();
  const [selectedSlideIdx, setSelectedSlideIdx] = useState<number>(0);
  const router = useRouter();

  const filterTabs: {
    id: ProjectCategory;
    label: { vi: string; en: string };
    count: number;
  }[] = useMemo(() => {
    return [
      {
        id: "all",
        label: { vi: "Tất cả Dự án", en: "All Projects" },
        count: featuredProjects.length + archiveProjects.length,
      },
      {
        id: "imc",
        label: { vi: "Full-Funnel IMC", en: "Full-Funnel IMC" },
        count: featuredProjects.filter((p) => p.category === "imc").length,
      },
      {
        id: "performance-b2b",
        label: {
          vi: "Performance & B2B",
          en: "Performance & B2B",
        },
        count: featuredProjects.filter((p) => p.category === "performance-b2b")
          .length,
      },
      {
        id: "marcom-event",
        label: { vi: "MarCom & Sự kiện O2O", en: "MarCom & O2O Events" },
        count: featuredProjects.filter((p) => p.category === "marcom-event")
          .length,
      },
    ];
  }, [featuredProjects, archiveProjects]);

  const coverflowItems = useMemo(() => {
    const featuredSlides: (CoverflowSlide & {
      slug: string;
      category: ProjectCategory;
      summary: string;
      channels: string[];
      miniMetrics: { value: string; label: string }[];
    })[] = featuredProjects.map((proj, idx) => ({
      src:
        proj.thumbnail && proj.thumbnail.startsWith("http")
          ? proj.thumbnail
          : PROJECT_COVER_IMAGES[idx % PROJECT_COVER_IMAGES.length],
      alt: t(proj.title, lang),
      title: t(proj.title, lang),
      subtitle: `${t(proj.industryPill, lang)} • ${t(proj.rolePill, lang)}`,
      badge: proj.cardMiniMetrics[0]?.value || "+100% KPI",
      href: `/work/${proj.slug}`,
      slug: proj.slug,
      category: proj.category,
      summary: t(proj.shortSummary, lang),
      channels: proj.channels,
      miniMetrics: proj.cardMiniMetrics.map((m) => ({
        value: m.value,
        label: t(m.label, lang),
      })),
      meta: [
        {
          label: lang === "vi" ? "Ngành hàng" : "Industry",
          value: t(proj.industryPill, lang),
        },
        {
          label: lang === "vi" ? "Vai trò" : "My Role",
          value: t(proj.rolePill, lang),
        },
        {
          label: lang === "vi" ? "Kết quả chính" : "Key Outcome",
          value: `${proj.cardMiniMetrics[0]?.value || ""} | ${proj.cardMiniMetrics[1]?.value || ""}`,
        },
        {
          label: lang === "vi" ? "Thời gian" : "Timeframe",
          value: proj.timeframe,
        },
      ],
    }));

    const archiveSlides = archiveProjects.map((arc, idx) => {
      const linkedFeatured =
        featuredProjects.find((f) => `/work/${f.slug}` === arc.href) ||
        featuredProjects[idx % Math.max(1, featuredProjects.length)];

      return {
        src: PROJECT_COVER_IMAGES[(idx + 4) % PROJECT_COVER_IMAGES.length],
        alt: t(arc.name, lang),
        title: t(arc.name, lang),
        subtitle: `${t(arc.clientType, lang)} • ${t(arc.specialty, lang)}`,
        badge: arc.year,
        href: arc.href || (linkedFeatured ? `/work/${linkedFeatured.slug}` : "/#work"),
        slug: linkedFeatured ? linkedFeatured.slug : "university-admissions-imc-2025",
        category: (linkedFeatured?.category || "imc") as ProjectCategory,
        summary: t(arc.highlightResult, lang),
        channels: [t(arc.specialty, lang), t(arc.clientType, lang), arc.year],
        miniMetrics: linkedFeatured
          ? linkedFeatured.cardMiniMetrics.map((m) => ({
              value: m.value,
              label: t(m.label, lang),
            }))
          : [],
        meta: [
          {
            label: lang === "vi" ? "Năm" : "Year",
            value: arc.year,
          },
          {
            label: lang === "vi" ? "Khách hàng" : "Client Type",
            value: t(arc.clientType, lang),
          },
          {
            label: lang === "vi" ? "Chuyên môn" : "Specialty",
            value: t(arc.specialty, lang),
          },
        ],
      };
    });

    const all = [...featuredSlides, ...archiveSlides];
    if (activeCategory === "all") return all;
    const matching = all.filter((item) => item.category === activeCategory);
    const others = all.filter((item) => item.category !== activeCategory);
    return [...matching, ...others];
  }, [lang, activeCategory, featuredProjects, archiveProjects]);

  const safeSlideIdx =
    ((selectedSlideIdx % coverflowItems.length) + coverflowItems.length) %
    coverflowItems.length;
  const activeSlide = coverflowItems[safeSlideIdx];

  return (
    <section
      id="work"
      className="border-b border-[#D1CCC4] bg-[#F5F3ED] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header + Category Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#C05E3E]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {lang === "vi"
                  ? "02 / TRÌNH DIỄN DỰ ÁN 3D COVERFLOW (FEATURED PORTFOLIO)"
                  : "02 / 3D COVERFLOW PROJECT SHOWCASE & CASE STUDIES"}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0E0E0E] sm:text-3xl lg:text-4xl">
              {lang === "vi"
                ? "Khám phá Dự án qua 3D Coverflow & Phân tích Chiều sâu"
                : "Interactive 3D Coverflow Portfolio & Full-Funnel Case Studies"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#5C5852] line-clamp-2">
              {lang === "vi"
                ? "Kéo trượt 3D Coverflow, dùng phím mũi tên ← → hoặc click trực tiếp vào thẻ chính giữa để mở bài phân tích 5 Trạm."
                : "Drag the 3D Coverflow ring, use ← → arrow keys, or click the active center card directly to open the 5-station breakdown."}
            </p>
          </div>

          {/* Category Filter Menu */}
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setSelectedSlideIdx(0);
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-colors",
                    isActive
                      ? "border-[#C05E3E] bg-[#C05E3E] font-semibold text-[#FAF9F6] shadow-sm shadow-indigo-500/20"
                      : "border-[#D1CCC4] bg-[#FAF9F6] text-[#0E0E0E] hover:bg-[#EBE7DF]"
                  )}
                >
                  <span>{t(tab.label, lang)}</span>
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px]",
                      isActive
                        ? "bg-[#FAF9F6]/20 text-[#FAF9F6]"
                        : "bg-[#EFECE6] text-[#5C5852]"
                    )}
                  >
                    {tab.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ===============================================================
            3D COVERFLOW CAROUSEL STAGE + PROJECT QUICK-SELECT MENU
        =============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-8 overflow-hidden rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6]"
        >
          {/* Top Quick-Jump Portfolio Menu */}
          <div className="border-b border-[#D1CCC4] bg-[#EFECE6] px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="mr-1 shrink-0 font-mono text-[11px] font-medium uppercase tracking-wider text-[#5C5852]">
                {lang === "vi" ? "Chọn nhanh Dự án:" : "Quick Select:"}
              </span>
              {coverflowItems.slice(0, 6).map((item, idx) => {
                const isCurrent = safeSlideIdx === idx;
                return (
                  <button
                    key={`${item.slug}-${idx}`}
                    type="button"
                    onClick={() => setSelectedSlideIdx(idx)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all",
                      isCurrent
                        ? "border-[#C05E3E] bg-[#C05E3E] text-[#FAF9F6] shadow-sm"
                        : "border-[#D1CCC4] bg-[#FAF9F6] text-[#0E0E0E] hover:bg-[#EBE7DF]"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isCurrent ? "bg-[#FAF9F6]" : "bg-[#C05E3E]"
                      )}
                    />
                    <span className="max-w-[180px] truncate">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                          isCurrent
                            ? "bg-[#FAF9F6]/20 text-[#FAF9F6]"
                            : "bg-[#EFECE6] text-[#C05E3E]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D CoverflowCarousel Component */}
          <div className="w-full overflow-hidden bg-[#F5F3ED] py-6">
            <CoverflowCarousel
              slides={coverflowItems}
              activeIndex={safeSlideIdx}
              onSlideChange={(idx) =>
                setSelectedSlideIdx((prev) => (prev === idx ? prev : idx))
              }
              onActiveSlideClick={(slide) => {
                if (slide.href) {
                  router.push(slide.href);
                }
              }}
              ctaLabel={
                lang === "vi"
                  ? "Mở trang chi tiết dự án"
                  : "Open Full Case Study"
              }
              showCaption
              showNavigation
              showPagination
              cardWidth="clamp(195px, 25vw, 305px)"
            />
          </div>

          {/* Active Slide Executive Action Bar with Animated Slide Transitions */}
          {activeSlide && (
            <div className="border-t border-[#D1CCC4] bg-[#EFECE6] px-5 py-5 sm:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeSlide.slug}-${safeSlideIdx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center"
                >
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-[#C05E3E] bg-[#C05E3E] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#FAF9F6]">
                        ACTIVE CASE STUDY // 0{safeSlideIdx + 1}
                      </span>
                      {activeSlide.channels.slice(0, 4).map((ch) => (
                        <span
                          key={ch}
                          className="rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2 py-0.5 font-mono text-[10px] text-[#5C5852]"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#0E0E0E] sm:text-sm line-clamp-2">
                      {activeSlide.summary}
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-4 py-2">
                      {activeSlide.miniMetrics.slice(0, 2).map((m, i) => (
                        <div
                          key={i}
                          className={cn(
                            "text-left",
                            i !== 0 && "border-l border-[#D1CCC4] pl-3"
                          )}
                        >
                          <div className="font-mono text-sm font-bold text-[#C05E3E]">
                            {m.value}
                          </div>
                          <div className="font-mono text-[10px] text-[#5C5852]">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/work/${activeSlide.slug}`}
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-5 font-mono text-xs font-semibold text-[#FAF9F6] shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#AD5234]"
                    >
                      <span>
                        {lang === "vi"
                          ? "Đọc phân tích 5 Trạm →"
                          : "Read 5-Station Case Study →"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
