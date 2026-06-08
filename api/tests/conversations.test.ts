import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { registerUser, authCookie } from "./helpers.js";

let app: Express;
let cookie: string;
let secondCookie: string;
let secondUserId: string;

beforeAll(async () => {
  app = createApp();
  const user1 = await registerUser(app, {
    name: "User One",
    email: "conv-user1@servixa.com",
    password: "servixa123",
  });
  cookie = user1.cookie;

  const user2 = await registerUser(app, {
    name: "User Two",
    email: "conv-user2@servixa.com",
    password: "servixa123",
  });
  secondCookie = user2.cookie;
  secondUserId = user2.user.id;
});

describe("GET /api/conversations", () => {
  it("returns an empty list when no conversations exist", async () => {
    const res = await request(app)
      .get("/api/conversations")
      .set(...authCookie(cookie));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get("/api/conversations");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/conversations", () => {
  it("creates a new conversation", async () => {
    const res = await request(app)
      .post("/api/conversations")
      .set(...authCookie(cookie))
      .send({ prestadorId: secondUserId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.userId).toBeDefined();
    expect(res.body.prestadorId).toBe(secondUserId);
  });

  it("returns existing conversation if one already exists", async () => {
    const res1 = await request(app)
      .post("/api/conversations")
      .set(...authCookie(cookie))
      .send({ prestadorId: secondUserId });

    const res2 = await request(app)
      .post("/api/conversations")
      .set(...authCookie(cookie))
      .send({ prestadorId: secondUserId });

    expect(res2.status).toBe(200);
    expect(res2.body.id).toBe(res1.body.id);
  });

  it("returns 400 with invalid body", async () => {
    const res = await request(app)
      .post("/api/conversations")
      .set(...authCookie(cookie))
      .send({});

    expect(res.status).toBe(400);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/conversations")
      .send({ prestadorId: "any-id" });

    expect(res.status).toBe(401);
  });
});

describe("Conversation Messages", () => {
  let convId: string;

  beforeAll(async () => {
    const convRes = await request(app)
      .post("/api/conversations")
      .set(...authCookie(cookie))
      .send({ prestadorId: secondUserId });
    convId = convRes.body.id;
  });

  describe("GET /api/conversations/:id/messages", () => {
    it("returns messages for a conversation", async () => {
      const res = await request(app)
        .get(`/api/conversations/${convId}/messages`)
        .set(...authCookie(cookie));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("returns 401 without auth", async () => {
      const res = await request(app).get(`/api/conversations/${convId}/messages`);
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/conversations/:id/messages", () => {
    it("sends a message in a conversation", async () => {
      const res = await request(app)
        .post(`/api/conversations/${convId}/messages`)
        .set(...authCookie(cookie))
        .send({ text: "Olá, tudo bem?" });

      expect(res.status).toBe(201);
      expect(res.body.text).toBe("Olá, tudo bem?");
      expect(res.body.senderId).toBeDefined();
      expect(res.body.conversationId).toBe(convId);
    });

    it("updates conversation lastMessage on send", async () => {
      await request(app)
        .post(`/api/conversations/${convId}/messages`)
        .set(...authCookie(cookie))
        .send({ text: "Segunda mensagem" });

      const convRes = await request(app)
        .get("/api/conversations")
        .set(...authCookie(cookie));

      const conv = convRes.body.find((c: any) => c.id === convId);
      expect(conv.lastMessage).toBe("Segunda mensagem");
    });

    it("returns 400 with empty text", async () => {
      const res = await request(app)
        .post(`/api/conversations/${convId}/messages`)
        .set(...authCookie(cookie))
        .send({ text: "" });

      expect(res.status).toBe(400);
    });

    it("returns 401 without auth", async () => {
      const res = await request(app)
        .post(`/api/conversations/${convId}/messages`)
        .send({ text: "Oi" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/conversations", () => {
    it("lists conversations after creating one", async () => {
      const res = await request(app)
        .get("/api/conversations")
        .set(...authCookie(cookie));

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it("shows conversations for other participant too", async () => {
      const res = await request(app)
        .get("/api/conversations")
        .set(...authCookie(secondCookie));

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
