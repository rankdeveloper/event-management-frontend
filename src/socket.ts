import { io } from "socket.io-client";

const path =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://event-management-backend-10tv.onrender.com";
export const socket = io(path);
