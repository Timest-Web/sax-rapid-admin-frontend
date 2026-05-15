"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  ShieldBan,
  UserCheck,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import type { BuyerListItem } from "@/src/features/buyers/api";
import {
  useReactivateBuyer,
  useSuspendBuyer,
} from "@/src/features/buyers/hooks";

function initials(name: string) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (
    ((parts[0]?.[0] ?? "B") + (parts[parts.length - 1]?.[0] ?? "Y")).toUpperCase()
  );
}

/**
 * Translate country calling code -> country
 */
function getCountryFromCode(code?: string | null) {
  const map: Record<string, string> = {
    "+234": "Nigeria",
    "+1": "United States",
    "+44": "United Kingdom",
    "+91": "India",
    "+27": "South Africa",
    "+233": "Ghana",
    "+254": "Kenya",
  };

  return map[code || ""] || code || "—";
}

function BuyerActionsCell({ buyer }: { buyer: BuyerListItem }) {
  const suspend = useSuspendBuyer();
  const reactivate = useReactivateBuyer();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const isActive = String(buyer.status).toLowerCase() === "active";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 bg-white text-black border-zinc-200"
        >
          <DropdownMenuLabel className="text-xs text-zinc-400 uppercase tracking-wider">
            Actions
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-zinc-100" />

          <DropdownMenuItem asChild className="text-xs cursor-pointer">
            <Link
              href={`/admin/buyers/${buyer.id}`}
              className="flex items-center w-full"
            >
              <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" />
              View Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-zinc-100" />

          {isActive ? (
            <DropdownMenuItem
              className="text-xs cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
              disabled={suspend.isPending}
              onSelect={(e) => {
                e.preventDefault();
                setReason("");
                setOpen(true);
              }}
            >
              <ShieldBan className="mr-2 h-3.5 w-3.5" />
              Suspend Buyer
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-xs cursor-pointer text-emerald-700 focus:text-emerald-800 focus:bg-emerald-50"
              disabled={reactivate.isPending}
              onSelect={(e) => {
                e.preventDefault();
                reactivate.mutate(buyer.id);
              }}
            >
              <UserCheck className="mr-2 h-3.5 w-3.5" />
              Reactivate Buyer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-130">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-widest font-display">
              Suspend Buyer
            </DialogTitle>

            <DialogDescription>
              Provide a reason. This will suspend access for this buyer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Reason <span className="text-rose-600">*</span>
            </Label>

            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Fraudulent activity"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={suspend.isPending}
            >
              Cancel
            </Button>

            <Button
              className="bg-zinc-900 text-white"
              disabled={!reason.trim() || suspend.isPending}
              onClick={() => {
                suspend.mutate(
                  {
                    customerId: buyer.id,
                    reason: reason.trim(),
                  },
                  {
                    onSuccess: () => setOpen(false),
                  }
                );
              }}
            >
              {suspend.isPending ? "Suspending..." : "Confirm Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const columns: ColumnDef<BuyerListItem>[] = [
  {
    header: "Buyer",
    accessorKey: "fullName",
    cell: ({ row }) => {
      const b = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 border border-zinc-200">
            {initials(b.fullName)}
          </div>

          <div className="space-y-0.5">
            <p className="font-bold text-zinc-900 font-display">
              {b.fullName}
            </p>

            <div className="flex items-center gap-2">
              <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                {b.customerCode}
              </p>

              {b.verificationStatus === "Verified" ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                  <ShieldAlert className="h-3 w-3" />
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    header: "Contact",
    accessorKey: "email",
    cell: ({ row }) => {
      const b = row.original;

      return (
        <div className="space-y-1">
          <p className="text-xs text-zinc-800 font-medium">{b.email}</p>

          <p className="text-[11px] text-zinc-500 font-mono">
            {b.countryCode} {b.phoneNumber}
          </p>
        </div>
      );
    },
  },

  {
    header: "Country",
    accessorKey: "countryCode",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-700">
        {getCountryFromCode(row.original.countryCode)}
      </span>
    ),
  },

  // {
  //   header: "Verification",
  //   accessorKey: "verificationStatus",
  //   cell: ({ row }) => (
  //     <StatusBadge
  //       status={
  //         row.original.verificationStatus === "Verified"
  //           ? "active"
  //           : "inactive"
  //       }
  //     />
  //   ),
  // },

  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <BuyerActionsCell buyer={row.original} />,
  },
];