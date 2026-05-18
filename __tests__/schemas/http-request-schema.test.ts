import { describe, it, expect } from "vitest";
import { httpRequestSchema } from "@/schemas/executions/http-request-schema";

describe("HTTP Request Schema", () => {
  it("should validate valid HTTP request data", () => {
    const result = httpRequestSchema.safeParse({
      variableName: "apiResponse",
      endpoint: "https://api.example.com",
      method: "POST",
      body: '{"foo": "bar"}'
    });
    expect(result.success).toBe(true);
  });

  it("should fail with invalid method", () => {
    const result = httpRequestSchema.safeParse({
      variableName: "apiResponse",
      endpoint: "https://api.example.com",
      method: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with empty endpoint", () => {
    const result = httpRequestSchema.safeParse({
      variableName: "apiResponse",
      endpoint: "",
      method: "GET",
    });
    expect(result.success).toBe(false);
  });
});
