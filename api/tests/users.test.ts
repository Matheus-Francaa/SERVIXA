import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { registerUser, authCookie } from "./helpers.js";

let app: Express;
let cookie: string;
let userId: string;

beforeAll(async () => {
  app = createApp();
  const result = await registerUser(app, {
    name: "Users Test User",
    email: "users-test@servixa.com",
    password: "servixa123",
  });
  cookie = result.cookie;
  userId = result.user.id;
});

describe("GET /api/users/me", () => {
  it("returns the authenticated user", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.name).toBe("Users Test User");
    expect(res.body.email).toBe("users-test@servixa.com");
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/prestadores/:id", () => {
  it("returns a public user profile", async () => {
    const res = await request(app)
      .get(`/api/prestadores/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.name).toBe("Users Test User");
  });

  it("returns 404 for non-existent user", async () => {
    const res = await request(app)
      .get("/api/prestadores/non-existent-id");

    expect(res.status).toBe(404);
  });
});
