import crypto from "node:crypto";
import { eq, desc, sql, and } from "drizzle-orm";
import type { DB } from "../types.js";
import { services, favorites } from "../schema.js";
import { NotFoundError } from "../lib/errors.js";

export type CreateServiceInput = {
  title: string;
  description?: string;
  price: number;
  location: string;
  imageUrl?: string;
  categoryId: number;
  latitude?: number;
  longitude?: number;
};

export type ServiceUser = {
  id: string;
  name: string;
};

export function createServicesService(db: DB) {
  return {
    async list(categoryId?: string) {
      const where = categoryId ? eq(services.categoryId, Number(categoryId)) : undefined;

      return db
        .select()
        .from(services)
        .where(where)
        .orderBy(desc(services.createdAt));
    },

    async findById(id: string) {
      const [result] = await db
        .select()
        .from(services)
        .where(eq(services.id, id))
        .limit(1);

      if (!result) throw new NotFoundError("Serviço não encontrado");
      return result;
    },

    async create(input: CreateServiceInput, user: ServiceUser) {
      const newService = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description ?? "",
        price: input.price,
        location: input.location,
        imageUrl: input.imageUrl ?? "https://picsum.photos/seed/service/400/300",
        categoryId: input.categoryId,
        latitude: input.latitude,
        longitude: input.longitude,
        userId: user.id,
        prestador: user.name,
        avaliacao: "5.0",
        avaliacoes: "0",
        data: new Date().toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        createdAt: new Date().toISOString(),
      };

      await db.insert(services).values(newService);
      return newService;
    },

    async toggleFavorite(serviceId: string, userId: string) {
      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(eq(favorites.userId, userId), eq(favorites.serviceId, serviceId)),
        )
        .limit(1)
        .then((rows) => rows[0]);

      if (existing) {
        await db
          .delete(favorites)
          .where(
            and(eq(favorites.userId, userId), eq(favorites.serviceId, serviceId)),
          );
        return { favorited: false };
      }

      await db.insert(favorites).values({
        userId,
        serviceId,
        createdAt: new Date().toISOString(),
      });
      return { favorited: true };
    },

    async getFavoriteStatus(serviceId: string, userId: string) {
      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(eq(favorites.userId, userId), eq(favorites.serviceId, serviceId)),
        )
        .limit(1)
        .then((rows) => rows[0]);

      return { favorited: !!existing };
    },

    async listFavorites(userId: string) {
      const result = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, userId))
        .orderBy(favorites.createdAt);

      const serviceIds = result.map((f) => f.serviceId);
      if (serviceIds.length === 0) return [];

      return db
        .select()
        .from(services)
        .where(sql`${services.id} IN ${serviceIds}`);
    },
  };
}
