const BASE = "http://localhost:3000/api";

const users = [
  { name: "João Silva", email: "joao@servixa.com", password: "123456" },
  { name: "Carlos Mendes", email: "carlos@servixa.com", password: "123456" },
  { name: "Pedro Costa", email: "pedro@servixa.com", password: "123456" },
  { name: "Maria Costa", email: "maria@servixa.com", password: "123456" },
  { name: "André Oliveira", email: "andre@servixa.com", password: "123456" },
  { name: "Roberto Dias", email: "roberto@servixa.com", password: "123456" },
];

const prestadorNameMap: Record<string, string> = {
  "João Silva": "joao@servixa.com",
  "Carlos Mendes": "carlos@servixa.com",
  "Pedro Costa": "pedro@servixa.com",
  "Maria Costa": "maria@servixa.com",
  "André Oliveira": "andre@servixa.com",
  "Roberto Dias": "roberto@servixa.com",
};

async function signup(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${BASE}/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || body.error || "Signup failed");
  return body.user as { id: string; name: string; email: string };
}

async function main() {
  console.log("Creating demo user: demo@servixa.com / 123456");
  const demo = await signup({ name: "Professor", email: "demo@servixa.com", password: "123456" });
  console.log(`  -> demo user ID: ${demo.id}`);

  const created: Record<string, string> = {};
  for (const u of users) {
    console.log(`Creating prestador: ${u.name} (${u.email})`);
    try {
      const user = await signup(u);
      created[u.name] = user.id;
    } catch (e: any) {
      console.log(`  -> ${e.message}`);
    }
  }

  const Database = require("better-sqlite3");
  const { drizzle } = require("drizzle-orm/better-sqlite3");
  const { eq } = require("drizzle-orm");
  const schema = require("./schema");

  const sqlite = new Database("./servixa.db");
  const db = drizzle(sqlite, { schema });

  const allServices = db.select().from(schema.services).all();
  let updated = 0;
  for (const svc of allServices) {
    const email = prestadorNameMap[svc.prestador];
    if (email && created[svc.prestador]) {
      db.update(schema.services)
        .set({ userId: created[svc.prestador] })
        .where(eq(schema.services.id, svc.id))
        .run();
      updated++;
    }
  }
  console.log(`Updated ${updated} services with prestador userIds`);
  console.log("Demo users seeded successfully!");
}

main().catch((e) => {
  console.error("seed-users failed:", e.message);
  process.exit(1);
});
