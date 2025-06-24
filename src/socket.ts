import { io } from "socket.io-client";

const path =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://ocgg00o40ksg088g4w4gs440.coolify.probir.dev";
export const socket = io(path);
