import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";

let app: Express;

beforeAll(() => {
  app = createApp();
});

describe("GET /api/categories", () => {
  it("returns a list of categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
  });

  it("returns categories with id and label", async () => {
    const res = await request(app).get("/api/categories");
    res.body.forEach((cat: any) => {
      expect(cat).toHaveProperty("id");
      expect(cat).toHaveProperty("label");
    });
  });
});
