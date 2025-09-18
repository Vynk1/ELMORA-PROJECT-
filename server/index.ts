import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import chatHandler from "./chat-handler";
import speechToTextHandler from "./speech-to-text-handler";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // Chat functionality
  app.use("/api", chatHandler);
  
  // Speech-to-text functionality
  app.use("/api", speechToTextHandler);

  return app;
}
