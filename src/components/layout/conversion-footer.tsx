"use client";

import React, { useState } from "react";
import { useUIStore } from "@/store/use-ui-store";
import { useCMSStore } from "@/store/use-cms-store";
import { t } from "@/lib/utils";
import SignaturePenFooter from "@/components/ui/signature-pen-footer";

export function ConversionFooter() {
  const { lang, theme } = useUIStore();
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

  return (
    <section id="contact" className="border-t border-[#D1CCC4] bg-[#F5F3ED]">
      <SignaturePenFooter
        word={profile.marketerName}
        title={
          lang === "vi"
            ? "Cảm ơn bạn đã ghé thăm."
            : "Thank you for stopping by."
        }
        description={t(profile.footer.subtext, lang)}
        actions={[
          {
            label: copied
              ? t(profile.hero.copiedFeedback, lang)
              : `${t(profile.hero.secondaryCta, lang)} (${profile.email})`,
            variant: "secondary",
            onClick: handleCopyEmail,
          },
          {
            label:
              lang === "vi"
                ? "Tải CV Full-Stack (PDF)"
                : "Download Full-Stack CV (PDF)",
            href: profile.cvPath,
            variant: "primary",
          },
        ]}
        brand={`${profile.marketerName} · Growth Studio`}
        links={
          lang === "vi"
            ? [
                { label: "Dự án 3D Coverflow", href: "#work" },
                { label: "Không gian 3D Tunnel", href: "#lab" },
                { label: "Timeline Kinh nghiệm", href: "#journey" },
                { label: "LinkedIn", href: profile.linkedinUrl },
                { label: "Zalo", href: profile.zaloUrl },
              ]
            : [
                { label: "3D Coverflow Work", href: "#work" },
                { label: "3D Tunnel Archive", href: "#lab" },
                { label: "Career Timeline", href: "#journey" },
                { label: "LinkedIn", href: profile.linkedinUrl },
                { label: "Zalo", href: profile.zaloUrl },
              ]
        }
        legal={`© ${new Date().getFullYear()} ${profile.marketerName} — ${t(
          profile.marketerFullTitle,
          lang
        )}.`}
        theme={theme}
        background={theme === "dark" ? "#09090B" : "#FAFAFA"}
        inkFrom={theme === "dark" ? "#a5b4fc" : "#6366f1"}
        inkTo={theme === "dark" ? "#6366f1" : "#4f46e5"}
        accent={theme === "dark" ? "#6366f1" : "#4f46e5"}
        duration={3.0}
      />
    </section>
  );
}
