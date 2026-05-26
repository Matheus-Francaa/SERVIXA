import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import crypto from "node:crypto";
import * as schema from "../schema.js";
import { config } from "../config.js";

const sqlite = new Database(config.dbPath);
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("Seeding database...");

  const existingCats = await db.select().from(schema.categories);
  if (existingCats.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  await db.insert(schema.categories).values([
    { id: 1, label: "Limpeza" },
    { id: 2, label: "Encanamento" },
    { id: 3, label: "Elétrica" },
  ]);

  const servicesData = [
    { title: "Limpeza Residencial Completa", price: 250, location: "Centro · São Paulo", imageUrl: "https://picsum.photos/seed/service1/400/300", description: "Limpeza profissional completa de residências incluindo todos os cômodos, sanitização e organização.", categoryId: 1, prestador: "João Silva", avaliacao: "4.8", avaliacoes: "156", data: "15 de outubro de 2026" },
    { title: "Serviço de Encanamento Urgente", price: 150, location: "Vila Madalena · São Paulo", imageUrl: "https://picsum.photos/seed/service2/400/300", description: "Atendimento rápido para vazamentos, destupição e consertos hidráulicos.", categoryId: 2, prestador: "Carlos Mendes", avaliacao: "4.9", avaliacoes: "203", data: "16 de outubro de 2026" },
    { title: "Instalação Elétrica Residencial", price: 320, location: "Pinheiros · São Paulo", imageUrl: "https://picsum.photos/seed/service3/400/300", description: "Serviços de instalação e manutenção de sistemas elétricos residenciais.", categoryId: 3, prestador: "Roberto Dias", avaliacao: "4.7", avaliacoes: "89", data: "17 de outubro de 2026" },
    { title: "Reparo em Vazamentos", price: 180, location: "Consolação · São Paulo", imageUrl: "https://picsum.photos/seed/service4/400/300", description: "Identificação e reparo de todos os tipos de vazamentos.", categoryId: 2, prestador: "Pedro Costa", avaliacao: "4.9", avaliacoes: "128", data: "18 de outubro de 2026" },
    { title: "Limpeza de Escritório", price: 450, location: "Consolação · São Paulo", imageUrl: "https://picsum.photos/seed/service5/400/300", description: "Limpeza e higienização de ambientes comerciais.", categoryId: 1, prestador: "Maria Costa", avaliacao: "4.6", avaliacoes: "67", data: "22 de outubro de 2026" },
    { title: "Reparo de Fiação Elétrica", price: 200, location: "Bom Retiro · São Paulo", imageUrl: "https://picsum.photos/seed/service6/400/300", description: "Troca de fios e disjuntores com segurança.", categoryId: 3, prestador: "André Oliveira", avaliacao: "4.8", avaliacoes: "54", data: "25 de outubro de 2026" },
    { title: "Desobstrução de Canos", price: 120, location: "Tatuapé · São Paulo", imageUrl: "https://picsum.photos/seed/service7/400/300", description: "Desobstrução profissional de tubulações.", categoryId: 2, prestador: "Roberto Dias", avaliacao: "4.9", avaliacoes: "91", data: "28 de outubro de 2026" },
  ];

  for (const svc of servicesData) {
    await db.insert(schema.services).values({
      id: crypto.randomUUID(),
      ...svc,
      createdAt: new Date().toISOString(),
    });
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
