/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

// ─── 1. MAIN CATEGORY FORM ───
export function CategoryFormModal({ 
  open, setOpen, onSubmit, initialData 
}: { 
  open: boolean; setOpen: (v: boolean) => void; onSubmit: (data: any) => void; initialData?: any 
}) {
  const isEdit = !!initialData;
  const [name, setName] = useState(initialData?.name || "");
  
  const handleSubmit = () => {
    // In real app: Validate inputs
    onSubmit({ 
      id: initialData?.id || `CAT-${Math.floor(Math.random() * 1000)}`,
      name, 
      icon: "Box", // Dummy icon
      status: "Active",
      subcategories: initialData?.subcategories || [],
      attributes: initialData?.attributes || []
    });
    setOpen(false);
    setName("");
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
            <Label>Icon</Label>
            <Input placeholder="e.g. Car" className="font-mono text-xs" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="text-black" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="gold" onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 2. SUBCATEGORY FORM ───
export function SubcategoryFormModal({ 
  open, setOpen, onSubmit 
}: { 
  open: boolean; setOpen: (v: boolean) => void; onSubmit: (data: any) => void 
}) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    onSubmit({ id: `SUB-${Math.floor(Math.random() * 1000)}`, name, products: 0 });
    setOpen(false);
    setName("");
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="default" onClick={handleSubmit}>Add Subcategory</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 3. ATTRIBUTE FORM ───
export function AttributeFormModal({ 
  open, setOpen, onSubmit 
}: { 
  open: boolean; setOpen: (v: boolean) => void; onSubmit: (data: any) => void 
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Text");
  const [options, setOptions] = useState(""); // For Select/Radio

  const handleSubmit = () => {
    onSubmit({ 
      name, 
      type, 
      options: (type === "Select" || type === "Radio") ? options.split(",").map(s => s.trim()) : undefined,
      placeholder: type === "Text" ? "Enter value..." : undefined
    });
    setOpen(false);
    setName("");
    setOptions("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Define Attribute</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Attribute Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Screen Size" />
          </div>
          <div className="space-y-2">
            <Label>Input Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Text">Text Input</SelectItem>
                <SelectItem value="Number">Number Input</SelectItem>
                <SelectItem value="Select">Dropdown Select</SelectItem>
                <SelectItem value="Radio">Radio Buttons</SelectItem>
                <SelectItem value="ColorPicker">Color Picker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(type === "Select" || type === "Radio") && (
             <div className="space-y-2">
               <Label>Options (Comma separated)</Label>
               <Textarea 
                 value={options} 
                 onChange={(e) => setOptions(e.target.value)} 
                 placeholder="e.g. Small, Medium, Large" 
                 className="font-mono text-xs"
               />
             </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="default" onClick={handleSubmit}>Add Attribute</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 4. DELETE CONFIRMATION ───
export function DeleteAlert({ open, setOpen, onConfirm, itemName }: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Delete {itemName}?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will remove the item from the marketplace.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); setOpen(false); }}>
            <Trash2 className="mr-2 h-3 w-3" /> Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}