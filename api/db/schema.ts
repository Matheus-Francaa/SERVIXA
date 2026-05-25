import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt"),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  location: text("location").notNull(),
  imageUrl: text("imageUrl").notNull(),
  prestador: text("prestador"),
  avaliacao: text("avaliacao"),
  avaliacoes: text("avaliacoes"),
  data: text("data"),
  categoryId: integer("categoryId")
    .notNull()
    .references(() => categories.id),
  userId: text("userId"),
  createdAt: text("createdAt").notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  serviceId: text("serviceId")
    .notNull()
    .references(() => services.id),
  userId: text("userId").notNull(),
  paymentMethod: text("paymentMethod").notNull(),
  amount: real("amount").notNull(),
  serviceFee: real("serviceFee").notNull(),
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("createdAt").notNull(),
});

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  prestadorId: text("prestadorId").notNull(),
  lastMessage: text("lastMessage"),
  lastMessageAt: text("lastMessageAt"),
  createdAt: text("createdAt").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversationId")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("senderId").notNull(),
  text: text("text").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const favorites = sqliteTable("favorites", {
  userId: text("userId").notNull(),
  serviceId: text("serviceId").notNull(),
  createdAt: text("createdAt").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.serviceId] }),
}));
