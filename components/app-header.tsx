import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Renders the application's top navigation header, containing common actions and a sidebar trigger.
 * 
 * @author Maruf Bepary
 * @returns The rendered header component.
 */
export const AppHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
    </header>
  );
};
