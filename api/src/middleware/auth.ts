import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../lib/errors.js";
import type { AuthInstance } from "../auth.js";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type SessionData = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type SessionResult = {
  user: SessionUser;
  session: SessionData;
} | null;

function setRequestSession(req: Request, result: SessionResult) {
  if (!result?.user) return;
  const { user, session: s } = result;
  req.user = user;
  req.session = {
    id: s.id,
    userId: s.userId,
    token: s.token,
    expiresAt: Number(s.expiresAt),
    createdAt: String(s.createdAt),
    updatedAt: String(s.updatedAt),
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
  };
}

export function requireAuth(auth: AuthInstance) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = await (auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    }) as Promise<SessionResult>);

    if (!result?.user) {
      throw new UnauthorizedError();
    }

    setRequestSession(req, result);
    next();
  };
}

export function optionalAuth(auth: AuthInstance) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = await (auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      }) as Promise<SessionResult>);

      setRequestSession(req, result);
    } catch {
      // not authenticated, continue
    }

    next();
  };
}
