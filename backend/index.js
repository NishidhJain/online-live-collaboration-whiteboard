import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

const corsConfig = {
  origin:
    app.settings.env === "development"
      ? "http://localhost:5173"
      : "https://whiteboard-signoz.netlify.app/",
};

app.use(cors(corsConfig));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsConfig,
});

io.on("connection", (socket) => {
  socket.on("begin_path", (actionData) => {
    socket.broadcast.emit("begin_path", actionData);
  });

  socket.on("draw", (actionData) => {
    socket.broadcast.emit("draw", actionData);
  });

  socket.on("erase", (actionData) => {
    socket.broadcast.emit("erase", actionData);
  });

  socket.on("clear_whiteboard", () => {
    socket.broadcast.emit("clear_whiteboard");
  });
});

httpServer.listen(3000);
