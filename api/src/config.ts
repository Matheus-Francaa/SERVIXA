function parseOrigins(input: string | undefined): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  dbPath: process.env.SERVIXA_DB_PATH || "./servixa.db",
  trustedOrigins: [
    ...parseOrigins(process.env.BETTER_AUTH_TRUSTED_ORIGINS),
    "https://*.ngrok-free.dev",
    "https://*.ngrok.io",
    "https://*.ngrok.app",
    "http://localhost:*",
    "http://10.0.2.2:*",
  ],
};
