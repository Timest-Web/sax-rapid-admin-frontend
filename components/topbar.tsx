"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Menu } from "lucide-react";

export function TopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-obsidian-600 bg-obsidian-800 px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted hover:text-gold-400" />
        <div>
          <h1 className="text-xl font-serif font-semibold text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] tracking-widest uppercase text-muted font-sans">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="hidden sm:flex items-center gap-2 rounded-md bg-obsidian-700 border border-obsidian-600 px-3 h-9 w-64">
          <Search size={13} className="text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-muted"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-obsidian-600 bg-transparent hover:bg-obsidian-700 transition">
          <Bell size={15} className="text-muted" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-gold-400" />
        </button>
      </div>
    </header>
  );
}
