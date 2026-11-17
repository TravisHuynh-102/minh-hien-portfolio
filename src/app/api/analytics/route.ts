import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  readCloudOrLocalJSON,
  writeCloudAndLocalJSON,
} from "@/lib/github-storage";

const ANALYTICS_REL_PATH = "src/data/analytics-data.json";
const ANALYTICS_LOCAL_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "analytics-data.json"
);

export interface AnalyticsEventItem {
  id: string;
  type:
    | "page_view"
    | "case_study_view"
    | "coverflow_click"
    | "cv_download"
    | "contact_click";
  target: string;
  label?: string;
  source: string;
  device: "Desktop" | "Mobile";
  timestamp: string;
}

export interface ProjectEngagementStat {
  views: number;
  coverflowClicks: number;
  lastViewedAt?: string;
}

export interface PortfolioAnalyticsPayload {
  totalPageViews: number;
  uniqueVisitors: number;
  cvDownloads: number;
  contactClicks: number;
  projectStats: Record<string, ProjectEngagementStat>;
  trafficSources: Record<string, number>;
  recentEvents: AnalyticsEventItem[];
  lastUpdated: string;
}

export const DEFAULT_ANALYTICS_DATA: PortfolioAnalyticsPayload = {
  totalPageViews: 148,
  uniqueVisitors: 94,
  cvDownloads: 19,
  contactClicks: 27,
  projectStats: {
    "university-admissions-imc-2025": {
      views: 64,
      coverflowClicks: 45,
      lastViewedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    },
    "b2b-industrial-tech-lead-engine": {
      views: 42,
      coverflowClicks: 31,
      lastViewedAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    },
    "flagship-o2o-brand-ambassador-series": {
      views: 35,
      coverflowClicks: 26,
      lastViewedAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    },
    "omnichannel-d2c-ecommerce-cro-growth": {
      views: 29,
      coverflowClicks: 21,
      lastViewedAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    },
  },
  trafficSources: {
    LinkedIn: 52,
    "CV / Resume PDF": 38,
    Direct: 31,
    Facebook: 16,
    GitHub: 11,
  },
  recentEvents: [
    {
      id: "evt-seed-1",
      type: "case_study_view",
      target: "university-admissions-imc-2025",
      label: "Xem chi tiết Case Study: university-admissions-imc-2025",
      source: "LinkedIn",
      device: "Desktop",
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    },
    {
      id: "evt-seed-2",
      type: "cv_download",
      target: "/cv.pdf",
      label: "Tải xuống CV PDF",
      source: "CV / Resume PDF",
      device: "Desktop",
      timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    },
    {
      id: "evt-seed-3",
      type: "coverflow_click",
      target: "b2b-industrial-tech-lead-engine",
      label: "Click 3D Coverflow: B2B Lead Generation Engine",
      source: "Direct",
      device: "Mobile",
      timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    },
  ],
  lastUpdated: new Date().toISOString(),
};

let memoryAnalyticsCache: PortfolioAnalyticsPayload | null = null;

async function getCurrentAnalytics(
  customToken?: string
): Promise<PortfolioAnalyticsPayload> {
  if (memoryAnalyticsCache) {
    return memoryAnalyticsCache;
  }
  const { data } = await readCloudOrLocalJSON<PortfolioAnalyticsPayload>(
    ANALYTICS_REL_PATH,
    DEFAULT_ANALYTICS_DATA,
    customToken
  );
  memoryAnalyticsCache = data;
  return data;
}

export async function GET() {
  try {
    const data = await getCurrentAnalytics();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch {
    return NextResponse.json(memoryAnalyticsCache || DEFAULT_ANALYTICS_DATA, {
      status: 200,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: "track" | "reset" | "sync-cloud";
      type?: AnalyticsEventItem["type"];
      target?: string;
      label?: string;
      source?: string;
      device?: "Desktop" | "Mobile";
      isNewVisitor?: boolean;
      githubToken?: string;
    };

    const customToken =
      request.headers.get("x-github-token")?.trim() || body.githubToken;

    if (body.action === "reset") {
      const resetPayload: PortfolioAnalyticsPayload = {
        totalPageViews: 0,
        uniqueVisitors: 0,
        cvDownloads: 0,
        contactClicks: 0,
        projectStats: {},
        trafficSources: {
          Direct: 0,
          LinkedIn: 0,
          "CV / Resume PDF": 0,
          Facebook: 0,
          GitHub: 0,
        },
        recentEvents: [],
        lastUpdated: new Date().toISOString(),
      };
      memoryAnalyticsCache = resetPayload;
      await writeCloudAndLocalJSON(
        ANALYTICS_REL_PATH,
        resetPayload,
        "chore(analytics): reset portfolio analytics counters",
        customToken
      );
      return NextResponse.json({ ok: true, data: resetPayload });
    }

    if (body.action === "sync-cloud") {
      const current = await getCurrentAnalytics(customToken);
      const syncRes = await writeCloudAndLocalJSON(
        ANALYTICS_REL_PATH,
        current,
        "chore(analytics): sync portfolio analytics snapshot to GitHub",
        customToken
      );
      return NextResponse.json({ ok: true, data: current, ...syncRes });
    }

    const current = await getCurrentAnalytics(customToken);

    const next: PortfolioAnalyticsPayload = {
      totalPageViews: current.totalPageViews || 0,
      uniqueVisitors: current.uniqueVisitors || 0,
      cvDownloads: current.cvDownloads || 0,
      contactClicks: current.contactClicks || 0,
      projectStats: { ...(current.projectStats || {}) },
      trafficSources: { ...(current.trafficSources || {}) },
      recentEvents: [...(current.recentEvents || [])],
      lastUpdated: new Date().toISOString(),
    };

    const eventType = body.type || "page_view";
    const target = body.target || "/";
    const source = body.source || "Direct";
    const device = body.device || "Desktop";

    if (eventType === "page_view") {
      next.totalPageViews += 1;
      if (body.isNewVisitor) {
        next.uniqueVisitors += 1;
      }
      next.trafficSources[source] = (next.trafficSources[source] || 0) + 1;
    } else if (eventType === "case_study_view") {
      next.totalPageViews += 1;
      if (body.isNewVisitor) {
        next.uniqueVisitors += 1;
      }
      const slug = target.replace(/^\/work\//, "").trim();
      const prev = next.projectStats[slug] || { views: 0, coverflowClicks: 0 };
      next.projectStats[slug] = {
        ...prev,
        views: prev.views + 1,
        lastViewedAt: next.lastUpdated,
      };
    } else if (eventType === "coverflow_click") {
      const slug = target.replace(/^\/work\//, "").trim();
      const prev = next.projectStats[slug] || { views: 0, coverflowClicks: 0 };
      next.projectStats[slug] = {
        ...prev,
        coverflowClicks: prev.coverflowClicks + 1,
        lastViewedAt: next.lastUpdated,
      };
    } else if (eventType === "cv_download") {
      next.cvDownloads += 1;
    } else if (eventType === "contact_click") {
      next.contactClicks += 1;
    }

    const newEvent: AnalyticsEventItem = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: eventType,
      target,
      label: body.label || target,
      source,
      device,
      timestamp: next.lastUpdated,
    };

    next.recentEvents = [newEvent, ...next.recentEvents].slice(0, 40);
    memoryAnalyticsCache = next;

    try {
      await fs.mkdir(path.dirname(ANALYTICS_LOCAL_PATH), { recursive: true });
      await fs.writeFile(
        ANALYTICS_LOCAL_PATH,
        JSON.stringify(next, null, 2),
        "utf-8"
      );
    } catch {
      // Read-only filesystem in serverless; memoryAnalyticsCache stays updated
    }

    return NextResponse.json({ ok: true, data: next });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
