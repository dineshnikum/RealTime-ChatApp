import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Store online users: { userId: socketId }
const onlineUsers = new Map();

/**
 * Initialize Socket.io server
 */
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.userId = user._id.toString();
            socket.userData = user;
            next();
        } catch (error) {
            console.error('Socket authentication error:', error);
            next(new Error('Authentication error'));
        }
    });

    // Listen for new connections
    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.userId}`);

        // Add user to online users
        onlineUsers.set(socket.userId, socket.id);

        // Notify all users about online status
        io.emit('user-online', {
            userId: socket.userId,
            status: 'online',
        });

        // Join user to their personal room for direct messages
        socket.join(socket.userId);

        /**
         * Join a chat room
         */
        socket.on('join-chat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.userId} joined chat: ${chatId}`);
        });

        /**
         * Leave a chat room
         */
        socket.on('leave-chat', (chatId) => {
            socket.leave(chatId);
            console.log(`User ${socket.userId} left chat: ${chatId}`);
        });

        /**
         * Send a new message
         */
        socket.on('new-message', (message) => {
            const chat = message.chat;

            if (!chat || !chat.users) return;

            // Emit message to all users in the chat except sender
            chat.users.forEach((user) => {
                if (user._id === socket.userId) return;
                io.to(user._id).emit('message-received', message);
            });

            // Emit to the chat room as well
            socket.to(chat._id).emit('message-received', message);
        });

        /**
         * Typing indicator
         */
        socket.on('typing', ({ chatId, userName }) => {
            socket.to(chatId).emit('typing', { chatId, userName });
        });

        socket.on('stop-typing', ({ chatId }) => {
            socket.to(chatId).emit('stop-typing', { chatId });
        });

        /**
         * Message seen
         */
        socket.on('message-seen', ({ chatId, messageId, userId }) => {
            socket.to(chatId).emit('message-seen', { messageId, userId });
        });

        /**
         * User status update
         */
        socket.on('update-status', async ({ status }) => {
            try {
                const user = await User.findById(socket.userId);
                if (user) {
                    user.status = status;
                    if (status === 'offline') {
                        user.lastSeen = Date.now();
                    }
                    await user.save();

                    // Notify all users about status change
                    io.emit('user-status-changed', {
                        userId: socket.userId,
                        status: status,
                        lastSeen: user.lastSeen,
                    });
                }
            } catch (error) {
                console.error('Update status error:', error);
            }
        });

        /**
         * Create group chat notification
         */
        socket.on('group-created', ({ chat, users }) => {
            users.forEach((userId) => {
                io.to(userId).emit('group-created', chat);
            });
        });

        /**
         * User added to group notification
         */
        socket.on('user-added-to-group', ({ chat, userId }) => {
            io.to(userId).emit('added-to-group', chat);
        });

        /**
         * User removed from group notification
         */
        socket.on('user-removed-from-group', ({ chatId, userId }) => {
            io.to(userId).emit('removed-from-group', chatId);
        });

        /**
         * Group renamed notification
         */
        socket.on('group-renamed', ({ chat }) => {
            socket.to(chat._id).emit('group-renamed', chat);
        });

        /**
         * Disconnect
         */
        socket.on('disconnect', async () => {
            console.log(`❌ User disconnected: ${socket.userId}`);

            // Remove from online users
            onlineUsers.delete(socket.userId);

            // Update user status to offline
            try {
                const user = await User.findById(socket.userId);
                if (user) {
                    user.status = 'offline';
                    user.lastSeen = Date.now();
                    await user.save();

                    // Notify all users about offline status
                    io.emit('user-offline', {
                        userId: socket.userId,
                        status: 'offline',
                        lastSeen: user.lastSeen,
                    });
                }
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        });
    });

    return io;
};

export { onlineUsers };

