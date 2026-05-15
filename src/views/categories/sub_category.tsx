/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateCategoryInput } from "@/src/features/categories/api";

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

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      parentId,
      isActive: true,
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="default" onClick={handleSubmit}>Add Subcategory</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}