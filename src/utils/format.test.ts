import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats a number as BRL", () => {
    expect(formatPrice(250)).toBe("R$ 250,00");
  });

  it("formats with decimal places", () => {
    expect(formatPrice(150.5)).toBe("R$ 150,50");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("R$ 0,00");
  });

  it("handles string input", () => {
    expect(formatPrice("100")).toBe("R$ 100,00");
  });

  it("handles NaN input gracefully", () => {
    expect(formatPrice("abc")).toBe("R$ 0,00");
  });

  it("handles undefined input", () => {
    expect(formatPrice(undefined)).toBe("R$ 0,00");
  });

  it("handles null input", () => {
    expect(formatPrice(null)).toBe("R$ 0,00");
  });

  it("rounds to two decimal places", () => {
    expect(formatPrice(99.999)).toBe("R$ 100,00");
  });
});
