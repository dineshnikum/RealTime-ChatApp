// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initializeSocket } from './socket/socket.js';
import { errorHandler, notFound } from './middleware/error.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Chat App API is running...' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io server is ready`);
});

export default app;

