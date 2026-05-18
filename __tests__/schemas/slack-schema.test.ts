import { describe, it, expect } from "vitest";
import { slackSchema } from "@/schemas/executions/slack-schema";

describe("Slack Schema", () => {
  it("should validate valid Slack data", () => {
    const result = slackSchema.safeParse({
      variableName: "slackMsg",
      content: "Hello Slack!",
      webhookUrl: "https://hooks.slack.com/services/..."
    });
    expect(result.success).toBe(true);
  });

  it("should fail with empty content", () => {
    const result = slackSchema.safeParse({
      variableName: "slackMsg",
      content: "",
      webhookUrl: "https://hooks.slack.com/services/..."
    });
    expect(result.success).toBe(false);
  });
});
