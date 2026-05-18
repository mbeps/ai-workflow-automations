import { describe, it, expect } from "vitest";
import { credentialSchema } from "@/schemas/credentials/credential-schema";
import { CredentialType } from "@prisma/client";

describe("Credential Schema", () => {
  it("should validate valid credential form values", () => {
    const result = credentialSchema.safeParse({
      name: "My Cred",
      type: CredentialType.OPENAI,
      value: "secret-key"
    });
    expect(result.success).toBe(true);
  });

  it("should fail validation with missing fields", () => {
    const result = credentialSchema.safeParse({
      name: "",
      type: CredentialType.OPENAI,
      value: ""
    });
    expect(result.success).toBe(false);
  });
});
