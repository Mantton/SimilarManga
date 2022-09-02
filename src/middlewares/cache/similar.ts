import { RequestHandler } from "express";
import store from "../../helpers/redis";
import { Collection } from "../../types";
import { contentIdentifier } from "../../utils/idGen";
import { logger } from "../../utils/logger";

export const getFromCache: RequestHandler = async (req, res, next) => {
  // Types already validated at this point
  const source = req.params.source as string;
  const content = req.params.content;
  const page = req.query.page;

  if (!store) {
    console.log("Invalid");
  }
  const value = await store.get(
    contentIdentifier(source, content) + `::${page}`
  );

  if (!value) {
    next();
    return;
  }
  const obj = JSON.parse(value);
  res.send(obj);
  return;
};

export const setToCache = async (
  id: { sourceId: string; contentId: string },
  collection: Collection
) => {
  store
    .setEx(
      contentIdentifier(id.sourceId, id.contentId) + `::${collection.page}`,
      10,
      JSON.stringify(collection)
    )
    .catch((err) => {
      logger.error(err.message);
    });
};
