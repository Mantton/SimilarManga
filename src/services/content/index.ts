import { Content, Tag } from "@prisma/client";
import { findContent, updateMany } from "../../database/content";
import { sources } from "../../utils/constants";
import { ErrorMSG } from "../../utils/error";
export const fetchAndSaveContent = async (
  sourceId: string,
  contentId: string
) => {
  const source = sources.find((v) => v.id == sourceId);

  if (!source) {
    throw ErrorMSG.SourceNotFound;
  }

  try {
    const content = await source.getContent(contentId);
    await updateMany([content]);

    return findContent(content.sourceId, content.contentId);
  } catch (_) {
    throw ErrorMSG.ContentNotFound;
  }
};
