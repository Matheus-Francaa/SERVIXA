// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";

vi.mock("expo-secure-store", () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

vi.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

import { AuthProvider, useAuth } from "./AuthContext";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function setupHook() {
  return renderHook(() => useAuth(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      React.createElement(AuthProvider, null, children)
    ),
  });
}

describe("AuthContext", () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it("starts with loading true and user null", async () => {
    const { result } = setupHook();
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it("resolves loading to false after initialization", async () => {
    const { result } = setupHook();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("signs in and sets user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        user: { id: "1", name: "Test", email: "test@test.com" },
        token: "session-token",
      })),
    });

    const { result } = setupHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.signIn("test@test.com", "password");
    });

    expect(result.current.user).toEqual({
      id: "1",
      name: "Test",
      email: "test@test.com",
    });
  });

  it("signs up and sets user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        user: { id: "2", name: "New", email: "new@test.com" },
        token: "session-token",
      })),
    });

    const { result } = setupHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.signUp("New", "new@test.com", "password");
    });

    expect(result.current.user).toEqual({
      id: "2",
      name: "New",
      email: "new@test.com",
    });
  });

  it("signs out and clears user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        user: { id: "1", name: "Test", email: "test@test.com" },
        token: "session-token",
      })),
    });

    const { result } = setupHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.signIn("test@test.com", "password");
    });

    expect(result.current.user).not.toBeNull();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve("{}"),
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
  });

  it("restores user from storage on mount", async () => {
    store["servixa_token"] = "existing-token";
    store["servixa_user"] = JSON.stringify({
      id: "3",
      name: "Stored",
      email: "stored@test.com",
    });

    const { result } = setupHook();
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toEqual({
      id: "3",
      name: "Stored",
      email: "stored@test.com",
    });
  });

  it("clears token if no saved user", async () => {
    store["servixa_token"] = "orphan-token";

    const { result } = setupHook();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("servixa_token");
  });
});
