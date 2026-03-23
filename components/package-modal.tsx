/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2 } from "lucide-react";

export function PackageModal({ initialData }: { initialData?: any }) {
  const [open, setOpen] = useState(false);
  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit2 size={14} />
          </Button>
        ) : (
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-3 w-3" /> Create Package
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Ad Package" : "Create Ad Package"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Package Name</Label>
            <Input
              defaultValue={initialData?.name}
              placeholder="e.g. Homepage Hero"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₦)</Label>
              <Input
                defaultValue={initialData?.price}
                className="font-mono"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (Days)</Label>
              <Select defaultValue={initialData?.duration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Placement Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Where does it show?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Homepage Carousel</SelectItem>
                <SelectItem value="category">Category Top Row</SelectItem>
                <SelectItem value="search">Search Results (Boost)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="gold" onClick={() => setOpen(false)}>
            Save Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
