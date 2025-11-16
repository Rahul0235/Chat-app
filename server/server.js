import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// ALLOWED FRONTEND ORIGINS
const allowedOrigins = [
  "https://chat-app-beta-khaki.vercel.app",
  "http://localhost:5173",
];

const app = express();
const server = http.createServer(app);

// JSON Middleware
app.use(express.json({ limit: "4mb" }));

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Preflight for all routes
app.options("*", cors());

// ROUTES
app.get("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// SOCKET.IO
export const userSocketMap = {};

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// SOCKET AUTH MIDDLEWARE
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

// SOCKET CONNECTION HANDLER
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

// START SERVER
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });
