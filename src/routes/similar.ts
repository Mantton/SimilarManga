import { Router } from "express";
import { validateSimilarRequest } from "../validations/validateSimilarRequest";
import * as Controller from "../controllers/similar";
import { getFromCache } from "../middlewares/cache/similar";

const router = Router();

router.get(
  "/:source/:content",
  [validateSimilarRequest, getFromCache],
  Controller.handleGetSimilar
);

export default router;
