import { ContentRep } from "../../database";
import { logger } from "../../utils/logger";
import { sources } from "./sources";
export default async function populate() {
  for (const source of sources) {
    const tags = await source.getTags();
    for (const tag of tags) {
      logger.debug(`Working on ${tag.label} Titles`);
      let iteration = 0;
      const LIMIT = 30;
      while (iteration <= LIMIT) {
        const data = await source.getResults(tag.id, iteration);
        await ContentRep.updateMany(data);
        logger.debug(`\nAdded\n${data.map((v) => v.title).join("\n")}`);
        iteration++;
      }
    }
  }
}

if (require.main === module) {
  main();
}

async function main() {
  populate();
}
