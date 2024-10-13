import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import {
    customErrors,
} from "../src/middlewares/errorhandling/customErrors";
import eventRoutes from "./routes/eventRoutes";
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register routes
app.use("/api/v1/events", eventRoutes);

// Handle errors
app.use(customErrors);

export default app;