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
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const mockGetToken = vi.fn();
const mockSetToken = vi.fn();
const mockRemoveToken = vi.fn();

vi.mock("./storage", () => ({
  storage: {
    getToken: () => mockGetToken(),
    setToken: (t: string) => mockSetToken(t),
    removeToken: () => mockRemoveToken(),
  },
}));

describe("api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetToken.mockResolvedValue(null);
  });

  it("services.list calls GET /services", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([{ id: "1" }])),
    });

    const { api } = await import("./api");
    const result = await api.services.list();
    expect(result).toEqual([{ id: "1" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/services"),
      expect.any(Object),
    );
  });

  it("services.list with category adds query param", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([])),
    });

    const { api } = await import("./api");
    await api.services.list("1");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("?category=1"),
      expect.any(Object),
    );
  });

  it("services.get calls GET /services/:id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ id: "svc-1" })),
    });

    const { api } = await import("./api");
    const result = await api.services.get("svc-1");
    expect(result).toEqual({ id: "svc-1" });
  });

  it("services.create sends POST with body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      text: () => Promise.resolve(JSON.stringify({ id: "new" })),
    });

    const { api } = await import("./api");
    const result = await api.services.create({
      title: "Test",
      description: "Desc",
      price: 100,
      location: "SP",
      categoryId: 1,
    });
    expect(result).toEqual({ id: "new" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/services"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("Test"),
      }),
    );
  });

  it("includes Authorization header when token is available", async () => {
    mockGetToken.mockResolvedValue("my-token");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([])),
    });

    const { api } = await import("./api");
    await api.categories.list();
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers["Authorization"]).toBe("Bearer my-token");
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve(JSON.stringify({ error: "Not found" })),
    });

    const { api } = await import("./api");
    await expect(api.services.get("bad-id")).rejects.toThrow("Not found");
  });

  it("removes token on 401", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve(JSON.stringify({ error: "Unauthorized" })),
    });

    const { api } = await import("./api");
    await expect(api.services.list()).rejects.toThrow();
    expect(mockRemoveToken).toHaveBeenCalled();
  });

  it("categories.list calls GET /categories", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([{ id: 1, label: "Limpeza" }])),
    });

    const { api } = await import("./api");
    const result = await api.categories.list();
    expect(result).toEqual([{ id: 1, label: "Limpeza" }]);
  });

  it("checkout sends POST with body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      text: () => Promise.resolve(JSON.stringify({ id: "order-1" })),
    });

    const { api } = await import("./api");
    const result = await api.checkout({
      serviceId: "svc-1",
      paymentMethod: "pix",
      amount: 150,
      serviceFee: 12.5,
      total: 162.5,
    });
    expect(result).toEqual({ id: "order-1" });
  });

  it("conversations.list calls GET /conversations", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([])),
    });

    const { api } = await import("./api");
    const result = await api.conversations.list();
    expect(result).toEqual([]);
  });

  it("conversations.messages.send calls POST with text", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      text: () => Promise.resolve(JSON.stringify({ id: "msg-1" })),
    });

    const { api } = await import("./api");
    const result = await api.conversations.messages.send("conv-1", "Olá");
    expect(result).toEqual({ id: "msg-1" });
  });
});
