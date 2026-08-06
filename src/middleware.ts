/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canRead, normalizeRoles, type ModuleKey } from "@/src/lib/rbac";

const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/sign-in",
  "/forgot-password",
  "/admin/reset-password",
]);

// Longest-prefix matching (more specific first)
const ROUTE_MODULES: Array<[string, ModuleKey]> = [
  ["/admin/analytics", "analytics"],
  ["/admin/buyers", "buyers"],
  ["/admin/vendors", "vendors"],
  ["/admin/roles", "roles"],
  ["/admin/products", "products"],
  ["/admin/orders", "orders"],
  ["/admin/categories", "categories"],
  ["/admin/reviews", "reviews"],
  ["/admin/disputes", "disputes"],
  ["/admin/wallets", "wallets"],
  ["/admin/withdrawals", "withdrawals"],
  ["/admin/subscriptions", "subscriptions"],
  ["/admin/commissions", "commissions"],
  ["/admin/currencies", "currencies"],
  ["/admin/coupons", "coupons"],
  ["/admin/locations", "locations"],
  ["/admin/promotions", "promotions"],
  ["/admin/shipping", "shipping"],
  ["/admin/cms", "cms"],
  ["/admin/notifications", "notifications"],
  ["/admin/integrations", "integrations"],
  ["/admin/audit-logs", "auditLogs"],
  ["/admin/chat", "chat"],

  // keep last:
  ["/admin", "dashboard"],
];

function moduleForPath(pathname: string): ModuleKey | null {
  const hit = ROUTE_MODULES.find(([prefix]) =>
    prefix === "/admin" ? pathname === "/admin" : pathname.startsWith(prefix),
  );
  return hit?.[1] ?? null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  // allow public admin pages
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/sign-in";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const roles = normalizeRoles((token as any).role);
  if (roles.length === 0) {
    const url = req.nextUrl.clone();
    url.pathname = "/not-authorized";
    return NextResponse.redirect(url);
  }

  const moduleKey = moduleForPath(pathname);

  // If route isn't mapped, block (safer)
  if (!moduleKey) {
    const url = req.nextUrl.clone();
    url.pathname = "/not-authorized";
    return NextResponse.redirect(url);
  }

  if (!canRead(roles, moduleKey)) {
    const url = req.nextUrl.clone();
    url.pathname = "/not-authorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};