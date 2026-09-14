import { CredentialType } from "@prisma/client";
import { z } from "zod";

/**
 * Schema for credential form validation.
 * Used in the UI for creating and editing API credentials.
 * @author Maruf Bepary
 */
export const credentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

export type CredentialFormValues = z.infer<typeof credentialSchema>;
