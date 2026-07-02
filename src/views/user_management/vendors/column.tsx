"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Store, MapPin, BadgeCheck, BadgeX, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { VendorProfile } from "@/src/features/vendors/api";

function initials(text: string) {
  const parts = String(text || "").trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "S";
  const b = parts[parts.length - 1]?.[0] ?? "T";
  return (a + b).toUpperCase();
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function KycBadge({ value }: { value: string }) {
  const verified = value?.toLowerCase() === "verified";
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wider",
        verified
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200",
      ].join(" ")}
    >
      {verified ? <BadgeCheck size={12} /> : <BadgeX size={12} />}
      {value}
    </span>
  );
}

function SuspendedBadge({ reason }: { reason?: string | null }) {
  return (
    <span
      title={reason ?? undefined}
      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wider bg-rose-50 text-rose-700 border-rose-200"
    >
      <Ban size={12} />
      Suspended
    </span>
  );
}

export const vendorColumns: ColumnDef<VendorProfile>[] = [
  {
    header: "Store Identity",
    accessorKey: "shopName",
    cell: ({ row }) => {
      const v = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center text-xs font-bold text-sax-gold border border-zinc-800">
            {initials(v.shopName)}
          </div>
          <div>
            <p className="font-bold text-zinc-900 font-display">{v.shopName}</p>
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
              <Store size={10} /> {v.ownerName}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">{v.ownerEmail}</p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Business",
    accessorKey: "companyName",
    cell: ({ row }) => {
      const v = row.original;
      return (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-zinc-900">{v.companyName || "—"}</p>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            {v.accountType} • {v.businessRegistrationNumber || "—"}
          </p>
        </div>
      );
    },
  },
  {
    header: "Location",
    id: "location",
    cell: ({ row }) => {
      const v = row.original;
      const loc = [v.storeCity, v.storeState].filter(Boolean).join(", ");
      return (
        <div className="flex items-center gap-1.5 text-zinc-600 text-xs bg-zinc-50 w-fit px-2 py-1 rounded border border-zinc-100">
          <MapPin size={10} className="text-zinc-400" />
          {loc || v.storeAddress || "—"}
        </div>
      );
    },
  },
  {
    header: "KYC / Status",
    accessorKey: "verificationStatus",
    cell: ({ row }) => {
      const v = row.original;

      return (
        <div className="flex flex-col gap-1">
          {v.isSuspended ? (
            <SuspendedBadge reason={v.suspensionReason} />
          ) : (
            <KycBadge value={String(v.verificationStatus)} />
          )}

          <span className="text-[10px] text-zinc-400 font-mono">
            Verified: {formatDate(v.verifiedAt)}
          </span>

          {v.isSuspended && (
            <span className="text-[10px] text-rose-600 font-mono">
              Since: {formatDate(v.suspendedAt)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: () => <div className="text-right">Limits</div>,
    accessorKey: "productLimit",
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-bold text-zinc-900 font-mono">{row.original.productLimit}</p>
        <p className="text-[10px] text-zinc-400 font-mono">Product Limit</p>
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Created</div>,
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <div className="text-right">
        <p className="text-xs font-semibold text-zinc-900 font-mono">
          {formatDate(row.original.createdAt)}
        </p>
        <p className="text-[10px] text-zinc-400 font-mono">
          Updated: {formatDate(row.original.updatedAt)}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-200">
            <DropdownMenuLabel className="text-xs font-bold text-black uppercase tracking-wider">
              Manage Store
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/vendors/${row.original.userId}`}
                className="text-xs text-black cursor-pointer flex items-center w-full focus:bg-zinc-50"
              >
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];