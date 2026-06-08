import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { registerUser, authCookie } from "./helpers.js";

let app: Express;
let cookie: string;

beforeAll(async () => {
  app = createApp();
  const result = await registerUser(app, {
    name: "Service Tester",
    email: "svc-test@servixa.com",
    password: "servixa123",
  });
  cookie = result.cookie;
});

describe("GET /api/services", () => {
  it("returns a list of services", async () => {
    const res = await request(app).get("/api/services");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("can filter by category", async () => {
    const res = await request(app).get("/api/services?category=1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((svc: any) => {
      expect(svc.categoryId).toBe(1);
    });
  });

  it("returns 404 for non-existent service", async () => {
    const res = await request(app).get("/api/services/non-existent-id");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/services", () => {
  it("creates a new service when authenticated", async () => {
    const res = await request(app)
      .post("/api/services")
      .set(...authCookie(cookie))
      .send({
        title: "Test Service",
        price: 100,
        location: "São Paulo",
        categoryId: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Service");
    expect(res.body.userId).toBeDefined();
  });

  it("returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/services")
      .send({ title: "Test", price: 100, location: "SP", categoryId: 1 });

    expect(res.status).toBe(401);
  });

  it("returns 400 with invalid data", async () => {
    const res = await request(app)
      .post("/api/services")
      .set(...authCookie(cookie))
      .send({});

    expect(res.status).toBe(400);
  });
});
