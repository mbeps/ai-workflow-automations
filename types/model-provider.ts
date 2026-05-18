import type { CredentialType } from "@prisma/client";

/**
 * Metadata for an AI model provider.
 *
 * @author Maruf Bepary
 */
export interface ModelProvider {
  /** The unique identifier for the provider type. */
  type: CredentialType;
  /** Human-readable display name of the provider. */
  label: string;
  /** URL or identifier for the provider's logo asset. */
  logo: string;
}
