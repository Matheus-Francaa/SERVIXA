import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db.js";
import * as schema from "./schema.js";
import { config } from "./config.js";

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    baseURL: config.baseURL,
    usePlural: false,
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: config.trustedOrigins,
    advanced: {
      disableCSRFCheck: true,
    },
  });
}

let _auth: ReturnType<typeof createAuth> | null = null;

export function getAuthInstance() {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}

type BetterAuth = ReturnType<typeof createAuth>;

export type AuthInstance = {
  api: Pick<BetterAuth["api"], "getSession">;
};

export const auth: AuthInstance = {
  get api() {
    return getAuthInstance().api;
  },
};
