import WebSocket, { WebSocketServer } from "ws";
import http from "http";

import { JobStatus } from "../enums/jobstatus.enum";

let wss: WebSocketServer | null = null;

export function initializeWebSocket(server: http.Server) {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");
  });
}

// Function to notify clients of job completion
export function notifyJobCompletion(jobId: string, result: string) {
  if (!wss) {
    console.warn("WebSocket server not initialized.");
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({ jobId, result, status: JobStatus.RESOLVED })
      );
    }
  });
}
