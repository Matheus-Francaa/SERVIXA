import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type * as schema from "./schema.js";

export type DB = BetterSQLite3Database<typeof schema>;

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
      session?: Session;
    }
  }
}
