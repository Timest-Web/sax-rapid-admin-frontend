import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-obsidian-800 font-sans antialiased">
          <AppSidebar />
          <div className="flex flex-1 flex-col min-w-0">{children}</div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
