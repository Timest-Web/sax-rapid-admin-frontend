/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import type { CategoryNode, CreateCategoryInput, UpdateCategoryInput } from "@/src/features/categories/api";

export function CategoryFormModal({
  open,
  setOpen,
  onSubmit,
  initialData,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (payload: CreateCategoryInput | { id: number; payload: UpdateCategoryInput }) => void;
  initialData?: CategoryNode | null;
}) {
  const isEdit = !!initialData;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initialData?.name ?? "");
    setDescription(initialData?.description ?? "");
    setIconUrl(initialData?.iconUrl ?? "");
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (isEdit) {
      onSubmit({
        id: initialData!.id,
        payload: {
          name: name.trim(),
          description: description.trim(),
          iconUrl: iconUrl.trim(),
          isActive: initialData!.isActive, // status controlled by switch outside modal
        },
      });
    } else {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        iconUrl: iconUrl.trim(),
        isActive: true,
        parentId: null,
        displayOrder: 0,
      });
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 text-black">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Automotive" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional..." />
          </div>

          <div className="space-y-2">
            <Label>Icon URL</Label>
            <Input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="icons/category.png" className="font-mono text-xs" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="text-black" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleSubmit}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SubcategoryFormModal({
  open,
  setOpen,
  onSubmit,
  parentId,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (payload: CreateCategoryInput) => void;
  parentId: number;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setIconUrl("");
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      iconUrl: iconUrl.trim(),
      parentId,
      isActive: true,
      displayOrder: 0,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Add Subcategory</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Subcategory Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Car Parts" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional..." />
          </div>

          <div className="space-y-2">
            <Label>Icon URL</Label>
            <Input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="icons/subcategory.png" className="font-mono text-xs" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="default" onClick={handleSubmit}>Add Subcategory</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAlert({
  open,
  setOpen,
  onConfirm,
  itemName,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onConfirm: () => void;
  itemName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Deactivate {itemName}?</DialogTitle>
          <DialogDescription>
            This will deactivate the category (soft delete). You can re-enable it later using the toggle.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            <Trash2 className="mr-2 h-3 w-3" /> Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}