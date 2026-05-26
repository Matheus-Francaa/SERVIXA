import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";

let app: Express;

beforeAll(() => {
  app = createApp();
});

describe("GET /api/services", () => {
  it("returns a list of services", async () => {
    const res = await request(app).get("/api/services");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("can filter by category", async () => {
    const res = await request(app).get("/api/services?category=1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 404 for non-existent service", async () => {
    const res = await request(app).get("/api/services/non-existent-id");
    expect(res.status).toBe(404);
  });
});
