import { promises as fs } from "fs";
import path from "path";
import { execSync } from "child_process";

const DEFAULT_GITHUB_REPO =
  process.env.GITHUB_CMS_REPO || "TravisHuynh-102/minh-hien-portfolio";
const DEFAULT_GITHUB_BRANCH = process.env.GITHUB_CMS_BRANCH || "main";

let cachedLocalGitToken: string | null | undefined = undefined;

export function resolveGitHubToken(customToken?: string): {
  token: string | null;
  source: "header" | "env" | "git-credential" | "none";
} {
  if (customToken && customToken.trim().length > 10) {
    return { token: customToken.trim(), source: "header" };
  }

  const envToken =
    process.env.GITHUB_CMS_TOKEN || process.env.GITHUB_TOKEN || "";
  if (envToken.trim().length > 10) {
    return { token: envToken.trim(), source: "env" };
  }

  // On local development machine (not Vercel serverless), resolve from git credential manager
  if (!process.env.VERCEL) {
    if (cachedLocalGitToken !== undefined) {
      return {
        token: cachedLocalGitToken,
        source: cachedLocalGitToken ? "git-credential" : "none",
      };
    }
    try {
      const out = execSync("git credential fill", {
        input: "protocol=https\nhost=github.com\n\n",
        stdio: ["pipe", "pipe", "ignore"],
        timeout: 2500,
      }).toString();
      const match = out.match(/password=(.+)/);
      if (match && match[1]?.trim()) {
        cachedLocalGitToken = match[1].trim();
        return { token: cachedLocalGitToken, source: "git-credential" };
      }
    } catch {
      // Ignore if git credential manager is unavailable
    }
    cachedLocalGitToken = null;
  }

  return { token: null, source: "none" };
}

export async function readCloudOrLocalJSON<T>(
  relativePath: string,
  fallback: T,
  customToken?: string
): Promise<{ data: T; source: "cloud" | "local" | "default" }> {
  const cleanRelPath = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const localAbsPath = path.join(process.cwd(), ...cleanRelPath.split("/"));

  let localData: T | null = null;
  try {
    const raw = await fs.readFile(localAbsPath, "utf-8");
    localData = JSON.parse(raw) as T;
  } catch {
    localData = null;
  }

  // Fetch live from GitHub API so Vercel serverless always gets the newest published data
  try {
    const { token } = resolveGitHubToken(customToken);
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.raw+json",
      "User-Agent": "MinhHien-Portfolio-CMS",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${DEFAULT_GITHUB_REPO}/contents/${cleanRelPath}?ref=${DEFAULT_GITHUB_BRANCH}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (res.ok) {
      const cloudText = await res.text();
      const cloudData = JSON.parse(cloudText) as T;

      // If both local and cloud have lastUpdated, pick whichever is newer
      const localTs =
        localData &&
        typeof localData === "object" &&
        "lastUpdated" in localData &&
        typeof (localData as { lastUpdated?: string }).lastUpdated === "string"
          ? Date.parse((localData as { lastUpdated: string }).lastUpdated)
          : 0;
      const cloudTs =
        cloudData &&
        typeof cloudData === "object" &&
        "lastUpdated" in cloudData &&
        typeof (cloudData as { lastUpdated?: string }).lastUpdated === "string"
          ? Date.parse((cloudData as { lastUpdated: string }).lastUpdated)
          : 0;

      if (localData && localTs > cloudTs && !process.env.VERCEL) {
        return { data: localData, source: "local" };
      }

      return { data: cloudData, source: "cloud" };
    }
  } catch {
    // Fallback to local file
  }

  if (localData !== null) {
    return { data: localData, source: "local" };
  }

  return { data: fallback, source: "default" };
}

export async function writeCloudAndLocalJSON<T>(
  relativePath: string,
  data: T,
  commitMessage: string,
  customToken?: string
): Promise<{
  savedLocal: boolean;
  syncedCloud: boolean;
  cloudUrl?: string;
  cloudError?: string;
  tokenSource: "header" | "env" | "git-credential" | "none";
}> {
  const cleanRelPath = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const localAbsPath = path.join(process.cwd(), ...cleanRelPath.split("/"));
  const serialized = JSON.stringify(data, null, 2);

  let savedLocal = false;
  try {
    await fs.mkdir(path.dirname(localAbsPath), { recursive: true });
    await fs.writeFile(localAbsPath, serialized, "utf-8");
    savedLocal = true;
  } catch {
    savedLocal = false;
  }

  const { token, source: tokenSource } = resolveGitHubToken(customToken);
  if (!token) {
    return {
      savedLocal,
      syncedCloud: false,
      tokenSource,
      cloudError:
        "Chưa cấu hình GITHUB_CMS_TOKEN trên môi trường Cloud (đã lưu cục bộ).",
    };
  }

  try {
    const apiUrl = `https://api.github.com/repos/${DEFAULT_GITHUB_REPO}/contents/${cleanRelPath}`;
    const commonHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "MinhHien-Portfolio-CMS",
    };

    // 1. Check current file SHA on GitHub if it exists
    let existingSha: string | undefined = undefined;
    const getRes = await fetch(
      `${apiUrl}?ref=${DEFAULT_GITHUB_BRANCH}`,
      {
        headers: commonHeaders,
        cache: "no-store",
      }
    );
    if (getRes.ok) {
      const meta = (await getRes.json()) as { sha?: string };
      existingSha = meta.sha;
    }

    // 2. Commit updated file content to GitHub
    const putBody: Record<string, string> = {
      message: commitMessage,
      content: Buffer.from(serialized, "utf-8").toString("base64"),
      branch: DEFAULT_GITHUB_BRANCH,
    };
    if (existingSha) {
      putBody.sha = existingSha;
    }

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        ...commonHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putBody),
    });

    if (putRes.ok) {
      const putJson = (await putRes.json()) as {
        content?: { html_url?: string };
      };
      return {
        savedLocal,
        syncedCloud: true,
        tokenSource,
        cloudUrl:
          putJson.content?.html_url ||
          `https://github.com/${DEFAULT_GITHUB_REPO}/blob/${DEFAULT_GITHUB_BRANCH}/${cleanRelPath}`,
      };
    } else {
      const errText = await putRes.text();
      return {
        savedLocal,
        syncedCloud: false,
        tokenSource,
        cloudError: `GitHub API (${putRes.status}): ${errText.slice(0, 160)}`,
      };
    }
  } catch (error) {
    return {
      savedLocal,
      syncedCloud: false,
      tokenSource,
      cloudError:
        error instanceof Error ? error.message : "Lỗi kết nối GitHub Cloud API",
    };
  }
}

export function getCloudConfigInfo(customToken?: string) {
  const { token, source } = resolveGitHubToken(customToken);
  return {
    repo: DEFAULT_GITHUB_REPO,
    branch: DEFAULT_GITHUB_BRANCH,
    hasToken: Boolean(token),
    tokenSource: source,
    isVercel: Boolean(process.env.VERCEL),
  };
}
