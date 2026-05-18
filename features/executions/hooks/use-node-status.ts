/**
 * Custom hook for real-time node execution status updates via Inngest.
 * Subscribes to Inngest Realtime channels and filters messages by nodeId.
 * Maintains a local state updated with latest status for each node.
 *
 * @author Maruf Bepary
 */

import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

/**
 * Configuration options for useNodeStatus hook.
 *
 * @property nodeId - Target node identifier to track
 * @property channel - Inngest Realtime channel name
 * @property topic - Inngest Realtime topic within channel
 * @property refreshToken - Function that returns valid subscription token
 */
interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

/**
 * Subscribes to real-time status updates for a specific execution node.
 * Filters Inngest messages by channel, topic, and nodeId, maintaining latest status.
 * Automatically re-subscribes when token expires via refreshToken callback.
 *
 * @param options - UseNodeStatusOptions configuration
 * @returns Current status state ('initial', 'running', 'success', 'failed')
 */
export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    // Find the latest message for this node
    const latestMessage = data
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (latestMessage?.kind === "data") {
      setStatus(latestMessage.data.status as NodeStatus);
    }
  }, [data, nodeId, channel, topic]);

  return status;
}
