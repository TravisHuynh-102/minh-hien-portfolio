"use client";

import React, { useMemo } from "react";
import { useUIStore } from "@/store/use-ui-store";
import PerspectiveTunnelHero, {
  type TunnelImageItem,
} from "@/components/ui/perspective-tunnel-hero";

const TUNNEL_CAMPAIGN_IMAGES_VI: TunnelImageItem[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg",
    title: "Key Visual Tuyển Sinh • +128% KPI",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg",
    title: "B2B Demo Hook 9:16 • 2.2x SQLs",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg",
    title: "UniHackfest & Miss UEF • 50M+ Views",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c627ae01916f68bcfa9a02ab6e24.jpg",
    title: "D2C Mega Sale • ROAS 4.8x",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/10/10db8a40cf2d49dc2d2ef1d0b2edbd7287d4fb9d2c59d1ab47ac94ee74714ad8.jpg",
    title: "Quiz CRO Funnel • -32% CPL",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/25/250f91a21b930792b5da4ae54ef105204882efeeed88de6a203e7d532bf43354.jpg",
    title: "3DS & Trutech B2B • 180M Budget",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ca/ca884da70a7ba1931f5f023b3ab2b1f48e8bd72ee98e793e5d7cfcf6cd419f7c.jpg",
    title: "Los Gatos Creativo • +200% Rev",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/d5/d577130ffbfdd8d0681e2c52ee8dc0c6c18666ceef9ac3b539240710d1b07b79.jpg",
    title: "GA4 + Server GTM • 8.8 EMQ",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/06/06008bf07e782fe1d8da447026af1faae7d98e62f3b0c46c93a98d44f661d563.jpg",
    title: "Nanovet 50+ Dealers • Toolkit",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/bb/bbef4de1ff05302a8d2c60ed17a34de822c0747b08e1aa573bd59142de3463d5.jpg",
    title: "UEF Ambassadors • O2O Viral",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/16/16ad0edcf399d80a7b2c79d6fc6c04e3bd45779ca7f72191bb38dbba1f3738b2.jpg",
    title: "Looker Studio BI • Live P&L",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ec/ec07fa56ef1adbf20fb37e6d1d09142b52081c082d937e7a5fc2ce9de453d210.jpg",
    title: "Data × Creative Loop • Full-Funnel",
  },
];

const TUNNEL_CAMPAIGN_IMAGES_EN: TunnelImageItem[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg",
    title: "Admissions KV • +128% KPI",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg",
    title: "B2B 9:16 Hook • 2.2x SQLs",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg",
    title: "UniHackfest & Miss UEF • 50M+ Views",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c627ae01916f68bcfa9a02ab6e24.jpg",
    title: "D2C Mega Sale • 4.8x ROAS",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/10/10db8a40cf2d49dc2d2ef1d0b2edbd7287d4fb9d2c59d1ab47ac94ee74714ad8.jpg",
    title: "Quiz CRO Funnel • -32% CPL",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/25/250f91a21b930792b5da4ae54ef105204882efeeed88de6a203e7d532bf43354.jpg",
    title: "3DS & Trutech B2B • 180M Budget",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ca/ca884da70a7ba1931f5f023b3ab2b1f48e8bd72ee98e793e5d7cfcf6cd419f7c.jpg",
    title: "Los Gatos Creativo • +200% Rev",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/d5/d577130ffbfdd8d0681e2c52ee8dc0c6c18666ceef9ac3b539240710d1b07b79.jpg",
    title: "GA4 + Server GTM • 8.8 EMQ",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/06/06008bf07e782fe1d8da447026af1faae7d98e62f3b0c46c93a98d44f661d563.jpg",
    title: "Nanovet 50+ Dealers • Toolkit",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/bb/bbef4de1ff05302a8d2c60ed17a34de822c0747b08e1aa573bd59142de3463d5.jpg",
    title: "UEF Ambassadors • O2O Viral",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/16/16ad0edcf399d80a7b2c79d6fc6c04e3bd45779ca7f72191bb38dbba1f3738b2.jpg",
    title: "Looker Studio BI • Live P&L",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/ec/ec07fa56ef1adbf20fb37e6d1d09142b52081c082d937e7a5fc2ce9de453d210.jpg",
    title: "Data × Creative Loop • Full-Funnel",
  },
];

export function CreativePerformanceLab() {
  const { lang } = useUIStore();

  const tunnelImages = useMemo(
    () =>
      lang === "vi" ? TUNNEL_CAMPAIGN_IMAGES_VI : TUNNEL_CAMPAIGN_IMAGES_EN,
    [lang]
  );

  return (
    <section id="lab" className="border-b border-[#D1CCC4] bg-[#F5F3ED]">
      <PerspectiveTunnelHero
        eyebrow={
          lang === "vi"
            ? "03 // KHÔNG GIAN SÁNG TẠO & PERFORMANCE 3D"
            : "03 // SPATIAL CREATIVE & PERFORMANCE ARCHIVE"
        }
        titleLine1={lang === "vi" ? "Đường Hầm" : "Enter The"}
        titleLine2={lang === "vi" ? "Thị Giác." : "Archive."}
        subtitle={
          lang === "vi"
            ? "Cuộn con lăn chuột hoặc vuốt để bay xuyên qua 12 ấn phẩm Key Visual, Short-form Hook 9:16 và hệ thống tăng trưởng đa kênh."
            : "Scroll or swipe to fly through 12 high-converting Key Visuals, 9:16 vertical hooks, and full-funnel growth campaigns."
        }
        scrollHint={lang === "vi" ? "Cuộn Để Bay" : "Scroll To Fly"}
        images={tunnelImages}
      />
    </section>
  );
}
