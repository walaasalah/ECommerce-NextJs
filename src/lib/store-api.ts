import "server-only";
import { GetOurToken } from "@/lib/auth";

export async function storeApi(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    authenticated?: boolean;
    version?: "v1" | "v2";
  } = {},
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.authenticated) headers.token = await GetOurToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "")}/api/${options.version ?? "v1"}/${path}`,
    {
      method: options.method ?? "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    },
  );
  if (response.status === 204) return { status: "success" };
  const data = await response.json().catch(() => {
    throw new Error(
      "The store returned an unreadable response. Please try again.",
    );
  });
  if (!response.ok)
    throw new Error(
      data.message ??
        data.errors?.[0]?.msg ??
        "Unable to complete your request. Please try again.",
    );
  return data;
}
