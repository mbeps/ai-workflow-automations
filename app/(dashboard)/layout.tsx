import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * Dashboard layout component.
 * Provides the sidebar navigation and main content area for authenticated dashboard pages.
 * 
 * @author Maruf Bepary
 * @param props - Component props.
 * @param props.children - Main content to be rendered within the dashboard area.
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
