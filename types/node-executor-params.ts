import type { StepTools } from "./step-tools";
import type { WorkflowContext } from "./workflow-context";

/**
 * Parameters passed to a node executor function during workflow execution.
 *
 * @author Maruf Bepary
 */
export interface NodeExecutorParams<TData = Record<string, unknown>> {
  /** Type-specific configuration data for the node. */
  data: TData;
  /** Unique identifier of the node instance within the workflow. */
  nodeId: string;
  /** Unique identifier of the user who owns the workflow. */
  userId: string;
  /** The shared context object containing outputs from previously executed nodes. */
  context: WorkflowContext;
  /** Inngest step utilities for creating durable checkpoints and retries. */
  step: StepTools;
  /** Utility function to publish real-time execution status updates. */
  publish: any;
}
