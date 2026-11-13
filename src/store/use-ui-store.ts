"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, ProjectCategory } from "@/types/portfolio";

export type ThemeMode = "light" | "dark";
export type StylePreset = "crimson" | "neon" | "original";

interface UIStoreState {
  lang: Language;
  theme: ThemeMode;
  stylePreset: StylePreset;
  isCommandOpen: boolean;
  activeCategory: ProjectCategory;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setStylePreset: (preset: StylePreset) => void;
  setCommandOpen: (open: boolean) => void;
  toggleCommandOpen: () => void;
  setActiveCategory: (category: ProjectCategory) => void;
}

export const useUIStoreBase = create<UIStoreState>()(
  persist(
    (set) => ({
      lang: "vi",
      theme: "light",
      stylePreset: "crimson",
      isCommandOpen: false,
      activeCategory: "all",
      setLang: (lang) => set({ lang }),
      toggleLang: () =>
        set((state) => ({ lang: state.lang === "vi" ? "en" : "vi" })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setStylePreset: (stylePreset) => set({ stylePreset }),
      setCommandOpen: (isCommandOpen) => set({ isCommandOpen }),
      toggleCommandOpen: () =>
        set((state) => ({ isCommandOpen: !state.isCommandOpen })),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
    }),
    {
      name: "portfolio-ui-storage",
      skipHydration: true,
      partialize: (state) => ({
        lang: state.lang,
        theme: state.theme,
        stylePreset: state.stylePreset,
      }),
    }
  )
);

let hasHydrated = false;

export function useUIStore(): UIStoreState {
  const store = useUIStoreBase();

  useEffect(() => {
    if (!hasHydrated) {
      hasHydrated = true;
      useUIStoreBase.persist.rehydrate();
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (store.theme === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    }
  }, [store.theme]);

  return store;
}
