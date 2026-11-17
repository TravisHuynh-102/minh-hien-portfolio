import { NextResponse } from "next/server";
import {
  getCloudConfigInfo,
  readCloudOrLocalJSON,
  writeCloudAndLocalJSON,
} from "@/lib/github-storage";

const CMS_REL_PATH = "src/data/cms-data.json";
const AUTH_REL_PATH = "src/data/cms-auth.json";

const DEFAULT_PASSCODE = process.env.ADMIN_PASSCODE || "minhhien2026";

async function getActivePasscode(customGithubToken?: string): Promise<string> {
  try {
    const { data } = await readCloudOrLocalJSON<{ passcode?: string } | null>(
      AUTH_REL_PATH,
      null,
      customGithubToken
    );
    if (data?.passcode && data.passcode.trim().length >= 4) {
      return data.passcode.trim();
    }
  } catch {
    // Fallback to default
  }
  return DEFAULT_PASSCODE;
}

export async function GET(request: Request) {
  try {
    const customToken =
      request.headers.get("x-github-token")?.trim() || undefined;
    const { data, source } = await readCloudOrLocalJSON<Record<
      string,
      unknown
    > | null>(CMS_REL_PATH, null, customToken);

    if (!data) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(
      {
        ...data,
        _syncSource: source,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(null, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const customToken =
      request.headers.get("x-github-token")?.trim() || undefined;
    const body = (await request.json()) as {
      action?: "verify" | "change" | "cloud-status";
      passcode?: string;
      newPasscode?: string;
      githubToken?: string;
    };

    if (body.action === "cloud-status") {
      const info = getCloudConfigInfo(body.githubToken || customToken);
      return NextResponse.json({ ok: true, cloud: info });
    }

    const activePasscode = await getActivePasscode(customToken);

    if (body.action === "change") {
      if ((body.passcode || "").trim() !== activePasscode) {
        return NextResponse.json(
          { ok: false, error: "Mật khẩu hiện tại không đúng" },
          { status: 401 }
        );
      }
      const nextPass = (body.newPasscode || "").trim();
      if (nextPass.length < 4) {
        return NextResponse.json(
          { ok: false, error: "Mật khẩu mới phải có ít nhất 4 ký tự" },
          { status: 400 }
        );
      }

      const syncRes = await writeCloudAndLocalJSON(
        AUTH_REL_PATH,
        {
          passcode: nextPass,
          updatedAt: new Date().toISOString(),
        },
        "chore(cms): update admin security vault passcode",
        body.githubToken || customToken
      );

      if (!syncRes.savedLocal && !syncRes.syncedCloud) {
        return NextResponse.json(
          {
            ok: false,
            error:
              syncRes.cloudError ||
              "Không thể lưu mật khẩu mới lên Cloud hoặc Local",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
        savedLocal: syncRes.savedLocal,
        syncedCloud: syncRes.syncedCloud,
      });
    }

    const isValid = (body.passcode || "").trim() === activePasscode;
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "Mã khóa Admin không chính xác" },
        { status: 401 }
      );
    }

    const cloud = getCloudConfigInfo(body.githubToken || customToken);
    return NextResponse.json({ ok: true, cloud });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Lỗi xác thực Admin" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const providedPasscode =
      request.headers.get("x-admin-passcode")?.trim() || "";
    const customToken =
      request.headers.get("x-github-token")?.trim() || undefined;
    const activePasscode = await getActivePasscode(customToken);

    if (providedPasscode !== activePasscode) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: Invalid Admin Passcode" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const savedAt = new Date().toISOString();
    const payload = {
      ...body,
      lastUpdated: savedAt,
    };

    const syncResult = await writeCloudAndLocalJSON(
      CMS_REL_PATH,
      payload,
      `content(cms): update portfolio content via Admin Studio (${savedAt.slice(0, 19)}Z)`,
      customToken
    );

    if (!syncResult.savedLocal && !syncResult.syncedCloud) {
      return NextResponse.json(
        {
          ok: false,
          error:
            syncResult.cloudError ||
            "Không thể lưu dữ liệu trên Serverless khi chưa cấu hình GitHub Cloud Token.",
          ...syncResult,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      savedAt,
      ...syncResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to save CMS data",
      },
      { status: 500 }
    );
  }
}
