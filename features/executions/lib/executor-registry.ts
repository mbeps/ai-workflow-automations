/**
 * Registry mapping node types to their executor implementations.
 * Provides centralized lookup for node executors during workflow execution.
 * Supports all trigger, AI, and messaging node types.
 *
 * @author Maruf Bepary
 */

import { NodeType } from "@prisma/client";
import { anthropicExecutor } from "@/features/executions/components/anthropic/executor";
import { discordExecutor } from "@/features/executions/components/discord/executor";
import { geminiExecutor } from "@/features/executions/components/gemini/executor";
import { httpRequestExecutor } from "@/features/executions/components/http-request/executor";
import { openAiExecutor } from "@/features/executions/components/openai/executor";
import { openRouterExecutor } from "@/features/executions/components/openrouter/executor";
import { slackExecutor } from "@/features/executions/components/slack/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import type { NodeExecutor } from "@/types/executions/node-executor";

/**
 * Complete mapping of all node types to their executor functions.
 * Each executor handles node-specific logic for the given node type.
 */
export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.OPENAI]: openAiExecutor,
  [NodeType.OPENROUTER]: openRouterExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.SLACK]: slackExecutor,
};

/**
 * Retrieves executor function for a given node type.
 * Throws error if no executor exists for the provided type.
 *
 * @param type - NodeType enum value
 * @returns Executor function for the node type
 */
export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
