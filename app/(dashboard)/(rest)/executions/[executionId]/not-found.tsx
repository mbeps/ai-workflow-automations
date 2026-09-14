import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

/**
 * Not-found page for execution dynamic route.
 *
 * @author Maruf Bepary
 */
export default function ExecutionNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-4 px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Execution Not Found</h1>
      <p className="text-muted-foreground text-sm max-w-md">
        The requested execution record does not exist or you do not have
        permission to view it.
      </p>
      <Button asChild>
        <Link href={ROUTES.EXECUTIONS.INDEX.path}>Back to Executions</Link>
      </Button>
    </div>
  );
}
