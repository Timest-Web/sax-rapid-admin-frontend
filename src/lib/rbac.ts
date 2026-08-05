/* eslint-disable @typescript-eslint/no-explicit-any */
export type Role = "SuperAdmin" | "Admin" | "Sales";

export type ModuleKey =
  | "dashboard"
  | "analytics"
  | "buyers"
  | "vendors"
  | "roles"
  | "products"
  | "orders"
  | "categories"
  | "reviews"
  | "disputes"
  | "wallets"
  | "withdrawals"
  | "subscriptions"
  | "commissions"
  | "currencies"
  | "coupons"
  | "locations"
  | "promotions"
  | "shipping"
  | "cms"
  | "notifications"
  | "integrations"
  | "auditLogs"
  | "chat";

export type Action = "read" | "write" | "approve" | "send" | "create";

const R: Action = "read";
const W: Action = "write";

export const ROLE_PERMISSIONS: Record<Role, Partial<Record<ModuleKey, Action[]>>> = {
  SuperAdmin: {
    dashboard: [R],
    analytics: [R, W],
    buyers: [R, W],
    vendors: [R, W],
    roles: [R, W],
    products: [R, W],
    orders: [R, W],
    categories: [R, W],
    reviews: [R, W],
    disputes: [R, W],
    wallets: [R],
    withdrawals: [R, W],
    subscriptions: [R],
    commissions: [R],
    currencies: [R, W],
    coupons: [R, W],
    locations: [R, W],
    promotions: [R, W],
    shipping: [R, W],
    cms: [R, W],
    notifications: [R, "send"],
    integrations: [R, W],
    auditLogs: [R],
    chat: [R, W],
  },

  Admin: {
    dashboard: [R],
    analytics: [R],
    buyers: [R, W],
    vendors: [R, W],
    products: [R, W],
    orders: [R, W],
    categories: [R, W],
    reviews: [R, W],
    disputes: [R, W],
    coupons: [R, "create"],
    promotions: [R, W],
    shipping: [R],
    cms: [R, W],
    notifications: [R, "send"],
    wallets: [R],
    subscriptions: [R],
    commissions: [R],
    auditLogs: [R],
    withdrawals: [R, "approve"],
    chat: [R, W],
  },

  Sales: {
    dashboard: [R],
    analytics: [R],
    buyers: [R, W],
    orders: [R, W],
    reviews: [R, W],
    disputes: [R, W],
    promotions: [R, W],
    notifications: [R, "send"],
    vendors: [R],
    products: [R],
    shipping: [R],
    chat: [R, W],
  },
};

/**
 * role may come as string or array from session/token
 */
export function normalizeRoles(input: unknown): Role[] {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];
  return arr
    .map((r) => String(r))
    .filter((r): r is Role => r === "SuperAdmin" || r === "Admin" || r === "Sales");
}

/**
 * Use this everywhere (sidebar, guards, hooks, middleware)
 */
export function getUserRoles(sessionOrToken: any): Role[] {
  return normalizeRoles(sessionOrToken?.role);
}

export function can(roles: Role[], moduleKey: ModuleKey, action: Action) {
  return roles.some((r) => ROLE_PERMISSIONS[r]?.[moduleKey]?.includes(action));
}

export function canRead(roles: Role[], moduleKey: ModuleKey) {
  return can(roles, moduleKey, "read");
}

/**
 * Union of actions across multiple roles (if your token ever contains more than 1 role)
 */
export function actionsFor(roles: Role[], moduleKey: ModuleKey): Action[] {
  const set = new Set<Action>();
  for (const role of roles) {
    for (const a of ROLE_PERMISSIONS[role]?.[moduleKey] ?? []) set.add(a);
  }
  return [...set];
}

/**
 * True only if the user literally has read and nothing else for that module
 * (used for the "View" badge in sidebar)
 */
export function isViewOnly(roles: Role[], moduleKey: ModuleKey) {
  const acts = actionsFor(roles, moduleKey);
  return acts.length === 1 && acts[0] === "read";
}

export function canWrite(roles: Role[], moduleKey: ModuleKey) {
  return can(roles, moduleKey, "write") || can(roles, moduleKey, "create");
}