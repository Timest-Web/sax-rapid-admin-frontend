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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Image as ImageIcon, UploadCloud } from "lucide-react";

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

// --- PAGE EDITOR MODAL ---
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

  const handleSave = () => {
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
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} />{" "}
            {initialData ? "Edit Content" : "Create New Page"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto pr-2">
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
          <Button onClick={handleSave} className="bg-zinc-900 text-white">
            {initialData ? "Update Page" : "Publish Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- BLOG EDITOR MODAL (NEW) ---
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

  const handleSave = () => {
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
      <DialogContent className="sm:max-w-[600px] bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} />{" "}
            {initialData ? "Edit Article" : "Write New Article"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Post Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10 Tips for Better Logistics"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
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
          <div className="space-y-2">
            <Label>Short Description / Excerpt</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of your article..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Featured Image Upload (Visual Mockup) */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group">
              <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 mb-3">
                <UploadCloud size={20} />
              </div>
              <p className="text-sm font-bold text-zinc-600">Click to upload image</p>
              <p className="text-xs text-zinc-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {initialData ? "Update Article" : "Publish Article"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}