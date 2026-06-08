import { eq } from "drizzle-orm";
import type { DB } from "../types.js";
import { users } from "../schema.js";
import { NotFoundError } from "../lib/errors.js";

export function createUsersService(db: DB) {
  return {
    async findById(id: string) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) throw new NotFoundError("Usuário não encontrado");
      return user;
    },

    async getPublicProfile(id: string) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) throw new NotFoundError("Prestador não encontrado");
      return { id: user.id, name: user.name, image: user.image, email: user.email };
    },
  };
}
