import { findContent } from "../../database/content";
import { database } from "../../helpers";
import { similar } from "../../queries/similar";
import { ContentCollection, Highlight } from "../../types";
import { ErrorMSG } from "../../utils/error";
import { fetchAndSaveContent } from "../content";

export const getSimilarTitles = async (
  sourceId: string,
  contentId: string,
  page: number
): Promise<ContentCollection> => {
  // Get Content
  let content = await findContent(sourceId, contentId);
  // Fetch & Save If Not Found
  if (!content) {
    content = await fetchAndSaveContent(sourceId, contentId);
    if (!content) throw ErrorMSG.ContentNotFound;
  }

  // Get Tags
  let tagIds = content.tags.map((v) => v.tagId);

  let offset = (page - 1) * 30;

  // Get matching source and in list
  let query = similar(content.sourceId, content.contentId, tagIds, offset);

  const value: Highlight[] = await database.$queryRawUnsafe(query);
  return {
    target: content,
    results: value,
    page,
    isLastPage: value.length < 30,
  };
};
