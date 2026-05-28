"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogSize = "sm" | "md" | "lg" | "custom";

const sizeClass: Record<Exclude<DialogSize, "custom">, string> = {
  sm: "sm:max-w-[480px]",
  md: "sm:max-w-[560px]",
  lg: "sm:max-w-[720px]",
};

export function AppDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;

  size?: DialogSize;
  maxWidthClassName?: string;

  children: React.ReactNode;
  footer?: React.ReactNode;

  /** make the BODY scroll instead of the whole modal */
  scrollBody?: boolean;
  /** tweak body max height if you want */
  bodyMaxHeightClassName?: string;

  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}) {
  const {
    open,
    onOpenChange,
    title,
    description,
    icon,
    size = "md",
    maxWidthClassName,
    children,
    footer,
    scrollBody = true,
    bodyMaxHeightClassName = "max-h-[65vh]",
    contentClassName,
    bodyClassName,
    footerClassName,
  } = props;

  const widthClass =
    size === "custom" ? maxWidthClassName : sizeClass[size];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-hidden bg-white border-zinc-200 p-0 rounded-2xl shadow-2xl",
          widthClass,
          contentClassName,
        )}
      >
        {/* Header */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              {icon ? (
                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                  {icon}
                </div>
              ) : null}
              {title}
            </DialogTitle>

            {description ? (
              <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        </div>

        {/* Body (scrolls) */}
        <div
          className={cn(
            "p-6",
            scrollBody && "overflow-y-auto custom-scrollbar",
            scrollBody && bodyMaxHeightClassName,
            bodyClassName,
          )}
        >
          {children}
        </div>

        {/* Footer (fixed) */}
        {footer ? (
          <DialogFooter
            className={cn(
              "p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white",
              footerClassName,
            )}
          >
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}