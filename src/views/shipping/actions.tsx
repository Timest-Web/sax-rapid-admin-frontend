/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Truck } from "lucide-react";

export type ShippingZone = {
  id: string;
  name: string; // e.g., "Lagos Island"
  baseFee: number;
  minDays: number;
  maxDays: number;
  status: "active" | "inactive";
};

export type DeliveryProvider = {
  id: string;
  name: string;
  type: "integrated" | "manual"; // API connected or manual tracking
  rating: number;
  activeShipments: number;
  status: "active" | "inactive";
  logo: string; // Initials
};

interface ZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: ShippingZone) => void;
}

export function ManageZoneModal({ isOpen, onClose, onSave }: ZoneModalProps) {
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const handleSubmit = () => {
    if (!name || !fee) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name,
      baseFee: Number(fee),
      minDays: Number(min) || 1,
      maxDays: Number(max) || 3,
      status: "active",
    });
    onClose();
    // Reset form
    setName(""); setFee(""); setMin(""); setMax("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin size={18} /> Configure Delivery Zone
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Zone Name / Region</Label>
            <Input placeholder="e.g. Lagos Mainland" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Base Shipping Fee (₦)</Label>
            <Input type="number" placeholder="1500" value={fee} onChange={(e) => setFee(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Days</Label>
              <Input type="number" placeholder="1" value={min} onChange={(e) => setMin(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Max Days</Label>
              <Input type="number" placeholder="3" value={max} onChange={(e) => setMax(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-zinc-900">Save Zone</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- PROVIDER MODAL ---
interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: DeliveryProvider) => void;
}

export function ManageProviderModal({ isOpen, onClose, onSave }: ProviderModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"integrated" | "manual">("manual");

  const handleSubmit = () => {
    if (!name) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      rating: 5.0,
      activeShipments: 0,
      status: "active",
      logo: name.substring(0, 2).toUpperCase(),
    });
    onClose();
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25 bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck size={18} /> Add Logistics Partner
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input placeholder="e.g. GIG Logistics" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Integration Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
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
          <Button onClick={handleSubmit} className="bg-zinc-900">Add Partner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}