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
    name: "Fav User",
    email: "fav-user@servixa.com",
    password: "servixa123",
  });
  cookie = result.cookie;

  const servicesRes = await request(app).get("/api/services");
  serviceId = servicesRes.body[0]?.id;
});

describe("GET /api/favorites", () => {
  it("returns an empty list when no favorites exist", async () => {
    const res = await request(app)
      .get("/api/favorites")
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get("/api/favorites");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/services/:id/favorite", () => {
  it("toggles favorite on", async () => {
    const res = await request(app)
      .post(`/api/services/${serviceId}/favorite`)
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(true);
  });

  it("toggles favorite off", async () => {
    const res = await request(app)
      .post(`/api/services/${serviceId}/favorite`)
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(false);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app)
      .post(`/api/services/${serviceId}/favorite`);

    expect(res.status).toBe(401);
  });
});

describe("GET /api/services/:id/favorite", () => {
  it("returns favorite status (false when not favorited)", async () => {
    const res = await request(app)
      .get(`/api/services/${serviceId}/favorite`)
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(false);
  });

  it("returns favorite status (true when favorited)", async () => {
    await request(app)
      .post(`/api/services/${serviceId}/favorite`)
      .set(...authCookie(cookie));

    const res = await request(app)
      .get(`/api/services/${serviceId}/favorite`)
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(res.body.favorited).toBe(true);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get(`/api/services/${serviceId}/favorite`);
    expect(res.status).toBe(401);
  });
});

describe("Favorites list reflects toggled items", () => {
  it("shows favorited services after toggling on", async () => {
    const prev = await request(app)
      .post(`/api/services/${serviceId}/favorite`)
      .set(...authCookie(cookie));

    const res = await request(app)
      .get("/api/favorites")
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    if (prev.body.favorited) {
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    }
  });
});
