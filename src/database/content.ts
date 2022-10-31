import { database } from "../helpers";
import { StoredContent } from "../types";

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

export const findContent = async (sourceId: string, contentId: string) => {
  return database.content.findUnique({
    where: {
      id: {
        sourceId,
        contentId,
      },
    },
    include: {
      tags: true,
    },
  });
};
