import { clientConfig } from "@/lib/config/config-client";

export function getWorkspaceBaseDomain(): string {
  const configuredBaseDomain =
    clientConfig.NEXT_PUBLIC_APP_BASE_DOMAIN?.trim() ||
    process.env.NEXT_PUBLIC_APP_BASE_DOMAIN?.trim();

  if (configuredBaseDomain) {
    return configuredBaseDomain
      .replace(/^https?:\/\//i, "")
      .replace(/\/$/, "")
      .replace(/^www\./i, "")
      .replace(/^app\./i, "");
  }

  if (typeof window !== "undefined") {
    return window.location.hostname
      .replace(/^app\./i, "")
      .replace(/^www\./i, "");
  }

  return "localhost:3000";
}

export function getWorkspaceUrl(subdomain: string): string {
  return `${subdomain}.${getWorkspaceBaseDomain()}`;
}
