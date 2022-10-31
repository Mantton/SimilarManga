import axios from "axios";
import { Parser, SimpleTag, StoredContent } from "../types";
import { capitalize } from "lodash";
const API_URL = "https://api.mangadex.org";
const COVER_URL = "https://uploads.mangadex.org/covers";

const SOURCE_ID = "org.mangadex";

const parseManga = (data: any, stats: any): StoredContent => {
  const attributes = data.attributes;
  const fileName =
    data.relationships.find((v: any) => v.type === "cover_art")?.attributes
      .fileName ?? "";
  const coverImage = `${COVER_URL}/${data.id}/${fileName}`;

  const tags: any[] = attributes.tags.map((v: any) => {
    return {
      label: v.attributes.name.en,
      id: v.id,
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
    contentId: data.id,
    title: attributes.title[Object.keys(attributes.title)[0]],
    coverImage,
    tags: tags,
    popularity: stats[data.id].follows,
  };
};
const getResultsForTag = async (
  page: number,
  tagId: string
): Promise<StoredContent[]> => {
  let offset = (page - 1) * 100;
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
    return parseManga(entry, stats);
  });
};

export const MangaDex: Parser = {
  id: SOURCE_ID,
  name: "MangaDex",
  getTags: async () => {
    const response = await axios.get(API_URL + "/manga/tag");
    const mapped: SimpleTag[] = response.data.data.map(
      (v: any): SimpleTag => ({
        label: v.attributes.name.en,
        id: v.id,
      })
    );
    return mapped;
  },
  getResults: async (tag, page) => {
    return await getResultsForTag(page, tag);
  },

  getContent: async (id) => {
    const response = await axios.get(API_URL + `/manga/${id}`);
    const data = response.data;

    const statsResponse = await axios.get(API_URL + "/statistics/manga", {
      params: {
        manga: [id],
      },
    });

    const stats = statsResponse.data.statistics;

    return parseManga(data, stats);
  },
};
