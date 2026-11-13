"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  FileText,
  Linkedin,
  Mail,
  MessageSquare,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/site-config";
import { useUIStore } from "@/store/use-ui-store";
import { useCMSStore } from "@/store/use-cms-store";
import { t } from "@/lib/utils";
import { MinimalistHero } from "@/components/ui/minimalist-hero";

export function HeroSection() {
  const { lang } = useUIStore();
  const { profile } = useCMSStore();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const navLinks = SITE_CONFIG.navItems.map((item) => ({
    label: t(item.label, lang).toUpperCase(),
    href: item.href,
  }));

  const socialLinks = [
    { icon: Linkedin, href: profile.linkedinUrl },
    { icon: MessageSquare, href: profile.zaloUrl },
    { icon: Mail, href: `mailto:${profile.email}` },
    { icon: FileText, href: profile.cvPath },
  ];

  const inlineMetrics = profile.heroMetrics.slice(0, 4).map((m) => ({
    value: m.value.split(" ")[0] || m.value,
    label: t(m.label, lang),
  }));

  const floatingBadges = {
    topLeft: {
      value: profile.heroMetrics[0]?.value || "50M+ Views",
      sub: profile.heroMetrics[0]
        ? t(profile.heroMetrics[0].label, lang)
        : lang === "vi"
          ? "MarCom & Video 9:16"
          : "MarCom & 9:16 Video",
    },
    topRight: {
      value: profile.heroMetrics[1]?.value || "3.5 Tỷ+ VNĐ",
      sub: profile.heroMetrics[1]
        ? t(profile.heroMetrics[1].label, lang)
        : lang === "vi"
          ? "Full-Funnel Growth"
          : "Full-Funnel Growth",
    },
    bottomRight: {
      value: profile.heroMetrics[2]?.value || "-32% CPL",
      sub: profile.heroMetrics[2]
        ? t(profile.heroMetrics[2].label, lang)
        : lang === "vi"
          ? "3s Hook & Quiz CRO"
          : "3s Hook & Quiz CRO",
    },
  };

  return (
    <section id="hero" className="border-b border-[#D1CCC4] bg-[#F5F3ED]">
      <MinimalistHero
        logoText="FULL-STACK MARKETER."
        navLinks={navLinks}
        mainText={t(profile.hero.headline, lang)}
        readMoreLink="#work"
        readMoreLabel={t(profile.hero.primaryCta, lang)}
        imageSrc={profile.portraitImage || "/images/profile/portrait-cutout.webp"}
        imageAlt={profile.marketerName}
        overlayText={{
          part1: lang === "vi" ? "marcom" : "brand",
          part2: lang === "vi" ? "& growth." : "& roas.",
        }}
        socialLinks={socialLinks}
        locationText={t(profile.location, lang)}
        inlineMetrics={inlineMetrics}
        floatingBadges={floatingBadges}
        extraActions={
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#D1CCC4] bg-[#EFECE6] px-3.5 font-mono text-xs font-medium text-[#0E0E0E] transition-all hover:-translate-y-0.5 hover:bg-[#E6E2DA]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#C05E3E]" />
                <span className="text-[#C05E3E]">
                  {t(profile.hero.copiedFeedback, lang)}
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#C05E3E]" />
                <span>{t(profile.hero.secondaryCta, lang)}</span>
              </>
            )}
          </button>
        }
      />
    </section>
  );
}
