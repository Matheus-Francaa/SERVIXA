import { storage } from "./storage";

function apiBase() {
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";
}

async function getToken() {
  try {
    return await storage.getToken();
  } catch {
    return null;
  }
}

async function setToken(token: string) {
  try { await storage.setToken(token); } catch {}
}

async function removeToken() {
  try { await storage.removeToken(); } catch {}
}

async function request(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) removeToken();
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    try {
      const err = JSON.parse(body);
      throw new Error(err.error || err.message || "Erro na requisição");
    } catch (e: any) {
      if (e.message !== "Erro na requisição") throw e;
      throw new Error(`Erro ${res.status}: ${body.slice(0, 100)}`);
    }
  }
  const body = await res.text();
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`Resposta inválida do servidor (${url}): ${body.slice(0, 200)}`);
  }
}

async function signInRequest(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, { ...options, headers });
  const body = await res.text();
  let data: any;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`Resposta inválida do servidor (${url}): ${body.slice(0, 200)}`);
  }
  if (!res.ok) throw new Error(data.message || data.error || `Erro ${res.status}`);
  if (data.session?.token) await setToken(data.session.token);
  return data;
}

export const api = {
  auth: {
    signUp: (data: { name: string; email: string; password: string }) =>
      signInRequest("/auth/sign-up/email", { method: "POST", body: JSON.stringify(data) }),
    signIn: (data: { email: string; password: string }) =>
      signInRequest("/auth/sign-in/email", { method: "POST", body: JSON.stringify(data) }),
    signOut: () => request("/auth/sign-out", { method: "POST" }),
    getSession: () => request("/auth/get-session"),
  },
  services: {
    list: (category?: string) =>
      request(`/services${category ? `?category=${category}` : ""}`),
    get: (id: string) => request(`/services/${id}`),
    create: (data: { title: string; description: string; price: number; location: string; imageUrl?: string; categoryId: number | string }) =>
      request("/services", { method: "POST", body: JSON.stringify(data) }),
    toggleFavorite: (id: string) => request(`/services/${id}/favorite`, { method: "POST" }),
    getFavoriteStatus: (id: string) => request(`/services/${id}/favorite`),
  },
  categories: { list: () => request("/categories") },
  checkout: (data: { serviceId: string; paymentMethod: string; amount: number; serviceFee: number; total: number }) =>
    request("/checkout", { method: "POST", body: JSON.stringify(data) }),
  orders: {
    list: () => request("/orders"),
    get: (id: string) => request(`/orders/${id}`),
  },
  conversations: {
    list: () => request("/conversations"),
    create: (prestadorId: string) =>
      request("/conversations", { method: "POST", body: JSON.stringify({ prestadorId }) }),
    messages: {
      list: (convId: string) => request(`/conversations/${convId}/messages`),
      send: (convId: string, text: string) =>
        request(`/conversations/${convId}/messages`, { method: "POST", body: JSON.stringify({ text }) }),
    },
  },
  favorites: { list: () => request("/favorites") },
  users: { me: () => request("/users/me") },
  prestadores: { get: (id: string) => request(`/prestadores/${id}`) },
};
