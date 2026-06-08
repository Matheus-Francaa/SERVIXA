import type { DB } from "../types.js";
import { categories } from "../schema.js";

export function createCategoriesService(db: DB) {
  return {
    list() {
      return db.select().from(categories);
    },
  };
}
