"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Truck } from "lucide-react";
import { DeliveryProvider } from "./types"; // Make sure to keep your actual import

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: DeliveryProvider) => void;
}

export function ManageProviderModal({ isOpen, onClose, onSave }: ProviderModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"integrated" | "manual">("manual");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      type,
      rating: 5.0, // Default for new providers
      activeShipments: 0,
      status: "active",
      logo: name.substring(0, 2).toUpperCase(),
    });
    
    // Reset and close
    setName("");
    setType("manual");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        
        {/* ─── MODAL HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Truck size={16} />
              </div>
              Add Logistics Partner
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Register a new delivery provider and configure their platform integration capabilities.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── FORM BODY ─── */}
        <form id="providerForm" onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Company Name */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Company Name <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input 
              placeholder="e.g. GIG Logistics" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          {/* Integration Type */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Integration Type <span className="text-[#D4AF37]">*</span>
            </Label>
            <Select value={type} onValueChange={(v: "integrated" | "manual") => setType(v)} required>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-[#D4AF37] transition-all rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual (Vendor manages waybill)</SelectItem>
                <SelectItem value="integrated">API Integrated (Auto-booking)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-zinc-500 mt-2 pl-1 leading-relaxed">
              Integrated partners will handle automated shipment creations instantly at checkout.
            </p>
          </div>
        </form>

        {/* ─── MODAL FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white">
          <Button 
            type="submit" 
            form="providerForm"
            disabled={!name.trim()}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            Add Partner
          </Button>
          <Button 
            type="button"
            variant="outline" 
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}