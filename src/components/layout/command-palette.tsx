"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileDown,
  FolderKanban,
  Globe,
  Hash,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/site-config";
import { FEATURED_PROJECTS } from "@/data/projects";
import { useUIStore } from "@/store/use-ui-store";
import { t } from "@/lib/utils";

interface CommandItem {
  id: string;
  group: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const { lang, toggleLang, theme, toggleTheme, isCommandOpen, setCommandOpen } =
    useUIStore();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!isCommandOpen);
      } else if (e.key === "Escape" && isCommandOpen) {
        setCommandOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCommandOpen, setCommandOpen]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setCommandOpen(false);
      }, 1200);
    } catch {
      // Fallback
    }
  };

  const items: CommandItem[] = useMemo(() => {
    const projectItems: CommandItem[] = FEATURED_PROJECTS.map((proj) => ({
      id: `proj-${proj.slug}`,
      group: lang === "vi" ? "Case Studies Trọng điểm" : "Featured Case Studies",
      label: t(proj.title, lang),
      sublabel: `${t(proj.industryPill, lang)} • ${proj.cardMiniMetrics[0].value}`,
      icon: <FolderKanban className="h-4 w-4 text-[#C05E3E]" />,
      action: () => {
        setCommandOpen(false);
        router.push(`/work/${proj.slug}`);
      },
    }));

    const sectionItems: CommandItem[] = [
      {
        id: "sec-hero",
        group: lang === "vi" ? "Điều hướng Trang chủ" : "Homepage Sections",
        label: lang === "vi" ? "01. Mở đầu & 4 Chỉ số Tác động" : "01. Hero & Impact Metrics",
        icon: <Hash className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          setCommandOpen(false);
          router.push("/#hero");
        },
      },
      {
        id: "sec-work",
        group: lang === "vi" ? "Điều hướng Trang chủ" : "Homepage Sections",
        label: lang === "vi" ? "02. Dự án Trọng điểm (Case Studies)" : "02. Featured Case Studies",
        icon: <Hash className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          setCommandOpen(false);
          router.push("/#work");
        },
      },
      {
        id: "sec-lab",
        group: lang === "vi" ? "Điều hướng Trang chủ" : "Homepage Sections",
        label: lang === "vi" ? "03. Creative Showcase & Bộ mô phỏng ROAS" : "03. Creative Lab & ROAS Simulator",
        icon: <Hash className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          setCommandOpen(false);
          router.push("/#lab");
        },
      },
      {
        id: "sec-capabilities",
        group: lang === "vi" ? "Điều hướng Trang chủ" : "Homepage Sections",
        label:
          lang === "vi"
            ? "04. Ba Trụ cột Năng lực & InkOrbit AI Workflow"
            : "04. Capabilities & InkOrbit AI Workflow",
        icon: <Hash className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          setCommandOpen(false);
          router.push("/#capabilities");
        },
      },
      {
        id: "sec-archive",
        group: lang === "vi" ? "Điều hướng Trang chủ" : "Homepage Sections",
        label: lang === "vi" ? "05. Danh mục Dự án Mở rộng (Archive)" : "05. Selected Archive Table",
        icon: <Hash className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          setCommandOpen(false);
          router.push("/#archive");
        },
      },
      {
        id: "sec-journey",
        group: lang === "vi" ? "Điều hướng Trang chủ" : "Homepage Sections",
        label: lang === "vi" ? "06. Hành trình Sự nghiệp & Đánh giá" : "06. Experience & Executive Proof",
        icon: <Hash className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          setCommandOpen(false);
          router.push("/#journey");
        },
      },
      {
        id: "sec-contact",
        group: lang === "vi" ? "Điều hướng Trang chủ" : "Homepage Sections",
        label: lang === "vi" ? "07. Liên hệ & Hợp tác Chiến lược" : "07. Contact & Collaboration",
        icon: <Hash className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          setCommandOpen(false);
          router.push("/#contact");
        },
      },
    ];

    const utilityItems: CommandItem[] = [
      {
        id: "util-theme",
        group: lang === "vi" ? "Thao tác Nhanh" : "Quick Actions",
        label:
          theme === "dark"
            ? lang === "vi"
              ? "Chuyển sang Giao diện Sáng (Switch to Light Mode)"
              : "Switch to Light Mode (Claude Crimson Light)"
            : lang === "vi"
              ? "Chuyển sang Giao diện Tối (Switch to Dark Mode)"
              : "Switch to Dark Mode (Claude Crimson Dark)",
        icon:
          theme === "dark" ? (
            <Sun className="h-4 w-4 text-[#C05E3E]" />
          ) : (
            <Moon className="h-4 w-4 text-[#C05E3E]" />
          ),
        action: () => {
          toggleTheme();
          setCommandOpen(false);
        },
      },
      {
        id: "util-lang",
        group: lang === "vi" ? "Thao tác Nhanh" : "Quick Actions",
        label:
          lang === "vi"
            ? "Chuyển ngôn ngữ sang Tiếng Anh (Switch to EN)"
            : "Switch language to Vietnamese (Chuyển sang VI)",
        icon: <Globe className="h-4 w-4 text-[#C05E3E]" />,
        action: () => {
          toggleLang();
          setCommandOpen(false);
        },
      },
      {
        id: "util-email",
        group: lang === "vi" ? "Thao tác Nhanh" : "Quick Actions",
        label: copied
          ? t(SITE_CONFIG.hero.copiedFeedback, lang)
          : `${t(SITE_CONFIG.hero.secondaryCta, lang)} (${SITE_CONFIG.email})`,
        icon: copied ? (
          <Check className="h-4 w-4 text-[#C05E3E]" />
        ) : (
          <Copy className="h-4 w-4 text-[#5C5852]" />
        ),
        action: handleCopyEmail,
      },
      {
        id: "util-cv",
        group: lang === "vi" ? "Thao tác Nhanh" : "Quick Actions",
        label: lang === "vi" ? "Mở / Tải CV PDF (/cv.pdf)" : "Open / Download CV PDF (/cv.pdf)",
        icon: <FileDown className="h-4 w-4 text-[#5C5852]" />,
        action: () => {
          window.open(SITE_CONFIG.cvPath, "_blank", "noopener,noreferrer");
          setCommandOpen(false);
        },
      },
    ];

    return [...utilityItems, ...projectItems, ...sectionItems];
  }, [lang, theme, copied, router, setCommandOpen, toggleLang, toggleTheme]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        (item.sublabel && item.sublabel.toLowerCase().includes(q))
    );
  }, [items, query]);

  if (!isCommandOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#0E0E0E]/45 px-4 pt-20 backdrop-blur-xs"
      onClick={() => setCommandOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] text-[#0E0E0E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center border-b border-[#D1CCC4] bg-[#F5F3ED] px-3.5 py-3">
          <Search className="mr-2.5 h-4 w-4 text-[#C05E3E]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === "vi"
                ? "Tìm kiếm dự án, nhảy đến mục hoặc gõ lệnh (VD: Dark, ROAS, CV)..."
                : "Search case studies, jump to sections, or run actions (e.g., Dark, ROAS, CV)..."
            }
            className="w-full bg-transparent text-sm text-[#0E0E0E] placeholder-[#5C5852] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setCommandOpen(false)}
            className="ml-2 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] p-1 text-[#5C5852] hover:bg-[#E6E2DA] hover:text-[#0E0E0E]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filtered Results List */}
        <div className="max-h-[65dvh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#5C5852]">
              {lang === "vi"
                ? "Không tìm thấy kết quả phù hợp."
                : "No matching commands or case studies found."}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#EFECE6]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#D1CCC4] bg-[#F5F3ED]">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#0E0E0E] group-hover:text-[#C05E3E]">
                        {item.label}
                      </p>
                      {item.sublabel && (
                        <p className="truncate font-mono text-[11px] text-[#5C5852]">
                          {item.sublabel}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <span className="hidden rounded-lg border border-[#D1CCC4] bg-[#F5F3ED] px-2 py-0.5 font-mono text-[10px] text-[#5C5852] sm:inline">
                      {item.group}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#5C5852] group-hover:text-[#C05E3E]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between border-t border-[#D1CCC4] bg-[#EFECE6] px-4 py-2 font-mono text-[11px] text-[#5C5852]">
          <span>
            {lang === "vi"
              ? "Nhấn ESC để đóng • Click để thực thi"
              : "Press ESC to close • Click to execute"}
          </span>
          <span>⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
