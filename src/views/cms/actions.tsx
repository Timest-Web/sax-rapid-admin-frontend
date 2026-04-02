/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Image as ImageIcon, UploadCloud, Edit3 } from "lucide-react";

// --- TYPES ---
export type ContentPage = {
  id: string;
  title: string;
  slug: string;
  lastUpdated: string;
  status: "published" | "draft";
  author: string;
  content?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category: string;
  author: string;
  date: string;
  status: "published" | "draft" | "scheduled";
  views: number;
};

// ==========================================
// MODAL: PAGE EDITOR (CMS)
// ==========================================
interface PageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ContentPage | null;
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

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content || "<h2>Content loaded...</h2>");
    } else {
      setTitle("");
      setContent("");
    }
  }, [isOpen, initialData]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

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
      <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* ─── HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <FileText size={16} />
              </div>
              {initialData ? "Edit Content Page" : "Create Content Page"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Manage core platform pages like Terms of Service, Privacy Policy, or custom landing pages.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── FORM BODY ─── */}
        <form
          id="pageForm"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-5 shrink-0">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Page Title <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Refund Policy"
                required
                className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                URL Slug
              </Label>
              <div className="flex items-center h-11 rounded-lg border border-zinc-200 bg-zinc-50/50 overflow-hidden focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37] transition-all">
                <span className="flex items-center justify-center px-4 bg-zinc-100 border-r border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-widest h-full">
                  /pages
                </span>
                <Input
                  className="h-full border-0 focus-visible:ring-0 bg-transparent rounded-none"
                  placeholder="/refund-policy"
                  value={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Content Body (Rich Text) <span className="text-[#D4AF37]">*</span>
            </Label>
            <Textarea
              className="flex-1 resize-none p-4 custom-scrollbar bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Start typing your Markdown or HTML content here..."
              required
            />
          </div>
        </form>

        {/* ─── FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white shrink-0">
          <Button
            type="submit"
            form="pageForm"
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md"
          >
            {initialData ? "Update Page" : "Publish Page"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// MODAL: BLOG EDITOR
// ==========================================
interface BlogEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BlogPost | null;
  onSave: (data: BlogPost) => void;
}

export function BlogEditorModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: BlogEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setCategory(initialData.category || "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
    }
  }, [isOpen, initialData]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) return;

    const newBlog: BlogPost = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      author: initialData?.author || "Admin",
      date: initialData?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "published",
      views: initialData?.views || 0,
    };

    onSave(newBlog);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        {/* ─── HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Edit3 size={16} />
              </div>
              {initialData ? "Edit Article" : "Write New Article"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Publish news, guides, and platform updates to the community blog.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── FORM BODY ─── */}
        <form
          id="blogForm"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Post Title <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10 Tips for Better Logistics"
              required
              className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Category <span className="text-[#D4AF37]">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-[#D4AF37] transition-all rounded-lg">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Short Description / Excerpt
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of your article..."
              className="resize-none h-24 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-[#D4AF37] rounded-lg custom-scrollbar"
            />
          </div>

          {/* Featured Image Upload (Visual Mockup) */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Featured Image
            </Label>
            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-100 hover:border-[#D4AF37]/50 transition-all cursor-pointer group">
              <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-[#D4AF37] group-hover:bg-zinc-900 transition-all mb-4">
                <UploadCloud size={20} />
              </div>
              <p className="text-sm font-bold text-zinc-900">Click to upload image</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-2 font-bold">
                SVG, PNG, JPG (MAX. 800x400px)
              </p>
            </div>
          </div>
        </form>

        {/* ─── FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white shrink-0">
          <Button
            type="submit"
            form="blogForm"
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md"
          >
            {initialData ? "Update Article" : "Publish Article"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}