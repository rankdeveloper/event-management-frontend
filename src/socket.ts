import { io } from "socket.io-client";

const path =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://evenza.r.probir.dev";
export const socket = io(path);
