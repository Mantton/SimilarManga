import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import store from "./helpers/redis";
import { badRouteHandler, errorHandler } from "./helpers";
import router from "./routes/similar";
import { sources } from "./utils/constants";
const app = express();

// Connect Services
store.connect();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(cors());

// Routes
app.use("/similar", router);
app.use("/sources", (_, res) => {
  res.send(sources.map((v) => ({ id: v.id, name: v.name })));
});
// Default Handlers
app.use(errorHandler);
app.use("*", badRouteHandler);
export default app;
