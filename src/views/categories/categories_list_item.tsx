/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryListItemProps {
  category: any;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryListItem({ category, isSelected, onClick }: CategoryListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 flex items-center justify-between border-b border-zinc-100 hover:bg-zinc-50 transition-colors",
        isSelected && "bg-zinc-50 border-l-4 border-l-sax-gold"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-8 w-8 rounded flex items-center justify-center text-zinc-500 bg-zinc-100",
          isSelected && "bg-sax-gold-light text-sax-gold-dim"
        )}>
           {/* In real app, render dynamic icon based on string name */}
           <span className="font-bold text-xs">{category.name.charAt(0)}</span>
        </div>
        <div>
          <p className={cn("text-sm font-bold", isSelected ? "text-zinc-900" : "text-zinc-600")}>
            {category.name}
          </p>
          <p className="text-[10px] text-zinc-400 font-mono">
            {category.subcategories.length} Subcats
          </p>
        </div>
      </div>
      {isSelected && <ChevronRight size={14} className="text-zinc-400" />}
    </button>
  );
}