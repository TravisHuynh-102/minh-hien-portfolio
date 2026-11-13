"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Building2, Calendar, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TimelineBulletItem {
  label?: string;
  text: string;
}

export interface TimelineItemData {
  id?: string;
  title: string;
  organization?: string;
  description?: string;
  date: string;
  image: string;
  groupTag?: string;
  groupVariant?: "cyan" | "violet" | "amber" | "emerald" | "outline";
  metricPill?: string;
  bullets?: TimelineBulletItem[];
  tags?: string[];
}

export interface TimelineProps {
  items: TimelineItemData[];
  className?: string;
}

export default function Timeline({ items, className }: TimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 25%"],
  });

  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full divide-y divide-[#D1CCC4]", className)}
    >
      {/* Continuous Vertical Progress Spine on Desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[28px] top-0 hidden w-[2px] bg-[#D1CCC4] md:left-[280px] lg:left-[320px] md:block"
      >
        <motion.div
          style={{ height: beamHeight }}
          className="w-full bg-[#C05E3E]"
        />
      </div>

      {items.map((item, idx) => {
        const badgeVariant = item.groupVariant ?? "cyan";
        return (
          <motion.article
            key={item.id ?? `${item.date}-${idx}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.2) }}
            className="group relative grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]"
          >
            {/* Left Column: Sticky Date / Period & Track Classification */}
            <div className="relative border-b border-[#D1CCC4] bg-[#EFECE6]/70 p-6 md:border-b-0 md:border-r md:border-[#D1CCC4] md:p-8 lg:p-10">
              {/* Warm Terracotta Node on the Timeline Spine */}
              <div
                aria-hidden="true"
                className="absolute -right-[7px] top-9 z-10 hidden h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#C05E3E] bg-[#FAF9F6] md:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C05E3E]" />
              </div>

              <div className="md:sticky md:top-28 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-[#C05E3E]">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {item.date}
                  </span>

                  {item.groupTag && (
                    <Badge
                      variant={badgeVariant}
                      className="rounded-lg px-2.5 py-0.5 text-[11px]"
                    >
                      {item.groupTag}
                    </Badge>
                  )}
                </div>

                {item.organization && (
                  <div className="flex items-start gap-2 pt-1 text-xs font-medium text-[#0E0E0E] sm:text-sm">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C05E3E]" />
                    <span className="leading-snug">{item.organization}</span>
                  </div>
                )}

                {item.metricPill && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#C05E3E]/35 bg-[#C05E3E]/12 px-3 py-1.5 font-mono text-[11px] font-semibold text-[#A64B2E]">
                    <Sparkles className="h-3 w-3 shrink-0 text-[#C05E3E]" />
                    <span>{item.metricPill}</span>
                  </div>
                )}

                {/* Index Watermark */}
                <div className="hidden pt-2 font-mono text-3xl font-bold tracking-tighter text-[#D1CCC4] select-none md:block">
                  0{idx + 1}
                </div>
              </div>
            </div>

            {/* Right Column: Role Title, Structured Bullet Points & Visual Card */}
            <div className="flex flex-col justify-between gap-6 bg-[#FAF9F6] p-6 transition-colors group-hover:bg-[#F5F3ED]/60 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
                {/* Text & Bullet Breakdown */}
                <div className="space-y-4 xl:col-span-8">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight text-[#0E0E0E] sm:text-2xl group-hover:text-[#C05E3E] transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm leading-relaxed text-[#5C5852]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Detailed CV Bullet Points */}
                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="space-y-3 pt-1">
                      {item.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 rounded-lg border border-[#D1CCC4] bg-[#F5F3ED] p-3.5 text-xs leading-relaxed text-[#0E0E0E] sm:text-[13.5px]"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C05E3E]" />
                          <div>
                            {bullet.label ? (
                              <>
                                <strong className="font-semibold text-[#0E0E0E]">
                                  {bullet.label}:{" "}
                                </strong>
                                <span className="text-[#5C5852]">
                                  {bullet.text}
                                </span>
                              </>
                            ) : (
                              <span className="text-[#5C5852]">
                                {bullet.text}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Highlight Tags / Key Campaigns */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-[#D1CCC4] bg-[#EFECE6] px-2.5 py-1 font-mono text-[11px] text-[#0E0E0E] transition-colors group-hover:border-[#C05E3E]/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visual Preview Image */}
                <div className="xl:col-span-4">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#D1CCC4] bg-[#EFECE6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="truncate rounded-md border border-[#D1CCC4] bg-[#FAF9F6]/95 px-2 py-0.5 font-mono text-[10px] font-medium text-[#0E0E0E]">
                        {item.organization ?? item.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
