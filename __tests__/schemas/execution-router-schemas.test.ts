import { describe, it, expect } from "vitest";
import { executionIdSchema, executionGetManySchema } from "@/schemas/executions/execution-router-schemas";

describe("Execution Router Schemas", () => {
  describe("executionIdSchema", () => {
    it("should validate valid ID", () => {
      expect(executionIdSchema.safeParse({ id: "exec-1" }).success).toBe(true);
    });
  });

  describe("executionGetManySchema", () => {
    it("should use defaults", () => {
      const result = executionGetManySchema.parse({});
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(5);
    });
  });
});
