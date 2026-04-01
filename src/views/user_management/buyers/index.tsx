"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./column";
import { BUYERS } from "@/src/lib/dummy_data";
import { StatCard } from "@/components/cards/stat-card";
import { Users, UserPlus } from "lucide-react";

// --- Dialog & Form Imports ---
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BuyersView() {
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock Form Submission
  const handleSaveBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your save logic here (e.g., API call)
    console.log("New Buyer saved!");
    setIsAddModalOpen(false); // Close modal after saving
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <PageHeader
        title="User Management / Buyers"
        actionLabel="Add New Buyer"
        // Triggers the modal to open
        onAction={() => setIsAddModalOpen(true)}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* ─── METRICS ROW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Buyers"
            value="12,450"
            variant="gold"
            icon={Users}
          />
          <StatCard
            label="New This Month"
            value="+145"
            variant="emerald"
            icon={Users}
          />
          <StatCard
            label="Active Now"
            value="842"
            variant="cyan"
            icon={Users}
          />
        </div>

        {/* ─── BUYERS TABLE ─── */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-4">
          <DataTable columns={columns} data={BUYERS} />
        </div>
      </main>

      {/* ─── ADD BUYER MODAL (Black & Gold Theme) ─── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
          
          {/* Modal Header */}
          <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
            
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <UserPlus size={16} />
                </div>
                Create New Buyer
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
                Enter the details of the new buyer below. They will receive an email invitation to set up their password and verify their account.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveBuyer} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  First Name <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Last Name <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  required 
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Email Address <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                required 
                className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg" 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Phone Number
              </Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+27 12 345 6789" 
                className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg" 
              />
            </div>

            {/* Modal Footer */}
            <DialogFooter className="pt-6 mt-2 border-t border-zinc-100 sm:justify-between flex-row-reverse">
              <Button 
                type="submit" 
                className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11 transition-all duration-300 shadow-md"
              >
                Save Buyer
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddModalOpen(false)} 
                className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}