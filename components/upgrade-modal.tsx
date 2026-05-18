"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * A dialog prompting users to subscribe to a Pro plan when they attempt to use premium features.
 * 
 * @author Maruf Bepary
 * @param open Whether the modal is visible.
 * @param onOpenChange Callback triggered when the modal visibility changes.
 * @returns The rendered upgrade modal component.
 */
export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
          <AlertDialogDescription>
            You need an active subscription to perform this action. Upgrade to
            Pro to unlock all features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              authClient.checkout({
                slug: env.NEXT_PUBLIC_POLAR_PRODUCT_SLUG as string,
              })
            }
          >
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
