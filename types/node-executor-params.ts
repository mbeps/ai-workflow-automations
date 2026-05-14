import type { StepTools } from "./step-tools";
import type { WorkflowContext } from "./workflow-context";

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  userId: string;
  context: WorkflowContext;
  step: StepTools;
  publish: any;
}
