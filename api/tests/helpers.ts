import request from "supertest";
import type { Express } from "express";

type RegisterResult = {
  token: string;
  user: { id: string; name: string; email: string };
  cookie: string;
};

export async function registerUser(
  app: Express,
  user: { name: string; email: string; password: string },
): Promise<RegisterResult> {
  const res = await request(app)
    .post("/api/auth/sign-up/email")
    .set("Origin", "http://localhost:3456")
    .send(user);

  if (!res.ok) {
    throw new Error(`Sign-up failed: ${res.body.message || JSON.stringify(res.body)}`);
  }

  const cookie = res.headers["set-cookie"]
    ?.map((c: string) => c.split(";")[0])
    .join("; ");

  return {
    token: res.body.token,
    user: res.body.user,
    cookie: cookie || "",
  };
}

export function authCookie(cookie: string): [string, string] {
  return ["Cookie", cookie];
}
