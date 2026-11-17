"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Check,
  Cloud,
  Copy,
  Download,
  ExternalLink,
  Eye,
  GitBranch,
  Globe,
  Laptop,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useCMSStore } from "@/store/use-cms-store";
import type { PortfolioAnalyticsPayload } from "@/app/api/analytics/route";
import { cn, t } from "@/lib/utils";

interface CloudStatusInfo {
  repo: string;
  branch: string;
  hasToken: boolean;
  tokenSource: "header" | "env" | "git-credential" | "none";
  isVercel: boolean;
}

export function AdminAnalyticsCloudPanel({
  onNotify,
  onJumpToProject,
}: {
  onNotify: (msg: string) => void;
  onJumpToProject: (index: number) => void;
}) {
  const {
    featuredProjects,
    githubToken,
    setGithubToken,
    lastSyncResult,
    saveToServer,
    isSyncing,
  } = useCMSStore();

  const [analytics, setAnalytics] = useState<PortfolioAnalyticsPayload | null>(
    null
  );
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [syncingAnalyticsCloud, setSyncingAnalyticsCloud] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<CloudStatusInfo | null>(null);
  const [tokenInput, setTokenInput] = useState(githubToken || "");
  const [copiedUtm, setCopiedUtm] = useState<string | null>(null);

  const fetchAnalyticsAndCloudStatus = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const [anaRes, cloudRes] = await Promise.all([
        fetch("/api/analytics", { cache: "no-store" }),
        fetch("/api/cms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "cloud-status",
            githubToken: githubToken || undefined,
          }),
        }),
      ]);

      if (anaRes.ok) {
        const anaData = (await anaRes.json()) as PortfolioAnalyticsPayload;
        setAnalytics(anaData);
      }
      if (cloudRes.ok) {
        const cData = (await cloudRes.json()) as {
          ok?: boolean;
          cloud?: CloudStatusInfo;
        };
        if (cData.cloud) {
          setCloudStatus(cData.cloud);
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setLoadingAnalytics(false);
    }
  }, [githubToken]);

  useEffect(() => {
    void fetchAnalyticsAndCloudStatus();
  }, [fetchAnalyticsAndCloudStatus]);

  const handleSaveToken = async () => {
    setGithubToken(tokenInput);
    onNotify(
      tokenInput.trim()
        ? "Đã lưu GitHub Cloud Token cho trình duyệt này!"
        : "Đã xóa GitHub Cloud Token tùy chỉnh."
    );
    setTimeout(() => {
      void fetchAnalyticsAndCloudStatus();
    }, 150);
  };

  const handleSyncAnalyticsToGithub = async () => {
    setSyncingAnalyticsCloud(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sync-cloud",
          githubToken: githubToken || undefined,
        }),
      });
      const data = (await res.json()) as {
        syncedCloud?: boolean;
        cloudError?: string;
      };
      if (data.syncedCloud) {
        onNotify("Đã đồng bộ Snapshot Số liệu Traffic lên GitHub Cloud!");
      } else {
        onNotify(
          data.cloudError || "Đã lưu số liệu cục bộ (chưa có GitHub Token)."
        );
      }
    } catch {
      onNotify("Lỗi khi đồng bộ số liệu lên GitHub Cloud.");
    } finally {
      setSyncingAnalyticsCloud(false);
    }
  };

  const handleResetAnalytics = async () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Bạn có chắc muốn đặt lại toàn bộ bộ đếm lượt xem và lịch sử truy cập về 0?"
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          githubToken: githubToken || undefined,
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { data: PortfolioAnalyticsPayload };
        setAnalytics(json.data);
        onNotify("Đã đặt lại toàn bộ bộ đếm Traffic về 0!");
      }
    } catch {
      onNotify("Không thể đặt lại bộ đếm.");
    }
  };

  const copyUtmUrl = (sourceKey: string, url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(url);
      setCopiedUtm(sourceKey);
      onNotify(`Đã copy link UTM (${sourceKey})!`);
      setTimeout(() => setCopiedUtm(null), 2200);
    }
  };

  const totalCoverflowClicks = Object.values(
    analytics?.projectStats || {}
  ).reduce((acc, item) => acc + (item.coverflowClicks || 0), 0);

  const totalCaseStudyViews = Object.values(
    analytics?.projectStats || {}
  ).reduce((acc, item) => acc + (item.views || 0), 0);

  const maxProjectViews = Math.max(
    1,
    ...featuredProjects.map(
      (p) => analytics?.projectStats?.[p.slug]?.views || 0
    )
  );

  const totalTrafficSourceCount = Math.max(
    1,
    Object.values(analytics?.trafficSources || {}).reduce((a, b) => a + b, 0)
  );

  return (
    <div className="mt-6 space-y-6">
      {/* =====================================================================
          SECTION 1: GITHUB CLOUD SYNC ENGINE STATUS
      ===================================================================== */}
      <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#D1CCC4] pb-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C05E3E] text-[#FAF9F6] shadow-sm">
              <Cloud className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-[#0E0E0E]">
                  1. Đồng bộ Admin CMS trực tiếp lên GitHub & Vercel Cloud
                </h2>
                {cloudStatus?.hasToken ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Đã kết nối GitHub Cloud ({cloudStatus.tokenSource})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800">
                    Chế độ Local / Cần nhập GitHub Token nếu sửa trực tiếp trên
                    Web
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#5C5852]">
                Mọi chỉnh sửa khi bấm{" "}
                <strong className="text-[#0E0E0E]">Lưu & Xuất bản</strong> sẽ tự
                động commit thẳng vào file{" "}
                <code className="rounded bg-[#EFECE6] px-1.5 py-0.5 font-mono text-[11px] text-[#C05E3E]">
                  src/data/cms-data.json
                </code>{" "}
                trên nhánh{" "}
                <strong className="font-mono text-[#0E0E0E]">
                  {cloudStatus?.branch || "main"}
                </strong>{" "}
                của repo{" "}
                <a
                  href={`https://github.com/${cloudStatus?.repo || "TravisHuynh-102/minh-hien-portfolio"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-semibold text-[#C05E3E] underline hover:opacity-80"
                >
                  {cloudStatus?.repo || "TravisHuynh-102/minh-hien-portfolio"}
                </a>
                . Trang Vercel đọc dữ liệu mới nhất theo thời gian thực!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://github.com/TravisHuynh-102/minh-hien-portfolio/blob/main/src/data/cms-data.json"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs font-medium text-[#0E0E0E] hover:border-[#C05E3E] hover:text-[#C05E3E]"
            >
              <GitBranch className="h-3.5 w-3.5 text-[#C05E3E]" />
              <span>Xem file CMS trên GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              type="button"
              disabled={isSyncing}
              onClick={async () => {
                const res = await saveToServer();
                if (res.syncedCloud) {
                  onNotify(
                    "Đã đẩy toàn bộ dữ liệu CMS lên GitHub Cloud (main) thành công!"
                  );
                } else if (res.savedLocal) {
                  onNotify(
                    res.cloudError || "Đã lưu vào file cms-data.json trên máy!"
                  );
                } else {
                  onNotify(
                    res.cloudError ||
                      "Chưa thể đồng bộ Cloud — hãy nhập GitHub Token bên dưới."
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C05E3E] px-4 py-2 font-mono text-xs font-semibold text-[#FAF9F6] shadow-sm hover:bg-[#AD5234] disabled:opacity-50"
            >
              <Cloud className="h-3.5 w-3.5" />
              <span>
                {isSyncing ? "Đang đẩy lên Cloud..." : "Đẩy CMS lên Cloud ngay"}
              </span>
            </button>
          </div>
        </div>

        {/* Last Sync Status Banner */}
        {lastSyncResult && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/70 px-4 py-2.5 font-mono text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#C05E3E]" />
              <span>
                Trạng thái lần lưu gần nhất:{" "}
                <strong>
                  {lastSyncResult.syncedCloud
                    ? "Đã đồng bộ GitHub Cloud + Local thành công"
                    : lastSyncResult.savedLocal
                      ? "Đã lưu Local Disk"
                      : "Chỉ lưu Trình duyệt"}
                </strong>
              </span>
            </div>
            {lastSyncResult.cloudUrl && (
              <a
                href={lastSyncResult.cloudUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#C05E3E] underline"
              >
                <span>Kiểm tra bản ghi trên GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* Optional GitHub Token Input for Remote / Mobile Admin Editing */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/50 p-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <label className="mb-1 block font-mono text-xs font-semibold text-[#0E0E0E]">
              GitHub Personal Access Token (Tùy chọn khi sửa trực tiếp trên
              minh-hien-portfolio.vercel.app/admin từ điện thoại/máy lạ)
            </label>
            <p className="mb-2 text-[11px] text-[#5C5852]">
              Trên máy tính cá nhân của bạn, hệ thống đã{" "}
              <strong className="text-[#0E0E0E]">
                tự động nhận diện quyền GitHub (`git-credential`)
              </strong>{" "}
              nên không cần nhập. Nếu bạn mở `/admin` trên điện thoại và muốn
              bấm Lưu là đẩy thẳng lên GitHub, hãy dán GitHub Token (`repo`
              scope) vào đây hoặc thêm biến môi trường{" "}
              <code className="font-mono text-[#C05E3E]">GITHUB_CMS_TOKEN</code>{" "}
              trên Vercel.
            </p>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3.5 py-2 font-mono text-xs text-[#0E0E0E] focus:border-[#C05E3E] focus:outline-none"
            />
          </div>
          <div className="lg:col-span-3">
            <button
              type="button"
              onClick={handleSaveToken}
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#C05E3E] bg-[#FAF9F6] px-4 font-mono text-xs font-semibold text-[#C05E3E] transition-colors hover:bg-[#C05E3E] hover:text-[#FAF9F6]"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Lưu Token trên máy này</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: EXECUTIVE TRAFFIC & ENGAGEMENT KPI CARDS
      ===================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-[#5C5852]">
              Tổng Lượt Xem (Page Views)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFECE6] text-[#C05E3E]">
              <Eye className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 font-mono text-3xl font-bold text-[#0E0E0E]">
            {loadingAnalytics ? "..." : analytics?.totalPageViews ?? 0}
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#5C5852]">
            Bao gồm Trang chủ & các trang Case Study
          </p>
        </div>

        <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-[#5C5852]">
              Người Xem Duy Nhất (Unique)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFECE6] text-[#C05E3E]">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 font-mono text-3xl font-bold text-[#0E0E0E]">
            {loadingAnalytics ? "..." : analytics?.uniqueVisitors ?? 0}
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#5C5852]">
            Phiên truy cập của HR / Khách hàng
          </p>
        </div>

        <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-[#5C5852]">
              Lượt Đọc Case Study & 3D Click
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFECE6] text-[#C05E3E]">
              <MousePointerClick className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-[#C05E3E]">
              {loadingAnalytics ? "..." : totalCaseStudyViews}
            </span>
            <span className="font-mono text-xs text-[#5C5852]">
              ({totalCoverflowClicks} click từ 3D Coverflow)
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#5C5852]">
            Tương tác sâu vào bài phân tích 5 Trạm
          </p>
        </div>

        <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-[#5C5852]">
              Chuyển Đổi: Tải CV & Liên Hệ
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFECE6] text-[#C05E3E]">
              <Download className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-[#0E0E0E]">
              {loadingAnalytics
                ? "..."
                : (analytics?.cvDownloads ?? 0) +
                  (analytics?.contactClicks ?? 0)}
            </span>
            <span className="font-mono text-xs text-[#5C5852]">
              ({analytics?.cvDownloads ?? 0} CV •{" "}
              {analytics?.contactClicks ?? 0} Liên hệ)
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#5C5852]">
            Lượt bấm tải CV PDF, Zalo, Email & LinkedIn
          </p>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: CASE STUDY PERFORMANCE RANKING + TRAFFIC SOURCES
      ===================================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 cols: Case Study Ranking */}
        <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 shadow-sm lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D1CCC4] pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#C05E3E]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E0E0E]">
                Xếp hạng Lượt xem từng Dự án Case Study
              </h3>
            </div>
            <span className="font-mono text-[11px] text-[#5C5852]">
              Đo lường tự động từ `/work/[slug]` & vòng xoay 3D
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {featuredProjects.map((proj, idx) => {
              const stat = analytics?.projectStats?.[proj.slug] || {
                views: 0,
                coverflowClicks: 0,
              };
              const widthPct = Math.max(
                6,
                Math.round((stat.views / maxProjectViews) * 100)
              );

              return (
                <div
                  key={proj.slug}
                  className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/50 p-4 transition-colors hover:border-[#C05E3E]/60"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#C05E3E] px-2 py-0.5 font-mono text-[10px] font-bold text-[#FAF9F6]">
                          #{idx + 1}
                        </span>
                        <Link
                          href={`/work/${proj.slug}`}
                          className="text-sm font-bold text-[#0E0E0E] hover:text-[#C05E3E]"
                        >
                          {t(proj.title, "vi")}
                        </Link>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-[#5C5852]">
                        Slug: `/work/{proj.slug}` •{" "}
                        {proj.cardMiniMetrics[0]?.value}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <div className="text-sm font-bold text-[#C05E3E]">
                          {stat.views} lượt đọc
                        </div>
                        <div className="text-[10px] text-[#5C5852]">
                          {stat.coverflowClicks} click 3D Coverflow
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onJumpToProject(idx)}
                        className="rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 font-mono text-[10px] font-semibold text-[#0E0E0E] hover:border-[#C05E3E] hover:text-[#C05E3E]"
                      >
                        Sửa bài
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#D1CCC4]/60">
                    <div
                      className="h-full rounded-full bg-[#C05E3E] transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Traffic Sources + Marketer UTM Builder */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3.5">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#C05E3E]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E0E0E]">
                  Nguồn Truy Cập (Traffic Channels)
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[#5C5852]">
                UTM & Referrer
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {Object.entries(analytics?.trafficSources || {}).map(
                ([sourceName, count]) => {
                  const pct = Math.round(
                    (count / totalTrafficSourceCount) * 100
                  );
                  return (
                    <div key={sourceName} className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-semibold text-[#0E0E0E]">
                          {sourceName}
                        </span>
                        <span className="text-[#5C5852]">
                          {count} lượt ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFECE6]">
                        <div
                          className="h-full rounded-full bg-[#C05E3E]"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Marketer's UTM Quick Link Generator */}
          <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#D1CCC4] pb-3.5">
              <Sparkles className="h-4 w-4 text-[#C05E3E]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E0E0E]">
                Link Tracking UTM (Dành cho CV & LinkedIn)
              </h3>
            </div>
            <p className="mt-2 text-xs text-[#5C5852]">
              Copy các đường dẫn dưới đây gắn vào CV PDF hoặc Bio để biết chính
              xác nhà tuyển dụng đến từ kênh nào:
            </p>

            <div className="mt-3 space-y-2">
              {[
                {
                  id: "CV PDF",
                  label: "Link gắn trong file CV PDF",
                  url: "https://minh-hien-portfolio.vercel.app/?utm_source=cv_pdf",
                },
                {
                  id: "LinkedIn",
                  label: "Link gắn trên LinkedIn Profile",
                  url: "https://minh-hien-portfolio.vercel.app/?utm_source=linkedin",
                },
                {
                  id: "Facebook",
                  label: "Link gửi qua Facebook / Zalo",
                  url: "https://minh-hien-portfolio.vercel.app/?utm_source=facebook",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] font-bold text-[#0E0E0E]">
                      {item.label}
                    </div>
                    <div className="truncate font-mono text-[10px] text-[#5C5852]">
                      {item.url}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyUtmUrl(item.id, item.url)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#C05E3E] bg-[#FAF9F6] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#C05E3E] hover:bg-[#C05E3E] hover:text-[#FAF9F6]"
                  >
                    {copiedUtm === item.id ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 4: REAL-TIME VISITOR EVENT STREAM & CONTROLS
      ===================================================================== */}
      <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1CCC4] pb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#C05E3E]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E0E0E]">
              Nhật ký Tương tác Thời gian thực (Recent Visitor Events)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchAnalyticsAndCloudStatus()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-1.5 font-mono text-xs text-[#0E0E0E] hover:border-[#C05E3E]"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#C05E3E]" />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              disabled={syncingAnalyticsCloud}
              onClick={handleSyncAnalyticsToGithub}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#C05E3E] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs font-semibold text-[#C05E3E] hover:bg-[#C05E3E] hover:text-[#FAF9F6]"
            >
              <Cloud className="h-3.5 w-3.5" />
              <span>
                {syncingAnalyticsCloud
                  ? "Đang lưu..."
                  : "Lưu Snapshot lên GitHub"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResetAnalytics}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3 py-1.5 font-mono text-xs text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Đặt lại về 0</span>
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#D1CCC4] text-[10px] uppercase text-[#5C5852]">
                <th className="pb-2.5 pr-4">Hành động</th>
                <th className="pb-2.5 pr-4">Chi tiết / Trang đích</th>
                <th className="pb-2.5 pr-4">Nguồn (UTM)</th>
                <th className="pb-2.5 pr-4">Thiết bị</th>
                <th className="pb-2.5 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1CCC4]/60">
              {(analytics?.recentEvents || []).slice(0, 15).map((evt) => (
                <tr key={evt.id} className="hover:bg-[#EFECE6]/40">
                  <td className="py-2.5 pr-4">
                    <span
                      className={cn(
                        "inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold",
                        evt.type === "case_study_view"
                          ? "bg-[#C05E3E] text-[#FAF9F6]"
                          : evt.type === "coverflow_click"
                            ? "bg-indigo-600 text-white"
                            : evt.type === "cv_download"
                              ? "bg-emerald-600 text-white"
                              : "bg-[#EFECE6] text-[#0E0E0E]"
                      )}
                    >
                      {evt.type === "case_study_view"
                        ? "Đọc Case Study"
                        : evt.type === "coverflow_click"
                          ? "Click 3D Coverflow"
                          : evt.type === "cv_download"
                            ? "Tải CV PDF"
                            : evt.type === "contact_click"
                              ? "Click Liên hệ"
                              : "Xem Trang chủ"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-sans text-xs font-medium text-[#0E0E0E]">
                    {evt.label || evt.target}
                  </td>
                  <td className="py-2.5 pr-4 text-[#C05E3E]">{evt.source}</td>
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1 text-[#5C5852]">
                      {evt.device === "Mobile" ? (
                        <Smartphone className="h-3 w-3" />
                      ) : (
                        <Laptop className="h-3 w-3" />
                      )}
                      {evt.device}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[#5C5852]">
                    {new Date(evt.timestamp).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
              {(!analytics?.recentEvents ||
                analytics.recentEvents.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-xs text-[#5C5852]"
                  >
                    Chưa có sự kiện nào được ghi nhận.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
