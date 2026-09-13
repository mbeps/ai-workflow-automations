import { CredentialType } from "@prisma/client";
import { ASSETS } from "@/config/assets";
import type { ModelProvider } from "@/types/credentials/model-provider";

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
    logo: ASSETS.LOGOS.OPENAI.path,
  },
  {
    type: CredentialType.ANTHROPIC,
    label: "Anthropic",
    logo: ASSETS.LOGOS.ANTHROPIC.path,
  },
  {
    type: CredentialType.GEMINI,
    label: "Gemini",
    logo: ASSETS.LOGOS.GEMINI.path,
  },
  {
    type: CredentialType.OPENROUTER,
    label: "OpenRouter",
    logo: ASSETS.LOGOS.OPENROUTER.path,
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
    MODEL_PROVIDERS.find((p) => p.type === type)?.logo ||
    ASSETS.LOGOS.OPENAI.path
  );
};
