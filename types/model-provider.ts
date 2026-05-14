import { CredentialType } from "@/generated/prisma";

export interface ModelProvider {
  type: CredentialType;
  label: string;
  logo: string;
}
