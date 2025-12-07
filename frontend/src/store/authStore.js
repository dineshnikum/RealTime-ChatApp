import { create } from 'zustand';
import api from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';
import toast from 'react-hot-toast';

/**
 * Authentication Store using Zustand
 */
export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isLoading: true,
    error: null,

    /**
     * Check if user is authenticated
     */
    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isLoading: false, user: null });
            return;
        }

        try {
            const response = await api.get('/auth/me');
            set({ user: response.data, isLoading: false });

            // Initialize socket connection
            initSocket(token);
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            set({ user: null, token: null, refreshToken: null, isLoading: false });
        }
    },

    /**
     * Login user
     */
    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/auth/login', { email, password });
            const { token, refreshToken, ...user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            set({
                user,
                token,
                refreshToken,
                isLoading: false,
            });

            // Initialize socket connection
            initSocket(token);

            toast.success('Logged in successfully!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, isLoading: false });
            toast.error(message);
            return false;
        }
    },

    /**
     * Signup user
     */
    signup: async (name, email, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/auth/signup', { name, email, password });
            const { token, refreshToken, ...user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            set({
                user,
                token,
                refreshToken,
                isLoading: false,
            });

            // Initialize socket connection
            initSocket(token);

            toast.success('Account created successfully!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Signup failed';
            set({ error: message, isLoading: false });
            toast.error(message);
            return false;
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            disconnectSocket();
            set({ user: null, token: null, refreshToken: null });
            toast.success('Logged out successfully!');
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (data) => {
        try {
            const formData = new FormData();

            if (data.name !== undefined) {
                formData.append('name', data.name);
            }

            if (data.bio !== undefined) {
                formData.append('bio', data.bio);
            }

            if (data.avatar) {
                formData.append('avatar', data.avatar);
            }

            if (data.avatarFile) {
                formData.append('avatar', data.avatarFile);
            }

            console.log(formData);

            const response = await api.put('/auth/profile', formData);
            set({ user: response.data });
            toast.success('Profile updated successfully!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Update failed';
            toast.error(message);
            return false;
        }
    },
}));

