import axios from "axios";
import { Parser, StoredContent, StoredTag } from "../../../types";
import { capitalize, map, toPairs } from "lodash";
import { logger } from "../../../utils/logger";
import { sleep } from "../../../utils/sleep";
const API_URL = "https://api.mangadex.org";
const COVER_URL = "https://uploads.mangadex.org/covers";
const ADULT_TAGS = [
  "b29d6a3d-1569-4e7a-8caf-7557bc92cd5d",
  "97893a4c-12af-4dac-b6be-0dffb353568e",
  "5bd0e105-4481-44ca-b6e7-7544da56b1a3",
];
const SOURCE_ID = "org.mangadex";
const getResultsForTag = async (
  page: number,
  tagId: string
): Promise<StoredContent[]> => {
  let offset = page * 100;
  const response = await axios.get(API_URL + "/manga", {
    params: {
      includes: ["cover_art"],
      offset,
      "order[followedCount]": "desc",
      "order[rating]": "desc",
      contentRating: ["safe", "suggestive", "erotica", "pornographic"],
      limit: 100,
      includedTags: [tagId],
    },
  });
  const data: any[] = response.data.data;

  const statsResponse = await axios.get(API_URL + "/statistics/manga", {
    params: {
      manga: data.map((v) => v.id),
    },
  });

  const stats = statsResponse.data.statistics;

  return data.map((entry: any): StoredContent => {
    const attributes = entry.attributes;
    const fileName =
      entry.relationships.find((v: any) => v.type === "cover_art")?.attributes
        .fileName ?? "";
    const coverImage = `${COVER_URL}/${entry.id}/${fileName}`;

    const tags: StoredTag[] = attributes.tags.map((v: any): StoredTag => {
      return {
        label: v.attributes.name.en,
        id: v.id,
        adult: ADULT_TAGS.includes(v.id),
      };
    });

    if (attributes.populationDemographic) {
      const pd = attributes.populationDemographic;
      tags.push({
        id: `pd|${pd}`,
        label: capitalize(pd),
        adult: false,
      });
    }
    if (attributes.originalLanguage) {
      let label = "unknown";

      switch (attributes.originalLanguage) {
        case "ko": {
          label = "Korean";
          break;
        }

        case "ja": {
          label = "Japanese";
          break;
        }
        case "en": {
          label = "English";
          break;
        }
        case "zh": {
          label = "Chinese Traditional";
          break;
        }
        case "zh-hk": {
          label = "Chinese Simplified";
          break;
        }
      }

      if (label !== "unknown") {
        tags.push({
          id: `lang|${attributes.originalLanguage}`,
          label,
          adult: false,
        });
      }
    }
    if (attributes.contentRating) {
      tags.push({
        id: `cr|${attributes.contentRating}`,
        label: capitalize(attributes.contentRating),
        adult: attributes.contentRating === "pornographic",
      });
    }

    return {
      sourceId: SOURCE_ID,
      contentId: entry.id,
      title: attributes.title[Object.keys(attributes.title)[0]],
      coverImage,
      tags: tags,
      popularity: stats[entry.id].follows,
    };
  });
};

export const MangaDex: Parser = {
  sourceId: SOURCE_ID,
  getResults: async (callback) => {
    const PAGE_LIMIT = 20;
    let iteration = 0;

    // Get All Tags
    const tags: string[] = [];
    const response = await axios.get(API_URL + "/manga/tag");
    const mapped: string[] = response.data.data.map((v: any) => v.id);
    tags.push(...mapped);

    // Loop through
    for (const tag of tags) {
      iteration = 0;
      logger.debug(`Working on Tag: ${tag}`);
      while (iteration <= PAGE_LIMIT) {
        try {
          const result = await getResultsForTag(iteration, tag);
          callback(result);
          await sleep(250); // hacky rate limit
          iteration++;
        } catch (err: any) {
          logger.error(err.message);
          break;
        }
      }
    }

    logger.info(`\n\nCompleted ${SOURCE_ID}`);
  },
};
