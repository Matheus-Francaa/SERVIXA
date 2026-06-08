import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import crypto from "node:crypto";
import * as schema from "../schema.js";
import { config } from "../config.js";

export async function seedDatabase(db?: ReturnType<typeof drizzle<typeof schema>>) {
  const sqlite = db ? undefined : new Database(config.dbPath);
  const database = db ?? drizzle(sqlite!, { schema });

  const existingCats = await database.select().from(schema.categories);
  if (existingCats.length > 0) {
    return;
  }

  await database.insert(schema.categories).values([
    { id: 1, label: "Limpeza" },
    { id: 2, label: "Encanamento" },
    { id: 3, label: "Elétrica" },
  ]);

  const servicesData = [
    { title: "Limpeza Residencial Completa", price: 250, location: "Centro · São Paulo", imageUrl: "https://picsum.photos/seed/service1/400/300", description: "Limpeza profissional completa de residências incluindo todos os cômodos, sanitização e organização.", categoryId: 1, prestador: "João Silva", avaliacao: "4.8", avaliacoes: "156", data: "15 de outubro de 2026", latitude: -23.5505, longitude: -46.6333 },
    { title: "Serviço de Encanamento Urgente", price: 150, location: "Vila Madalena · São Paulo", imageUrl: "https://picsum.photos/seed/service2/400/300", description: "Atendimento rápido para vazamentos, destupição e consertos hidráulicos.", categoryId: 2, prestador: "Carlos Mendes", avaliacao: "4.9", avaliacoes: "203", data: "16 de outubro de 2026", latitude: -23.5564, longitude: -46.6889 },
    { title: "Instalação Elétrica Residencial", price: 320, location: "Pinheiros · São Paulo", imageUrl: "https://picsum.photos/seed/service3/400/300", description: "Serviços de instalação e manutenção de sistemas elétricos residenciais.", categoryId: 3, prestador: "Roberto Dias", avaliacao: "4.7", avaliacoes: "89", data: "17 de outubro de 2026", latitude: -23.5654, longitude: -46.6978 },
    { title: "Reparo em Vazamentos", price: 180, location: "Consolação · São Paulo", imageUrl: "https://picsum.photos/seed/service4/400/300", description: "Identificação e reparo de todos os tipos de vazamentos.", categoryId: 2, prestador: "Pedro Costa", avaliacao: "4.9", avaliacoes: "128", data: "18 de outubro de 2026", latitude: -23.5545, longitude: -46.6623 },
    { title: "Limpeza de Escritório", price: 450, location: "Consolação · São Paulo", imageUrl: "https://picsum.photos/seed/service5/400/300", description: "Limpeza e higienização de ambientes comerciais.", categoryId: 1, prestador: "Maria Costa", avaliacao: "4.6", avaliacoes: "67", data: "22 de outubro de 2026", latitude: -23.5524, longitude: -46.6602 },
    { title: "Reparo de Fiação Elétrica", price: 200, location: "Bom Retiro · São Paulo", imageUrl: "https://picsum.photos/seed/service6/400/300", description: "Troca de fios e disjuntores com segurança.", categoryId: 3, prestador: "André Oliveira", avaliacao: "4.8", avaliacoes: "54", data: "25 de outubro de 2026", latitude: -23.5412, longitude: -46.6415 },
    { title: "Desobstrução de Canos", price: 120, location: "Tatuapé · São Paulo", imageUrl: "https://picsum.photos/seed/service7/400/300", description: "Desobstrução profissional de tubulações.", categoryId: 2, prestador: "Roberto Dias", avaliacao: "4.9", avaliacoes: "91", data: "28 de outubro de 2026", latitude: -23.5398, longitude: -46.5768 },
  ];

  for (const svc of servicesData) {
    await database.insert(schema.services).values({
      id: crypto.randomUUID(),
      ...svc,
      createdAt: new Date().toISOString(),
    });
  }
}

const sqlite = new Database(config.dbPath);
const dbInst = drizzle(sqlite, { schema });

seedDatabase(dbInst)
  .then(() => console.log("Seed complete!"))
  .catch(console.error);
