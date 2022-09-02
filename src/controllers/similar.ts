import { RequestHandler } from "express";
import { setToCache } from "../middlewares/cache/similar";
import { getSimilarTitles } from "../services/similar";

export const handleGetSimilar: RequestHandler = async (req, res, next) => {
  const sourceId = req.params.source as string;
  const contentId = req.params.content as string;

  const page = parseInt(req.query.page as string) || 1;
  try {
    const results = await getSimilarTitles(
      sourceId,
      contentId,
      Math.max(page, 1)
    );
    setToCache({ sourceId, contentId }, results);

    res.send(results);
  } catch (err) {
    next(err);
  }
};
