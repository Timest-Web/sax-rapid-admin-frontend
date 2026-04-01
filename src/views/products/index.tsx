"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { productColumns } from "./column";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  UploadCloud,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { PRODUCTS } from "@/src/lib/dummy_data";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Dialog & Form Imports ---
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductsView() {
  const pendingProducts = PRODUCTS.filter((p) => p.status === "Pending");

  // State for Filters
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  // Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Mock Form Submission
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Product Saved!");
    // Reset state & close
    setUploadedImage(null);
    setIsAddProductModalOpen(false);
  };

  // Mock Image Upload Handler
  const handleImageUpload = () => {
    // In reality, this would open a file picker. We'll just mock it.
    setUploadedImage("mock-image-uploaded");
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Products
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider"
          >
            Export List
          </Button>
          {/* Trigger Modal on Click */}
          <Button
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
            onClick={() => setIsAddProductModalOpen(true)}
          >
            <Plus className="mr-2 h-3.5 w-3.5" /> Add New Product
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* ─── STATS OVERVIEW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Inventory"
            value="45,200"
            icon={Package}
            variant="gold"
          />
          <StatCard
            label="Moderation Queue"
            value="12"
            icon={AlertTriangle}
            variant="rose"
          />
          <StatCard
            label="Live Products"
            value="44,800"
            icon={CheckCircle2}
            variant="emerald"
          />
        </div>

        {/* ─── MAIN TABS & FILTERS ─── */}
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full flex flex-col">
            <div className="flex items-center justify-between">
              <FilterTabs
                tabs={[
                  {
                    value: "all",
                    label: "All Inventory",
                    count: 45,
                    variant: "emerald",
                  },
                  {
                    value: "pending",
                    label: "Pending",
                    count: pendingProducts.length,
                    variant: "amber",
                  },
                  {
                    value: "rejected",
                    label: "Rejected",
                    count: 9,
                    variant: "rose",
                  },
                ]}
              />
            </div>

            <div className="mt-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              {/* FILTER BAR */}
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-wrap gap-3 items-center">
                <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
                  <Filter className="mr-2 h-3.5 w-3.5" /> Filters:
                </div>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[150px] h-9 text-xs font-medium bg-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food & Groceries</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={stock} onValueChange={setStock}>
                  <SelectTrigger className="w-[140px] h-9 text-xs font-medium bg-white">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Stock</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-[140px] h-9 text-xs font-medium bg-white">
                    <SelectValue placeholder="Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Type</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[140px] h-9 text-xs font-medium bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TABLE CONTENT */}
              <TabsContent value="all" className="m-0">
                <DataTable columns={productColumns} data={PRODUCTS} />
              </TabsContent>

              <TabsContent value="pending" className="m-0">
                <DataTable columns={productColumns} data={pendingProducts} />
              </TabsContent>

              <TabsContent value="rejected" className="m-0">
                <div className="p-12 text-center text-zinc-400 font-mono text-sm uppercase tracking-widest">
                  No rejected items in history.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      {/* ─── ADD PRODUCT MODAL (Black & Gold Theme) ─── */}
      <Dialog
        open={isAddProductModalOpen}
        onOpenChange={(open) => {
          setIsAddProductModalOpen(open);
          if (!open) setUploadedImage(null); // Reset image on close
        }}
      >
        <DialogContent className="sm:max-w-[600px] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Modal Header (Fixed) */}
          <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Package size={16} />
                </div>
                Add New Product
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
                Enter the product details below. If moderation is required, it
                will be added to the pending queue for review.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Body (Scrollable) */}
          <form
            id="addProductForm"
            onSubmit={handleSaveProduct}
            className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1"
          >
            {/* Image Upload Area */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Product Image <span className="text-[#D4AF37]">*</span>
              </Label>

              {!uploadedImage ? (
                <div
                  onClick={handleImageUpload}
                  className="border-2 border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 hover:border-[#D4AF37] transition-all rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="h-10 w-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <UploadCloud className="h-4 w-4 text-zinc-400 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-zinc-600">
                    Click to upload or drag & drop
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1.5 font-mono uppercase tracking-widest">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                </div>
              ) : (
                <div className="relative border border-zinc-200 bg-zinc-100 rounded-xl h-36 flex flex-col items-center justify-center overflow-hidden group">
                  {/* Mock Image Placeholder */}
                  <ImageIcon className="h-12 w-12 text-zinc-300" />
                  <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
                    product_image.jpg
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-zinc-900/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleImageUpload}
                      className="bg-transparent border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs uppercase tracking-widest font-bold h-8"
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                      }}
                      className="h-8 w-8 bg-red-500 hover:bg-red-600 rounded-md"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="productName"
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
              >
                Product Name <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                id="productName"
                placeholder="e.g. Sony WH-1000XM5 Headphones"
                required
                className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="sku"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                >
                  SKU / Barcode <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  id="sku"
                  placeholder="AUD-SNY-XM5"
                  required
                  className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="price"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                >
                  Price (₦/R) <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  required
                  className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="stockQty"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                >
                  Stock Quantity <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  id="stockQty"
                  type="number"
                  placeholder="e.g. 50"
                  required
                  className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Category <span className="text-[#D4AF37]">*</span>
                </Label>
                <Select required>
                  <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all rounded-lg">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="apparel">Apparel</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                    <SelectItem value="beauty">Beauty & Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
              >
                Product Description
              </Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Briefly describe the product features..."
                className="w-full p-3 bg-zinc-50/50 border border-zinc-200 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg resize-none custom-scrollbar"
              />
            </div>
          </form>

          {/* Modal Footer (Fixed) */}
          <div className="p-6 pt-4 border-t border-zinc-100 bg-white shrink-0">
            <DialogFooter className="sm:justify-between flex-row-reverse">
              <Button
                type="submit"
                form="addProductForm"
                className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11 transition-all duration-300 shadow-md"
              >
                Create Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddProductModalOpen(false)}
                className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
              >
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
