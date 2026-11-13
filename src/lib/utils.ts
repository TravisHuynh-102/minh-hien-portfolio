import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language, LocalizedText } from "@/types/portfolio";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function t(textObj: LocalizedText | undefined, lang: Language): string {
  if (!textObj) return "";
  return textObj[lang] || textObj.vi;
}
