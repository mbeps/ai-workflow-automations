import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import type { NodeExecutor } from "@/types/node-executor";

type GoogleFormTriggerData = Record<string, unknown>;

/**
 * Inngest node executor for the Google Form trigger.
 * Publishes status updates and returns the context.
 * 
 * @author Maruf Bepary
 */
export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ nodeId, context, step, publish }) => {
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const result = await step.run("google-form-trigger", async () => context);

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
