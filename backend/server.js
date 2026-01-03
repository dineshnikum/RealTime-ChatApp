import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket/socket.js";
import { errorHandler, notFound } from "./middleware/error.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingEnvVars.forEach((envVar) => console.error(`   - ${envVar}`));
    console.error(
        "\nPlease set these variables in your Render dashboard or .env file"
    );
    process.exit(1);
}

connectDB();

const app = express();

// Create HTTP server and initialize Socket.io
const server = createServer(app);
const io = initializeSocket(server);

// Make io accessible in routes
app.set("io", io);

// Middlewares
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Chat App API is running...",
        status: "online",
        timestamp: new Date().toISOString(),
    });
});

// Health check endpoint for monitoring
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// Handle favicon.ico requests to prevent 404 errors
app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io server is ready`);
});

export default app;
