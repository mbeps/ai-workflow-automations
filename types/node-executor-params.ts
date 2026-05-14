import type { Realtime } from "@inngest/realtime";
import type { Inngest, GetStepTools } from "inngest";
import type { WorkflowContext } from "./workflow-context";
import type { StepTools } from "./step-tools";

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  userId: string;
  context: WorkflowContext;
  step: StepTools;
  publish: Realtime.PublishFn;
}
