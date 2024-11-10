import { io } from "socket.io-client";

const domain = import.meta.env.PROD
  ? "https://online-live-collaboration-whiteboard.onrender.com"
  : "http://localhost:3000";

export const socket = io(domain);
