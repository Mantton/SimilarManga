import { RequestHandler } from "express";
import { VALID_SOURCES } from "../utils/constants";

export const validateSimilarRequest: RequestHandler = (req, res, next) => {
  const source = req.params.source;
  const content = req.params.content;
  const page = req.query.page ?? "1";

  if (
    typeof page != "string" ||
    !parseInt(page) ||
    !VALID_SOURCES.includes(source)
  ) {
    res.status(400).send({ msg: "bad request" });
    return;
  }

  next();
};
