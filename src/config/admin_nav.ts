import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  ClipboardList,
  Wallet,
  BadgePercent,
  MapPin,
  Tag,
  Star,
  AlertTriangle,
  Truck,
  FileText,
  Bell,
  BarChart3,
  Shield,
  Plug2,
  ScrollText,
  CreditCard,
  Coins,
  Crown,
} from "lucide-react";

export const ADMIN_NAV = [
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
        title: "Vendor Applications",
        icon: ClipboardList,
        href: "/admin/vendor-applications",
      },
      { title: "Roles & Permissions", icon: Shield, href: "/admin/roles" },
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
      { title: "Wallets & Payments", icon: Wallet, href: "/admin/wallets" },
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
