/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Percent,
  Edit3,
  Save,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AppDialog } from "@/components/custom-dialog";
import type { CategoryCommission } from "@/src/features/commissions/api";

export type CategoryCommissionRow = CategoryCommission & {
  icon: any; // lucide icon component
};

function CommissionActionsCell({
  row,
  onUpdate,
  isUpdating,
}: {
  row: any;
  onUpdate: (categoryId: number, newRate: number) => void;
  isUpdating?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rate, setRate] = useState<number>(row.original.commissionRate);

  // keep local input in sync if row updates (after optimistic update/refetch)
  useEffect(() => {
    setRate(row.original.commissionRate);
  }, [row.original.commissionRate]);

  const categoryId: number = row.original.categoryId;

  const handleSave = () => {
    // basic guard
    if (Number.isNaN(rate) || rate < 0 || rate > 100) return;

    onUpdate(categoryId, rate); // <-- this should call your mutation (PATCH)
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="bg-white border-zinc-200">
          <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
            Manage
          </DropdownMenuLabel>

          <DropdownMenuItem
            className="text-xs cursor-pointer"
            onSelect={() => {
              // Radix closes the menu automatically; just open the dialog
              setIsOpen(true);
            }}
          >
            <Edit3 className="mr-2 h-3.5 w-3.5 text-zinc-500" />
            Edit Rate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Update Commission Rate"
        description={`Adjust the percentage fee taken from ${row.original.categoryName} sales.`}
        icon={<Edit3 size={16} />}
        size="custom"
        maxWidthClassName="sm:max-w-[480px]"
        footer={
          <>
            <Button
              type="button"
              className="bg-zinc-900 text-[#D4AF37] px-8 h-11"
              onClick={handleSave}
              disabled={isUpdating}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-6 h-11"
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs font-bold uppercase text-zinc-500">
              Category
            </Label>
            <Input
              value={row.original.categoryName}
              disabled
              className="col-span-3 bg-zinc-50 border-zinc-200 text-zinc-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs font-bold uppercase text-zinc-500">
              Percentage
            </Label>
            <div className="col-span-3 relative">
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="pr-8 border-zinc-200 focus-visible:ring-zinc-900 font-mono"
              />
              <Percent
                size={14}
                className="absolute right-3 top-3 text-zinc-400"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[10px] uppercase tracking-wider font-bold text-amber-800 flex gap-2 items-start">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              Changing this rate will apply only to new orders after the update.
            </p>
          </div>
        </div>
      </AppDialog>
    </>
  );
}

export const getCommissionColumns = (opts: {
  onUpdate: (categoryId: number, newRate: number) => void;
  isUpdating?: boolean;
}): ColumnDef<CategoryCommissionRow>[] => [
  {
    header: "Category",
    accessorKey: "categoryName",
    cell: ({ row }) => {
      const Icon = row.original.icon;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500">
            <Icon size={18} />
          </div>
          <div>
            <p className="font-bold text-zinc-900 font-display">
              {row.original.categoryName}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">
              ID: {row.original.categoryId}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Commission Rate",
    accessorKey: "commissionRate",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-lg font-bold font-mono",
            row.original.commissionRate >= 8
              ? "text-emerald-600"
              : "text-zinc-900",
          )}
        >
          {row.original.commissionRate}%
        </span>

        {row.original.commissionRate >= 8 && (
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            High
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CommissionActionsCell
        row={row}
        onUpdate={opts.onUpdate}
        isUpdating={opts.isUpdating}
      />
    ),
  },
];