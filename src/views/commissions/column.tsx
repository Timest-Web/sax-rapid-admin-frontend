/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Percent,
  TrendingUp,
  Edit3,
  Save,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// --- Types ---
export type CategoryCommission = {
  id: string;
  name: string;
  slug: string;
  totalSales: string;
  revenueGenerated: string;
  rate: number; // e.g. 5.0
  lastUpdated: string;
  status: "active" | "archived";
  icon: any; // Using Lucide Icon component
};

// --- Action Component (The Modal) ---
const CommissionActionCell = ({ row }: { row: any }) => {
  const [rate, setRate] = useState(row.original.rate);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    // Simulate API Call
    setIsOpen(false);
    // In a real app, you would trigger a toast here
    console.log(`Updated ${row.original.name} to ${rate}%`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Manage</DropdownMenuLabel>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit Rate
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[425px] bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle>Update Commission Rate</DialogTitle>
          <DialogDescription>
            Adjust the percentage fee taken from {row.original.name} sales.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right text-xs font-bold uppercase text-zinc-500"
            >
              Category
            </Label>
            <Input
              id="name"
              value={row.original.name}
              disabled
              className="col-span-3 bg-zinc-100 border-zinc-200"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="rate"
              className="text-right text-xs font-bold uppercase text-zinc-500"
            >
              Percentage
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="pr-8"
              />
              <Percent
                size={14}
                className="absolute right-3 top-3 text-zinc-400"
              />
            </div>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex gap-2 items-start">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <p>
              Changing this rate will only apply to new orders placed after the
              update.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="bg-zinc-900 hover:bg-zinc-800"
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const commissionColumns: ColumnDef<CategoryCommission>[] = [
  {
    header: "Category",
    accessorKey: "name",
    cell: ({ row }) => {
      const Icon = row.original.icon;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500">
            <Icon size={18} />
          </div>
          <div>
            <p className="font-bold text-zinc-900 font-display">
              {row.original.name}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">
              Last updated: {row.original.lastUpdated}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Commission Rate",
    accessorKey: "rate",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-lg font-bold font-mono",
            row.original.rate > 7 ? "text-emerald-600" : "text-zinc-900",
          )}
        >
          {row.original.rate}%
        </span>
        {row.original.rate > 7 && (
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">
            High
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Financial Impact",
    accessorKey: "revenueGenerated",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 font-bold text-zinc-900">
          <TrendingUp size={14} className="text-zinc-400" />
          {row.original.revenueGenerated}
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">
          From {row.original.totalSales} Sales
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CommissionActionCell row={row} />,
  },
];
