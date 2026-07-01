/* eslint-disable @typescript-eslint/no-explicit-any */

import { IntegrationDto } from "@/src/features/integrations/api";

export type IntegrationCategory =
  | "payment"
  | "delivery"
  | "map"
  | "email"
  | "other";
export type IntegrationUiStatus = "connected" | "disconnected" | "error";

export type IntegrationApp = {
  id: string;
  name: string;
  provider: string;
  category: IntegrationCategory;
  description: string;
  status: IntegrationUiStatus;

  isLiveMode: boolean;
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;

  lastSyncAt: string | null;
  logoUrl?: string;

  /** raw backend fields */
  rawType: string;
  rawStatus: string;
  configJson: string | null;
};

function safeJsonParse(input: string | null) {
  if (!input) return null;
  try {
    return JSON.parse(input) as any;
  } catch {
    return null;
  }
}

function normalizeCategory(type: string): IntegrationCategory {
  const t = String(type || "").toLowerCase();
  if (t.includes("payment") || t.includes("gateway")) return "payment";
  if (
    t.includes("logistics") ||
    t.includes("delivery") ||
    t.includes("shipping")
  )
    return "delivery";
  if (t.includes("map") || t.includes("geo")) return "map";
  if (t.includes("email")) return "email";
  return "other";
}

function normalizeStatus(status: string): IntegrationUiStatus {
  const s = String(status || "").toLowerCase();
  if (s.includes("error") || s.includes("fail")) return "error";
  if (s.includes("active") || s.includes("enabled") || s.includes("connected"))
    return "connected";
  return "disconnected";
}

function providerFromName(name: string) {
  // simplistic: provider = first word
  const n = String(name || "").trim();
  if (!n) return "Provider";
  return n.split(/\s+/)[0];
}

export function mapIntegrationDtoToApp(dto: IntegrationDto): IntegrationApp {
  const cfg = safeJsonParse(dto.configJson);

  return {
    id: dto.id,
    name: dto.name ?? "—",
    provider: providerFromName(dto.name),
    category: normalizeCategory(dto.type),
    description: dto.description ?? "—",
    status: normalizeStatus(dto.status),

    isLiveMode: Boolean(cfg?.isLiveMode ?? false),
    apiKey: typeof cfg?.apiKey === "string" ? cfg.apiKey : undefined,
    secretKey: typeof cfg?.secretKey === "string" ? cfg.secretKey : undefined,
    webhookUrl:
      typeof cfg?.webhookUrl === "string" ? cfg.webhookUrl : undefined,

    lastSyncAt: dto.lastSyncAt,
    logoUrl: dto.logoUrl ?? undefined,

    rawType: dto.type,
    rawStatus: dto.status,
    configJson: dto.configJson,
  };
}
