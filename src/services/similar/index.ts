import { database } from "../../helpers";
import { similar } from "../../queries/similar";
import { Collection, Highlight } from "../../types";
import { ErrorMSG } from "../../utils/error";

export const getSimilarTitles = async (
  sourceId: string,
  contentId: string,
  page: number
): Promise<Collection> => {
  // Get Content
  const content = await database.content.findUnique({
    where: {
      id: {
        sourceId,
        contentId,
      },
    },
    include: {
      linkedTags: true,
    },
  });

  if (!content) throw new Error(ErrorMSG.ContentNotFound);

  // Get Tags
  let tagIds = content.linkedTags.map((v) => v.tagId);

  let offset = (page - 1) * 30;

  // Get matching source and in list
  let query = similar(content.sourceId, content.contentId, tagIds, offset);

  const value: Highlight[] = await database.$queryRawUnsafe(query);
  return {
    results: value,
    page,
    isLastPage: value.length < 30,
  };
};
