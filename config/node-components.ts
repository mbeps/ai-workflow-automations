import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAiNode } from "@/features/executions/components/openai/node";
import { OpenRouterNode } from "@/features/executions/components/openrouter/node";
import { SlackNode } from "@/features/executions/components/slack/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";

/**
 * Registry mapping database NodeType enums to their respective React Flow component implementations.
 * This configuration is critical for the visual workflow editor as it determines how each node
 * type is rendered on the infinite canvas.
 *
 * @author Maruf Bepary
 */
export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.OPENROUTER]: OpenRouterNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;

/**
 * Type representing the keys of the registered node components.
 */
export type RegisteredNodeType = keyof typeof nodeComponents;
