import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

/**
 * Root 404 page component for unmatched paths.
 *
 * @author Maruf Bepary
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-4 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground text-sm max-w-md">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Button asChild>
        <Link href={ROUTES.WORKFLOWS.INDEX.path}>Return to Workflows</Link>
      </Button>
    </div>
  );
}
