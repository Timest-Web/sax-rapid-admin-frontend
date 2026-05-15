
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/src/features/categories/api";

interface CategoryListItemProps {
  category: CategoryNode;
  depth: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryListItem({
  category,
  depth,
  isSelected,
  onClick,
}: CategoryListItemProps) {
  const subCount = category.subCategories?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 flex items-center justify-between border-b border-zinc-100 hover:bg-zinc-50 transition-colors",
        isSelected && "bg-zinc-50 border-l-4 border-l-sax-gold"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* indentation + connector dot */}
        <div className="flex items-center" style={{ width: depth * 14 }}>
          {depth > 0 ? <span className="h-1 w-1 rounded-full bg-zinc-300" /> : null}
        </div>

        <div
          className={cn(
            "h-8 w-8 rounded flex items-center justify-center text-zinc-500 bg-zinc-100 shrink-0",
            isSelected && "bg-sax-gold-light text-sax-gold-dim"
          )}
        >
          <span className="font-bold text-xs">{category.name.charAt(0)}</span>
        </div>

        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-bold truncate",
              isSelected ? "text-zinc-900" : "text-zinc-700"
            )}
            title={category.name}
          >
            {category.name}
          </p>

          <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
            {category.parentId ? "Subcategory" : "Parent"}
            {subCount > 0 ? ` • ${subCount} subcats` : ""}
          </p>
        </div>
      </div>

      {isSelected && <ChevronRight size={14} className="text-zinc-400 shrink-0" />}
    </button>
  );
}