import { database } from "../../helpers";
import { StoredContent } from "../../types";

const get = (sourceId: string, contentId: string) => {
  return database.content.findUnique({
    where: {
      id: {
        sourceId,
        contentId,
      },
    },
  });
};

const upsert = (content: StoredContent) => {
  return database.$transaction(async (db) => {
    const out = await db.content.upsert({
      create: {
        contentId: content.contentId,
        sourceId: content.sourceId,
        title: content.title,
        coverImage: content.coverImage,

        popularity: content.popularity,
      },
      update: {
        title: content.title,
        coverImage: content.coverImage,
        popularity: content.popularity,
      },
      where: {
        id: {
          sourceId: content.sourceId,
          contentId: content.contentId,
        },
      },
    });
    for (const tag of content.tags) {
      await db.tag.upsert({
        create: {
          tagId: tag.id,
          label: tag.label,
          sourceId: content.sourceId,
          adultContent: tag.adult,
        },
        update: {
          label: tag.label,
        },
        where: {
          id: {
            tagId: tag.id,
            sourceId: content.sourceId,
          },
        },
      });

      await db.contentTag.upsert({
        create: {
          tagId: tag.id,
          contentId: content.contentId,
          sourceId: content.sourceId,
        },
        update: {},
        where: {
          id: {
            tagId: tag.id,
            sourceId: content.sourceId,
            contentId: content.contentId,
          },
        },
      });
    }
    return out;
  });
};

export { get, upsert };
