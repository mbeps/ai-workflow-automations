import { CredentialType } from "@prisma/client";
import type { ModelProvider } from "@/types/model-provider";

export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    type: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/logos/openai.svg",
  },
  {
    type: CredentialType.ANTHROPIC,
    label: "Anthropic",
    logo: "/logos/anthropic.svg",
  },
  {
    type: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/logos/gemini.svg",
  },
  {
    type: CredentialType.OPENROUTER,
    label: "OpenRouter",
    logo: "/logos/openrouter.svg",
  },
];

export const getModelProviderLogo = (type: CredentialType): string => {
  return (
    MODEL_PROVIDERS.find((p) => p.type === type)?.logo || "/logos/openai.svg"
  );
};
