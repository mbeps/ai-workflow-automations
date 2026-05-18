import { describe, it, expect } from "vitest";
import { aiModelSchema } from "@/schemas/executions/ai-model-schemas";

describe("AI Model Schema", () => {
  it("should validate valid AI model data", () => {
    const result = aiModelSchema.safeParse({
      variableName: "myVar",
      credentialId: "cred-123",
      userPrompt: "Hello world",
      systemPrompt: "Be helpful"
    });
    expect(result.success).toBe(true);
  });

  it("should validate without systemPrompt", () => {
    const result = aiModelSchema.safeParse({
      variableName: "my_var_2",
      credentialId: "cred-123",
      userPrompt: "Hello world"
    });
    expect(result.success).toBe(true);
  });

  it("should fail with invalid variableName", () => {
    const result = aiModelSchema.safeParse({
      variableName: "123var",
      credentialId: "cred-123",
      userPrompt: "Hello"
    });
    expect(result.success).toBe(false);
  });

  it("should fail with empty userPrompt", () => {
     const result = aiModelSchema.safeParse({
      variableName: "var",
      credentialId: "cred-123",
      userPrompt: ""
    });
    expect(result.success).toBe(false);
  });
});
