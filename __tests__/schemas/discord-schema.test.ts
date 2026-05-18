import { describe, it, expect } from "vitest";
import { discordSchema } from "@/schemas/executions/discord-schema";

describe("Discord Schema", () => {
  it("should validate valid Discord data", () => {
    const result = discordSchema.safeParse({
      variableName: "discordOutput",
      content: "Hello Discord!",
      webhookUrl: "https://discord.com/api/webhooks/..."
    });
    expect(result.success).toBe(true);
  });

  it("should fail if content is too long", () => {
    const longContent = "a".repeat(2001);
    const result = discordSchema.safeParse({
      variableName: "discordOutput",
      content: longContent,
      webhookUrl: "https://discord.com/api/webhooks/..."
    });
    expect(result.success).toBe(false);
  });

  it("should fail if webhookUrl is missing", () => {
    const result = discordSchema.safeParse({
      variableName: "discordOutput",
      content: "Hello",
      webhookUrl: ""
    });
    expect(result.success).toBe(false);
  });
});
