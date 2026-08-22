import { io, Socket } from "socket.io-client";
import { HOST_URL } from "../constants/ApiEndpoint";

// 🔴 TẠM THỜI TẮT SOCKET - SET = true ĐỂ BẬT LẠI
const SOCKET_DISABLED = false;

let socket: Socket;

if (SOCKET_DISABLED) {
  // Mock socket object - không kết nối thật
  socket = {
    on: () => {},
    off: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {},
    id: "mock-socket-id",
    connected: false,
  } as any;

  console.log("⚠️ Socket is DISABLED");
} else {
  // Kết nối socket thật
  socket = io(HOST_URL, {
    secure: true,
    rejectUnauthorized: false,
    path: "/socket.io",
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Socket disconnected:", reason);
  });
}

export default socket;
