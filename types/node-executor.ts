import type { NodeExecutorParams } from "./node-executor-params";
import type { WorkflowContext } from "./workflow-context";

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;
