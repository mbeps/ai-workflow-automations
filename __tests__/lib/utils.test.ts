import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge tailwind classes correctly", () => {
    expect(cn("px-2", "py-2")).toBe("px-2 py-2");
    expect(cn("px-2 py-2", "p-4")).toBe("p-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("px-2", true && "py-2", false && "mt-4")).toBe("px-2 py-2");
  });

  it("should handle null and undefined", () => {
    expect(cn("px-2", null, undefined)).toBe("px-2");
  });
});
