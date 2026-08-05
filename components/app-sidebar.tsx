/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Store,
  ClipboardList,
  ShoppingBag,
  Tag,
  Star,
  AlertTriangle,
  Wallet,
  CreditCard,
  Crown,
  Coins,
  BadgePercent,
  MapPin,
  Truck,
  FileText,
  Bell,
  Plug2,
  ScrollText,
  LogOut,
  Shield,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import logo from "@/public/images/sax_logo.png";
import type { ModuleKey } from "@/src/lib/rbac";
import { getUserRoles, canRead, isViewOnly } from "@/src/lib/rbac";

type NavItem = {
  title: string;
  icon: LucideIcon;
  href: string;
  moduleKey: ModuleKey;
};

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/admin", moduleKey: "dashboard" },
      { title: "Analytics", icon: BarChart3, href: "/admin/analytics", moduleKey: "analytics" },
    ],
  },
  {
    label: "User Management",
    items: [
      { title: "Buyers", icon: Users, href: "/admin/buyers", moduleKey: "buyers" },
      { title: "Vendors", icon: Store, href: "/admin/vendors", moduleKey: "vendors" },
      { title: "Roles & Perms", icon: Shield, href: "/admin/roles", moduleKey: "roles" },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { title: "Products", icon: ShoppingBag, href: "/admin/products", moduleKey: "products" },
      { title: "Orders", icon: ClipboardList, href: "/admin/orders", moduleKey: "orders" },
      { title: "Categories", icon: Tag, href: "/admin/categories", moduleKey: "categories" },
      { title: "Reviews", icon: Star, href: "/admin/reviews", moduleKey: "reviews" },
      { title: "Disputes", icon: AlertTriangle, href: "/admin/disputes", moduleKey: "disputes" },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Wallets", icon: Wallet, href: "/admin/wallets", moduleKey: "wallets" },
      { title: "Withdrawals", icon: CreditCard, href: "/admin/withdrawals", moduleKey: "withdrawals" },
      { title: "Subscriptions", icon: Crown, href: "/admin/subscriptions", moduleKey: "subscriptions" },
      { title: "Commissions", icon: Coins, href: "/admin/commissions", moduleKey: "commissions" },
      { title: "Currencies", icon: BadgePercent, href: "/admin/currencies", moduleKey: "currencies" },
      { title: "Coupons", icon: BadgePercent, href: "/admin/coupons", moduleKey: "coupons" },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Locations", icon: MapPin, href: "/admin/locations", moduleKey: "locations" },
      { title: "Promotions", icon: BadgePercent, href: "/admin/promotions", moduleKey: "promotions" },
      { title: "Shipping", icon: Truck, href: "/admin/shipping", moduleKey: "shipping" },
      { title: "Content (CMS)", icon: FileText, href: "/admin/cms", moduleKey: "cms" },
      { title: "Notifications", icon: Bell, href: "/admin/notifications", moduleKey: "notifications" },
      { title: "Integrations", icon: Plug2, href: "/admin/integrations", moduleKey: "integrations" },
      { title: "Audit Logs", icon: ScrollText, href: "/admin/audit-logs", moduleKey: "auditLogs" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const roles = getUserRoles(session);

  const navFiltered = useMemo(() => {
    return NAV.map((section) => ({
      ...section,
      items: section.items.filter((it) => canRead(roles, it.moduleKey)),
    })).filter((section) => section.items.length > 0);
  }, [roles]);

  const displayRole = Array.isArray((session as any)?.role)
    ? (session as any).role?.[0]
    : (session as any)?.role;

  const displayName =
    (session as any)?.user?.name ||
    (session as any)?.user?.email ||
    "Admin";

  const handleLogout = () => {
    // use whichever route you actually have
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 bg-sax-black text-gray-400">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/10">
        <div className="px-4">
          <Image src={logo} alt="SAX Admin" className="h-10 w-full" />
        </div>
        <div className="hidden group-data-[collapsible=icon]:block text-sax-gold font-bold text-xl">
          S
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4 scrollbar-thin scrollbar-thumb-zinc-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navFiltered.map((section) => (
          <SidebarGroup key={section.label} className="mb-2">
            <SidebarGroupLabel className="px-6 text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2 mt-2 group-data-[collapsible=icon]:hidden">
              {section.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  const viewOnly = isViewOnly(roles, item.moduleKey);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        className={`
                          h-10 px-6 rounded-none border-l-2 transition-all duration-200 w-full justify-start
                          ${
                            isActive
                              ? "bg-white/10 border-sax-gold text-white"
                              : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                          }
                        `}
                      >
                        <Link href={item.href} className="flex items-center gap-3 w-full">
                          <item.icon
                            size={15}
                            className={
                              isActive
                                ? "text-sax-gold"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }
                          />

                          <span className="text-[13px] font-medium tracking-wide flex-1">
                            {item.title}
                          </span>

                          {/* {viewOnly && (
                            <span className="group-data-[collapsible=icon]:hidden text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                              View
                            </span>
                          )} */}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4 bg-sax-black space-y-3">
        <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:justify-center">
          <div className="h-8 w-8 shrink-0 bg-zinc-800 flex items-center justify-center text-xs font-bold text-sax-gold rounded-sm">
            {String(displayName).slice(0, 2).toUpperCase()}
          </div>

          <div className="text-left flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-white font-medium truncate">{displayName}</p>
            <p className="text-[10px] text-zinc-500 font-mono truncate">
              Role: {displayRole ?? "—"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-sm px-1 py-2 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors group-data-[collapsible=icon]:justify-center"
          title="Log out"
        >
          <LogOut size={14} className="shrink-0" />
          <span className="text-[13px] font-medium tracking-wide group-data-[collapsible=icon]:hidden">
            Log out
          </span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}