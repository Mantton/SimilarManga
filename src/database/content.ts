import { database } from "../helpers";
import { StoredContent } from "../types";

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

export const updateMany = async (content: StoredContent[]) => {
  const tags = content.flatMap((c) => {
    let tags = c.tags;
    let arr = tags.map((t) => ({
      sourceId: c.sourceId,
      contentId: c.contentId,
      tagId: t.id,
    }));
    return arr;
  });
  await database.$transaction([
    database.content.deleteMany({
      where: {
        sourceId: {
          in: content.map((v) => v.sourceId),
        },
        contentId: {
          in: content.map((v) => v.contentId),
        },
      },
    }),
    database.content.createMany({
      data: content.map((v) => ({
        sourceId: v.sourceId,
        contentId: v.contentId,
        title: v.title,
        popularity: v.popularity,
        coverImage: v.coverImage,
      })),
    }),
    database.tag.deleteMany({
      where: {
        sourceId: {
          in: content.map((v) => v.sourceId),
        },

        contentId: {
          in: content.map((v) => v.contentId),
        },
        tagId: {
          in: tags.map((v) => v.tagId),
        },
      },
    }),

    database.tag.createMany({
      data: tags,
      skipDuplicates: true,
    }),
  ]);
};
const upsert = (content: StoredContent) => {
  return database.$transaction(
    async (db) => {
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
      // for (const tag of content.tags) {
      //   await db.tag.upsert({
      //     create: {
      //       tagId: tag.id,
      //       label: tag.label,
      //       sourceId: content.sourceId,
      //       adultContent: tag.adult,
      //     },
      //     update: {
      //       label: tag.label,
      //     },
      //     where: {
      //       id: {
      //         tagId: tag.id,
      //         sourceId: content.sourceId,
      //       },
      //     },
      //   });

      //   await db.contentTag.upsert({
      //     create: {
      //       tagId: tag.id,
      //       contentId: content.contentId,
      //       sourceId: content.sourceId,
      //     },
      //     update: {},
      //     where: {
      //       id: {
      //         tagId: tag.id,
      //         sourceId: content.sourceId,
      //         contentId: content.contentId,
      //       },
      //     },
      //   });
      // }
      return out;
    },
    {
      maxWait: 20000, // default: 2000
      timeout: 60000, // default: 5000
    }
  );
};

export { get, upsert };
