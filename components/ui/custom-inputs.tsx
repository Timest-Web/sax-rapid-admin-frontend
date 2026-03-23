"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // Ensure you have this utility
import { Label } from "@/components/ui/label";
import { Input as BaseInput } from "@/components/ui/input";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronDown } from "lucide-react";

// ─── STYLING CONSTANTS (The "Secret Sauce") ───
const SHARED_STYLES = {
  // The tactile feel: slightly transparent bg, nice border, smooth focus ring
  input:
    "bg-zinc-50/50 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all duration-200 rounded-xl",

  // Error state
  errorInput:
    "border-rose-200 bg-rose-50/30 focus:border-rose-300 focus:ring-rose-100 text-rose-900 placeholder:text-rose-300",

  // Label styling
  label:
    "text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1 mb-1.5 block",
};

// ─── 1. FORM FIELD WRAPPER ───
// Handles the Label, spacing, and error messages automatically
interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  optional?: boolean;
}

export const Field = ({
  children,
  label,
  error,
  optional,
  className,
  ...props
}: FieldProps) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      {label && (
        <div className="flex justify-between items-end">
          <Label className={SHARED_STYLES.label}>
            {label}
            {optional && (
              <span className="text-zinc-400 font-normal normal-case tracking-normal ml-1">
                (Optional)
              </span>
            )}
          </Label>
        </div>
      )}
      {children}
      {error && (
        <p className="text-[11px] font-medium text-rose-500 mt-1.5 ml-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

// ─── 2. CUSTOM INPUT ───
interface CustomInputProps extends React.ComponentProps<typeof BaseInput> {
  error?: boolean;
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        className={cn(
          "h-11 shadow-none", // Reset default shadcn shadow if needed
          SHARED_STYLES.input,
          error && SHARED_STYLES.errorInput,
          className,
        )}
        {...props}
      />
    );
  },
);
CustomInput.displayName = "CustomInput";

// ─── 3. CUSTOM TEXTAREA ───
export const CustomTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof BaseTextarea> & { error?: boolean }
>(({ className, error, ...props }, ref) => {
  return (
    <BaseTextarea
      ref={ref}
      className={cn(
        "resize-none min-h-[100px] shadow-none",
        SHARED_STYLES.input,
        error && SHARED_STYLES.errorInput,
        className,
      )}
      {...props}
    />
  );
});
CustomTextarea.displayName = "CustomTextarea";

// ─── 4. CUSTOM SELECT ───
// A simplified wrapper for Select that looks consistent
interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  error?: boolean;
}

export const CustomSelect = ({
  placeholder,
  options,
  value,
  onChange,
  className,
  error,
}: CustomSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-11 w-full justify-between shadow-none",
          SHARED_STYLES.input,
          error && SHARED_STYLES.errorInput,
          className,
        )}
      >
        <SelectValue placeholder={placeholder || "Select..."} />
      </SelectTrigger>
      <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1.5 min-w-(--radix-select-trigger-width)">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="cursor-pointer my-0.5 px-3 py-2.5 rounded-lg text-sm text-zinc-600 focus:bg-zinc-100 focus:text-zinc-900 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-black data-[state=checked]:font-medium transition-colors"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
