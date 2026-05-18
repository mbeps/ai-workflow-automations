import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";

/**
 * Hook for fetching the Polar.sh subscription status.
 * 
 * @author Maruf Bepary
 */
export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      if (env.NEXT_PUBLIC_ENABLE_POLAR !== "true") {
        return null;
      }
      const { data } = await authClient.customer.state();
      return data;
    },
    enabled: env.NEXT_PUBLIC_ENABLE_POLAR === "true",
  });
};

/**
 * Hook for checking if the user has an active Polar.sh subscription.
 * Returns active status and the first active subscription details.
 * 
 * @author Maruf Bepary
 */
export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  if (env.NEXT_PUBLIC_ENABLE_POLAR !== "true") {
    return {
      hasActiveSubscription: true,
      subscription: null,
      isLoading: false,
      ...rest,
    };
  }

  const hasActiveSubscription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    subscription: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
