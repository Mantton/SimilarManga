import { ErrorRequestHandler, RequestHandler } from "express";
import { logger } from "../utils/logger";
import { ErrorMSG } from "../utils/error";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (res.headersSent) {
    logger.error(err.message + "\n HEADERS SENT");
    return;
  }

  // TODO: Handle this better
  switch (err.message) {
    case ErrorMSG.ContentNotFound: {
      res.status(404).send({ msg: "Content not found" });
      break;
    }
    default: {
      res.status(500).send({
        msg: "server error",
        error: err.message,
        report: "https://github.com/MangaSoup/Server",
      });
    }
  }
};

export const badRouteHandler: RequestHandler = (_req, res) => {
  res.status(404).send({ msg: "not found" });
};
