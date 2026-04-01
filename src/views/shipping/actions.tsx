"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck } from "lucide-react";
import { DeliveryProvider } from "./types";

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: DeliveryProvider) => void;
}

export function ManageProviderModal({ isOpen, onClose, onSave }: ProviderModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"integrated" | "manual">("manual");

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name,
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
      <DialogContent className="sm:max-w-[425px] bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck size={18} /> Add Logistics Partner
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input 
              placeholder="e.g. GIG Logistics" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Integration Type</Label>
            <Select value={type} onValueChange={(v: "integrated" | "manual") => setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual (Vendor manages waybill)</SelectItem>
                <SelectItem value="integrated">API Integrated (Auto-booking)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-zinc-900 text-white hover:bg-zinc-800">
            Add Partner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}