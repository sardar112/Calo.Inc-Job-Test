import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import jobRoutes from "./routes/jobRoutes";
import globalErrorHandler from "./controllers/errorController";
import AppError from "./utils/AppErrror";
import { initializeWebSocket } from "./utils/websocket";

dotenv.config({ path: ".env" });

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/api/v1/jobs", jobRoutes);

// Initialize WebSocket server
initializeWebSocket(server);

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server running on port ${port} ...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});

app.use("**", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaughtException ");
  server.close(() => {
    process.exit(1);
  });
});
