"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Award,
  BarChart3,
  Check,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FolderKanban,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sliders,
  Trash2,
  Upload,
  UserCheck,
} from "lucide-react";
import { useCMSStore, type CMSDataPayload } from "@/store/use-cms-store";
import { useUIStore } from "@/store/use-ui-store";
import type {
  ArchiveProject,
  CredentialItem,
  FeaturedProject,
  LocalizedText,
  MarcomShowcaseAsset,
  TestimonialItem,
} from "@/types/portfolio";
import { cn, t } from "@/lib/utils";
import { AdminAnalyticsCloudPanel } from "@/components/admin/admin-analytics-cloud-panel";

type AdminMainTab =
  | "profile"
  | "projects"
  | "archive"
  | "credentials"
  | "analytics";
type ProjectEditorSubTab =
  | "card"
  | "station1"
  | "station2"
  | "station3"
  | "station4"
  | "station5";

function BilingualInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 2,
  placeholderVi = "Nhập nội dung Tiếng Việt...",
  placeholderEn = "Enter English text...",
}: {
  label: string;
  value: LocalizedText;
  onChange: (next: LocalizedText) => void;
  multiline?: boolean;
  rows?: number;
  placeholderVi?: string;
  placeholderEn?: string;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 p-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0E0E0E]">
          {label}
        </span>
        <span className="font-mono text-[10px] text-[#5C5852]">
          Song ngữ VI / EN
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#C05E3E]">
            <span className="rounded bg-[#C05E3E] px-1.5 py-0.2 text-[9px] text-[#FAF9F6]">
              VI
            </span>
            <span>Tiếng Việt</span>
          </label>
          {multiline ? (
            <textarea
              rows={rows}
              value={value.vi}
              onChange={(e) => onChange({ ...value, vi: e.target.value })}
              placeholder={placeholderVi}
              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-2 text-xs text-[#0E0E0E] focus:border-[#C05E3E] focus:outline-none"
            />
          ) : (
            <input
              type="text"
              value={value.vi}
              onChange={(e) => onChange({ ...value, vi: e.target.value })}
              placeholder={placeholderVi}
              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-2 text-xs text-[#0E0E0E] focus:border-[#C05E3E] focus:outline-none"
            />
          )}
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#5C5852]">
            <span className="rounded bg-[#D1CCC4] px-1.5 py-0.2 text-[9px] text-[#0E0E0E]">
              EN
            </span>
            <span>English</span>
          </label>
          {multiline ? (
            <textarea
              rows={rows}
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              placeholder={placeholderEn}
              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-2 text-xs text-[#0E0E0E] focus:border-[#C05E3E] focus:outline-none"
            />
          ) : (
            <input
              type="text"
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              placeholder={placeholderEn}
              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-2 text-xs text-[#0E0E0E] focus:border-[#C05E3E] focus:outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminCMSDashboard() {
  const { lang } = useUIStore();
  const {
    profile,
    featuredProjects,
    archiveProjects,
    lastUpdated,
    isSyncing,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPasscode,
    setProfile,
    updateFeaturedProject,
    addFeaturedProject,
    deleteFeaturedProject,
    moveFeaturedProject,
    addArchiveProject,
    updateArchiveProject,
    deleteArchiveProject,
    importFullData,
    resetToDefaults,
    saveToServer,
  } = useCMSStore();

  const searchParams = useSearchParams();
  const queryProjectSlug = searchParams.get("project");

  const [activeTab, setActiveTab] = useState<AdminMainTab>("projects");
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number>(0);
  const [projectSubTab, setProjectSubTab] =
    useState<ProjectEditorSubTab>("card");
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Admin Login & Change Password State
  const [passInput, setPassInput] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [currPassInput, setCurrPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");

  useEffect(() => {
    if (queryProjectSlug && featuredProjects.length > 0) {
      const idx = featuredProjects.findIndex(
        (p) => p.slug === queryProjectSlug
      );
      if (idx !== -1) {
        setActiveTab("projects");
        setSelectedProjectIdx(idx);
      }
    }
  }, [queryProjectSlug, featuredProjects]);

  const safeProjectIdx = Math.min(
    Math.max(0, selectedProjectIdx),
    Math.max(0, featuredProjects.length - 1)
  );
  const activeProject: FeaturedProject | undefined =
    featuredProjects[safeProjectIdx];

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const handleSaveAndPublish = async () => {
    const res = await saveToServer();
    if (res.syncedCloud) {
      showNotification(
        lang === "vi"
          ? "Đã lưu & đồng bộ trực tiếp lên GitHub Cloud (main)!"
          : "Saved & synced directly to GitHub Cloud (main)!"
      );
    } else if (res.ok || res.savedLocal) {
      showNotification(
        lang === "vi"
          ? "Đã lưu & đồng bộ dữ liệu lên Server thành công!"
          : "Saved & synced to Server successfully!"
      );
    } else {
      showNotification(
        lang === "vi"
          ? "Đã lưu vào bộ nhớ trình duyệt (mở tab 5 để cấu hình GitHub Cloud)!"
          : "Saved to browser Local Storage!"
      );
    }
  };

  const handleExportJson = () => {
    const payload: CMSDataPayload = {
      profile,
      featuredProjects,
      archiveProjects,
      lastUpdated: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(
      lang === "vi" ? "Đã tải xuống file Backup JSON!" : "Exported JSON backup!"
    );
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result)) as CMSDataPayload;
        if (parsed && parsed.profile && Array.isArray(parsed.featuredProjects)) {
          importFullData(parsed);
          await saveToServer();
          showNotification(
            lang === "vi"
              ? "Đã nhập dữ liệu JSON và đồng bộ thành công!"
              : "Imported JSON data & synced!"
          );
        } else {
          showNotification(
            lang === "vi"
              ? "File JSON không đúng định dạng CMS!"
              : "Invalid CMS JSON file!"
          );
        }
      } catch {
        showNotification(
          lang === "vi" ? "Lỗi đọc file JSON!" : "Failed to parse JSON!"
        );
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleDuplicateOrCreateProject = () => {
    const template = activeProject || featuredProjects[0];
    if (!template) return;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newProject: FeaturedProject = JSON.parse(JSON.stringify(template));
    newProject.slug = `du-an-moi-${randomSuffix}`;
    newProject.title = {
      vi: `${template.title.vi} (Bản mới #${randomSuffix})`,
      en: `${template.title.en} (New #${randomSuffix})`,
    };
    addFeaturedProject(newProject);
    setSelectedProjectIdx(0);
    setProjectSubTab("card");
    showNotification(
      lang === "vi"
        ? `Đã tạo dự án mới: /work/${newProject.slug}`
        : `Created new project: /work/${newProject.slug}`
    );
  };

  const updateCurrentProject = (updater: (proj: FeaturedProject) => FeaturedProject) => {
    if (!activeProject) return;
    const updated = updater(JSON.parse(JSON.stringify(activeProject)));
    updateFeaturedProject(safeProjectIdx, updated);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);
    const res = await loginAdmin(passInput);
    setIsLoggingIn(false);
    if (!res.ok) {
      setAuthError(res.error || "Mã khóa Admin không chính xác");
    } else {
      setPassInput("");
    }
  };

  const handleChangePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changeAdminPasscode(currPassInput, newPassInput);
    if (res.ok) {
      setShowChangePassModal(false);
      setCurrPassInput("");
      setNewPassInput("");
      showNotification("Đã cập nhật mật khẩu Admin mới thành công!");
    } else {
      showNotification(res.error || "Không thể đổi mật khẩu!");
    }
  };

  // =========================================================================
  // PRIVATE ADMIN SECURITY VAULT GATE (WHEN LOCKED)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-[#F5F3ED] px-4 py-12 text-[#0E0E0E]">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 shadow-xl sm:p-8"
        >
          <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C05E3E] text-[#FAF9F6] shadow-sm shadow-indigo-500/20">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <h1 className="text-base font-bold text-[#0E0E0E]">
                  {lang === "vi"
                    ? "Cổng Bảo Mật Admin CMS"
                    : "Private Admin CMS Vault"}
                </h1>
                <p className="font-mono text-[11px] text-[#5C5852]">
                  {lang === "vi"
                    ? "Chỉ chủ sở hữu Portfolio mới có quyền truy cập"
                    : "Restricted to Portfolio Owner"}
                </p>
              </div>
            </div>
            <ShieldCheck className="h-5 w-5 text-[#C05E3E]" />
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-xs font-semibold text-[#0E0E0E]">
                {lang === "vi"
                  ? "Nhập Mật khẩu Quản trị (Admin Passcode)"
                  : "Enter Admin Passcode"}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder={
                    lang === "vi"
                      ? "Nhập mật khẩu của bạn..."
                      : "Enter passcode..."
                  }
                  autoFocus
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3.5 py-2.5 pr-10 font-mono text-sm text-[#0E0E0E] focus:border-[#C05E3E] focus:bg-[#FAF9F6] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5852] hover:text-[#0E0E0E]"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {authError && (
                <p className="mt-2 font-mono text-xs font-semibold text-red-600">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !passInput.trim()}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#C05E3E] font-mono text-xs font-semibold text-[#FAF9F6] shadow-sm shadow-indigo-500/20 transition-all hover:bg-[#AD5234] disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              <span>
                {isLoggingIn
                  ? lang === "vi"
                    ? "Đang xác thực..."
                    : "Verifying..."
                  : lang === "vi"
                    ? "Mở khóa Admin CMS Studio →"
                    : "Unlock Admin CMS Studio →"}
              </span>
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#5C5852] hover:text-[#C05E3E]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>
                {lang === "vi" ? "Quay về Trang Chủ" : "Return to Homepage"}
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F5F3ED] pb-24 text-[#0E0E0E]">
      {/* Sticky Admin Control Bar */}
      <div className="sticky top-16 z-30 border-b border-[#D1CCC4] bg-[#FAF9F6]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-1.5 font-mono text-xs font-medium text-[#0E0E0E] transition-colors hover:border-[#C05E3E] hover:text-[#C05E3E]"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#C05E3E]" />
              <span>{lang === "vi" ? "Về Trang Chủ" : "Back to Site"}</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C05E3E] text-[#FAF9F6]">
                <Sliders className="h-3.5 w-3.5" />
              </span>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-[#0E0E0E] sm:text-base">
                  {lang === "vi"
                    ? "PORTFOLIO ADMIN CMS STUDIO"
                    : "PORTFOLIO ADMIN CMS STUDIO"}
                </h1>
                <p className="font-mono text-[10px] text-[#5C5852]">
                  {lastUpdated
                    ? `${lang === "vi" ? "Cập nhật lúc:" : "Last updated:"} ${new Date(
                        lastUpdated
                      ).toLocaleTimeString()}`
                    : lang === "vi"
                      ? "Tự động đồng bộ trực tiếp với 3D Coverflow & Case Study 5 Trạm"
                      : "Live-synced with 3D Coverflow & 5-Station Case Studies"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {activeProject && (
              <Link
                href={`/work/${activeProject.slug}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs font-medium text-[#0E0E0E] transition-colors hover:border-[#C05E3E] hover:text-[#C05E3E]"
              >
                <span>
                  {lang === "vi" ? "Xem trang dự án" : "View Case Study"}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-[#C05E3E]" />
              </Link>
            )}

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs text-[#0E0E0E] hover:bg-[#EBE7DF]"
            >
              <Download className="h-3.5 w-3.5 text-[#C05E3E]" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs text-[#0E0E0E] hover:bg-[#EBE7DF]"
            >
              <Upload className="h-3.5 w-3.5 text-[#C05E3E]" />
              <span className="hidden sm:inline">Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportJson}
              className="hidden"
            />

            <button
              type="button"
              onClick={async () => {
                await resetToDefaults();
                showNotification(
                  lang === "vi"
                    ? "Đã khôi phục toàn bộ nội dung về mặc định gốc!"
                    : "Reset all content to original defaults!"
                );
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs text-[#5C5852] hover:border-red-400 hover:text-red-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">
                {lang === "vi" ? "Khôi phục gốc" : "Reset"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowChangePassModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs text-[#0E0E0E] hover:bg-[#EBE7DF]"
            >
              <KeyRound className="h-3.5 w-3.5 text-[#C05E3E]" />
              <span className="hidden md:inline">
                {lang === "vi" ? "Đổi mật khẩu" : "Passcode"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                logoutAdmin();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs text-[#5C5852] hover:border-red-400 hover:text-red-600"
              title="Khóa trang Admin và ẩn mọi nút Admin khỏi giao diện"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">
                {lang === "vi" ? "Khóa & Ẩn Admin" : "Lock Admin"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndPublish}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 rounded-xl border border-[#C05E3E] bg-[#C05E3E] px-4 py-1.5 font-mono text-xs font-semibold text-[#FAF9F6] shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#AD5234]"
            >
              <Save className="h-3.5 w-3.5" />
              <span>
                {isSyncing
                  ? lang === "vi"
                    ? "Đang lưu..."
                    : "Saving..."
                  : lang === "vi"
                    ? "Lưu & Xuất bản"
                    : "Save & Publish"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-[#C05E3E] bg-[#C05E3E] px-4 py-3 font-mono text-xs font-semibold text-[#FAF9F6] shadow-xl">
          <Check className="h-4 w-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Change Passcode Modal */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#0E0E0E]">
              {lang === "vi"
                ? "Đổi Mật khẩu Quản trị Admin"
                : "Change Admin Passcode"}
            </h3>
            <p className="mt-1 text-xs text-[#5C5852]">
              {lang === "vi"
                ? "Mật khẩu mới sẽ được lưu bảo mật trên Server."
                : "Your new passcode will be securely saved on the server."}
            </p>
            <form onSubmit={handleChangePassSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block font-mono text-xs text-[#5C5852]">
                  {lang === "vi" ? "Mật khẩu hiện tại" : "Current Passcode"}
                </label>
                <input
                  type="password"
                  value={currPassInput}
                  onChange={(e) => setCurrPassInput(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-[#5C5852]">
                  {lang === "vi"
                    ? "Mật khẩu mới (ít nhất 4 ký tự)"
                    : "New Passcode (min 4 chars)"}
                </label>
                <input
                  type="password"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  required
                  minLength={4}
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassModal(false)}
                  className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-4 py-2 font-mono text-xs text-[#0E0E0E]"
                >
                  {lang === "vi" ? "Hủy" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#C05E3E] px-4 py-2 font-mono text-xs font-semibold text-[#FAF9F6]"
                >
                  {lang === "vi" ? "Cập nhật mật khẩu" : "Update Passcode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        {/* Main Navigation Tabs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              id: "projects" as const,
              icon: FolderKanban,
              titleVi: "1. Dự án & 5 Trạm Case Study",
              titleEn: "1. Featured Case Studies (5 Stations)",
              badge: `${featuredProjects.length} dự án`,
            },
            {
              id: "profile" as const,
              icon: UserCheck,
              titleVi: "2. Hồ sơ, Hero & Liên hệ",
              titleEn: "2. Profile, Hero & Contact",
              badge: "Hero + 4 KPIs",
            },
            {
              id: "archive" as const,
              icon: Layers,
              titleVi: "3. Dự án Mở rộng (3D Coverflow)",
              titleEn: "3. Extended Coverflow Projects",
              badge: `${archiveProjects.length} mục`,
            },
            {
              id: "credentials" as const,
              icon: Award,
              titleVi: "4. Chứng chỉ & Đánh giá (Quotes)",
              titleEn: "4. Certifications & Endorsements",
              badge: `${profile.credentials.length + profile.testimonials.length} mục`,
            },
            {
              id: "analytics" as const,
              icon: BarChart3,
              titleVi: "5. Số liệu Traffic & Cloud Sync",
              titleEn: "5. Traffic Analytics & Cloud Sync",
              badge: "Live + GitHub",
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                  isCurrent
                    ? "border-[#C05E3E] bg-[#C05E3E] text-[#FAF9F6] shadow-md shadow-indigo-500/15"
                    : "border-[#D1CCC4] bg-[#FAF9F6] text-[#0E0E0E] hover:border-[#C05E3E]/60"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isCurrent ? "text-[#FAF9F6]" : "text-[#C05E3E]"
                    )}
                  />
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold",
                      isCurrent
                        ? "bg-[#FAF9F6]/20 text-[#FAF9F6]"
                        : "bg-[#EFECE6] text-[#5C5852]"
                    )}
                  >
                    {tab.badge}
                  </span>
                </div>
                <div className="mt-3 text-xs font-bold sm:text-sm">
                  {lang === "vi" ? tab.titleVi : tab.titleEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            TAB 1: FEATURED CASE STUDIES & 5-STATION EDITOR
        =================================================================== */}
        {activeTab === "projects" && activeProject && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Sidebar: Project List + Add / Reorder / Delete */}
            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-4">
                <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0E0E0E]">
                    {lang === "vi"
                      ? "DANH SÁCH DỰ ÁN TRỌNG ĐIỂM"
                      : "FEATURED CASE STUDIES"}
                  </span>
                  <button
                    type="button"
                    onClick={handleDuplicateOrCreateProject}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#C05E3E] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#FAF9F6] hover:bg-[#AD5234]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{lang === "vi" ? "Thêm dự án" : "New Project"}</span>
                  </button>
                </div>

                <div className="mt-3 space-y-2.5">
                  {featuredProjects.map((proj, idx) => {
                    const isSelected = idx === safeProjectIdx;
                    return (
                      <div
                        key={`${proj.slug}-${idx}`}
                        onClick={() => setSelectedProjectIdx(idx)}
                        className={cn(
                          "cursor-pointer rounded-xl border p-3 transition-all",
                          isSelected
                            ? "border-[#C05E3E] bg-[#C05E3E]/8 ring-1 ring-[#C05E3E]"
                            : "border-[#D1CCC4] bg-[#EFECE6]/50 hover:bg-[#EFECE6]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-[#C05E3E] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#FAF9F6]">
                              0{idx + 1}
                            </span>
                            <span className="font-mono text-[10px] font-semibold text-[#C05E3E]">
                              {proj.cardMiniMetrics[0]?.value}
                            </span>
                          </div>

                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                moveFeaturedProject(idx, idx - 1);
                                setSelectedProjectIdx(idx - 1);
                              }}
                              className="rounded border border-[#D1CCC4] bg-[#FAF9F6] p-1 text-[#5C5852] hover:text-[#0E0E0E] disabled:opacity-30"
                              title="Chuyển lên"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === featuredProjects.length - 1}
                              onClick={() => {
                                moveFeaturedProject(idx, idx + 1);
                                setSelectedProjectIdx(idx + 1);
                              }}
                              className="rounded border border-[#D1CCC4] bg-[#FAF9F6] p-1 text-[#5C5852] hover:text-[#0E0E0E] disabled:opacity-30"
                              title="Chuyển xuống"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            {featuredProjects.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  deleteFeaturedProject(idx);
                                  setSelectedProjectIdx(Math.max(0, idx - 1));
                                  showNotification(
                                    lang === "vi"
                                      ? "Đã xóa dự án!"
                                      : "Deleted project!"
                                  );
                                }}
                                className="rounded border border-[#D1CCC4] bg-[#FAF9F6] p-1 text-red-500 hover:bg-red-50"
                                title="Xóa dự án"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-1.5 text-xs font-bold text-[#0E0E0E] line-clamp-2">
                          {t(proj.title, lang)}
                        </div>
                        <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-[#5C5852]">
                          <span>/work/{proj.slug}</span>
                          <Link
                            href={`/work/${proj.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#C05E3E] hover:underline"
                          >
                            Xem ↗
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: 6 Sub-Tabs Editor for Active Project */}
            <div className="space-y-6 lg:col-span-8">
              {/* Sub-tab Navigation */}
              <div className="flex flex-wrap gap-2 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-3">
                {[
                  {
                    id: "card" as const,
                    label: "00. Thẻ Coverflow & Thông tin chung",
                  },
                  { id: "station1" as const, label: "Trạm 01: 4 Chỉ số KPI" },
                  {
                    id: "station2" as const,
                    label: "Trạm 02: Bài toán & Phễu 3 Tầng",
                  },
                  {
                    id: "station3" as const,
                    label: "Trạm 03: Tư liệu MarCom",
                  },
                  {
                    id: "station4" as const,
                    label: "Trạm 04: Ngân sách & Ads/CRO",
                  },
                  {
                    id: "station5" as const,
                    label: "Trạm 05: Trước/Sau & Đúc kết",
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setProjectSubTab(st.id)}
                    className={cn(
                      "rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors",
                      projectSubTab === st.id
                        ? "border-[#C05E3E] bg-[#C05E3E] font-semibold text-[#FAF9F6]"
                        : "border-[#D1CCC4] bg-[#EFECE6] text-[#0E0E0E] hover:bg-[#EBE7DF]"
                    )}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* SUB-TAB 00: COVERFLOW CARD & GENERAL METADATA */}
              {projectSubTab === "card" && (
                <div className="space-y-5 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D1CCC4] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#0E0E0E]">
                        Thông tin Thẻ 3D Coverflow & Tổng quan Dự án
                      </h2>
                      <p className="text-xs text-[#5C5852]">
                        Mọi thay đổi tại đây cập nhật trực tiếp lên thẻ 3D Coverflow ở Trang chủ và đầu trang Case Study.
                      </p>
                    </div>
                    <Link
                      href={`/work/${activeProject.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#C05E3E] px-3 py-1.5 font-mono text-xs font-semibold text-[#FAF9F6]"
                    >
                      <span>Mở trang dự án này ↗</span>
                    </Link>
                  </div>

                  {/* Slug, Category, Timeframe, Visual Accent */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                        Đường dẫn URL (Slug)
                      </label>
                      <input
                        type="text"
                        value={activeProject.slug}
                        onChange={(e) =>
                          updateCurrentProject((p) => ({
                            ...p,
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-_]/g, "-"),
                          }))
                        }
                        className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                        Danh mục bộ lọc (Category)
                      </label>
                      <select
                        value={activeProject.category}
                        onChange={(e) =>
                          updateCurrentProject((p) => ({
                            ...p,
                            category: e.target.value as FeaturedProject["category"],
                          }))
                        }
                        className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                      >
                        <option value="imc">Full-Funnel IMC (imc)</option>
                        <option value="performance-b2b">
                          Performance & B2B (performance-b2b)
                        </option>
                        <option value="marcom-event">
                          MarCom & Sự kiện O2O (marcom-event)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                        Thời gian triển khai (Timeframe)
                      </label>
                      <input
                        type="text"
                        value={activeProject.timeframe}
                        onChange={(e) =>
                          updateCurrentProject((p) => ({
                            ...p,
                            timeframe: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                        Mã Nhãn Chuyên môn (Visual Accent Code)
                      </label>
                      <input
                        type="text"
                        value={activeProject.visualAccentCode}
                        onChange={(e) =>
                          updateCurrentProject((p) => ({
                            ...p,
                            visualAccentCode: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                      />
                    </div>
                  </div>

                  {/* Cover Image URL + Live Preview */}
                  <div className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 p-4">
                    <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase text-[#0E0E0E]">
                      Ảnh bìa Thẻ 3D Coverflow & Banner (Thumbnail URL)
                    </label>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeProject.thumbnail}
                        alt="Preview"
                        className="h-24 w-36 shrink-0 rounded-xl border border-[#D1CCC4] object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={activeProject.thumbnail}
                          onChange={(e) =>
                            updateCurrentProject((p) => ({
                              ...p,
                              thumbnail: e.target.value,
                            }))
                          }
                          placeholder="https://..."
                          className="w-full rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                        />
                        <p className="font-mono text-[10px] text-[#5C5852]">
                          Nhập link ảnh trực tiếp (https://...) hoặc đường dẫn trong /public/images/...
                        </p>
                      </div>
                    </div>
                  </div>

                  <BilingualInput
                    label="Tiêu đề Dự án (Project Title)"
                    value={activeProject.title}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({ ...p, title: next }))
                    }
                    multiline
                    rows={2}
                  />

                  <BilingualInput
                    label="Tóm tắt ngắn dưới vòng xoay Coverflow (Short Summary)"
                    value={activeProject.shortSummary}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        shortSummary: next,
                      }))
                    }
                    multiline
                    rows={2}
                  />

                  <BilingualInput
                    label="Ngành hàng (Industry Pill)"
                    value={activeProject.industryPill}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        industryPill: next,
                      }))
                    }
                  />

                  <BilingualInput
                    label="Vai trò đảm nhiệm (Role Pill)"
                    value={activeProject.rolePill}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({ ...p, rolePill: next }))
                    }
                  />

                  <BilingualInput
                    label="Quy mô ngân sách (Budget Scale)"
                    value={activeProject.budgetScale}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        budgetScale: next,
                      }))
                    }
                  />

                  {/* Channels List */}
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#0E0E0E]">
                      Các kênh triển khai (Ngăn cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={activeProject.channels.join(", ")}
                      onChange={(e) =>
                        updateCurrentProject((p) => ({
                          ...p,
                          channels: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }))
                      }
                      className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                    />
                  </div>

                  {/* 3 Card Mini Metrics */}
                  <div className="space-y-3 border-t border-[#D1CCC4] pt-4">
                    <div className="font-mono text-xs font-bold uppercase text-[#C05E3E]">
                      3 Chỉ số Mini KPI trên Thẻ Coverflow (Badge số 1 hiển thị trên góc thẻ 3D)
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {activeProject.cardMiniMetrics.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="space-y-2 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] p-3"
                        >
                          <label className="block font-mono text-[10px] font-bold uppercase text-[#C05E3E]">
                            Chỉ số #{mIdx + 1} (Value)
                          </label>
                          <input
                            type="text"
                            value={m.value}
                            onChange={(e) =>
                              updateCurrentProject((p) => {
                                const nextMetrics = [...p.cardMiniMetrics] as FeaturedProject["cardMiniMetrics"];
                                nextMetrics[mIdx] = {
                                  ...nextMetrics[mIdx],
                                  value: e.target.value,
                                };
                                return { ...p, cardMiniMetrics: nextMetrics };
                              })
                            }
                            className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 font-mono text-xs font-bold text-[#C05E3E]"
                          />
                          <label className="block font-mono text-[10px] text-[#5C5852]">
                            Nhãn (VI)
                          </label>
                          <input
                            type="text"
                            value={m.label.vi}
                            onChange={(e) =>
                              updateCurrentProject((p) => {
                                const nextMetrics = [...p.cardMiniMetrics] as FeaturedProject["cardMiniMetrics"];
                                nextMetrics[mIdx] = {
                                  ...nextMetrics[mIdx],
                                  label: {
                                    ...nextMetrics[mIdx].label,
                                    vi: e.target.value,
                                  },
                                };
                                return { ...p, cardMiniMetrics: nextMetrics };
                              })
                            }
                            className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 text-xs"
                          />
                          <label className="block font-mono text-[10px] text-[#5C5852]">
                            Nhãn (EN)
                          </label>
                          <input
                            type="text"
                            value={m.label.en}
                            onChange={(e) =>
                              updateCurrentProject((p) => {
                                const nextMetrics = [...p.cardMiniMetrics] as FeaturedProject["cardMiniMetrics"];
                                nextMetrics[mIdx] = {
                                  ...nextMetrics[mIdx],
                                  label: {
                                    ...nextMetrics[mIdx].label,
                                    en: e.target.value,
                                  },
                                };
                                return { ...p, cardMiniMetrics: nextMetrics };
                              })
                            }
                            className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 01: STATION 01 KPI COMPARISON */}
              {projectSubTab === "station1" && (
                <div className="space-y-5 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
                  <div className="border-b border-[#D1CCC4] pb-3">
                    <h2 className="text-base font-bold text-[#0E0E0E]">
                      Trạm 01: Bảng Đối chiếu 4 Chỉ số KPI Cốt lõi
                    </h2>
                    <p className="text-xs text-[#5C5852]">
                      Hiển thị tại phần mở đầu trang chi tiết dự án (/work/{activeProject.slug}).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {activeProject.kpiComparison.map((kpi, kIdx) => (
                      <div
                        key={kIdx}
                        className="space-y-3 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/70 p-4"
                      >
                        <div className="font-mono text-xs font-bold text-[#C05E3E]">
                          Ô KPI #0{kIdx + 1}
                        </div>
                        <BilingualInput
                          label="Tên chỉ số (Metric Name)"
                          value={kpi.metric}
                          onChange={(next) =>
                            updateCurrentProject((p) => {
                              const list = [...p.kpiComparison] as FeaturedProject["kpiComparison"];
                              list[kIdx] = { ...list[kIdx], metric: next };
                              return { ...p, kpiComparison: list };
                            })
                          }
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="mb-1 block font-mono text-[10px] text-[#5C5852]">
                              Mục tiêu (Target)
                            </label>
                            <input
                              type="text"
                              value={kpi.target}
                              onChange={(e) =>
                                updateCurrentProject((p) => {
                                  const list = [...p.kpiComparison] as FeaturedProject["kpiComparison"];
                                  list[kIdx] = {
                                    ...list[kIdx],
                                    target: e.target.value,
                                  };
                                  return { ...p, kpiComparison: list };
                                })
                              }
                              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block font-mono text-[10px] text-[#5C5852]">
                              Thực đạt (Achieved)
                            </label>
                            <input
                              type="text"
                              value={kpi.achieved}
                              onChange={(e) =>
                                updateCurrentProject((p) => {
                                  const list = [...p.kpiComparison] as FeaturedProject["kpiComparison"];
                                  list[kIdx] = {
                                    ...list[kIdx],
                                    achieved: e.target.value,
                                  };
                                  return { ...p, kpiComparison: list };
                                })
                              }
                              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 font-mono text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block font-mono text-[10px] text-[#C05E3E]">
                              Badge Tăng trưởng
                            </label>
                            <input
                              type="text"
                              value={kpi.delta}
                              onChange={(e) =>
                                updateCurrentProject((p) => {
                                  const list = [...p.kpiComparison] as FeaturedProject["kpiComparison"];
                                  list[kIdx] = {
                                    ...list[kIdx],
                                    delta: e.target.value,
                                  };
                                  return { ...p, kpiComparison: list };
                                })
                              }
                              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 font-mono text-xs font-bold text-[#C05E3E]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 02: STATION 02 CHALLENGE & 3-STAGE FUNNEL */}
              {projectSubTab === "station2" && (
                <div className="space-y-6 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
                  <div className="border-b border-[#D1CCC4] pb-3">
                    <h2 className="text-base font-bold text-[#0E0E0E]">
                      Trạm 02: Bối cảnh, Điểm nghẽn & Phễu 3 Tầng (TOFU / MOFU / BOFU)
                    </h2>
                  </div>

                  <BilingualInput
                    label="1. Bối cảnh Thị trường (Market Context)"
                    value={activeProject.challenge.marketContext}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        challenge: { ...p.challenge, marketContext: next },
                      }))
                    }
                    multiline
                    rows={3}
                  />

                  <BilingualInput
                    label="2. Điểm nghẽn Truyền thông (MarCom Bottleneck)"
                    value={activeProject.challenge.marcomBottleneck}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        challenge: { ...p.challenge, marcomBottleneck: next },
                      }))
                    }
                    multiline
                    rows={3}
                  />

                  <BilingualInput
                    label="3. Điểm nghẽn Chuyển đổi (Performance Bottleneck)"
                    value={activeProject.challenge.performanceBottleneck}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        challenge: {
                          ...p.challenge,
                          performanceBottleneck: next,
                        },
                      }))
                    }
                    multiline
                    rows={3}
                  />

                  <BilingualInput
                    label="4. Sự thật Ngầm hiểu (Customer Insight)"
                    value={activeProject.challenge.customerInsight}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        challenge: { ...p.challenge, customerInsight: next },
                      }))
                    }
                    multiline
                    rows={3}
                  />

                  <BilingualInput
                    label="5. Ý tưởng Lớn & Giải pháp Chiến lược (Big Idea)"
                    value={activeProject.challenge.bigIdea}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        challenge: { ...p.challenge, bigIdea: next },
                      }))
                    }
                    multiline
                    rows={3}
                  />

                  <div className="space-y-4 border-t border-[#D1CCC4] pt-5">
                    <h3 className="font-mono text-xs font-bold uppercase text-[#C05E3E]">
                      Kiến trúc Phễu 3 Tầng (TOFU → MOFU → BOFU)
                    </h3>
                    {activeProject.funnelSynergy.map((stage, sIdx) => (
                      <div
                        key={stage.stageCode}
                        className="space-y-3 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/50 p-4"
                      >
                        <div className="font-mono text-xs font-bold text-[#C05E3E]">
                          TẦNG 0{sIdx + 1} // {stage.stageCode}
                        </div>
                        <BilingualInput
                          label={`Tên tầng ${stage.stageCode}`}
                          value={stage.stageName}
                          onChange={(next) =>
                            updateCurrentProject((p) => {
                              const nextFunnel = [...p.funnelSynergy] as FeaturedProject["funnelSynergy"];
                              nextFunnel[sIdx] = {
                                ...nextFunnel[sIdx],
                                stageName: next,
                              };
                              return { ...p, funnelSynergy: nextFunnel };
                            })
                          }
                        />
                        <BilingualInput
                          label="Hành động MarCom & Nội dung"
                          value={stage.marcomAction}
                          onChange={(next) =>
                            updateCurrentProject((p) => {
                              const nextFunnel = [...p.funnelSynergy] as FeaturedProject["funnelSynergy"];
                              nextFunnel[sIdx] = {
                                ...nextFunnel[sIdx],
                                marcomAction: next,
                              };
                              return { ...p, funnelSynergy: nextFunnel };
                            })
                          }
                          multiline
                          rows={2}
                        />
                        <BilingualInput
                          label="Hành động Paid Media & CRO"
                          value={stage.performanceAction}
                          onChange={(next) =>
                            updateCurrentProject((p) => {
                              const nextFunnel = [...p.funnelSynergy] as FeaturedProject["funnelSynergy"];
                              nextFunnel[sIdx] = {
                                ...nextFunnel[sIdx],
                                performanceAction: next,
                              };
                              return { ...p, funnelSynergy: nextFunnel };
                            })
                          }
                          multiline
                          rows={2}
                        />
                        <div>
                          <label className="mb-1 block font-mono text-[10px] font-semibold uppercase text-[#5C5852]">
                            Chỉ số KPI tầng {stage.stageCode} (Ngăn cách bằng dấu phẩy)
                          </label>
                          <input
                            type="text"
                            value={stage.kpis.join(", ")}
                            onChange={(e) =>
                              updateCurrentProject((p) => {
                                const nextFunnel = [...p.funnelSynergy] as FeaturedProject["funnelSynergy"];
                                nextFunnel[sIdx] = {
                                  ...nextFunnel[sIdx],
                                  kpis: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                };
                                return { ...p, funnelSynergy: nextFunnel };
                              })
                            }
                            className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-2 font-mono text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 03: STATION 03 MARCOM SHOWCASE GALLERY */}
              {projectSubTab === "station3" && (
                <div className="space-y-5 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
                  <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#0E0E0E]">
                        Trạm 03: Thư viện Tư liệu Sáng tạo MarCom
                      </h2>
                      <p className="text-xs text-[#5C5852]">
                        Thêm/sửa hình ảnh Key Visual, Video 9:16, Sự kiện O2O hiển thị tại Trạm 03.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateCurrentProject((p) => {
                          const newAsset: MarcomShowcaseAsset = {
                            id: `asset-${Date.now()}`,
                            mediaSrc:
                              "https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg",
                            mediaType: "image",
                            aspectLabel: "16:9 KEY VISUAL",
                            tag: {
                              vi: "Hạng mục Sáng tạo Mới",
                              en: "New Creative Asset",
                            },
                            caption: {
                              vi: "Mô tả chi tiết vai trò và kết quả của ấn phẩm truyền thông này.",
                              en: "Detailed description of this creative asset and its campaign impact.",
                            },
                          };
                          return {
                            ...p,
                            marcomShowcase: [...p.marcomShowcase, newAsset],
                          };
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#C05E3E] px-3 py-1.5 font-mono text-xs font-semibold text-[#FAF9F6]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Thêm Tư liệu</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activeProject.marcomShowcase.map((asset, aIdx) => (
                      <div
                        key={asset.id}
                        className="space-y-3 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#C05E3E]">
                            Tư liệu MarCom #0{aIdx + 1}
                          </span>
                          {activeProject.marcomShowcase.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                updateCurrentProject((p) => ({
                                  ...p,
                                  marcomShowcase: p.marcomShowcase.filter(
                                    (_, i) => i !== aIdx
                                  ),
                                }))
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 font-mono text-[10px] text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Xóa</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="sm:col-span-2">
                            <label className="mb-1 block font-mono text-[10px] font-semibold uppercase text-[#5C5852]">
                              Link Ảnh / Media (mediaSrc)
                            </label>
                            <input
                              type="text"
                              value={asset.mediaSrc}
                              onChange={(e) =>
                                updateCurrentProject((p) => {
                                  const list = [...p.marcomShowcase];
                                  list[aIdx] = {
                                    ...list[aIdx],
                                    mediaSrc: e.target.value,
                                  };
                                  return { ...p, marcomShowcase: list };
                                })
                              }
                              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block font-mono text-[10px] font-semibold uppercase text-[#5C5852]">
                              Nhãn Khung hình (Aspect Label)
                            </label>
                            <input
                              type="text"
                              value={asset.aspectLabel}
                              onChange={(e) =>
                                updateCurrentProject((p) => {
                                  const list = [...p.marcomShowcase];
                                  list[aIdx] = {
                                    ...list[aIdx],
                                    aspectLabel: e.target.value,
                                  };
                                  return { ...p, marcomShowcase: list };
                                })
                              }
                              className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs"
                            />
                          </div>
                        </div>

                        <BilingualInput
                          label="Nhãn Hạng mục (Tag)"
                          value={asset.tag}
                          onChange={(next) =>
                            updateCurrentProject((p) => {
                              const list = [...p.marcomShowcase];
                              list[aIdx] = { ...list[aIdx], tag: next };
                              return { ...p, marcomShowcase: list };
                            })
                          }
                        />

                        <BilingualInput
                          label="Mô tả chi tiết ấn phẩm (Caption)"
                          value={asset.caption}
                          onChange={(next) =>
                            updateCurrentProject((p) => {
                              const list = [...p.marcomShowcase];
                              list[aIdx] = { ...list[aIdx], caption: next };
                              return { ...p, marcomShowcase: list };
                            })
                          }
                          multiline
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 04: STATION 04 PERFORMANCE PROOF, BUDGET & DATA-TO-CREATIVE */}
              {projectSubTab === "station4" && (
                <div className="space-y-6 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
                  <div className="border-b border-[#D1CCC4] pb-3">
                    <h2 className="text-base font-bold text-[#0E0E0E]">
                      Trạm 04: Tỷ trọng Ngân sách Ads & Vòng lặp Data-to-Creative
                    </h2>
                  </div>

                  {/* Budget Split */}
                  <div className="space-y-3">
                    <div className="font-mono text-xs font-bold uppercase text-[#C05E3E]">
                      1. Phân bổ Ngân sách Đa kênh (Budget Split %)
                    </div>
                    {activeProject.performanceProof.budgetSplit.map(
                      (item, bIdx) => (
                        <div
                          key={bIdx}
                          className="space-y-2 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 p-3.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-xs font-bold text-[#0E0E0E]">
                              Kênh #{bIdx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <label className="font-mono text-xs text-[#5C5852]">
                                Tỷ trọng (%):
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={item.percentage}
                                onChange={(e) =>
                                  updateCurrentProject((p) => {
                                    const list = [
                                      ...p.performanceProof.budgetSplit,
                                    ];
                                    list[bIdx] = {
                                      ...list[bIdx],
                                      percentage: Number(e.target.value) || 0,
                                    };
                                    return {
                                      ...p,
                                      performanceProof: {
                                        ...p.performanceProof,
                                        budgetSplit: list,
                                      },
                                    };
                                  })
                                }
                                className="w-20 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1 font-mono text-xs font-bold text-[#C05E3E]"
                              />
                            </div>
                          </div>
                          <BilingualInput
                            label="Tên Kênh Quảng cáo"
                            value={item.label}
                            onChange={(next) =>
                              updateCurrentProject((p) => {
                                const list = [
                                  ...p.performanceProof.budgetSplit,
                                ];
                                list[bIdx] = { ...list[bIdx], label: next };
                                return {
                                  ...p,
                                  performanceProof: {
                                    ...p.performanceProof,
                                    budgetSplit: list,
                                  },
                                };
                              })
                            }
                          />
                          <BilingualInput
                            label="Vai trò của Kênh (Channel Note)"
                            value={item.channelNote}
                            onChange={(next) =>
                              updateCurrentProject((p) => {
                                const list = [
                                  ...p.performanceProof.budgetSplit,
                                ];
                                list[bIdx] = {
                                  ...list[bIdx],
                                  channelNote: next,
                                };
                                return {
                                  ...p,
                                  performanceProof: {
                                    ...p.performanceProof,
                                    budgetSplit: list,
                                  },
                                };
                              })
                            }
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* Data-to-Creative Loop */}
                  <div className="space-y-3 border-t border-[#D1CCC4] pt-5">
                    <div className="font-mono text-xs font-bold uppercase text-[#C05E3E]">
                      2. Câu chuyện Xoay trục Dữ liệu sang Sáng tạo (Data-to-Creative Loop)
                    </div>
                    <BilingualInput
                      label="Bước 1: Phát hiện từ Dữ liệu Ads/CRO (Discovery)"
                      value={
                        activeProject.performanceProof.dataToCreativeLoop
                          .discovery
                      }
                      onChange={(next) =>
                        updateCurrentProject((p) => ({
                          ...p,
                          performanceProof: {
                            ...p.performanceProof,
                            dataToCreativeLoop: {
                              ...p.performanceProof.dataToCreativeLoop,
                              discovery: next,
                            },
                          },
                        }))
                      }
                      multiline
                      rows={3}
                    />
                    <BilingualInput
                      label="Bước 2: Hành động Xoay trục Sáng tạo & Landing Page (Action Taken)"
                      value={
                        activeProject.performanceProof.dataToCreativeLoop
                          .actionTaken
                      }
                      onChange={(next) =>
                        updateCurrentProject((p) => ({
                          ...p,
                          performanceProof: {
                            ...p.performanceProof,
                            dataToCreativeLoop: {
                              ...p.performanceProof.dataToCreativeLoop,
                              actionTaken: next,
                            },
                          },
                        }))
                      }
                      multiline
                      rows={3}
                    />
                    <BilingualInput
                      label="Bước 3: Kết quả Bứt phá Định lượng (Outcome Lift)"
                      value={
                        activeProject.performanceProof.dataToCreativeLoop
                          .outcomeLift
                      }
                      onChange={(next) =>
                        updateCurrentProject((p) => ({
                          ...p,
                          performanceProof: {
                            ...p.performanceProof,
                            dataToCreativeLoop: {
                              ...p.performanceProof.dataToCreativeLoop,
                              outcomeLift: next,
                            },
                          },
                        }))
                      }
                      multiline
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB 05: STATION 05 RETROSPECTIVE & BEFORE/AFTER */}
              {projectSubTab === "station5" && (
                <div className="space-y-6 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-5 sm:p-6">
                  <div className="border-b border-[#D1CCC4] pb-3">
                    <h2 className="text-base font-bold text-[#0E0E0E]">
                      Trạm 05: Đối chiếu Trước/Sau & Bài học Đúc kết
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {activeProject.retrospective.beforeAfterMetrics.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="space-y-2.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/70 p-4"
                        >
                          <div className="font-mono text-xs font-bold text-[#C05E3E]">
                            Chỉ số Trước/Sau #0{idx + 1}
                          </div>
                          <BilingualInput
                            label="Tên chỉ số"
                            value={item.label}
                            onChange={(next) =>
                              updateCurrentProject((p) => {
                                const list = [
                                  ...p.retrospective.beforeAfterMetrics,
                                ];
                                list[idx] = { ...list[idx], label: next };
                                return {
                                  ...p,
                                  retrospective: {
                                    ...p.retrospective,
                                    beforeAfterMetrics: list,
                                  },
                                };
                              })
                            }
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="mb-1 block font-mono text-[10px] text-[#5C5852]">
                                Trước (Hiển thị)
                              </label>
                              <input
                                type="text"
                                value={item.displayBefore}
                                onChange={(e) =>
                                  updateCurrentProject((p) => {
                                    const list = [
                                      ...p.retrospective.beforeAfterMetrics,
                                    ];
                                    list[idx] = {
                                      ...list[idx],
                                      displayBefore: e.target.value,
                                    };
                                    return {
                                      ...p,
                                      retrospective: {
                                        ...p.retrospective,
                                        beforeAfterMetrics: list,
                                      },
                                    };
                                  })
                                }
                                className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2 py-1.5 font-mono text-xs"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block font-mono text-[10px] text-[#5C5852]">
                                Sau (Hiển thị)
                              </label>
                              <input
                                type="text"
                                value={item.displayAfter}
                                onChange={(e) =>
                                  updateCurrentProject((p) => {
                                    const list = [
                                      ...p.retrospective.beforeAfterMetrics,
                                    ];
                                    list[idx] = {
                                      ...list[idx],
                                      displayAfter: e.target.value,
                                    };
                                    return {
                                      ...p,
                                      retrospective: {
                                        ...p.retrospective,
                                        beforeAfterMetrics: list,
                                      },
                                    };
                                  })
                                }
                                className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2 py-1.5 font-mono text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block font-mono text-[10px] text-[#C05E3E]">
                                Badge Delta
                              </label>
                              <input
                                type="text"
                                value={item.deltaBadge}
                                onChange={(e) =>
                                  updateCurrentProject((p) => {
                                    const list = [
                                      ...p.retrospective.beforeAfterMetrics,
                                    ];
                                    list[idx] = {
                                      ...list[idx],
                                      deltaBadge: e.target.value,
                                    };
                                    return {
                                      ...p,
                                      retrospective: {
                                        ...p.retrospective,
                                        beforeAfterMetrics: list,
                                      },
                                    };
                                  })
                                }
                                className="w-full rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2 py-1.5 font-mono text-xs font-bold text-[#C05E3E]"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <BilingualInput
                    label="Công thức Chiến thắng (Winning Formula)"
                    value={activeProject.retrospective.winningFormula}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        retrospective: {
                          ...p.retrospective,
                          winningFormula: next,
                        },
                      }))
                    }
                    multiline
                    rows={3}
                  />

                  <BilingualInput
                    label="Điểm Cải tiến ở Chu kỳ Tiếp theo (What To Improve)"
                    value={activeProject.retrospective.whatToImprove}
                    onChange={(next) =>
                      updateCurrentProject((p) => ({
                        ...p,
                        retrospective: {
                          ...p.retrospective,
                          whatToImprove: next,
                        },
                      }))
                    }
                    multiline
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: PROFILE, HERO & CONTACT EDITOR
        =================================================================== */}
        {activeTab === "profile" && (
          <div className="mt-8 space-y-6 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6">
            <div className="border-b border-[#D1CCC4] pb-3">
              <h2 className="text-lg font-bold text-[#0E0E0E]">
                Hồ sơ Cá nhân, Khu vực Mở đầu (Hero) & Thông tin Liên hệ
              </h2>
              <p className="text-xs text-[#5C5852]">
                Cập nhật tên thương hiệu, câu giới thiệu chủ đạo trên Hero, ảnh chân dung, 4 chỉ số KPI và thông tin liên hệ.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                  Tên hiển thị (Brand Name)
                </label>
                <input
                  type="text"
                  value={profile.marketerName}
                  onChange={(e) =>
                    setProfile({ ...profile, marketerName: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs font-bold text-[#0E0E0E]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                  Email Liên hệ
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                  Link Zalo
                </label>
                <input
                  type="text"
                  value={profile.zaloUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, zaloUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                  Link LinkedIn
                </label>
                <input
                  type="text"
                  value={profile.linkedinUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedinUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#5C5852]">
                  Đường dẫn CV PDF
                </label>
                <input
                  type="text"
                  value={profile.cvPath}
                  onChange={(e) =>
                    setProfile({ ...profile, cvPath: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 p-4">
              <label className="mb-1 block font-mono text-[11px] font-semibold uppercase text-[#0E0E0E]">
                Ảnh Chân dung Hero (Portrait Image URL)
              </label>
              <input
                type="text"
                value={profile.portraitImage}
                onChange={(e) =>
                  setProfile({ ...profile, portraitImage: e.target.value })
                }
                className="w-full rounded-xl border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-2 font-mono text-xs text-[#0E0E0E]"
              />
            </div>

            <BilingualInput
              label="Chức danh đầy đủ (Full Title)"
              value={profile.marketerFullTitle}
              onChange={(next) =>
                setProfile({ ...profile, marketerFullTitle: next })
              }
            />

            <BilingualInput
              label="Trạng thái Sẵn sàng trên Navbar (Availability Badge)"
              value={profile.availabilityBadge}
              onChange={(next) =>
                setProfile({ ...profile, availabilityBadge: next })
              }
            />

            <BilingualInput
              label="Địa điểm làm việc (Location)"
              value={profile.location}
              onChange={(next) => setProfile({ ...profile, location: next })}
            />

            <BilingualInput
              label="Tiêu đề Tuyên ngôn trên Hero (Hero Headline)"
              value={profile.hero.headline}
              onChange={(next) =>
                setProfile({
                  ...profile,
                  hero: { ...profile.hero, headline: next },
                })
              }
              multiline
              rows={3}
            />

            <BilingualInput
              label="Mô tả cuối trang (Footer Subtext)"
              value={profile.footer.subtext}
              onChange={(next) =>
                setProfile({
                  ...profile,
                  footer: { ...profile.footer, subtext: next },
                })
              }
              multiline
              rows={2}
            />

            {/* 4 Hero KPIs */}
            <div className="space-y-3 border-t border-[#D1CCC4] pt-5">
              <h3 className="font-mono text-xs font-bold uppercase text-[#C05E3E]">
                4 Chỉ số KPI nổi bật trên Hero (Inline Pills & Floating Badges)
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {profile.heroMetrics.map((metric, idx) => (
                  <div
                    key={metric.id}
                    className="space-y-2.5 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#C05E3E]">
                        Hero KPI #0{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const list = [...profile.heroMetrics];
                          list[idx] = { ...list[idx], value: e.target.value };
                          setProfile({ ...profile, heroMetrics: list });
                        }}
                        className="w-40 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1 font-mono text-xs font-bold text-[#C05E3E]"
                      />
                    </div>
                    <BilingualInput
                      label="Nhãn hiển thị (Label)"
                      value={metric.label}
                      onChange={(next) => {
                        const list = [...profile.heroMetrics];
                        list[idx] = { ...list[idx], label: next };
                        setProfile({ ...profile, heroMetrics: list });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: EXTENDED COVERFLOW ARCHIVE PROJECTS
        =================================================================== */}
        {activeTab === "archive" && (
          <div className="mt-8 space-y-5 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1CCC4] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#0E0E0E]">
                  Dự án Mở rộng trên Vòng xoay 3D Coverflow
                </h2>
                <p className="text-xs text-[#5C5852]">
                  Các dự án ngắn hạn xuất hiện nối tiếp sau 4 dự án trọng điểm trên 3D Coverflow.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newArc: ArchiveProject = {
                    year: "2026",
                    name: {
                      vi: "Chiến dịch Tăng trưởng Mới",
                      en: "New Growth Campaign",
                    },
                    clientType: {
                      vi: "Doanh nghiệp B2B / EdTech",
                      en: "B2B / EdTech Enterprise",
                    },
                    specialty: {
                      vi: "Full-Funnel IMC & CRO",
                      en: "Full-Funnel IMC & CRO",
                    },
                    highlightResult: {
                      vi: "Tăng 150% lượng Lead chất lượng và tối ưu 30% chi phí CPL.",
                      en: "Increased qualified leads by 150% while cutting CPL by 30%.",
                    },
                    href: `/work/${featuredProjects[0]?.slug || "university-admissions-imc-2025"}`,
                  };
                  addArchiveProject(newArc);
                  showNotification("Đã thêm dự án mở rộng mới!");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C05E3E] px-3.5 py-2 font-mono text-xs font-semibold text-[#FAF9F6]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Thêm dự án mở rộng</span>
              </button>
            </div>

            <div className="space-y-4">
              {archiveProjects.map((arc, idx) => (
                <div
                  key={idx}
                  className="space-y-3 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-[#C05E3E] px-2 py-0.5 font-mono text-xs font-bold text-[#FAF9F6]">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={arc.year}
                        onChange={(e) =>
                          updateArchiveProject(idx, {
                            ...arc,
                            year: e.target.value,
                          })
                        }
                        className="w-24 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1 font-mono text-xs font-bold"
                        placeholder="Năm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteArchiveProject(idx)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 font-mono text-xs text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>

                  <BilingualInput
                    label="Tên Dự án Mở rộng"
                    value={arc.name}
                    onChange={(next) =>
                      updateArchiveProject(idx, { ...arc, name: next })
                    }
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <BilingualInput
                      label="Loại hình Khách hàng (Client Type)"
                      value={arc.clientType}
                      onChange={(next) =>
                        updateArchiveProject(idx, { ...arc, clientType: next })
                      }
                    />
                    <BilingualInput
                      label="Hạng mục Chuyên môn (Specialty)"
                      value={arc.specialty}
                      onChange={(next) =>
                        updateArchiveProject(idx, { ...arc, specialty: next })
                      }
                    />
                  </div>

                  <BilingualInput
                    label="Kết quả Định lượng Nổi bật (Highlight Result)"
                    value={arc.highlightResult}
                    onChange={(next) =>
                      updateArchiveProject(idx, {
                        ...arc,
                        highlightResult: next,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: CERTIFICATIONS & TESTIMONIALS
        =================================================================== */}
        {activeTab === "credentials" && (
          <div className="mt-8 space-y-8">
            {/* International Certifications */}
            <div className="space-y-4 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6">
              <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0E0E0E]">
                    Chứng chỉ Chuyên môn Quốc tế (Verified Certifications)
                  </h2>
                  <p className="text-xs text-[#5C5852]">
                    Hiển thị tại dải bảo chứng năng lực dưới Timeline Kinh nghiệm.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextCert: CredentialItem = {
                      id: `cert-${Date.now()}`,
                      issuer: "Google / Meta",
                      title: {
                        vi: "Chứng chỉ Chuyên môn Mới",
                        en: "New Professional Certification",
                      },
                      year: "2026",
                      credentialCode: "CERT-PRO",
                    };
                    setProfile({
                      ...profile,
                      credentials: [...profile.credentials, nextCert],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#C05E3E] px-3 py-1.5 font-mono text-xs font-semibold text-[#FAF9F6]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm Chứng chỉ</span>
                </button>
              </div>

              <div className="space-y-4">
                {profile.credentials.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="space-y-3 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const list = [...profile.credentials];
                            list[idx] = { ...list[idx], issuer: e.target.value };
                            setProfile({ ...profile, credentials: list });
                          }}
                          className="rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 text-xs font-bold"
                          placeholder="Tổ chức cấp"
                        />
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => {
                            const list = [...profile.credentials];
                            list[idx] = { ...list[idx], year: e.target.value };
                            setProfile({ ...profile, credentials: list });
                          }}
                          className="w-20 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-2.5 py-1.5 font-mono text-xs"
                          placeholder="Năm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            credentials: profile.credentials.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }
                        className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 font-mono text-xs text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                    <BilingualInput
                      label="Tên Chứng chỉ"
                      value={cert.title}
                      onChange={(next) => {
                        const list = [...profile.credentials];
                        list[idx] = { ...list[idx], title: next };
                        setProfile({ ...profile, credentials: list });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Endorsements / Testimonials */}
            <div className="space-y-4 rounded-2xl border border-[#D1CCC4] bg-[#FAF9F6] p-6">
              <div className="flex items-center justify-between border-b border-[#D1CCC4] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0E0E0E]">
                    Đánh giá từ Lãnh đạo & Khách hàng (Executive Endorsements)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextQuote: TestimonialItem = {
                      id: `quote-${Date.now()}`,
                      author: "Tên Người Đánh Giá",
                      role: {
                        vi: "Giám đốc Điều hành (CEO)",
                        en: "Chief Executive Officer (CEO)",
                      },
                      company: {
                        vi: "Tên Doanh nghiệp / Tập đoàn",
                        en: "Enterprise Organization",
                      },
                      metricHighlight: "+150% KPI Growth",
                      quote: {
                        vi: "Nhận xét thực tế về năng lực triển khai chiến dịch IMC và tối ưu chuyển đổi Performance.",
                        en: "Executive endorsement highlighting full-funnel IMC and performance marketing impact.",
                      },
                    };
                    setProfile({
                      ...profile,
                      testimonials: [...profile.testimonials, nextQuote],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#C05E3E] px-3 py-1.5 font-mono text-xs font-semibold text-[#FAF9F6]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm Đánh giá</span>
                </button>
              </div>

              <div className="space-y-4">
                {profile.testimonials.map((item, idx) => (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-xl border border-[#D1CCC4] bg-[#EFECE6]/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={item.author}
                          onChange={(e) => {
                            const list = [...profile.testimonials];
                            list[idx] = { ...list[idx], author: e.target.value };
                            setProfile({ ...profile, testimonials: list });
                          }}
                          className="rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 text-xs font-bold"
                          placeholder="Tên người đánh giá"
                        />
                        <input
                          type="text"
                          value={item.metricHighlight}
                          onChange={(e) => {
                            const list = [...profile.testimonials];
                            list[idx] = {
                              ...list[idx],
                              metricHighlight: e.target.value,
                            };
                            setProfile({ ...profile, testimonials: list });
                          }}
                          className="w-56 rounded-lg border border-[#D1CCC4] bg-[#FAF9F6] px-3 py-1.5 font-mono text-xs font-semibold text-[#C05E3E]"
                          placeholder="Chỉ số nổi bật"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            testimonials: profile.testimonials.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }
                        className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 font-mono text-xs text-red-600"
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <BilingualInput
                        label="Chức vụ (Role)"
                        value={item.role}
                        onChange={(next) => {
                          const list = [...profile.testimonials];
                          list[idx] = { ...list[idx], role: next };
                          setProfile({ ...profile, testimonials: list });
                        }}
                      />
                      <BilingualInput
                        label="Công ty / Tổ chức (Company)"
                        value={item.company}
                        onChange={(next) => {
                          const list = [...profile.testimonials];
                          list[idx] = { ...list[idx], company: next };
                          setProfile({ ...profile, testimonials: list });
                        }}
                      />
                    </div>

                    <BilingualInput
                      label="Nội dung Trích dẫn (Quote)"
                      value={item.quote}
                      onChange={(next) => {
                        const list = [...profile.testimonials];
                        list[idx] = { ...list[idx], quote: next };
                        setProfile({ ...profile, testimonials: list });
                      }}
                      multiline
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <AdminAnalyticsCloudPanel
            onNotify={showNotification}
            onJumpToProject={(idx) => {
              setSelectedProjectIdx(idx);
              setActiveTab("projects");
              setProjectSubTab("card");
            }}
          />
        )}
      </div>
    </div>
  );
}
