"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit2, Power, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import type { SubscriptionPlan } from "@/src/features/subscriptions/api";

function money(amount: number, currency: string) {
  const symbol =
    currency === "NGN"
      ? "₦"
      : currency === "ZAR"
      ? "R"
      : currency === "USD"
      ? "$"
      : "";

  return `${symbol}${Number(amount ?? 0).toLocaleString()}`;
}

function isActive(plan: SubscriptionPlan) {
  return plan.isActive ?? true;
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-100 text-zinc-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export type SubscriptionPlanRow = SubscriptionPlan & {
  currency: string;
  monthlyDisplay: number;
  yearlyDisplay: number;
};

export function getPlanColumns(opts: {
  onEdit: (plan: SubscriptionPlan) => void;
  onToggleStatus: (plan: SubscriptionPlan) => void;
}): ColumnDef<SubscriptionPlanRow>[] {
  return [
    {
      header: "Plan",
      accessorKey: "name",
      cell: ({ row }) => {
        const plan = row.original;

        return (
          <div className="flex max-w-[320px] flex-col">
            <span className="truncate text-sm font-semibold text-zinc-900">
              {plan.name}
            </span>

            <span className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
              {plan.description || "No description"}
            </span>

            {/* <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              {plan.id}
            </span> */}
          </div>
        );
      },
    },

    {
      header: "Pricing",
      id: "pricing",
      cell: ({ row }) => {
        const plan = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold text-zinc-900">
              {money(plan.monthlyDisplay, plan.currency)}
              <span className="ml-1 text-xs font-medium text-zinc-500">
                / month
              </span>
            </span>

            <span className="font-mono text-xs text-zinc-500">
              {money(plan.yearlyDisplay, plan.currency)}
              <span className="ml-1">/ year</span>
            </span>
          </div>
        );
      },
    },

    {
      header: "Max Products",
      accessorKey: "maxProducts",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-zinc-700">
          {row.original.maxProducts?.toLocaleString() ?? "-"}
        </span>
      ),
    },

    {
      header: "Display Order",
      accessorKey: "displayOrder",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-zinc-500">
          #{row.original.displayOrder}
        </span>
      ),
    },

    {
      header: "Status",
      id: "status",
      cell: ({ row }) => (
        <StatusPill active={isActive(row.original)} />
      ),
    },

    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,

      cell: ({ row }) => {
        const plan = row.original;
        const active = isActive(plan);

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44 border border-zinc-200 bg-white"
              >
                <DropdownMenuItem
                  onClick={() => opts.onEdit(plan)}
                  className="cursor-pointer text-xs"
                >
                  <Edit2 className="mr-2 h-4 w-4 text-zinc-500" />
                  Edit Plan
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/subscriptions/${plan.id}`}
                    className="flex cursor-pointer items-center text-xs"
                  >
                    <Eye className="mr-2 h-4 w-4 text-zinc-500" />
                    View Plan
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => opts.onToggleStatus(plan)}
                  className={`cursor-pointer text-xs ${
                    active
                      ? "text-rose-600 focus:text-rose-700"
                      : "text-emerald-600 focus:text-emerald-700"
                  }`}
                >
                  <Power className="mr-2 h-4 w-4" />

                  {active ? "Deactivate Plan" : "Activate Plan"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}