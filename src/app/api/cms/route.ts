import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CMS_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-data.json");
const AUTH_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "cms-auth.json"
);

const DEFAULT_PASSCODE = process.env.ADMIN_PASSCODE || "minhhien2026";

async function getActivePasscode(): Promise<string> {
  try {
    const raw = await fs.readFile(AUTH_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as { passcode?: string };
    if (parsed.passcode && parsed.passcode.trim().length >= 4) {
      return parsed.passcode.trim();
    }
  } catch {
    // Use default or env passcode
  }
  return DEFAULT_PASSCODE;
}

export async function GET() {
  try {
    const raw = await fs.readFile(CMS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: "verify" | "change";
      passcode?: string;
      newPasscode?: string;
    };
    const activePasscode = await getActivePasscode();

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
      await fs.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
      await fs.writeFile(
        AUTH_FILE_PATH,
        JSON.stringify({ passcode: nextPass, updatedAt: new Date().toISOString() }, null, 2),
        "utf-8"
      );
      return NextResponse.json({ ok: true });
    }

    const isValid = (body.passcode || "").trim() === activePasscode;
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "Mã khóa Admin không chính xác" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
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
    const activePasscode = await getActivePasscode();

    if (providedPasscode !== activePasscode) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: Invalid Admin Passcode" },
        { status: 401 }
      );
    }

    const body = await request.json();
    await fs.mkdir(path.dirname(CMS_FILE_PATH), { recursive: true });
    await fs.writeFile(CMS_FILE_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
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
