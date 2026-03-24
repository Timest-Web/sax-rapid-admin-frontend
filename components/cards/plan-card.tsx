// components/cards/plan-card.tsx
"use client";

import { Check, Edit2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const planVariants = {
  default: {
    card: "from-slate-50 via-zinc-50 to-stone-100 border-zinc-200 hover:border-zinc-300",
    price: "text-zinc-900",
    badge: "bg-zinc-100 text-zinc-600 border-zinc-200/60",
    check: "text-zinc-500 bg-zinc-100",
    divider: "border-zinc-200/60",
    subscribers: "text-zinc-500",
    editBtn: "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100",
  },
  gold: {
    card: "from-yellow-50 via-amber-50 to-orange-100 border-amber-200/60 hover:border-amber-300 ring-1 ring-amber-200/30",
    price: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200/60",
    check: "text-amber-600 bg-amber-100",
    divider: "border-amber-200/40",
    subscribers: "text-amber-600",
    editBtn: "text-amber-400 hover:text-amber-700 hover:bg-amber-100",
  },
  indigo: {
    card: "from-slate-50 via-blue-50 to-indigo-100 border-indigo-200/60 hover:border-indigo-300",
    price: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200/60",
    check: "text-indigo-600 bg-indigo-100",
    divider: "border-indigo-200/40",
    subscribers: "text-indigo-600",
    editBtn: "text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100",
  },
  emerald: {
    card: "from-green-50 via-emerald-50 to-teal-100 border-emerald-200/60 hover:border-emerald-300",
    price: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200/60",
    check: "text-emerald-600 bg-emerald-100",
    divider: "border-emerald-200/40",
    subscribers: "text-emerald-600",
    editBtn: "text-emerald-400 hover:text-emerald-700 hover:bg-emerald-100",
  },
  rose: {
    card: "from-red-50 via-rose-50 to-pink-100 border-rose-200/60 hover:border-rose-300",
    price: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200/60",
    check: "text-rose-600 bg-rose-100",
    divider: "border-rose-200/40",
    subscribers: "text-rose-600",
    editBtn: "text-rose-400 hover:text-rose-700 hover:bg-rose-100",
  },
  violet: {
    card: "from-violet-50 via-purple-50 to-fuchsia-100 border-violet-200/60 hover:border-violet-300",
    price: "text-violet-700",
    badge: "bg-violet-100 text-violet-700 border-violet-200/60",
    check: "text-violet-600 bg-violet-100",
    divider: "border-violet-200/40",
    subscribers: "text-violet-600",
    editBtn: "text-violet-400 hover:text-violet-700 hover:bg-violet-100",
  },
} as const;

type PlanVariant = keyof typeof planVariants;

export interface PlanCardProps {
  name: string;
  price: string;
  interval: string;
  features: string[];
  subscribers?: number;
  status?: string;
  variant?: PlanVariant;
  featured?: boolean;
  onEdit?: () => void;
  className?: string;
}

export function PlanCard({
  name,
  price,
  interval,
  features,
  subscribers,
  status,
  variant = "default",
  featured = false,
  onEdit,
  className,
}: PlanCardProps) {
  const theme = planVariants[variant];

  return (
    <div
      className={cn(
        "group relative p-6 rounded-xl border bg-linear-to-br flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        theme.card,
        featured && "shadow-md scale-[1.02]",
        className,
      )}
    >
      {/* Featured ribbon */}
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm",
              theme.badge,
            )}
          >
            <Star size={10} className="fill-current" />
            Most Popular
          </span>
        </div>
      )}

      {/* Edit button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className={cn(
            "absolute top-4 right-4 h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100",
            theme.editBtn,
          )}
        >
          <Edit2 size={14} />
        </button>
      )}

      {/* Top section */}
      <div>
        {/* Plan name & status */}
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold font-display tracking-tight text-zinc-900">
            {name}
          </h3>
          {status && (
            <span
              className={cn(
                "text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border",
                theme.badge,
              )}
            >
              {status}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-3 mb-6">
          <span
            className={cn(
              "text-4xl font-extrabold font-mono tracking-tighter",
              theme.price,
            )}
          >
            {price}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            / {interval}
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-2.5">
          {features.map((feat, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-xs font-medium text-zinc-700"
            >
              <span
                className={cn(
                  "mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0",
                  theme.check,
                )}
              >
                <Check size={10} strokeWidth={3} />
              </span>
              {feat}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom section */}
      {subscribers !== undefined && (
        <div
          className={cn(
            "mt-6 pt-4 border-t flex items-center justify-between",
            theme.divider,
          )}
        >
          <span
            className={cn("text-xs font-mono font-semibold", theme.subscribers)}
          >
            {subscribers.toLocaleString()} Vendors
          </span>
          <div className="flex -space-x-1.5">
            {Array.from({ length: Math.min(subscribers, 4) }).map((_, i) => (
              <div
                key={i}
                className="h-5 w-5 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center"
                style={{ zIndex: 4 - i }}
              >
                <div
                  className={cn(
                    "h-full w-full rounded-full bg-linear-to-br",
                    theme.card,
                  )}
                />
              </div>
            ))}
            {subscribers > 4 && (
              <div className="h-5 w-5 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-500">
                +{subscribers - 4}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
