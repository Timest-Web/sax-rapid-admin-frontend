/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Layout,
  FileText,
  Globe,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { getPageColumns, getBlogColumns } from "./column";
import { PageEditorModal, ContentPage, BlogPost } from "./actions";

// --- DUMMY DATA ---
const INITIAL_PAGES: ContentPage[] = [
  {
    id: "1",
    title: "Terms & Conditions",
    slug: "/terms",
    lastUpdated: "2 days ago",
    status: "published",
    author: "Admin",
    content: "Terms...",
  },
  {
    id: "2",
    title: "Privacy Policy",
    slug: "/privacy",
    lastUpdated: "1 week ago",
    status: "published",
    author: "Legal",
    content: "Privacy...",
  },
  {
    id: "3",
    title: "About Us",
    slug: "/about",
    lastUpdated: "1 month ago",
    status: "published",
    author: "Admin",
    content: "About...",
  },
];

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "Top 10 Gadgets for 2024",
    category: "Tech",
    author: "Sarah J.",
    date: "Oct 20",
    status: "published",
    views: 1240,
  },
  {
    id: "2",
    title: "Summer Fashion Trends",
    category: "Fashion",
    author: "Mike R.",
    date: "Oct 18",
    status: "published",
    views: 850,
  },
];

export default function CMSView() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("pages");

  // Data States
  const [pages, setPages] = useState<ContentPage[]>(INITIAL_PAGES);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  // Editor States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentPage | null>(null);

  // --- HANDLERS FOR PAGES ---

  // 1. Delete Page
  const handleDeletePage = (item: ContentPage) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setPages(pages.filter((p) => p.id !== item.id));
    }
  };

  // 2. Edit Page (Open Modal)
  const handleEditPage = (item: ContentPage) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  // 3. Create New Page (Open Modal)
  const handleCreatePage = () => {
    setEditingItem(null); // Clear previous data
    setIsEditorOpen(true);
  };

  // 4. Save Page (From Modal)
  const handleSavePage = (savedPage: ContentPage) => {
    const exists = pages.find((p) => p.id === savedPage.id);
    if (exists) {
      // Update existing
      setPages(pages.map((p) => (p.id === savedPage.id ? savedPage : p)));
    } else {
      // Add new
      setPages([savedPage, ...pages]);
    }
  };

  // 5. View Page (Simulated)
  const handleViewPage = (item: ContentPage) => {
    alert(`Simulating preview for: ${item.slug}`);
  };

  // --- HANDLERS FOR BLOGS (Simplified for brevity) ---
  const handleDeleteBlog = (item: BlogPost) => {
    setBlogs(blogs.filter((b) => b.id !== item.id));
  };

  // --- COLUMN CONFIGURATION ---
  // Pass handlers into column generators
  const pageColumns = getPageColumns({
    onEdit: handleEditPage,
    onDelete: handleDeletePage,
    onView: handleViewPage,
  });

  const blogColumns = getBlogColumns({
    onEdit: (item) => alert(`Editing blog: ${item.title}`),
    onDelete: handleDeleteBlog,
    onView: (item) => alert(`Reading: ${item.title}`),
  });

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Content Management
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <ExternalLink size={14} /> View Live Site
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Published Pages"
            value={pages.length.toString()}
            icon={FileText}
            variant="default"
          />
          <StatCard
            label="Blog Readers (MTD)"
            value="45.2k"
            icon={Globe}
            variant="indigo"
          />
          <StatCard
            label="Active Promos"
            value="2"
            icon={Layout}
            variant="gold"
          />
        </div>

        {/* TABS */}
        <Tabs
          defaultValue="pages"
          onValueChange={setActiveTab}
          className="w-full flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "pages",
                  label: "Static Pages",
                  count: pages.length,
                  variant: "amber",
                },
                {
                  value: "blog",
                  label: "Blog & News",
                  count: blogs.length,
                  variant: "indigo",
                },
                {
                  value: "home",
                  label: "Homepage Banners",
                  count: 3,
                  variant: "emerald",
                },
              ]}
            />
          </div>

          {/* TAB 1: STATIC PAGES */}
          <TabsContent value="pages">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={handleCreatePage}
                  className="bg-zinc-900 hover:bg-zinc-800 text-xs"
                >
                  <Plus size={16} className="mr-2" /> Create New Page
                </Button>
              </div>
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable columns={pageColumns} data={pages} />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: BLOG */}
          <TabsContent value="blog">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white">
                  <Plus size={16} className="mr-2" /> Write Article
                </Button>
              </div>
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable columns={blogColumns} data={blogs} />
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: HOMEPAGE (Visual Grid) */}
          <TabsContent value="home">
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center p-6 h-48 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all group">
                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:shadow-sm">
                  <Plus size={20} />
                </div>
                <p className="mt-3 text-sm font-bold text-zinc-500">
                  Add Hero Banner
                </p>
              </div>
              {/* Static Banners for visual demo */}
              <BannerCard
                title="Black Friday Sale"
                color="bg-zinc-900"
                status="active"
              />
              <BannerCard
                title="New Arrivals"
                color="bg-indigo-600"
                status="active"
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* SHARED EDITOR MODAL */}
      <PageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={editingItem}
        onSave={handleSavePage}
      />
    </div>
  );
}

// Simple helper for the banner grid
function BannerCard({ title, color, status }: any) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-48 relative group">
      <div
        className={`h-28 w-full ${color} flex items-center justify-center relative`}
      >
        <p className="text-white font-display font-bold text-lg tracking-wider opacity-90">
          {title}
        </p>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" className="h-8 text-xs">
            Edit
          </Button>
          <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between flex-1">
        <div>
          <p className="text-xs font-bold text-zinc-900 uppercase">
            Hero Section
          </p>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-zinc-300"}`}
        />
      </div>
    </div>
  );
}
