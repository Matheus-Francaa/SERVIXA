import ngrok from "@ngrok/ngrok";
import { config } from "./config.ts";

const authtoken = process.env.NGROK_AUTHTOKEN;

if (!authtoken) {
  console.error("NGROK_AUTHTOKEN not set. Skipping ngrok tunnel.");
  process.exit(1);
}

try {
  const listener = await ngrok.forward({
    addr: config.port,
    authtoken: authtoken,
  });

  console.log(`Ingress established at ${listener.url()}`);
} catch (err) {
  console.error("ngrok tunnel failed:", err);
  process.exit(1);
}
