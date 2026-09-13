import { Loader2Icon } from "lucide-react";

/**
 * Root loading component for global Suspense fallback.
 *
 * @author Maruf Bepary
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}
