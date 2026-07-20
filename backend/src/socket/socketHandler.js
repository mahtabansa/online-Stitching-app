import { Server } from "socket.io";

// socket/socketHandler.js

let io = null;

export function initSocket(server) {
  if (io) {
    console.log("⚠️ Socket already initialized, skipping...");
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("registerUser", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // ✅ Owner register
    socket.on("registerOwner", (ownerId) => {
      socket.join(`owner_${ownerId}`);
      console.log(`Owner ${ownerId} joined room owner_${ownerId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io; // ✅ return karna zaroori hai
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
