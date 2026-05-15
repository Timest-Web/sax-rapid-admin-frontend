/* eslint-disable @typescript-eslint/no-explicit-any */
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

type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "custom";

const sizeClass: Record<Exclude<DialogSize, "custom">, string> = {
  sm: "sm:max-w-[480px]",
  md: "sm:max-w-[560px]",
  lg: "sm:max-w-[720px]",
  xl: "sm:max-w-[840px]",
  "2xl": "sm:max-w-[980px]",
};

export type AppDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;

  /** default: md */
  size?: DialogSize;
  /** if size="custom", pass e.g. "sm:max-w-[500px]" */
  maxWidthClassName?: string;

  /** wraps body+footer in a <form> so submit buttons work */
  as?: "div" | "form";
  onSubmit?: React.FormEventHandler<HTMLFormElement>;

  children: React.ReactNode;

  /** put your <Button/>s here; rendered inside a styled DialogFooter */
  footer?: React.ReactNode;

  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  /** customize the top gradient bar (optional) */
  headerGradientClassName?: string;
};

export function AppDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,

  size = "md",
  maxWidthClassName,

  as = "div",
  onSubmit,

  children,
  footer,

  contentClassName,
  bodyClassName,
  footerClassName,

  headerGradientClassName,
}: AppDialogProps) {
  const widthClass =
    size === "custom" ? maxWidthClassName : sizeClass[size];

  const Wrapper: any = as; // div | form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl",
          widthClass,
          contentClassName,
        )}
      >
        {/* Header (consistent for all dialogs) */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900",
              headerGradientClassName,
            )}
          />
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
              <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        </div>

        {/* Body + Footer (optionally wrapped in form) */}
        <Wrapper
          onSubmit={as === "form" ? onSubmit : undefined}
          className={cn("p-6", bodyClassName)}
        >
          {children}

          {footer ? (
            <DialogFooter
              className={cn(
                "pt-6 mt-2 border-t border-zinc-100 sm:justify-between flex-row-reverse",
                footerClassName,
              )}
            >
              {footer}
            </DialogFooter>
          ) : null}
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
}