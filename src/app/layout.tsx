import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { StickyNavbar } from "@/components/layout/sticky-navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { PortfolioAnalyticsTracker } from "@/components/layout/portfolio-analytics-tracker";
import { SITE_CONFIG } from "@/data/site-config";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minh-hien-portfolio.vercel.app"),
  title: {
    default: `${SITE_CONFIG.marketerName} | Full-Stack Marketer (MarCom Strategy & Performance Growth)`,
    template: `%s | ${SITE_CONFIG.marketerName}`,
  },
  description:
    "Hybrid 2-Level Portfolio of a Full-Stack Marketer combining IMC/MarCom Brand Strategy, Multi-Channel Paid Media, CRO, and Data-to-Creative Feedback Loops.",
  keywords: [
    "Full-Stack Marketer",
    "MarCom Strategy",
    "Performance Marketing",
    "Growth Marketing",
    "IMC Case Study",
    "Data-to-Creative Loop",
    "ROAS Simulator",
    "CRO",
  ],
  openGraph: {
    title: `${SITE_CONFIG.marketerName} — Full-Stack Marketer (MarCom & Performance)`,
    description:
      "50M+ Views • 9-Figure VND Scale • -32% Blended CPL • 15+ Full-Funnel Campaigns. Explore deep-dive IMC & Performance case studies.",
    type: "website",
    locale: "vi_VN",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.marketerName} — Full-Stack Marketer`,
    description:
      "Bridging Brand/MarCom creative with measurable Performance & CRO growth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="vi" className={jetbrainsMono.variable}>
      <body className="min-h-[100dvh] bg-[#F5F3ED] font-sans text-[#0E0E0E] antialiased selection:bg-[#C05E3E] selection:text-[#FAF9F6]">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        ) : null}
        <StickyNavbar />
        <CommandPalette />
        <PortfolioAnalyticsTracker />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
