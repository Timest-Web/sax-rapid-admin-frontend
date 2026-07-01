/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsPageListItem, UpsertCmsPageInput } from "@/src/features/cms/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContent2,
  AlertDialogDescription as AlertDialogDescription2,
  AlertDialogFooter as AlertDialogFooter2,
  AlertDialogHeader as AlertDialogHeader2,
  AlertDialogTitle as AlertDialogTitle2,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Trash2 } from "lucide-react";

function slugify(title: string) {
  return (
    "/" +
    String(title || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  );
}

export function PageEditorModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: CmsPageListItem | null;
  isSaving?: boolean;
  onSave: (payload: UpsertCmsPageInput) => void;
}) {
  const { open, onOpenChange, initial, isSaving, onSave } = props;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Draft");
  const [content, setContent] = useState("");

  const isEdit = !!initial?.id;

  useEffect(() => {
    if (!open) return;

    setTitle(initial?.title ?? "");
    setSlug(initial?.slug ?? "");
    setStatus(String(initial?.status ?? "Draft"));
    setContent(""); // not returned by list endpoint
  }, [open, initial?.id]);

  const canSave = useMemo(() => {
    return (
      title.trim().length > 1 &&
      slug.trim().length > 1 &&
      status.trim().length > 0 &&
      content.trim().length > 1
    );
  }, [title, slug, status, content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-[900px]
          max-h-[90vh]
          overflow-hidden
          p-0
          bg-white border-zinc-200
          rounded-2xl shadow-2xl
          flex flex-col
        "
      >
        {/* Header (fixed) */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          {/* ✅ TOP BAND */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <FileText size={16} />
              </div>
              {isEdit ? "Edit CMS Page" : "Create CMS Page"}
            </DialogTitle>

            <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
              Uses{" "}
              {isEdit
                ? "PUT /api/admin/cms/pages/{pageId}"
                : "POST /api/admin/cms/pages"}
              .
              {isEdit
                ? " (Content is not returned by the list endpoint, so paste/edit it here.)"
                : ""}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body (scrolls) */}
        <div className="p-6 space-y-5 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Title <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Slug <span className="text-[#D4AF37]">*</span>
              </Label>

              <div className="flex gap-2">
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
                  disabled={isSaving}
                  placeholder="/terms-and-conditions"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => setSlug(slugify(title))}
                  disabled={isSaving || !title.trim()}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Status <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
              placeholder='e.g. "Published" or "Draft"'
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Content <span className="text-[#D4AF37]">*</span>
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[280px] bg-zinc-50/50 border-zinc-200 font-mono text-xs"
              placeholder="HTML/Markdown/content..."
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Footer (fixed) */}
        <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse shrink-0">
          <Button
            onClick={() =>
              onSave({
                title: title.trim(),
                slug: slug.trim(),
                content,
                status: status.trim(),
              })
            }
            disabled={!canSave || isSaving}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11"
          >
            {isSaving ? "Saving..." : isEdit ? "Update Page" : "Create Page"}
          </Button>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="bg-white border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDeletePageModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  page: CmsPageListItem | null;
  isDeleting?: boolean;
  onConfirm: (pageId: string) => void;
}) {
  const { open, onOpenChange, page, isDeleting, onConfirm } = props;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent2 className="p-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        {/* Header with top band */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

          <AlertDialogHeader2>
            <AlertDialogTitle2 className="flex items-center gap-2 text-zinc-900">
              <Trash2 size={18} className="text-rose-600" />
              Delete page
            </AlertDialogTitle2>

            <AlertDialogDescription2 className="text-sm text-zinc-600">
              This will permanently delete{" "}
              <span className="font-semibold">{page?.title ?? "this page"}</span>.
              This action cannot be undone.
            </AlertDialogDescription2>
          </AlertDialogHeader2>
        </div>

        <AlertDialogFooter2 className="p-6 pt-4 sm:justify-between flex-row-reverse">
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700"
            disabled={!page?.id || isDeleting}
            onClick={() => page?.id && onConfirm(page.id)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>

          <AlertDialogCancel disabled={isDeleting} className="bg-white border-zinc-200">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter2>
      </AlertDialogContent2>
    </AlertDialog>
  );
}