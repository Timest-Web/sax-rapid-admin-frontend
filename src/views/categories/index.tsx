/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Layers } from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import type {
  CategoryNode,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/src/features/categories/api";
import {
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/src/features/categories/hooks";

import { CategoryListItem } from "./categories_list_item";
import {
  CategoryFormModal,
  DeleteAlert,
  SubcategoryFormModal,
} from "./categories_action";

type FlatCat = { node: CategoryNode; depth: number };

function flattenTree(nodes: CategoryNode[], depth = 0): FlatCat[] {
  const out: FlatCat[] = [];
  for (const n of nodes) {
    out.push({ node: n, depth });
    if (n.subCategories?.length)
      out.push(...flattenTree(n.subCategories, depth + 1));
  }
  return out;
}

export default function CategoriesPage() {
  const {
    data: tree = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCategoryTree();

  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const flat = useMemo(() => flattenTree(tree), [tree]);

  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);

  // modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryNode | null>(null);

  // init selection (or after delete -> selection becomes null)
  useEffect(() => {
    if (selectedCatId != null) return;
    if (flat.length > 0) setSelectedCatId(flat[0].node.id);
  }, [flat, selectedCatId]);

  const selectedCat = useMemo(() => {
    if (!selectedCatId) return null;
    return flat.find((x) => x.node.id === selectedCatId)?.node ?? null;
  }, [flat, selectedCatId]);

  const selectedStatusLabel = selectedCat?.isActive ? "Active" : "Inactive";

  const handleAddCategory = (payload: CreateCategoryInput) => {
    createCat.mutate(payload, {
      onSuccess: (created) => setSelectedCatId(created.id),
    });
  };

  const handleEditCategory = (vars: {
    id: number;
    payload: UpdateCategoryInput;
  }) => {
    updateCat.mutate(vars, { onSuccess: () => setEditingCat(null) });
  };

  const handleDeleteCategory = () => {
    if (!selectedCat) return;
    deleteCat.mutate(selectedCat.id, {
      onSuccess: () => {
        // let refetch update the list, then effect selects first item
        setSelectedCatId(null);
      },
    });
  };

  const toggleCategoryStatus = (checked: boolean) => {
    if (!selectedCat) return;

    updateCat.mutate({
      id: selectedCat.id,
      payload: {
        name: selectedCat.name,
        description: selectedCat.description ?? "",
        iconUrl: selectedCat.iconUrl ?? "",
        isActive: checked,
      },
    });
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Categories
          </h1>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setEditingCat(null);
            setIsCatModalOpen(true);
          }}
          disabled={createCat.isPending}
        >
          <Plus className="mr-2 h-3 w-3" /> New Category
        </Button>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg shadow-sm flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Categories
              </h3>
              <span className="bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                {flat.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-xs text-zinc-500">
                  Loading categories…
                </div>
              ) : isError ? (
                <div className="p-4 text-xs">
                  <p className="text-rose-600 font-semibold">
                    Failed to load categories:{" "}
                    {(error as any)?.message ?? "Unknown error"}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-2 underline text-zinc-700"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                flat.map(({ node, depth }) => (
                  <CategoryListItem
                    key={node.id}
                    category={node}
                    depth={depth}
                    isSelected={selectedCatId === node.id}
                    onClick={() => setSelectedCatId(node.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
            {!selectedCat ? (
              <div className="p-10 text-sm text-zinc-500">
                Select a category…
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-zinc-200 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200 overflow-hidden">
                      {selectedCat.iconUrl ? (
                        <img
                          src={selectedCat.iconUrl}
                          alt={selectedCat.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-zinc-400">
                          {selectedCat.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 font-display">
                        {selectedCat.name}
                      </h2>
                      <p className="text-xs text-zinc-400 font-mono mt-1">
                        ID: {selectedCat.id}
                        {selectedCat.parentId
                          ? ` • Parent: ${selectedCat.parentId}`
                          : ""}
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <StatusBadge status={selectedStatusLabel} />
                        <div className="flex items-center gap-2">
                          <Label
                            className="text-[10px] uppercase font-bold text-zinc-500"
                            htmlFor="visible-switch"
                          >
                            Enabled
                          </Label>
                          <Switch
                            id="visible-switch"
                            checked={selectedCat.isActive}
                            onCheckedChange={toggleCategoryStatus}
                            disabled={updateCat.isPending}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCat(selectedCat);
                        setIsCatModalOpen(true);
                      }}
                      disabled={updateCat.isPending}
                    >
                      <Edit2 className="mr-2 h-3 w-3" /> Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => setIsDeleteOpen(true)}
                      disabled={deleteCat.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-8 flex-1">
                  {/* Subcategories */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <Layers size={16} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">
                          Subcategories
                        </h3>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() => setIsSubModalOpen(true)}
                        disabled={createCat.isPending}
                      >
                        <Plus className="mr-1 h-3 w-3" /> Add Subcategory
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(selectedCat.subCategories ?? []).length > 0 ? (
                        selectedCat.subCategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 border border-zinc-200 rounded bg-zinc-50/50 flex justify-between items-center hover:border-zinc-300 transition-colors group"
                          >
                            <button
                              type="button"
                              className="text-sm font-medium text-zinc-700 hover:underline text-left"
                              onClick={() => setSelectedCatId(sub.id)}
                            >
                              {sub.name}
                            </button>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-400">
                                ID: {sub.id}
                              </span>

                              <button
                                type="button"
                                className="opacity-0 group-hover:opacity-100 text-rose-500"
                                onClick={() => deleteCat.mutate(sub.id)}
                                title="Deactivate subcategory"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="col-span-2 text-center text-xs text-zinc-400 italic py-4">
                          No subcategories yet.
                        </p>
                      )}
                    </div>
                  </section>

                  <div className="h-px bg-zinc-100 w-full" />

                  {/* Endpoint-only details */}
                  <section className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                      Details
                    </h3>

                    <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 text-xs text-zinc-700 space-y-2">
                      <div className="flex justify-between">
                        {/* <span className="text-zinc-500 font-mono">icon</span>
                        <div className="h-16 w-16 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200 overflow-hidden">
                          {selectedCat.iconUrl ? (
                            <img
                              src={selectedCat.iconUrl}
                              alt={selectedCat.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-zinc-400">
                              {selectedCat.name.charAt(0)}
                            </span>
                          )}
                        </div> */}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-mono">
                          displayOrder
                        </span>
                        <span className="font-mono">
                          {selectedCat.displayOrder}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-mono">
                          createdAt
                        </span>
                        <span className="font-mono">
                          {new Date(selectedCat.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-zinc-200">
                        <div className="text-zinc-500 font-mono mb-1">
                          description
                        </div>
                        <div className="text-zinc-800">
                          {selectedCat.description ?? "—"}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modals */}
        <CategoryFormModal
          open={isCatModalOpen}
          setOpen={setIsCatModalOpen}
          initialData={editingCat}
          onSubmit={(payload) => {
            if ("id" in (payload as any)) {
              handleEditCategory(payload as any);
            } else {
              handleAddCategory(payload as any);
            }
          }}
        />

        {selectedCat ? (
          <SubcategoryFormModal
            open={isSubModalOpen}
            setOpen={setIsSubModalOpen}
            parentId={selectedCat.id}
            onSubmit={(payload) => handleAddCategory(payload)}
          />
        ) : null}

        <DeleteAlert
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          onConfirm={handleDeleteCategory}
          itemName={selectedCat?.name ?? "Category"}
        />
      </main>
    </div>
  );
}
