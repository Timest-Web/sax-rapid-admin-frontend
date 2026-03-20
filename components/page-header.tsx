import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
        <div className="h-6 w-px bg-zinc-200" />
        <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
          {title}
        </h1>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="h-9 px-4 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-500 hover:text-black transition-colors rounded-sm"
        >
          {actionLabel}
        </button>
      )}
    </header>
  );
}
