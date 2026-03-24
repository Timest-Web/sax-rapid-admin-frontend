"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
// ... imports same as before ...
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Store,
  ClipboardList,
  Shield,
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

// ... NAV ARRAY same as before ...
// (I will omit the full NAV array to save space, paste the previous one here)
const NAV = [
  // ... Paste the exact NAV array from the previous response ...
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { title: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    ],
  },
  {
    label: "User Management",
    items: [
      { title: "Buyers", icon: Users, href: "/admin/buyers" },
      { title: "Vendors", icon: Store, href: "/admin/vendors" },
      {
        title: "Vendor Apps",
        icon: ClipboardList,
        href: "/admin/vendor-applications",
      },
      { title: "Roles & Perms", icon: Shield, href: "/admin/roles" },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { title: "Products", icon: ShoppingBag, href: "/admin/products" },
      { title: "Orders", icon: ClipboardList, href: "/admin/orders" },
      { title: "Categories", icon: Tag, href: "/admin/categories" },
      { title: "Reviews", icon: Star, href: "/admin/reviews" },
      { title: "Disputes", icon: AlertTriangle, href: "/admin/disputes" },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Wallets", icon: Wallet, href: "/admin/wallets" },
      { title: "Withdrawals", icon: CreditCard, href: "/admin/withdrawals" },
      { title: "Subscriptions", icon: Crown, href: "/admin/subscriptions" },
      { title: "Commissions", icon: Coins, href: "/admin/commissions" },
      { title: "Currencies", icon: BadgePercent, href: "/admin/currencies" },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Locations", icon: MapPin, href: "/admin/locations" },
      { title: "Promotions", icon: BadgePercent, href: "/admin/promotions" },
      { title: "Shipping", icon: Truck, href: "/admin/shipping" },
      { title: "Content (CMS)", icon: FileText, href: "/admin/cms" },
      { title: "Notifications", icon: Bell, href: "/admin/notifications" },
      { title: "Integrations", icon: Plug2, href: "/admin/integrations" },
      { title: "Audit Logs", icon: ScrollText, href: "/admin/audit-logs" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-200 bg-sax-black text-gray-400"
    >
      {/* HEADER */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/10">
        <div className="group-data-[collapsible=icon]:hidden text-center">
          <h1 className="text-white font-bold tracking-[0.2em] text-sm">
            SAX<span className="text-sax-gold">.ADMIN</span>
          </h1>
        </div>
        <div className="hidden group-data-[collapsible=icon]:block text-sax-gold font-bold text-xl">
          S
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="py-4 scrollbar-thin scrollbar-thumb-zinc-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {NAV.map((section) => (
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
                              ? "bg-white/10 border-sax-gold text-white" /* White/10 for contrast against black sidebar */
                              : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                          }
                        `}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <item.icon
                            size={15}
                            className={`${isActive ? "text-sax-gold" : "text-zinc-500 group-hover:text-zinc-300"}`}
                          />
                          <span className="text-[13px] font-medium tracking-wide">
                            {item.title}
                          </span>
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

      {/* FOOTER */}
      <SidebarFooter className="border-t border-white/10 p-4 bg-sax-black">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="h-8 w-8 bg-zinc-800 flex items-center justify-center text-xs font-bold text-sax-gold">
            SA
          </div>
          <div className="text-left group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-white font-medium">Super Admin</p>
            <p className="text-[10px] text-zinc-500 font-mono">ID: 8829-X</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
