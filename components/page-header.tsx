import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export function PageHeader({
  title,
  actionLabel,
  onAction,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <SidebarTrigger
          className="text-zinc-500 hover:text-zinc-900"
          aria-label="Toggle sidebar"
        />
        <div className="h-6 w-px bg-zinc-200" />
        <h1 className="font-display text-sm font-bold uppercase tracking-widest text-zinc-900">
          {title}
        </h1>
      </div>

      {/* Right Section */}
      {actionLabel && (
        <Button
          size="sm"
          onClick={onAction}
          className="flex items-center gap-2 h-9 text-xs bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span>{actionLabel}</span>
        </Button>
      )}
    </header>
  );
}