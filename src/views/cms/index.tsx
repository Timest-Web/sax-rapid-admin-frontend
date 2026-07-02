/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Plus, Layout, FileText, Globe, ExternalLink } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";

import { getPageColumns } from "./column";
import { PageEditorModal, ConfirmDeletePageModal } from "./actions";

import type { CmsPageListItem } from "@/src/features/cms/api";
import {
  useCmsStats,
  useCmsPages,
  useCreateCmsPage,
  useUpdateCmsPage,
  useDeleteCmsPage,
} from "@/src/features/cms/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

function dateLabel(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function CMSView() {
  const [activeTab, setActiveTab] = useState<"pages" | "blog" | "home">(
    "pages",
  );

  const statsQ = useCmsStats();
  const pagesQ = useCmsPages({ PageNumber: 1, PageSize: 50 });

  const pages = pagesQ.data ?? [];

  // Modals + mutations
  const createM = useCreateCmsPage();
  const updateM = useUpdateCmsPage();
  const deleteM = useDeleteCmsPage();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CmsPageListItem | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<CmsPageListItem | null>(null);

  const columns = useMemo(
    () =>
      getPageColumns({
        onEdit: (p) => {
          setEditing(p);
          setEditorOpen(true);
        },
        onDelete: (p) => {
          setDeleting(p);
          setDeleteOpen(true);
        },
        onView: (p) => {
          // If you have a public site URL, adjust here
          window.open(p.slug, "_blank");
        },
      }),
    [],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Pages"
            value={statsQ.data ? String(statsQ.data.totalPages) : "—"}
            icon={FileText}
            variant="default"
          />
          <StatCard
            label="Published Pages"
            value={statsQ.data ? String(statsQ.data.publishedPages) : "—"}
            icon={Globe}
            variant="emerald"
          />
          <StatCard
            label="Draft Pages"
            value={statsQ.data ? String(statsQ.data.draftPages) : "—"}
            icon={Layout}
            variant="amber"
          />
        </div>

        <Tabs
          defaultValue="pages"
          onValueChange={(v) => setActiveTab(v as any)}
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
                // { value: "blog", label: "Blog & News", count: 0, variant: "indigo" },
                // { value: "home", label: "Homepage Banners", count: 0, variant: "emerald" },
              ]}
            />
          </div>

          {/* PAGES */}
          <TabsContent value="pages">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setEditing(null);
                    setEditorOpen(true);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 text-xs"
                >
                  <Plus size={16} className="mr-2" /> Create New Page
                </Button>
              </div>

              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                {pagesQ.isLoading ? (
                  <TableSkeleton rows={5} columns={6} />
                ) : pagesQ.isError ? (
                  <div className="p-6 text-sm text-rose-600">
                    Failed to load CMS pages.
                  </div>
                ) : (
                  <DataTable columns={columns} data={pages} />
                )}
              </div>
            </div>
          </TabsContent>

          {/* BLOG (placeholder) */}
          <TabsContent value="blog">
            <div className="mt-6 bg-white border border-zinc-200 rounded-lg p-6 text-sm text-zinc-500">
              No blog endpoints wired yet.
            </div>
          </TabsContent>

          {/* HOME (placeholder) */}
          <TabsContent value="home">
            <div className="mt-6 bg-white border border-zinc-200 rounded-lg p-6 text-sm text-zinc-500">
              No homepage banner endpoints wired yet.
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Editor modal */}
      <PageEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={editing}
        isSaving={createM.isPending || updateM.isPending}
        onSave={(payload) => {
          if (editing?.id) {
            updateM.mutate(
              { pageId: editing.id, payload },
              { onSuccess: () => setEditorOpen(false) },
            );
          } else {
            createM.mutate(payload, { onSuccess: () => setEditorOpen(false) });
          }
        }}
      />

      {/* Delete confirm */}
      <ConfirmDeletePageModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        page={deleting}
        isDeleting={deleteM.isPending}
        onConfirm={(pageId) => {
          deleteM.mutate(pageId, {
            onSuccess: () => {
              setDeleteOpen(false);
              setDeleting(null);
            },
          });
        }}
      />
    </div>
  );
}
