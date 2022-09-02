import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import store from "./helpers/redis";
import { badRouteHandler, errorHandler } from "./helpers";
import router from "./routes/similar";
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
// Default Handlers
app.use(errorHandler);
app.use("*", badRouteHandler);
export default app;
