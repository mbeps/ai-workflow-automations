import { CredentialType } from "@/generated/prisma";

export interface ModelProvider {
  type: CredentialType;
  label: string;
  logo: string;
}

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
];

export const getModelProviderLogo = (type: CredentialType): string => {
  return MODEL_PROVIDERS.find((p) => p.type === type)?.logo || "/logos/openai.svg";
};
