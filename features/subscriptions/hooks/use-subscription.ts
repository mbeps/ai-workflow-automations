import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";

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
