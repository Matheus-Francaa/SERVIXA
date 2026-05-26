import { db } from "../db.js";
import { eq } from "drizzle-orm";
import * as schema from "../schema.js";
import { config } from "../config.js";

const BASE = config.baseURL;
const PASS = process.env.DEMO_PASSWORD || "servixa123";

const users = [
  { name: "João Silva", email: "joao@servixa.com", password: PASS },
  { name: "Carlos Mendes", email: "carlos@servixa.com", password: PASS },
  { name: "Pedro Costa", email: "pedro@servixa.com", password: PASS },
  { name: "Maria Costa", email: "maria@servixa.com", password: PASS },
  { name: "André Oliveira", email: "andre@servixa.com", password: PASS },
  { name: "Roberto Dias", email: "roberto@servixa.com", password: PASS },
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
  const res = await fetch(`${BASE}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || body.error || "Signup failed");
  return body.user as { id: string; name: string; email: string };
}

async function main() {
  console.log("Creating demo user: demo@servixa.com / servixa123");
  const demo = await signup({ name: "Professor", email: "demo@servixa.com", password: PASS });
  console.log(`  -> demo user ID: ${demo.id}`);

  const created: Record<string, string> = {};
  for (const u of users) {
    console.log(`Creating prestador: ${u.name} (${u.email})`);
    try {
      const user = await signup(u);
      created[u.name] = user.id;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.log(`  -> ${message}`);
    }
  }

  const allServices = await db.select().from(schema.services);
  let updated = 0;
  for (const svc of allServices) {
    const email = prestadorNameMap[svc.prestador ?? ""];
    if (email && created[svc.prestador ?? ""]) {
      await db
        .update(schema.services)
        .set({ userId: created[svc.prestador!] })
        .where(eq(schema.services.id, svc.id));
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
