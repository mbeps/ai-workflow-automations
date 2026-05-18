import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";

/**
 * Hook to manage the state and logic for the premium upgrade modal.
 * It provides a handler to intercept tRPC FORBIDDEN errors and automatically
 * show the upgrade modal.
 *
 * @returns An object containing the error handler and the modal component.
 * @author Maruf Bepary
 */
export const useUpgradeModal = () => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return { handleError, modal };
};
