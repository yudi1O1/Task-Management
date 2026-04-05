import { app } from "./app";
import { env } from "./config/env";

if (process.env.VERCEL !== "1") {
  app.listen(env.port, () => {
    console.log(`Backend server is running on http://localhost:${env.port}`);
  });
}
