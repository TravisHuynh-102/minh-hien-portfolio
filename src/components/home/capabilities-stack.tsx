"use client";

import React from "react";
import { Check, Cpu, Layers, TrendingUp, Wrench } from "lucide-react";
import { SITE_CONFIG } from "@/data/site-config";
import { useUIStore } from "@/store/use-ui-store";
import { t } from "@/lib/utils";
import { InkOrbitShowcase } from "@/components/ui/ink-orbit-features";

export function CapabilitiesStack() {
  const { lang } = useUIStore();

  const getPillarIcon = (id: string) => {
    switch (id) {
      case "brand-marcom":
        return <Layers className="h-4 w-4 text-[#C05E3E]" />;
      case "performance-cro":
        return <TrendingUp className="h-4 w-4 text-[#C05E3E]" />;
      default:
        return <Cpu className="h-4 w-4 text-[#C05E3E]" />;
    }
  };

  return (
    <section
      id="capabilities"
      className="border-b border-[#D1CCC4] bg-[#F5F3ED] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#C05E3E]">
            <Wrench className="h-3.5 w-3.5" />
            <span>
              {lang === "vi"
                ? "04 / MA TRẬN NĂNG LỰC & CÔNG CỤ (CAPABILITIES & STACK)"
                : "04 / CORE CAPABILITIES & MARTECH STACK"}
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0E0E0E] sm:text-3xl">
            {lang === "vi"
              ? "Ba Trụ cột Vận hành Tăng trưởng Toàn diện"
              : "Three Pillars of Full-Stack Marketing Execution"}
          </h2>
          <p className="mt-2 text-sm text-[#5C5852] line-clamp-2">
            {lang === "vi"
              ? "Kết nối liền mạch giữa Sáng tạo Thương hiệu (MarCom), Mua quảng cáo chuyển đổi (Paid Media/CRO) và Hạ tầng đo lường dữ liệu (Martech/AI)."
              : "Uniting Brand/MarCom direction, high-ROAS paid media & CRO, and server-side Martech attribution in one cohesive workflow."}
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SITE_CONFIG.capabilities.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col justify-between rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] p-6 transition-colors hover:border-[#C05E3E]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3">
                  <span className="font-mono text-xs font-semibold text-[#C05E3E]">
                    {pillar.code}
                  </span>
                  {getPillarIcon(pillar.id)}
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#0E0E0E]">
                  {t(pillar.title, lang)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#5C5852] line-clamp-2">
                  {t(pillar.subtitle, lang)}
                </p>

                <ul className="mt-5 space-y-3 border-t border-[#D1CCC4] pt-4">
                  {pillar.coreStrengths.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-[#0E0E0E]"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C05E3E]" />
                      <span className="line-clamp-3">{t(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-[#D1CCC4] pt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#5C5852]">
                  {lang === "vi"
                    ? "ĐẦU RA CHỦ LỰC (KEY DELIVERABLES)"
                    : "KEY DELIVERABLES"}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pillar.deliverables.map((deliv, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-[#D1CCC4] bg-[#EFECE6] px-2.5 py-0.5 font-mono text-[11px] text-[#0E0E0E]"
                    >
                      {t(deliv, lang)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grouped Tool Badges Strip */}
        <div className="mt-8 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E0E0E]">
              {lang === "vi"
                ? "HỆ SINH THÁI MARTECH & AI SỬ DỤNG HÀNG NGÀY:"
                : "DAILY MARTECH, ANALYTICS & AI WORKFLOW STACK:"}
            </span>
            <span className="font-mono text-[11px] font-semibold text-[#C05E3E]">
              {SITE_CONFIG.allToolsStrip.length} Verified Platforms
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {SITE_CONFIG.allToolsStrip.map((tool) => (
              <span
                key={tool}
                className="rounded-lg border border-[#D1CCC4] bg-[#EFECE6] px-3 py-1 font-mono text-xs text-[#0E0E0E] transition-colors hover:border-[#C05E3E] hover:bg-[#EBE7DF]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive InkOrbitFeatures Bento Showcase with Live Dark/Light & Preset Controls */}
        <InkOrbitShowcase />
      </div>
    </section>
  );
}
