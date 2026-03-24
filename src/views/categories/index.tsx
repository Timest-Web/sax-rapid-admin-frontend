/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Layers, ListFilter } from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; 
import { CATEGORIES } from "@/src/lib/dummy_data";
import { CategoryListItem } from "./categories_list_item";
import { AttributeFormModal, CategoryFormModal, DeleteAlert, SubcategoryFormModal } from "./categories_action";

export default function CategoriesPage() {
  // ─── LOCAL STATE FOR INTERACTIVITY ───
  const [categories, setCategories] = useState(CATEGORIES);
  const [selectedCatId, setSelectedCatId] = useState(CATEGORIES[0].id);
  
  // Modal States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);

  // Derived state for the active view
  const selectedCat = categories.find(c => c.id === selectedCatId) || categories[0];

  // ─── HANDLERS ───

  // 1. Categories
  const handleAddCategory = (newCat: any) => {
    setCategories([...categories, newCat]);
    setSelectedCatId(newCat.id);
    toast.success("Category created successfully");
  };

  const handleEditCategory = (updatedCat: any) => {
    setCategories(categories.map(c => c.id === updatedCat.id ? updatedCat : c));
    setEditingCat(null); // Clear edit mode
    toast.success("Category updated");
  };

  const handleDeleteCategory = () => {
    const newCats = categories.filter(c => c.id !== selectedCatId);
    setCategories(newCats);
    if(newCats.length > 0) setSelectedCatId(newCats[0].id);
    toast.success("Category deleted");
  };

  const toggleCategoryStatus = () => {
    const newStatus = selectedCat.status === "Active" ? "Inactive" : "Active";
    setCategories(categories.map(c => c.id === selectedCatId ? { ...c, status: newStatus } : c));
  };

  // 2. Subcategories
  const handleAddSubcategory = (newSub: any) => {
    const updatedCat = {
      ...selectedCat,
      subcategories: [...selectedCat.subcategories, newSub]
    };
    setCategories(categories.map(c => c.id === selectedCatId ? updatedCat : c));
    toast.success("Subcategory added");
  };

  // 3. Attributes
  const handleAddAttribute = (newAttr: any) => {
    const updatedCat = {
      ...selectedCat,
      attributes: [...selectedCat.attributes, newAttr]
    };
    setCategories(categories.map(c => c.id === selectedCatId ? updatedCat : c));
    toast.success("Attribute added");
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Categories
          </h1>
        </div>
        <Button variant="default" size="sm" onClick={() => { setEditingCat(null); setIsCatModalOpen(true); }}>
          <Plus className="mr-2 h-3 w-3" /> New Category
        </Button>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* ─── LEFT SIDEBAR: LIST ─── */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg shadow-sm flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
               <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Main Categories</h3>
               <span className="bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                 {categories.length}
               </span>
            </div>
            <div className="flex-1 overflow-y-auto">
               {categories.map((cat) => (
                 <CategoryListItem
                   key={cat.id} 
                   category={cat} 
                   isSelected={selectedCatId === cat.id}
                   onClick={() => setSelectedCatId(cat.id)} 
                 />
               ))}
            </div>
          </div>

          {/* ─── RIGHT PANEL: DETAILS ─── */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-zinc-100 rounded-lg flex items-center justify-center text-2xl font-bold text-zinc-400 border border-zinc-200">
                     {selectedCat.name.charAt(0)}
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-zinc-900 font-display">{selectedCat.name}</h2>
                     <p className="text-xs text-zinc-400 font-mono mt-1">ID: {selectedCat.id}</p>
                     <div className="mt-2 flex items-center gap-3">
                        <StatusBadge status={selectedCat.status} />
                        <div className="flex items-center gap-2">
                           <Label className="text-[10px] uppercase font-bold text-zinc-500 cursor-pointer" htmlFor="visible-switch">Enabled</Label>
                           <Switch 
                              id="visible-switch"
                              checked={selectedCat.status === "Active"} 
                              onCheckedChange={toggleCategoryStatus} 
                           />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingCat(selectedCat); setIsCatModalOpen(true); }}>
                     <Edit2 className="mr-2 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setIsDeleteOpen(true)}>
                     <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            {/* Content Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
               
               {/* 1. Subcategories Section */}
               <section>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2 text-zinc-900">
                        <Layers size={16} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Subcategories</h3>
                     </div>
                     <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setIsSubModalOpen(true)}>
                        <Plus className="mr-1 h-3 w-3" /> Add Subcategory
                     </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {selectedCat.subcategories.length > 0 ? selectedCat.subcategories.map((sub: any) => (
                        <div key={sub.id} className="p-3 border border-zinc-200 rounded bg-zinc-50/50 flex justify-between items-center hover:border-zinc-300 transition-colors group">
                           <span className="text-sm font-medium text-zinc-700">{sub.name}</span>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-400">{sub.products} items</span>
                              <button className="opacity-0 group-hover:opacity-100 text-rose-500"><Trash2 size={12}/></button>
                           </div>
                        </div>
                     )) : (
                        <p className="col-span-2 text-center text-xs text-zinc-400 italic py-4">No subcategories yet.</p>
                     )}
                  </div>
               </section>

               <div className="h-px bg-zinc-100 w-full" />

               {/* 2. Attributes Section */}
               <section>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2 text-zinc-900">
                        <ListFilter size={16} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Attributes (Filters)</h3>
                     </div>
                     <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setIsAttrModalOpen(true)}>
                        <Plus className="mr-1 h-3 w-3" /> Add Attribute
                     </Button>
                  </div>

                  <div className="border border-zinc-200 rounded-lg overflow-hidden">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                           <tr>
                              <th className="p-3 font-mono text-[10px] text-zinc-500 uppercase font-bold">Attribute Name</th>
                              <th className="p-3 font-mono text-[10px] text-zinc-500 uppercase font-bold">Input Type</th>
                              <th className="p-3 font-mono text-[10px] text-zinc-500 uppercase font-bold">Options / Config</th>
                              <th className="p-3 w-10"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 bg-white">
                           {selectedCat.attributes.length > 0 ? selectedCat.attributes.map((attr: any, idx: number) => (
                              <tr key={idx} className="hover:bg-zinc-50">
                                 <td className="p-3 font-bold text-zinc-800">{attr.name}</td>
                                 <td className="p-3 text-zinc-500 text-xs font-mono">
                                    <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{attr.type}</span>
                                 </td>
                                 <td className="p-3 text-xs text-zinc-600 font-mono">
                                    {attr.options ? attr.options.join(", ") : attr.unit ? `Unit: ${attr.unit}` : attr.placeholder || "-"}
                                 </td>
                                 <td className="p-3 text-right">
                                    <button className="text-zinc-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                 </td>
                              </tr>
                           )) : (
                              <tr>
                                <td colSpan={4} className="p-6 text-center text-xs text-zinc-400 italic">No attributes defined.</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </section>

            </div>

          </div>

        </div>

        {/* ─── MODALS ─── */}
        <CategoryFormModal 
          open={isCatModalOpen} 
          setOpen={setIsCatModalOpen} 
          onSubmit={editingCat ? handleEditCategory : handleAddCategory}
          initialData={editingCat}
        />
        <SubcategoryFormModal 
          open={isSubModalOpen} 
          setOpen={setIsSubModalOpen} 
          onSubmit={handleAddSubcategory} 
        />
        <AttributeFormModal 
          open={isAttrModalOpen} 
          setOpen={setIsAttrModalOpen} 
          onSubmit={handleAddAttribute} 
        />
        <DeleteAlert 
          open={isDeleteOpen} 
          setOpen={setIsDeleteOpen} 
          onConfirm={handleDeleteCategory} 
          itemName={selectedCat.name} 
        />

      </main>
    </div>
  );
}