import type { Realtime } from "@inngest/realtime";
import type { GetStepTools, Inngest } from "inngest";
import type { StepTools } from "./step-tools";
import type { WorkflowContext } from "./workflow-context";

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  userId: string;
  context: WorkflowContext;
  step: StepTools;
  publish: Realtime.PublishFn;
}
