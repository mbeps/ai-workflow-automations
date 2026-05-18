import type { NodeExecutorParams } from "./node-executor-params";
import type { WorkflowContext } from "./workflow-context";

/**
 * Signature for a node executor function.
 * Processes node-specific logic and returns the updated workflow context.
 *
 * @author Maruf Bepary
 */
export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;
