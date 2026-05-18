import { describe, it, expect } from "vitest";
import { createStore } from "jotai";
import { editorAtom } from "@/features/editor/store/atoms";

describe("editorAtom", () => {
  it("should initialize with null", () => {
    const store = createStore();
    expect(store.get(editorAtom)).toBe(null);
  });

  it("should update with a ReactFlowInstance", () => {
    const store = createStore();
    const mockInstance = { zoomIn: () => {} } as any;
    
    store.set(editorAtom, mockInstance);
    expect(store.get(editorAtom)).toBe(mockInstance);
  });
});
