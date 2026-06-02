import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "servixa_token";
const USER_KEY = "servixa_user";

export const storage = {
  async getToken(): Promise<string | null> {
    if (Platform.OS === "web") return localStorage.getItem(TOKEN_KEY);
    try { return await SecureStore.getItemAsync(TOKEN_KEY); }
    catch { return null; }
  },
  async setToken(token: string): Promise<void> {
    if (Platform.OS === "web") { localStorage.setItem(TOKEN_KEY, token); return; }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async removeToken(): Promise<void> {
    if (Platform.OS === "web") { localStorage.removeItem(TOKEN_KEY); return; }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
  async getUser(): Promise<{ id: string; name: string; email: string } | null> {
    if (Platform.OS === "web") {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    }
    try {
      const raw = await SecureStore.getItemAsync(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  async setUser(user: { id: string; name: string; email: string }): Promise<void> {
    const raw = JSON.stringify(user);
    if (Platform.OS === "web") { localStorage.setItem(USER_KEY, raw); return; }
    await SecureStore.setItemAsync(USER_KEY, raw);
  },
  async removeUser(): Promise<void> {
    if (Platform.OS === "web") { localStorage.removeItem(USER_KEY); return; }
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};
