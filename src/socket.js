import { io } from "socket.io-client";

export const socket = io.connect("http://localhost:3111", {
  autoConnect: false,
});
