import { describe, it, expect } from "vitest";
import { workflowIdSchema, workflowUpdateNameSchema, workflowGetManySchema } from "@/schemas/workflows/workflow-router-schemas";

describe("Workflow Schemas", () => {
  describe("workflowIdSchema", () => {
    it("should validate a valid ID object", () => {
      const result = workflowIdSchema.safeParse({ id: "test-id" });
      expect(result.success).toBe(true);
    });

    it("should fail validation without an ID", () => {
      const result = workflowIdSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("workflowUpdateNameSchema", () => {
    it("should validate a valid name update", () => {
      const result = workflowUpdateNameSchema.safeParse({ id: "id", name: "New Name" });
      expect(result.success).toBe(true);
    });

    it("should fail validation with an empty name", () => {
      const result = workflowUpdateNameSchema.safeParse({ id: "id", name: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("workflowGetManySchema", () => {
    it("should use default pagination values", () => {
      const result = workflowGetManySchema.parse({});
      expect(result.page).toBeDefined();
      expect(result.pageSize).toBeDefined();
      expect(result.search).toBe("");
    });

    it("should validate specific pagination", () => {
      const result = workflowGetManySchema.safeParse({ page: 2, pageSize: 20 });
      expect(result.success).toBe(true);
    });
  });
});
