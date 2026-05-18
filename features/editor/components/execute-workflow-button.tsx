/**
 * Button component to trigger workflow execution via Inngest.
 * Appears in the editor canvas (bottom-center panel) only when a manual trigger node exists.
 * Disabled during execution; shows loading state via isPending.
 * 
 * @author Maruf Bepary
 */

import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  );
};
