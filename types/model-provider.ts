import type { CredentialType } from "@prisma/client";

export interface ModelProvider {
  type: CredentialType;
  label: string;
  logo: string;
}
