"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, ShieldAlert, Fingerprint, Lock } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { roleColumns, loginColumns } from "./column";
import { RoleEditorModal, AdminRole, LoginSession } from "./actions";

// --- DUMMY DATA ---
const INITIAL_ROLES: AdminRole[] = [
  { id: "1", name: "Super Admin", usersCount: 2, permissions: ["view_dashboard", "manage_users", "system_settings"], status: "active" },
  { id: "2", name: "Support Agent", usersCount: 12, permissions: ["view_dashboard", "manage_users"], status: "active" },
  { id: "3", name: "Finance Manager", usersCount: 3, permissions: ["manage_finance"], status: "active" },
];

const RECENT_LOGINS: LoginSession[] = [
  { id: "1", user: "Admin User", role: "Super Admin", ip: "102.33.21.4", location: "Lagos, NG", device: "MacBook Pro", status: "success", timestamp: "Just now" },
  { id: "2", user: "Sarah Smith", role: "Support Agent", ip: "197.210.44.12", location: "Abuja, NG", device: "Windows PC", status: "success", timestamp: "12 mins ago" },
  { id: "3", user: "Unknown", role: "N/A", ip: "45.12.33.11", location: "Moscow, RU", device: "Linux Bot", status: "failed", timestamp: "1 hour ago" },
  { id: "4", user: "John Doe", role: "Finance Manager", ip: "102.44.11.2", location: "Accra, GH", device: "iPhone 14", status: "success", timestamp: "2 hours ago" },
];

export default function SecurityView() {
  const [roles, setRoles] = useState<AdminRole[]>(INITIAL_ROLES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRole = (newRole: AdminRole) => {
    setRoles([...roles, newRole]);
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Security & Access
          </h1>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Admin Users" value="17" icon={Fingerprint} variant="default" />
          <StatCard label="2FA Enforced" value="On" icon={Lock} variant="emerald" />
          <StatCard label="Failed Attempts (24h)" value="5" icon={ShieldAlert} variant="rose" />
        </div>

        {/* TABS */}
        <Tabs defaultValue="roles" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                { value: "roles", label: "Role Management", count: roles.length, variant: "default" },
                { value: "logins", label: "Login Logs", count: RECENT_LOGINS.length, variant: "indigo" },
                { value: "settings", label: "Security Policies", count: 0, variant: "amber" },
              ]}
            />
          </div>

          {/* TAB 1: ROLES */}
          <TabsContent value="roles">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)} className="bg-zinc-900 hover:bg-zinc-800 text-xs">
                  <Plus size={16} className="mr-2" /> Add New Role
                </Button>
              </div>
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable columns={roleColumns} data={roles} />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: LOGINS */}
          <TabsContent value="logins">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={loginColumns} data={RECENT_LOGINS} />
            </div>
          </TabsContent>

          {/* TAB 3: SETTINGS */}
          <TabsContent value="settings">
             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 2FA Policy */}
                <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">Enforce Two-Factor Auth</h3>
                                <p className="text-xs text-zinc-500">Require 2FA for all admin roles</p>
                            </div>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <p className="text-xs text-zinc-400">When enabled, all staff members must configure an authenticator app (Google Auth or Authy) before they can access the dashboard.</p>
                </div>

                {/* Session Timeout */}
                <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">Strict Session Timeout</h3>
                                <p className="text-xs text-zinc-500">Auto-logout after inactivity</p>
                            </div>
                        </div>
                        <Switch />
                    </div>
                     <p className="text-xs text-zinc-400">Automatically logs out users after 15 minutes of inactivity to prevent unauthorized access on unattended devices.</p>
                </div>

             </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ROLE MODAL */}
      <RoleEditorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddRole} 
      />

    </div>
  );
}