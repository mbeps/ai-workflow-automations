import { describe, it, expect, vi, beforeEach } from "vitest";

// Set env var before any imports
vi.stubEnv("NEXT_PUBLIC_ENABLE_POLAR", "true");

// Mock better-auth/react
const createAuthClient = vi.fn((config) => ({
  config,
}));
vi.mock("better-auth/react", () => ({
  createAuthClient,
}));

// Mock @polar-sh/better-auth
const polarClient = vi.fn(() => "polar-plugin");
vi.mock("@polar-sh/better-auth", () => ({
  polarClient,
}));

describe("authClient", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should be created with polar plugin when ENABLE_POLAR is true", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_POLAR", "true");
    const { authClient } = await import("@/lib/auth-client");
    
    expect(authClient).toBeDefined();
    expect(polarClient).toHaveBeenCalled();
  });

  it("should be created without polar plugin when ENABLE_POLAR is false", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_POLAR", "false");
    const { authClient } = await import("@/lib/auth-client");
    
    expect(authClient).toBeDefined();
    // We expect polarClient NOT to have been called for this specific import
    // But since it's a module level side effect, we check the config
    expect(authClient.config.plugins).toHaveLength(0);
  });
});
