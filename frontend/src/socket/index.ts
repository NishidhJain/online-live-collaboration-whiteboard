import { io } from "socket.io-client";

const domain = "http://localhost:3000";

export const socket = io(domain);
