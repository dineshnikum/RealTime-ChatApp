import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Message Store using Zustand
 */
export const useMessageStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  typingUsers: {},

  /**
   * Fetch messages for a chat
   */
  fetchMessages: async (chatId) => {
    try {
      set({ isLoading: true });
      const response = await api.get(`/messages/${chatId}`);
      set({ messages: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch messages error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Send a message
   */
  sendMessage: async (chatId, content, imageUrl = '') => {
    try {
      const response = await api.post('/messages', {
        chatId,
        content,
        imageUrl,
      });
      const newMessage = response.data;

      set({ messages: [...get().messages, newMessage] });
      return newMessage;
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      return null;
    }
  },

  /**
   * Add received message
   */
  addMessage: (message) => {
    const { messages } = get();
    // Prevent duplicates
    if (!messages.find((m) => m._id === message._id)) {
      set({ messages: [...messages, message] });
    }
  },

  /**
   * Mark messages as seen
   */
  markAsSeen: async (messageIds) => {
    try {
      await api.put('/messages/seen', { messageIds });
    } catch (error) {
      console.error('Mark as seen error:', error);
    }
  },

  /**
   * Upload image
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/messages/upload', formData);

      return response.data.imageUrl;
    } catch (error) {
      console.error('Upload image error:', error);
      toast.error('Failed to upload image');
      return null;
    }
  },

  /**
   * Search messages in a chat
   */
  searchMessages: async (chatId, query) => {
    try {
      const response = await api.get(`/messages/search/${chatId}?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Search messages error:', error);
      toast.error('Failed to search messages');
      return [];
    }
  },

  /**
   * Set typing user
   */
  setTyping: (chatId, userName) => {
    set({
      typingUsers: {
        ...get().typingUsers,
        [chatId]: userName,
      },
    });
  },

  /**
   * Remove typing user
   */
  removeTyping: (chatId) => {
    const typingUsers = { ...get().typingUsers };
    delete typingUsers[chatId];
    set({ typingUsers });
  },

  /**
   * Clear messages
   */
  clearMessages: () => {
    set({ messages: [] });
  },
}));

