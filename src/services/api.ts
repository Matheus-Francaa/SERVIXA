import { storage } from "./storage";

interface ApiError {
  error?: string;
  message?: string;
}

interface SignInResponse {
  token?: string;
  user?: { id: string; name: string; email: string };
  session?: { token: string };
}

function apiBase(): string {
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";
}

async function getToken(): Promise<string | null> {
  try {
    return await storage.getToken();
  } catch {
    return null;
  }
}

async function persistToken(data: SignInResponse): Promise<void> {
  const token = data.session?.token || data.token;
  if (token) {
    try { await storage.setToken(token); } catch {}
  }
}

async function clearToken(): Promise<void> {
  try { await storage.removeToken(); } catch {}
}

async function parseResponse(res: Response, url: string): Promise<any> {
  const body = await res.text();
  let data: any;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`Resposta inválida do servidor (${url}): ${body.slice(0, 200)}`);
  }
  if (!res.ok) {
    throw new Error(data.message || data.error || `Erro ${res.status}`);
  }
  return data;
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) clearToken();
  return parseResponse(res, url);
}

async function signInRequest(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, { ...options, headers });
  const data: SignInResponse = await parseResponse(res, url);
  await persistToken(data);
  return data;
}

interface CreateServiceBody {
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl?: string;
  categoryId: number | string;
}

interface CheckoutBody {
  serviceId: string;
  paymentMethod: string;
  amount: number;
  serviceFee: number;
  total: number;
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
    create: (data: CreateServiceBody) =>
      request("/services", { method: "POST", body: JSON.stringify(data) }),
    toggleFavorite: (id: string) => request(`/services/${id}/favorite`, { method: "POST" }),
    getFavoriteStatus: (id: string) => request(`/services/${id}/favorite`),
  },
  categories: { list: () => request("/categories") },
  checkout: (data: CheckoutBody) =>
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
