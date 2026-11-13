"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SITE_CONFIG } from "@/data/site-config";
import { FEATURED_PROJECTS, ARCHIVE_PROJECTS } from "@/data/projects";
import type {
  ArchiveProject,
  CareerMilestone,
  CredentialItem,
  FeaturedProject,
  HeroMetric,
  LocalizedText,
  TestimonialItem,
} from "@/types/portfolio";

export interface CMSProfileConfig {
  marketerName: string;
  marketerFullTitle: LocalizedText;
  roleCode: string;
  email: string;
  phone: string;
  zaloUrl: string;
  linkedinUrl: string;
  cvPath: string;
  portraitImage: string;
  location: LocalizedText;
  availabilityBadge: LocalizedText;
  hero: {
    eyebrow: LocalizedText;
    headline: LocalizedText;
    subheadline: LocalizedText;
    primaryCta: LocalizedText;
    secondaryCta: LocalizedText;
    copiedFeedback: LocalizedText;
    portraitCaption: LocalizedText;
    portraitSubCaption: LocalizedText;
  };
  heroMetrics: HeroMetric[];
  careerMilestones: CareerMilestone[];
  testimonials: TestimonialItem[];
  credentials: CredentialItem[];
  footer: {
    eyebrow: LocalizedText;
    headline: LocalizedText;
    subtext: LocalizedText;
  };
}

export interface CMSDataPayload {
  profile: CMSProfileConfig;
  featuredProjects: FeaturedProject[];
  archiveProjects: ArchiveProject[];
  lastUpdated?: string;
}

export const DEFAULT_CMS_DATA: CMSDataPayload = {
  profile: {
    marketerName: SITE_CONFIG.marketerName,
    marketerFullTitle: SITE_CONFIG.marketerFullTitle,
    roleCode: SITE_CONFIG.roleCode,
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    zaloUrl: SITE_CONFIG.zaloUrl,
    linkedinUrl: SITE_CONFIG.linkedinUrl,
    cvPath: SITE_CONFIG.cvPath,
    portraitImage: "/images/profile/portrait-cutout.webp",
    location: SITE_CONFIG.location,
    availabilityBadge: SITE_CONFIG.availabilityBadge,
    hero: SITE_CONFIG.hero,
    heroMetrics: SITE_CONFIG.heroMetrics,
    careerMilestones: SITE_CONFIG.careerMilestones,
    testimonials: SITE_CONFIG.testimonials,
    credentials: SITE_CONFIG.credentials,
    footer: {
      eyebrow: SITE_CONFIG.footer.eyebrow,
      headline: SITE_CONFIG.footer.headline,
      subtext: SITE_CONFIG.footer.subtext,
    },
  },
  featuredProjects: FEATURED_PROJECTS,
  archiveProjects: ARCHIVE_PROJECTS,
};

interface CMSStoreState {
  profile: CMSProfileConfig;
  featuredProjects: FeaturedProject[];
  archiveProjects: ArchiveProject[];
  lastUpdated: string | null;
  isSyncing: boolean;
  isAdminAuthenticated: boolean;
  adminPasscode: string;
  loginAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => void;
  changeAdminPasscode: (
    currentPasscode: string,
    newPasscode: string
  ) => Promise<{ ok: boolean; error?: string }>;
  setProfile: (profile: CMSProfileConfig) => void;
  updateProfileField: <K extends keyof CMSProfileConfig>(
    key: K,
    value: CMSProfileConfig[K]
  ) => void;
  setFeaturedProjects: (projects: FeaturedProject[]) => void;
  updateFeaturedProject: (index: number, project: FeaturedProject) => void;
  addFeaturedProject: (project: FeaturedProject) => void;
  deleteFeaturedProject: (index: number) => void;
  moveFeaturedProject: (fromIndex: number, toIndex: number) => void;
  setArchiveProjects: (projects: ArchiveProject[]) => void;
  addArchiveProject: (project: ArchiveProject) => void;
  updateArchiveProject: (index: number, project: ArchiveProject) => void;
  deleteArchiveProject: (index: number) => void;
  importFullData: (payload: CMSDataPayload) => void;
  resetToDefaults: () => Promise<void>;
  saveToServer: () => Promise<boolean>;
  loadFromServer: () => Promise<void>;
}

export const useCMSStoreBase = create<CMSStoreState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_CMS_DATA.profile,
      featuredProjects: DEFAULT_CMS_DATA.featuredProjects,
      archiveProjects: DEFAULT_CMS_DATA.archiveProjects,
      lastUpdated: null,
      isSyncing: false,
      isAdminAuthenticated: false,
      adminPasscode: "",

      loginAdmin: async (passcode) => {
        const trimmed = passcode.trim();
        try {
          const res = await fetch("/api/cms", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "verify", passcode: trimmed }),
          });
          const data = (await res.json()) as { ok?: boolean; error?: string };
          if (res.ok && data.ok) {
            set({ isAdminAuthenticated: true, adminPasscode: trimmed });
            return { ok: true };
          }
          return {
            ok: false,
            error: data.error || "Mã khóa Admin không chính xác",
          };
        } catch {
          // Offline fallback check against default
          if (trimmed === "minhhien2026") {
            set({ isAdminAuthenticated: true, adminPasscode: trimmed });
            return { ok: true };
          }
          return { ok: false, error: "Mã khóa Admin không chính xác" };
        }
      },

      logoutAdmin: () =>
        set({ isAdminAuthenticated: false, adminPasscode: "" }),

      changeAdminPasscode: async (currentPasscode, newPasscode) => {
        try {
          const res = await fetch("/api/cms", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "change",
              passcode: currentPasscode.trim(),
              newPasscode: newPasscode.trim(),
            }),
          });
          const data = (await res.json()) as { ok?: boolean; error?: string };
          if (res.ok && data.ok) {
            set({
              isAdminAuthenticated: true,
              adminPasscode: newPasscode.trim(),
            });
            return { ok: true };
          }
          return {
            ok: false,
            error: data.error || "Không thể đổi mật khẩu",
          };
        } catch {
          return { ok: false, error: "Lỗi kết nối tới Server" };
        }
      },

      setProfile: (profile) =>
        set({ profile, lastUpdated: new Date().toISOString() }),

      updateProfileField: (key, value) =>
        set((state) => ({
          profile: { ...state.profile, [key]: value },
          lastUpdated: new Date().toISOString(),
        })),

      setFeaturedProjects: (featuredProjects) =>
        set({ featuredProjects, lastUpdated: new Date().toISOString() }),

      updateFeaturedProject: (index, project) =>
        set((state) => {
          const next = [...state.featuredProjects];
          if (index >= 0 && index < next.length) {
            next[index] = project;
          }
          return {
            featuredProjects: next,
            lastUpdated: new Date().toISOString(),
          };
        }),

      addFeaturedProject: (project) =>
        set((state) => ({
          featuredProjects: [project, ...state.featuredProjects],
          lastUpdated: new Date().toISOString(),
        })),

      deleteFeaturedProject: (index) =>
        set((state) => ({
          featuredProjects: state.featuredProjects.filter(
            (_, i) => i !== index
          ),
          lastUpdated: new Date().toISOString(),
        })),

      moveFeaturedProject: (fromIndex, toIndex) =>
        set((state) => {
          const next = [...state.featuredProjects];
          if (
            fromIndex < 0 ||
            fromIndex >= next.length ||
            toIndex < 0 ||
            toIndex >= next.length
          ) {
            return state;
          }
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return {
            featuredProjects: next,
            lastUpdated: new Date().toISOString(),
          };
        }),

      setArchiveProjects: (archiveProjects) =>
        set({ archiveProjects, lastUpdated: new Date().toISOString() }),

      addArchiveProject: (project) =>
        set((state) => ({
          archiveProjects: [project, ...state.archiveProjects],
          lastUpdated: new Date().toISOString(),
        })),

      updateArchiveProject: (index, project) =>
        set((state) => {
          const next = [...state.archiveProjects];
          if (index >= 0 && index < next.length) {
            next[index] = project;
          }
          return {
            archiveProjects: next,
            lastUpdated: new Date().toISOString(),
          };
        }),

      deleteArchiveProject: (index) =>
        set((state) => ({
          archiveProjects: state.archiveProjects.filter((_, i) => i !== index),
          lastUpdated: new Date().toISOString(),
        })),

      importFullData: (payload) =>
        set({
          profile: payload.profile || DEFAULT_CMS_DATA.profile,
          featuredProjects:
            payload.featuredProjects || DEFAULT_CMS_DATA.featuredProjects,
          archiveProjects:
            payload.archiveProjects || DEFAULT_CMS_DATA.archiveProjects,
          lastUpdated: new Date().toISOString(),
        }),

      resetToDefaults: async () => {
        const state = get();
        const now = new Date().toISOString();
        set({
          profile: DEFAULT_CMS_DATA.profile,
          featuredProjects: DEFAULT_CMS_DATA.featuredProjects,
          archiveProjects: DEFAULT_CMS_DATA.archiveProjects,
          lastUpdated: now,
        });
        try {
          await fetch("/api/cms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-passcode": state.adminPasscode,
            },
            body: JSON.stringify({
              profile: DEFAULT_CMS_DATA.profile,
              featuredProjects: DEFAULT_CMS_DATA.featuredProjects,
              archiveProjects: DEFAULT_CMS_DATA.archiveProjects,
              lastUpdated: now,
            }),
          });
        } catch {
          // Ignore network error if static
        }
      },

      saveToServer: async () => {
        const state = get();
        set({ isSyncing: true });
        try {
          const payload: CMSDataPayload = {
            profile: state.profile,
            featuredProjects: state.featuredProjects,
            archiveProjects: state.archiveProjects,
            lastUpdated: new Date().toISOString(),
          };
          const res = await fetch("/api/cms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-passcode": state.adminPasscode,
            },
            body: JSON.stringify(payload),
          });
          set({ isSyncing: false, lastUpdated: payload.lastUpdated || null });
          return res.ok;
        } catch {
          set({ isSyncing: false });
          return false;
        }
      },

      loadFromServer: async () => {
        try {
          const res = await fetch("/api/cms", { cache: "no-store" });
          if (!res.ok) return;
          const data = (await res.json()) as CMSDataPayload | null;
          if (data && data.profile && Array.isArray(data.featuredProjects)) {
            set({
              profile: data.profile,
              featuredProjects: data.featuredProjects,
              archiveProjects:
                data.archiveProjects || DEFAULT_CMS_DATA.archiveProjects,
              lastUpdated: data.lastUpdated || null,
            });
          }
        } catch {
          // Ignore if no server file yet
        }
      },
    }),
    {
      name: "portfolio-cms-storage-v1",
      skipHydration: true,
      partialize: (state) => ({
        profile: state.profile,
        featuredProjects: state.featuredProjects,
        archiveProjects: state.archiveProjects,
        lastUpdated: state.lastUpdated,
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminPasscode: state.adminPasscode,
      }),
    }
  )
);

let cmsHydrated = false;

export function useCMSStore(): CMSStoreState {
  const store = useCMSStoreBase();

  useEffect(() => {
    if (!cmsHydrated) {
      cmsHydrated = true;
      useCMSStoreBase.persist.rehydrate();
      void useCMSStoreBase.getState().loadFromServer();
    }
  }, []);

  return store;
}
