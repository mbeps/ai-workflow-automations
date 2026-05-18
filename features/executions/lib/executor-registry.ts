/**
 * Registry mapping node types to their executor implementations.
 * Provides centralized lookup for node executors during workflow execution.
 * Supports all trigger, AI, and messaging node types.
 *
 * @author Maruf Bepary
 */

import { NodeType } from "@prisma/client";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import type { NodeExecutor } from "@/types/node-executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { discordExecutor } from "../components/discord/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { openAiExecutor } from "../components/openai/executor";
import { openRouterExecutor } from "../components/openrouter/executor";
import { slackExecutor } from "../components/slack/executor";

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
