import { AuditLog } from "@/src/views/logs/actions";
import type { AuditLogDto } from "./api";


function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function safeJsonParse(input: string | null) {
  if (!input) return null;
  try {
    return JSON.parse(input) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizeCategory(raw: string): AuditLog["category"] {
  const c = String(raw || "").toLowerCase();

  if (c.includes("security")) return "security";
  if (c.includes("finance") || c.includes("payment") || c.includes("payout")) return "finance";
  if (c.includes("vendor")) return "vendor";
  if (c.includes("order")) return "finance"; // orders typically finance-ish in commerce
  return "system"; // user/system/etc
}

function buildEntity(categoryRaw: string, detailsObj: Record<string, unknown> | null) {
  const c = String(categoryRaw || "");

  if (detailsObj && c.toLowerCase().includes("order")) {
    const orderNumber = detailsObj["OrderNumber"];
    if (typeof orderNumber === "string" && orderNumber.trim()) return `Order: ${orderNumber}`;
  }

  if (detailsObj && c.toLowerCase().includes("user")) {
    const email = detailsObj["Email"] ?? detailsObj["UserName"];
    if (typeof email === "string" && email.trim()) return `User: ${email}`;
  }

  return `Category: ${c}`;
}

export function mapAuditLogDtoToUi(dto: AuditLogDto): AuditLog {
  const detailsObj = safeJsonParse(dto.details);

  const actorEmail = dto.actorEmail ?? "—";
  const actorName = dto.actorName ?? (actorEmail === "System" ? "System" : actorEmail);

  const role: AuditLog["actor"]["role"] =
    actorEmail === "System" || actorName === "System" ? "System" : "Super Admin";

  const categoryRaw = dto.category ?? "System";
  const category = normalizeCategory(categoryRaw);

  return {
    id: dto.id,
    action: dto.action ?? "—",
    actor: {
      name: actorName ?? "—",
      email: actorEmail ?? "—",
      role,
      avatar: initials(actorName ?? "U"),
    },
    category,
    categoryRaw,
    entity: buildEntity(categoryRaw, detailsObj),
    timestamp: dto.createdAt, 
    ipAddress: dto.ipAddress ?? "—",
    userAgent: "—", 
    changes: undefined, 
    detailsRaw: dto.details ?? null,
    detailsObj,
  };
}