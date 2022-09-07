import app from "./app";
import populate from "./jobs/populate";
import { logger } from "./utils/logger";
import { ENVIRONMENT, PORT } from "./utils/secrets";

const registerJobs = () => {
  setInterval(() => {
    populate();
  }, 7 * 24 * 60 * 60 * 1000);
};
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${ENVIRONMENT} mode`);
  registerJobs();
});

export default server;
