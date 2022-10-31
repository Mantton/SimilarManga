import app from "./app";
import populate from "./jobs/populate";
import { logger } from "./utils/logger";
import { ENVIRONMENT, PORT } from "./utils/secrets";

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${ENVIRONMENT} mode`);
});

export default server;
