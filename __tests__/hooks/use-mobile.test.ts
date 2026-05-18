import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useIsMobile } from "@/hooks/use-mobile";

describe("useIsMobile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("(max-width: 767px)") ? false : true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("should return false on desktop", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true on mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    // Update matchMedia for mobile
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("(max-width: 767px)") ? true : false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should handle resize events", () => {
    let changeHandler: any;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      addEventListener: vi.fn((event, handler) => {
        if (event === "change") changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });
      if (changeHandler) changeHandler();
    });

    expect(result.current).toBe(true);
  });
});
