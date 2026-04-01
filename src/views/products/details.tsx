/* eslint-disable react/no-unescaped-entities */
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  UploadCloud,
  Store,
  PackageSearch,
  Plus,
} from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";

// Import your actual dummy data
import { PRODUCTS } from "@/src/lib/dummy_data";

export default function ProductDetailsView() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // 1. Fetch the exact product from the dummy data
  const product = PRODUCTS.find((p) => String(p.id) === String(id));

  // 2. Handle "Not Found" State
  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center text-center p-6">
        <PackageSearch className="h-16 w-16 text-zinc-300 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 font-display uppercase tracking-widest mb-2">
          Product Not Found
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          The product with ID "{id}" does not exist or has been removed.
        </p>
        <Button asChild className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest h-11 px-8 rounded-xl transition-all">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  // Generate mock details for fields that might not be in the basic dummy data
  const sku = `PRD-${product.category.substring(0, 3).toUpperCase()}-${product.id.toString().padStart(4, '0')}`;
  const mockDesc = `Premium quality ${product.name}. This item is sourced directly from ${product.vendor} and meets all marketplace quality standards. Perfect for your everyday needs.`;
  
  // Clean up price string for input (e.g. "₦12,000" -> "12000")
  const cleanPrice = product.price.replace(/[^0-9.]/g, '');
  const salePrice = (Number(cleanPrice) * 0.9).toFixed(0); // Mock 10% off

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-16">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link
              href="/admin/products"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> PRODUCTS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">
              #{product.id}
            </span>
            <StatusBadge status={product.status} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-zinc-50">
            Cancel
          </Button>
          <Button size="sm" className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all rounded-lg shadow-sm">
            <Save className="mr-2 h-3.5 w-3.5" /> Save Changes
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── LEFT COLUMN: CORE INFO (8/12) ─── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. General Information */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  General Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Product Name <span className="text-[#D4AF37]">*</span>
                  </Label>
                  <Input
                    defaultValue={product.name}
                    className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Description
                  </Label>
                  <Textarea
                    defaultValue={mockDesc}
                    className="min-h-[120px] bg-zinc-50/50 border-zinc-200 text-sm leading-relaxed focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Product Category <span className="text-[#D4AF37]">*</span>
                  </Label>
                  <Select defaultValue={product.category.toLowerCase()}>
                    <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all rounded-lg">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={product.category.toLowerCase()}>{product.category}</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="home">Home & Kitchen</SelectItem>
                      <SelectItem value="groceries">Groceries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 2. Product Details (Pricing) */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Pricing Details
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Regular Price <span className="text-[#D4AF37]">*</span>
                    </Label>
                    <Input
                      defaultValue={cleanPrice}
                      type="number"
                      className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Sale Price
                    </Label>
                    <Input
                      defaultValue={salePrice}
                      type="number"
                      className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Sale Start Date
                    </Label>
                    <Input
                      type="date"
                      className="h-11 text-sm bg-zinc-50/50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg text-zinc-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Sale End Date
                    </Label>
                    <Input
                      type="date"
                      className="h-11 text-sm bg-zinc-50/50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg text-zinc-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Inventory */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Inventory
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      SKU / Barcode <span className="text-[#D4AF37]">*</span>
                    </Label>
                    <Input
                      defaultValue={sku}
                      className="h-11 font-mono text-xs uppercase bg-zinc-50/50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Weight (kg/lbs)
                    </Label>
                    <Input
                      defaultValue="1.5kg"
                      className="h-11 font-mono text-sm bg-zinc-50/50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Stock Status <span className="text-[#D4AF37]">*</span>
                    </Label>
                    <Select defaultValue={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                      <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all rounded-lg">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        <SelectItem value="on-backorder">On Backorder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Stock Quantity
                    </Label>
                    <Input
                      defaultValue={product.stock}
                      type="number"
                      className="h-11 font-mono text-sm bg-zinc-50/50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Attributes Options */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative flex items-center justify-between">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Attributes
                </h2>
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">
                  <Plus className="h-3 w-3 mr-1" /> Add Attribute
                </Button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Size
                  </Label>
                  <Input
                    placeholder="e.g. S, M, L, XL"
                    defaultValue="M, L, XL"
                    className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Color
                  </Label>
                  <Input
                    placeholder="e.g. Red, Blue, Black"
                    defaultValue="Black, White"
                    className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Length / Dimensions
                  </Label>
                  <Input
                    placeholder="e.g. 10x10x5 cm"
                    className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-all rounded-lg"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: MEDIA & STATUS (4/12) ─── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Vendor Association (Read-only for Admin) */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                Vendor Information
              </h3>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Store size={18} />
                </div>
                <div>
                  <span className="font-bold text-sm text-zinc-900 block font-display">
                    {product.vendor}
                  </span>
                  <Link href={`/admin/vendors`} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline">
                    View Store Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Status / Visibility */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Marketplace Visibility
              </h2>
              <div className="space-y-1.5">
                <Select defaultValue={product.status.toLowerCase()}>
                  <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-1 focus:ring-[#D4AF37] transition-all rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="text-emerald-600 font-bold">Approved (Live)</SelectItem>
                    <SelectItem value="pending" className="text-amber-600 font-bold">Pending Review</SelectItem>
                    <SelectItem value="rejected" className="text-rose-600 font-bold">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                  Changing this status will immediately affect the product's visibility on the customer storefront.
                </p>
              </div>
            </div>

            {/* Product Media (Featured & Gallery) */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
               <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Product Media
                </h2>
              </div>
              <div className="p-5 space-y-5">
                
                {/* Main Image Display */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Featured Image
                  </Label>
                  <div className="relative aspect-square w-full border border-zinc-200 rounded-xl overflow-hidden group bg-zinc-100 flex items-center justify-center">
                    {product.image ? (
                      <>
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill
                          className="object-cover object-center"
                        />
                        {/* Hover Overlay to Change Image */}
                        <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <Button variant="outline" className="bg-transparent border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-9">
                            Replace Image
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="h-10 w-10 text-zinc-300 mb-2" />
                        <span className="text-xs font-bold text-zinc-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-zinc-100">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">
                    Product Gallery
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-100 hover:border-[#D4AF37] transition-all group">
                      <UploadCloud className="h-5 w-5 text-zinc-400 group-hover:text-[#D4AF37]" />
                    </div>
                    {/* Mock previously uploaded images */}
                    <div className="aspect-square bg-zinc-100 rounded-lg border border-zinc-200 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-zinc-300" />
                    </div>
                    <div className="aspect-square bg-zinc-100 rounded-lg border border-zinc-200 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-zinc-300" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}