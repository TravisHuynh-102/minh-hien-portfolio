"use client";

import React from "react";
import Link from "next/link";
import { Archive, ArrowUpRight } from "lucide-react";
import { ARCHIVE_PROJECTS } from "@/data/projects";
import { useUIStore } from "@/store/use-ui-store";
import { t } from "@/lib/utils";

export function SelectedArchiveTable() {
  const { lang } = useUIStore();

  return (
    <section
      id="archive"
      className="border-b border-[#D1CCC4] bg-[#F5F3ED] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#C05E3E]">
              <Archive className="h-3.5 w-3.5" />
              <span>
                {lang === "vi"
                  ? "05 / DANH MỤC DỰ ÁN MỞ RỘNG (SELECTED ARCHIVE)"
                  : "05 / SELECTED CAMPAIGN & MARTECH ARCHIVE"}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0E0E0E] sm:text-3xl">
              {lang === "vi"
                ? "Các Chiến dịch Ngắn hạn, Kiểm toán CRO & Hệ thống BI Nội bộ"
                : "Additional Sprints, CRO Audits & Internal BI Systems"}
            </h2>
          </div>

          <span className="font-mono text-xs text-[#5C5852]">
            {ARCHIVE_PROJECTS.length}{" "}
            {lang === "vi" ? "Hạng mục lưu trữ" : "Archived Engagements"}
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="mt-8 hidden overflow-hidden rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#D1CCC4] bg-[#EFECE6] font-mono text-[11px] uppercase tracking-wider text-[#5C5852]">
                <th className="py-3.5 pl-6 pr-4">
                  {lang === "vi" ? "Năm" : "Year"}
                </th>
                <th className="px-4 py-3.5">
                  {lang === "vi"
                    ? "Tên dự án / Thương hiệu"
                    : "Project / Initiative"}
                </th>
                <th className="px-4 py-3.5">
                  {lang === "vi" ? "Hạng mục chuyên môn" : "Specialty"}
                </th>
                <th className="px-4 py-3.5">
                  {lang === "vi"
                    ? "Kết quả định lượng nổi bật"
                    : "Quantified Impact"}
                </th>
                <th className="py-3.5 pl-4 pr-6 text-right">
                  {lang === "vi" ? "Liên kết" : "Link"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1CCC4] text-sm">
              {ARCHIVE_PROJECTS.map((item, idx) => (
                <tr
                  key={idx}
                  className="group transition-colors hover:bg-[#F5F3ED]"
                >
                  <td className="whitespace-nowrap py-4 pl-6 pr-4 font-mono text-xs text-[#5C5852]">
                    {item.year}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-[#0E0E0E] group-hover:text-[#C05E3E]">
                      {t(item.name, lang)}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-[#5C5852]">
                      {t(item.clientType, lang)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="rounded-lg border border-[#D1CCC4] bg-[#EFECE6] px-2.5 py-1 font-mono text-xs text-[#0E0E0E]">
                      {t(item.specialty, lang)}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs font-semibold text-[#C05E3E]">
                    {t(item.highlightResult, lang)}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-6 text-right">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#0E0E0E] hover:text-[#C05E3E]"
                      >
                        <span>{lang === "vi" ? "Xem" : "View"}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[#5C5852]">
                        NDA
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (< 768px) */}
        <div className="mt-6 space-y-3 md:hidden">
          {ARCHIVE_PROJECTS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#5C5852]">
                  {item.year} • {t(item.clientType, lang)}
                </span>
                <span className="rounded-lg border border-[#D1CCC4] bg-[#EFECE6] px-2 py-0.5 font-mono text-[10px] text-[#0E0E0E]">
                  {t(item.specialty, lang)}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-semibold text-[#0E0E0E]">
                {t(item.name, lang)}
              </h3>

              <p className="mt-2 font-mono text-xs font-semibold text-[#C05E3E] line-clamp-2">
                {t(item.highlightResult, lang)}
              </p>

              {item.href && (
                <div className="mt-3 border-t border-[#D1CCC4] pt-2.5">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#0E0E0E] hover:text-[#C05E3E]"
                  >
                    <span>
                      {lang === "vi"
                        ? "Xem Case Study liên quan"
                        : "View Related Case Study"}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
