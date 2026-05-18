import { CredentialType } from "@prisma/client";
import type { ModelProvider } from "@/types/model-provider";

/**
 * Metadata for supported AI model providers (OpenAI, Anthropic, Gemini, OpenRouter).
 * Maps credential types to display labels and logos for the credential selector UI.
 * 
 * @author Maruf Bepary
 */
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

/**
 * Retrieves the logo URL for a given credential type.
 * Returns OpenAI logo as fallback if type not found.
 * Used to display provider branding in credential forms and lists.
 * 
 * @param type - The credential type to look up.
 * @returns Logo path for the credential provider.
 * @author Maruf Bepary
 */
export const getModelProviderLogo = (type: CredentialType): string => {
  return (
    MODEL_PROVIDERS.find((p) => p.type === type)?.logo || "/logos/openai.svg"
  );
};
