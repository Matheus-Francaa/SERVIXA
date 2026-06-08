import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { storage } from "../services/storage";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthResponse {
  user?: User;
  token?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  signIn: async () => {}, signUp: async () => {}, signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [token, savedUser] = await Promise.all([
        storage.getToken(),
        storage.getUser(),
      ]);
      if (token && savedUser) setUser(savedUser);
      else if (token) await storage.removeToken();
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await api.auth.signIn({ email, password }) as AuthResponse;
    if (data?.user) {
      setUser(data.user);
      await storage.setUser(data.user);
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const data = await api.auth.signUp({ name, email, password }) as AuthResponse;
    if (data?.user) {
      setUser(data.user);
      await storage.setUser(data.user);
    }
  }, []);

  const signOut = useCallback(async () => {
    try { await api.auth.signOut(); } catch {}
    await Promise.all([storage.removeToken(), storage.removeUser()]);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
