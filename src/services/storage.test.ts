import { describe, it, expect, vi, beforeEach } from "vitest";

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
  clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

describe("storage (web)", () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.clearAllMocks();
  });

  it("getToken returns null when no token stored", async () => {
    const { storage } = await import("./storage");
    expect(await storage.getToken()).toBeNull();
  });

  it("setToken stores the token", async () => {
    const { storage } = await import("./storage");
    await storage.setToken("test-token");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("servixa_token", "test-token");
  });

  it("getToken retrieves stored token", async () => {
    const { storage } = await import("./storage");
    await storage.setToken("test-token");
    expect(await storage.getToken()).toBe("test-token");
  });

  it("removeToken clears the token", async () => {
    const { storage } = await import("./storage");
    await storage.setToken("test-token");
    await storage.removeToken();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("servixa_token");
  });

  it("setUser stores user JSON", async () => {
    const { storage } = await import("./storage");
    const user = { id: "1", name: "Test", email: "test@test.com" };
    await storage.setUser(user);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "servixa_user",
      JSON.stringify(user),
    );
  });

  it("getUser retrieves stored user", async () => {
    const { storage } = await import("./storage");
    const user = { id: "1", name: "Test", email: "test@test.com" };
    await storage.setUser(user);
    const retrieved = await storage.getUser();
    expect(retrieved).toEqual(user);
  });

  it("getUser returns null when no user stored", async () => {
    const { storage } = await import("./storage");
    expect(await storage.getUser()).toBeNull();
  });

  it("removeUser clears stored user", async () => {
    const { storage } = await import("./storage");
    await storage.setUser({ id: "1", name: "Test", email: "test@test.com" });
    await storage.removeUser();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("servixa_user");
  });
});
