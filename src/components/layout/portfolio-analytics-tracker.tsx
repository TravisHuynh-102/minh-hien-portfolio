"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export type PortfolioEventType =
  | "page_view"
  | "case_study_view"
  | "coverflow_click"
  | "cv_download"
  | "contact_click";

function detectTrafficSource(): string {
  if (typeof window === "undefined") return "Direct";
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = (
      params.get("utm_source") ||
      params.get("ref") ||
      params.get("source") ||
      ""
    ).toLowerCase();

    if (utm.includes("linkedin")) return "LinkedIn";
    if (utm.includes("cv") || utm.includes("resume") || utm.includes("pdf"))
      return "CV / Resume PDF";
    if (utm.includes("fb") || utm.includes("facebook")) return "Facebook";
    if (utm.includes("github") || utm.includes("git")) return "GitHub";

    const ref = (document.referrer || "").toLowerCase();
    if (!ref) return "Direct";
    if (ref.includes("linkedin.com")) return "LinkedIn";
    if (ref.includes("facebook.com") || ref.includes("fb.com"))
      return "Facebook";
    if (ref.includes("github.com")) return "GitHub";
    if (ref.includes("google.")) return "Google Search";
    if (ref.includes(window.location.host)) return "Direct";
    return "Other";
  } catch {
    return "Direct";
  }
}

function detectDevice(): "Desktop" | "Mobile" {
  if (typeof window === "undefined") return "Desktop";
  return window.innerWidth < 768 ? "Mobile" : "Desktop";
}

export async function trackPortfolioEvent(payload: {
  type: PortfolioEventType;
  target: string;
  label?: string;
}): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const sessionKey = "portfolio_visited_session_v1";
    const isNewVisitor = !window.sessionStorage.getItem(sessionKey);
    if (isNewVisitor) {
      window.sessionStorage.setItem(sessionKey, "1");
    }

    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "track",
        type: payload.type,
        target: payload.target,
        label: payload.label || payload.target,
        source: detectTrafficSource(),
        device: detectDevice(),
        isNewVisitor,
      }),
      keepalive: true,
    });
  } catch {
    // Non-blocking analytics
  }
}

export function PortfolioAnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    if (pathname.startsWith("/work/")) {
      const slug = pathname.replace("/work/", "").split("/")[0];
      void trackPortfolioEvent({
        type: "case_study_view",
        target: slug,
        label: `Xem chi tiết Case Study: ${slug}`,
      });
    } else {
      void trackPortfolioEvent({
        type: "page_view",
        target: pathname,
        label: pathname === "/" ? "Trang chủ Portfolio" : pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = (anchor.getAttribute("href") || "").toLowerCase();
      if (!href) return;

      if (href.includes("cv.pdf") || anchor.hasAttribute("download")) {
        void trackPortfolioEvent({
          type: "cv_download",
          target: href,
          label: "Tải xuống CV PDF",
        });
      } else if (
        href.startsWith("mailto:") ||
        href.includes("zalo.me") ||
        href.includes("linkedin.com") ||
        href.startsWith("tel:")
      ) {
        void trackPortfolioEvent({
          type: "contact_click",
          target: href,
          label: `Click Liên hệ (${href.split(":")[0].replace("https", "Social")})`,
        });
      }
    };

    document.addEventListener("click", handleGlobalClick, { passive: true });
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return null;
}
