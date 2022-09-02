import { ContentRep } from "../../database";
import { logger } from "../../utils/logger";
import { sources } from "./sources";
export default async function populate() {
  for (const source of sources) {
    const tags = await source.getTags();

    for (const tag of tags) {
      logger.debug(`Working on ${tag.label}-${tag.id} Titles`);
      let iteration = 1;
      const LIMIT = 30;
      while (iteration <= LIMIT) {
        const data = await source.getResults(tag.id, iteration);
        if (data.length == 0) {
          break;
        }
        await ContentRep.updateMany(data);
        iteration++;
      }
      logger.info(`${tag.label} Completed`);
    }
  }
}

if (require.main === module) {
  main();
}

async function main() {
  populate();
}
