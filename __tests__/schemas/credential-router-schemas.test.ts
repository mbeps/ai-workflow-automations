import { describe, it, expect } from "vitest";
import { 
  credentialIdSchema, 
  credentialUpsertSchema, 
  credentialUpdateSchema, 
  credentialGetManySchema, 
  credentialByTypeSchema 
} from "@/schemas/credentials/credential-router-schemas";
import { CredentialType } from "@prisma/client";

describe("Credential Router Schemas", () => {
  describe("credentialIdSchema", () => {
    it("should validate a valid ID", () => {
      const result = credentialIdSchema.safeParse({ id: "test-id" });
      expect(result.success).toBe(true);
    });

    it("should fail without ID", () => {
      const result = credentialIdSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("credentialUpsertSchema", () => {
    it("should validate valid data", () => {
      const result = credentialUpsertSchema.safeParse({
        name: "Test Cred",
        type: CredentialType.OPENAI,
        value: "sk-..."
      });
      expect(result.success).toBe(true);
    });

    it("should fail with empty name", () => {
      const result = credentialUpsertSchema.safeParse({
        name: "",
        type: CredentialType.OPENAI,
        value: "sk-..."
      });
      expect(result.success).toBe(false);
    });
  });

  describe("credentialUpdateSchema", () => {
    it("should validate valid update data", () => {
      const result = credentialUpdateSchema.safeParse({
        id: "id",
        name: "Test Cred",
        type: CredentialType.OPENAI,
        value: "sk-..."
      });
      expect(result.success).toBe(true);
    });
  });

  describe("credentialGetManySchema", () => {
    it("should use defaults", () => {
      const result = credentialGetManySchema.parse({});
      expect(result.page).toBe(1);
      expect(result.search).toBe("");
    });
  });

  describe("credentialByTypeSchema", () => {
    it("should validate valid type", () => {
      const result = credentialByTypeSchema.safeParse({ type: CredentialType.OPENAI });
      expect(result.success).toBe(true);
    });
  });
});
