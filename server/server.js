import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-beta-khaki.vercel.app"
];

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "4mb" }));

// 🔥 FIXED CORS FOR EXPRESS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Store online users
export const userSocketMap = {};

// 🔥 FIXED CORS FOR SOCKET.IO
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Socket.IO auth middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("jwt must be provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded._id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Handle connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  if (socket.userId) userSocketMap[socket.userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
    if (socket.userId) delete userSocketMap[socket.userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Connect DB
await connectDB();

// Start server (local only)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log("Server running on port:", PORT)
  );
}

// Export server for Vercel
export default server;
