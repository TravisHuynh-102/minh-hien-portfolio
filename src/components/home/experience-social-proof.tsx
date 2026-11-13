"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Quote } from "lucide-react";
import TimelineBlock01 from "@/components/ui/timeline-01";
import { useUIStore } from "@/store/use-ui-store";
import { useCMSStore } from "@/store/use-cms-store";
import { t } from "@/lib/utils";

export function ExperienceSocialProof() {
  const { lang } = useUIStore();
  const { profile } = useCMSStore();

  return (
    <section
      id="journey"
      className="border-b border-[#D1CCC4] bg-[#F5F3ED] py-16 md:py-24"
    >
      {/* Full CV Experience Timeline Component (TimelineBlock01) */}
      <TimelineBlock01 />

      {/* Streamlined Animated Verified Credentials & Executive Endorsements Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-7xl px-4 md:px-8 lg:px-12"
      >
        <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
          {/* Top Row: Verified International Certifications Badges */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#D1CCC4] pb-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#C05E3E]">
              <Award className="h-4 w-4 text-[#C05E3E]" />
              <span>
                {lang === "vi"
                  ? "CHỨNG CHỈ CHUYÊN MÔN QUỐC TẾ ĐÃ XÁC THỰC"
                  : "VERIFIED INTERNATIONAL CERTIFICATIONS"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {profile.credentials.map((cert) => (
                <motion.div
                  key={cert.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#C05E3E]" />
                  <span className="text-xs font-semibold text-[#0E0E0E]">
                    {cert.issuer}
                  </span>
                  <span className="hidden font-mono text-[11px] text-[#5C5852] sm:inline">
                    • {t(cert.title, lang)}
                  </span>
                  <span className="rounded-md bg-[#C05E3E] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#FAF9F6]">
                    {cert.year}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Row: 3 Compact Executive Endorsement Cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {profile.testimonials.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-between rounded-xl border border-[#D1CCC4] bg-[#EFECE6] p-4 transition-colors hover:border-[#C05E3E]/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Quote className="h-3.5 w-3.5 shrink-0 text-[#C05E3E]" />
                    <span className="truncate rounded-md border border-[#C05E3E]/35 bg-[#C05E3E]/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#C05E3E]">
                      {item.metricHighlight}
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#0E0E0E] line-clamp-3">
                    “{t(item.quote, lang)}”
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#D1CCC4] pt-2.5">
                  <div>
                    <div className="text-xs font-semibold text-[#0E0E0E]">
                      {item.author}
                    </div>
                    <div className="font-mono text-[10px] text-[#5C5852]">
                      {t(item.role, lang)} • {t(item.company, lang)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
