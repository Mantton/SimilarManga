import { createClient } from "redis";
import { logger } from "../utils/logger";
import { REDIS_HOST } from "../utils/secrets";

// ---
const store = (() => {
  const client = createClient({
    url: REDIS_HOST,
  });

  return client;
})();

// Events
store.on("error", (err) => {
  logger.error(`Redis Client Error: ${err.message}`);
  process.exit(1);
});
store.on("connect", () => {
  logger.info("Redis Connected Successfully");
});
store.on("quit", () => {
  logger.info("Redis Disconnected Successfully");
});

// ---
export default store;
