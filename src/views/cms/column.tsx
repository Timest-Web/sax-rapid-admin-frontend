"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ContentPage, BlogPost } from "./actions";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Edit, Eye, Clock, FileCode, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

// --- TYPES FOR ACTIONS ---
interface ColumnActions<T> {
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onView: (item: T) => void;
}

// --- PAGES COLUMNS GENERATOR ---
export const getPageColumns = ({ onEdit, onDelete, onView }: ColumnActions<ContentPage>): ColumnDef<ContentPage>[] => [
  {
    accessorKey: "title",
    header: "Page Title",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-400">
           <FileCode size={14} />
        </div>
        <div>
           <div className="font-bold text-zinc-900">{row.getValue("title")}</div>
           <div className="text-[10px] text-zinc-500 font-mono">/pages{row.original.slug}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => (
       <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Clock size={12} /> {row.getValue("lastUpdated")}
       </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal size={16} className="text-zinc-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onView(row.original)}>
                    <Eye className="mr-2 h-4 w-4" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Content
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
];

// --- BLOG COLUMNS GENERATOR ---
export const getBlogColumns = ({ onEdit, onDelete, onView }: ColumnActions<BlogPost>): ColumnDef<BlogPost>[] => [
  {
    accessorKey: "title",
    header: "Article",
    cell: ({ row }) => (
      <div className="font-bold text-zinc-900 max-w-[250px] truncate" title={row.getValue("title")}>
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] uppercase font-bold">
            {row.getValue("category")}
        </span>
    ),
  },
  {
    accessorKey: "views",
    header: "Reads",
    cell: ({ row }) => (
       <span className="font-mono text-sm">{row.original.views.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal size={16} className="text-zinc-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
];