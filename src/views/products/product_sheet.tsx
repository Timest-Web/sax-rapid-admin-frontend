/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Sheet, SheetContent, SheetFooter,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Trash2, Save, Store} from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";
import Image from "next/image";

interface ProductSheetProps {
  product: any; 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductSheet({ product, open, onOpenChange }: ProductSheetProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!product) return null;

  const isPending = product.status === "Pending";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTitle></SheetTitle>
      <SheetContent className="w-100 sm:w-135 overflow-y-auto bg-white border-l border-zinc-200 p-0">
        
        {/* ─── 1. IMAGE HEADER ─── */}
        <div className="h-48 py-4 bg-zinc-100 flex items-center justify-center border-b border-zinc-200 relative">
           <Image src={product.image} alt={product.name} width={60} height={60} />
           <div className="absolute top-4 left-4">
              <StatusBadge status={product.status} />
           </div>
        </div>

        {/* ─── 2. CONTENT FORM ─── */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
               <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Product Name</Label>
               <Input 
                 defaultValue={product.name} 
                 className="font-display font-bold text-lg border-zinc-200 focus-visible:ring-sax-gold"
                 readOnly={!isEditing} 
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Price (₦)</Label>
                  <Input defaultValue={product.price} className="font-mono" readOnly={!isEditing} />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Stock Qty</Label>
                  <Input defaultValue={product.stock} className="font-mono" readOnly={!isEditing} />
               </div>
            </div>

            <div className="space-y-2">
               <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</Label>
               <Textarea 
                 className="h-24 resize-none text-xs" 
                 placeholder="Product description..."
                 defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
                 readOnly={!isEditing}
               />
            </div>
          </div>

          {/* ─── 3. VENDOR INFO BOX ─── */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white border border-zinc-200 rounded flex items-center justify-center text-zinc-400">
                   <Store size={18} />
                </div>
                <div>
                   <p className="text-xs font-bold text-zinc-900">{product.vendor}</p>
                   <p className="text-[10px] text-zinc-500 font-mono">ID: VND-8821</p>
                </div>
             </div>
             <Button variant="outline" size="sm" className="h-7 text-[10px]">View Store</Button>
          </div>

        </div>

        {/* ─── 4. ACTIONS FOOTER ─── */}
        <SheetFooter className="p-6 border-t border-zinc-200 bg-zinc-50">
          <div className="flex flex-col gap-3 w-full">
            
            {/* If Pending: Show Approve/Reject */}
            {isPending && (
               <div className="grid grid-cols-2 gap-3 mb-2">
                  <Button variant="outline" className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                     <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button variant="gold">
                     <CheckCircle className="mr-2 h-4 w-4" /> Approve Listing
                  </Button>
               </div>
            )}

            {/* General Actions */}
            <div className="flex gap-2 justify-between w-full">
               <Button 
                 variant="ghost" 
                 className="text-zinc-500"
                 onClick={() => setIsEditing(!isEditing)}
               >
                 <Save className="mr-2 h-4 w-4" /> {isEditing ? "Save Changes" : "Edit Details"}
               </Button>
               
               <Button variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                 <Trash2 className="mr-2 h-4 w-4" /> Remove Product
               </Button>
            </div>
          </div>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
}