import "dotenv/config";
import { logger } from "./logger";

// Server
export const PORT = process.env["PORT"] ?? 5000;

// Redis
export const REDIS_HOST = process.env["REDIS_HOST"];

if (!REDIS_HOST) {
  logger.error("REDIS_HOST not set");
  process.exit(1);
}

// Environment
export const ENVIRONMENT = process.env.NODE_ENV ?? "development";
export const isProductionEnvironment = ENVIRONMENT === "production";

// Database
export const DB_URI = process.env["DB_URI"];
