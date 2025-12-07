import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

/**
 * Initialize socket connection
 */
export const initSocket = (token) => {
    if (socket) {
        return socket;
    }

    socket = io(SOCKET_URL, {
        auth: {
            token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected');
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    return socket;
};

/**
 * Get socket instance
 */
export const getSocket = () => {
    return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Emit event
 */
export const emit = (event, data) => {
    if (socket) {
        socket.emit(event, data);
    }
};

/**
 * Listen to event
 */
export const on = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
    }
};

/**
 * Remove event listener
 */
export const off = (event, callback) => {
    if (socket) {
        socket.off(event, callback);
    }
};

