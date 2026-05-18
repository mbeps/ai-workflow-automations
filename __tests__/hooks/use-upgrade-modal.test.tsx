import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { TRPCClientError } from "@trpc/client";

// Mock the UpgradeModal component since it's just a UI dependency
vi.mock("@/components/upgrade-modal", () => ({
  UpgradeModal: () => null,
}));

describe("useUpgradeModal", () => {
  it("should initialize with closed state", () => {
    const { result } = renderHook(() => useUpgradeModal());
    expect(result.current.modal.props.open).toBe(false);
  });

  it("should return true and open modal when error is FORBIDDEN", () => {
    const { result } = renderHook(() => useUpgradeModal());
    
    const forbiddenError = {
      data: { code: "FORBIDDEN" },
    } as any;
    
    // We need to simulate TRPCClientError. Since it's a class, we might need to mock it or create an instance.
    // For simplicity, we'll check if handleError processes it correctly.
    
    // Mocking TRPCClientError instance
    const error = Object.create(TRPCClientError.prototype);
    error.data = { code: "FORBIDDEN" };

    let handled = false;
    act(() => {
      handled = result.current.handleError(error);
    });

    expect(handled).toBe(true);
    expect(result.current.modal.props.open).toBe(true);
  });

  it("should return false when error is not FORBIDDEN", () => {
    const { result } = renderHook(() => useUpgradeModal());
    
    const otherError = Object.create(TRPCClientError.prototype);
    otherError.data = { code: "UNAUTHORIZED" };

    let handled = true;
    act(() => {
      handled = result.current.handleError(otherError);
    });

    expect(handled).toBe(false);
    expect(result.current.modal.props.open).toBe(false);
  });

  it("should return false when error is not TRPCClientError", () => {
    const { result } = renderHook(() => useUpgradeModal());
    
    const plainError = new Error("Something else");

    let handled = true;
    act(() => {
      handled = result.current.handleError(plainError);
    });

    expect(handled).toBe(false);
  });
});
