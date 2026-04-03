import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "prisma/config";

// Load environment variables from our config folder
// We use DOTENV_CONFIG_PATH if set, otherwise default to config/.env.development
const envPath = process.env.DOTENV_CONFIG_PATH || path.resolve(__dirname, "config/.env.development");
dotenv.config({ path: envPath });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
