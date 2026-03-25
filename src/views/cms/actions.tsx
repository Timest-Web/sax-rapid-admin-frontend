/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

// --- TYPES ---
export type ContentPage = {
  id: string;
  title: string;
  slug: string;
  lastUpdated: string;
  status: "published" | "draft";
  author: string;
  content?: string; // Added content field
};

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "published" | "draft" | "scheduled";
  views: number;
};

// --- PAGE EDITOR MODAL ---
interface PageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ContentPage | null; // Null means "New Page"
  onSave: (data: ContentPage) => void;
}

export function PageEditorModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: PageEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content || "<h2>Content loaded...</h2>");
    } else {
      // Reset for new page
      setTitle("");
      setContent("");
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!title) return; // Simple validation

    const newPage: ContentPage = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title,
      slug: `/${title.toLowerCase().replace(/\s+/g, "-")}`,
      lastUpdated: "Just now",
      status: "published",
      author: "Admin",
      content,
    };

    onSave(newPage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} />{" "}
            {initialData ? "Edit Content" : "Create New Page"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Refund Policy"
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <div className="flex items-center">
                <span className="bg-zinc-100 border border-r-0 border-zinc-200 px-3 py-2 text-sm text-zinc-500 rounded-l-md">
                  /pages
                </span>
                <Input
                  className="rounded-l-none"
                  placeholder="/refund-policy"
                  value={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <Label>Content Body (Rich Text)</Label>
            <Textarea
              className="flex-1 font-mono text-sm bg-zinc-50 resize-none p-4 focus:ring-zinc-900"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Start typing in Markdown or HTML..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-zinc-900">
            {initialData ? "Update Page" : "Publish Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
