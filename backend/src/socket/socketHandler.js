import { Server } from "socket.io";
import { configDotenv } from "dotenv";
configDotenv();
// socket/socketHandler.js

let io = null;

export function initSocket(server) {
  if (io) {
    console.log("⚠️ Socket already initialized, skipping...");
    return io;
  }
  console.log("process.env.Frontend_URL in sockethandler",process.env.Frontend_URL)

io = new Server(server, {
  cors: {
    origin:process.env.Frontend_URL, // ✅ frontend URL  "https://online-stitching-app.onrender.com"
    methods: ["GET", "POST"],
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
