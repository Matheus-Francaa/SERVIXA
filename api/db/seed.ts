const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const crypto = require("crypto");
const schema = require("./schema");

const sqlite = new Database("./servixa.db");
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("Seeding database...");

  const existingCats = db.select().from(schema.categories).all();
  if (existingCats.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  db.insert(schema.categories).values([
    { id: 1, label: "Limpeza" },
    { id: 2, label: "Encanamento" },
    { id: 3, label: "Elétrica" },
  ]).run();

  const prestadores = [
    { name: "João Silva", email: "joao@email.com" },
    { name: "Carlos Mendes", email: "carlos@email.com" },
    { name: "Pedro Santos", email: "pedro@email.com" },
    { name: "Maria Costa", email: "maria@email.com" },
    { name: "André Oliveira", email: "andre@email.com" },
    { name: "Roberto Dias", email: "roberto@email.com" },
  ];

  const servicesData = [
    { title: "Limpeza Residencial Completa", price: "R$ 250", location: "Centro · São Paulo", imageUrl: "https://picsum.photos/seed/service1/400/300", description: "Limpeza profissional completa de residências incluindo todos os cômodos, sanitização e organização.", categoryId: 1, prestador: "João Silva", avaliacao: "4.8", avaliacoes: "156", data: "15 de outubro de 2026" },
    { title: "Serviço de Encanamento Urgente", price: "R$ 150", location: "Vila Madalena · São Paulo", imageUrl: "https://picsum.photos/seed/service2/400/300", description: "Atendimento rápido para vazamentos, destupição e consertos hidráulicos.", categoryId: 2, prestador: "Carlos Mendes", avaliacao: "4.9", avaliacoes: "203", data: "16 de outubro de 2026" },
    { title: "Instalação Elétrica Residencial", price: "R$ 320", location: "Pinheiros · São Paulo", imageUrl: "https://picsum.photos/seed/service3/400/300", description: "Serviços de instalação e manutenção de sistemas elétricos residenciais.", categoryId: 3, prestador: "Roberto Dias", avaliacao: "4.7", avaliacoes: "89", data: "17 de outubro de 2026" },
    { title: "Reparo em Vazamentos", price: "R$ 180", location: "Consolação · São Paulo", imageUrl: "https://picsum.photos/seed/service4/400/300", description: "Identificação e reparo de todos os tipos de vazamentos.", categoryId: 2, prestador: "Pedro Costa", avaliacao: "4.9", avaliacoes: "128", data: "18 de outubro de 2026" },
    { title: "Limpeza de Escritório", price: "R$ 450", location: "Consolação · São Paulo", imageUrl: "https://picsum.photos/seed/service5/400/300", description: "Limpeza e higienização de ambientes comerciais.", categoryId: 1, prestador: "Maria Costa", avaliacao: "4.6", avaliacoes: "67", data: "22 de outubro de 2026" },
    { title: "Reparo de Fiação Elétrica", price: "R$ 200", location: "Bom Retiro · São Paulo", imageUrl: "https://picsum.photos/seed/service6/400/300", description: "Troca de fios e disjuntores com segurança.", categoryId: 3, prestador: "André Oliveira", avaliacao: "4.8", avaliacoes: "54", data: "25 de outubro de 2026" },
    { title: "Desobstrução de Canos", price: "R$ 120", location: "Tatuapé · São Paulo", imageUrl: "https://picsum.photos/seed/service7/400/300", description: "Desobstrução profissional de tubulações.", categoryId: 2, prestador: "Roberto Dias", avaliacao: "4.9", avaliacoes: "91", data: "28 de outubro de 2026" },
  ];

  for (const svc of servicesData) {
    db.insert(schema.services).values({
      id: crypto.randomUUID(),
      ...svc,
      createdAt: new Date().toISOString(),
    }).run();
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
