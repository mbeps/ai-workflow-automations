"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

/**
 * Root error boundary component catching runtime exceptions.
 *
 * @author Maruf Bepary
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-4 px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        Something went wrong!
      </h1>
      <p className="text-muted-foreground text-sm max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
