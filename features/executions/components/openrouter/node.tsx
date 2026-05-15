"use client";

import { CredentialType } from "@prisma/client";
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { getModelProviderLogo } from "@/features/credentials/models";
import { OPENROUTER_CHANNEL_NAME } from "@/inngest/channels/openrouter";
import type { OpenRouterFormValues } from "@/schemas/executions/ai-model-schemas";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { fetchOpenRouterRealtimeToken } from "./actions";
import { OpenRouterDialog } from "./dialog";

type OpenRouterNodeData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenRouterNodeType = Node<OpenRouterNodeData>;

export const OpenRouterNode = memo((props: NodeProps<OpenRouterNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENROUTER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenRouterRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: OpenRouterFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `nemotron-3: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <OpenRouterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={getModelProviderLogo(CredentialType.OPENROUTER)}
        name="OpenRouter"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenRouterNode.displayName = "OpenRouterNode";
