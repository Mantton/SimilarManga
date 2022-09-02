import { content } from "../../database";
import { logger } from "../../utils/logger";
import { sources } from "./sources";
export default async function populate() {
  for (const source of sources) {
    source.getResults(async (results) => {
      results.forEach(async (res) => {
        content
          .upsert(res)
          .then((_c) => {
            if (require.main === module) {
              logger.info(`Added ${res.title}`);
            }
          })
          .catch((err) => {
            logger.error(err.message);
          });
      });
    });
  }
}

if (require.main === module) {
  main();
}

async function main() {
  populate();
}
