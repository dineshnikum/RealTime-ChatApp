import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * User Store using Zustand
 */
export const useUserStore = create((set, get) => ({
  users: [],
  onlineUsers: new Set(),
  isLoading: false,
  error: null,

  /**
   * Search users
   */
  searchUsers: async (query) => {
    try {
      set({ isLoading: true });
      const response = await api.get(`/users/search?query=${query}`);
      set({ users: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  /**
   * Get all users
   */
  getAllUsers: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/users');
      set({ users: response.data, isLoading: false });
    } catch (error) {
      console.error('Get all users error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Set user online
   */
  setUserOnline: (userId) => {
    const { onlineUsers } = get();
    onlineUsers.add(userId);
    set({ onlineUsers: new Set(onlineUsers) });
  },

  /**
   * Set user offline
   */
  setUserOffline: (userId) => {
    const { onlineUsers } = get();
    onlineUsers.delete(userId);
    set({ onlineUsers: new Set(onlineUsers) });
  },

  /**
   * Check if user is online
   */
  isUserOnline: (userId) => {
    return get().onlineUsers.has(userId);
  },
}));

