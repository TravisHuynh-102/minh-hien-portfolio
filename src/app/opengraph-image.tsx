import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/data/site-config";

export const alt =
  "MINH HIỂN — Full-Stack Marketer (MarCom Strategy & Performance Growth)";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090B",
          padding: "56px 64px",
          color: "#F4F4F5",
          fontFamily: "sans-serif",
          border: "2px solid #27272A",
        }}
      >
        {/* Top Eyebrow Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "1px solid #27272A",
              backgroundColor: "#111113",
              fontSize: "18px",
              letterSpacing: "0.1em",
              color: "#E4E4E7",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "9999px",
                backgroundColor: "#34D399",
              }}
            />
            <span>FULL-STACK MARKETER • MARCOM & PERFORMANCE</span>
          </div>

          <div
            style={{
              fontSize: "20px",
              color: "#A1A1AA",
              letterSpacing: "0.08em",
            }}
          >
            {SITE_CONFIG.marketerName}
          </div>
        </div>

        {/* Center Positioning Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Bridging Emotionally Resonant Brand Narratives with Measurable
            Revenue Growth.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#A1A1AA",
              lineHeight: 1.4,
            }}
          >
            Full-Funnel IMC Strategy × Multi-Channel Paid Media ×
            Data-to-Creative Loop
          </div>
        </div>

        {/* Bottom Bento Strip Showing Top 3 Impact Metrics */}
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "20px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "22px 26px",
              borderRadius: "12px",
              border: "1px solid #27272A",
              backgroundColor: "#111113",
            }}
          >
            <span style={{ fontSize: "15px", color: "#A1A1AA" }}>
              01 / MARCOM REACH
            </span>
            <span
              style={{
                fontSize: "38px",
                fontWeight: 700,
                color: "#34D399",
                marginTop: "6px",
              }}
            >
              50M+ Views
            </span>
            <span style={{ fontSize: "15px", color: "#71717A", marginTop: "4px" }}>
              Cross-Channel Video, PR & O2O
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "22px 26px",
              borderRadius: "12px",
              border: "1px solid #27272A",
              backgroundColor: "#111113",
            }}
          >
            <span style={{ fontSize: "15px", color: "#A1A1AA" }}>
              02 / FUNNEL EFFICIENCY
            </span>
            <span
              style={{
                fontSize: "38px",
                fontWeight: 700,
                color: "#FFFFFF",
                marginTop: "6px",
              }}
            >
              -32% CPL
            </span>
            <span style={{ fontSize: "15px", color: "#71717A", marginTop: "4px" }}>
              Via 9:16 Hook Testing & Quiz CRO
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "22px 26px",
              borderRadius: "12px",
              border: "1px solid #27272A",
              backgroundColor: "#111113",
            }}
          >
            <span style={{ fontSize: "15px", color: "#A1A1AA" }}>
              03 / EXECUTION SCALE
            </span>
            <span
              style={{
                fontSize: "38px",
                fontWeight: 700,
                color: "#FFFFFF",
                marginTop: "6px",
              }}
            >
              15+ Campaigns
            </span>
            <span style={{ fontSize: "15px", color: "#71717A", marginTop: "4px" }}>
              9-Figure VND Scale • NDA-Safe
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
