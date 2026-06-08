import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { registerUser, authCookie } from "./helpers.js";

let app: Express;
let cookie: string;
let serviceId: string;

beforeAll(async () => {
  app = createApp();
  const result = await registerUser(app, {
    name: "Test User",
    email: "test-orders@servixa.com",
    password: "servixa123",
  });
  cookie = result.cookie;

  const servicesRes = await request(app).get("/api/services");
  serviceId = servicesRes.body[0]?.id;
});

describe("POST /api/checkout", () => {
  it("creates an order with valid data", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .set(...authCookie(cookie))
      .send({
        serviceId,
        paymentMethod: "pix",
        amount: 150,
        serviceFee: 12.5,
        total: 162.5,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("confirmed");
    expect(res.body.serviceId).toBe(serviceId);
    expect(res.body.total).toBe(162.5);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .send({ serviceId: "any", paymentMethod: "pix", amount: 100, total: 100 });

    expect(res.status).toBe(401);
  });

  it("returns 400 with invalid body", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .set(...authCookie(cookie))
      .send({});

    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent service", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .set(...authCookie(cookie))
      .send({
        serviceId: "non-existent-id",
        paymentMethod: "pix",
        amount: 100,
        total: 100,
      });

    expect(res.status).toBe(404);
  });
});

describe("GET /api/orders", () => {
  it("returns the user's orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders/:id", () => {
  it("returns a specific order", async () => {
    const createRes = await request(app)
      .post("/api/checkout")
      .set(...authCookie(cookie))
      .send({ serviceId, paymentMethod: "credit", amount: 200, total: 217 });

    const orderId = createRes.body.id;

    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get("/api/orders/some-id");
    expect(res.status).toBe(401);
  });
});
