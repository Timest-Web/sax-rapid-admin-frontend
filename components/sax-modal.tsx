"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SaxModal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;

  /** e.g. "sm:max-w-[600px]" */
  maxWidthClassName?: string;

  /** body content */
  children: React.ReactNode;

  /** footer buttons */
  footer: React.ReactNode;

  /** if true, body becomes scrollable with max height */
  scrollBody?: boolean;

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
    maxWidthClassName = "sm:max-w-[500px]",
    children,
    footer,
    scrollBody = true,
    contentClassName,
    bodyClassName,
    footerClassName,
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          maxWidthClassName,
          "max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl",
          contentClassName,
        )}
      >
        {/* ─── HEADER ─── */}
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

        {/* ─── BODY ─── */}
        <div
          className={cn(
            "p-6 space-y-5",
            scrollBody && "max-h-[65vh] overflow-y-auto custom-scrollbar",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {/* ─── FOOTER ─── */}
        <DialogFooter
          className={cn(
            "p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white",
            footerClassName,
          )}
        >
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}