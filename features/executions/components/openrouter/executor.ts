import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { openrouterChannel } from "@/inngest/channels/openrouter";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import type { NodeExecutor } from "@/types/node-executor";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type OpenRouterData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openRouterExecutor: NodeExecutor<OpenRouterData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await publish(
    openrouterChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      openrouterChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenRouter node: Variable name is missing");
  }

  if (!data.credentialId) {
    await publish(
      openrouterChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenRouter node: Credential is required");
  }

  if (!data.userPrompt) {
    await publish(
      openrouterChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenRouter node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId,
      },
    });
  });

  if (!credential) {
    await publish(
      openrouterChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenRouter node: Credential not found");
  }

  const openrouter = createOpenRouter({
    apiKey: decrypt(credential.value),
  });

  try {
    const { steps } = await step.ai.wrap(
      "openrouter-generate-text",
      generateText,
      {
        model: openrouter("nvidia/nemotron-3-super-120b-a12b:free"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      openrouterChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      openrouterChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
