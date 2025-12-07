import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Chat Store using Zustand
 */
export const useChatStore = create((set, get) => ({
  chats: [],
  selectedChat: null,
  isLoading: false,
  error: null,

  /**
   * Fetch all chats
   */
  fetchChats: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/chats');
      set({ chats: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch chats error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Select a chat
   */
  selectChat: (chat) => {
    set({ selectedChat: chat });
  },

  /**
   * Access or create a one-to-one chat
   */
  accessChat: async (userId) => {
    try {
      const response = await api.post('/chats', { userId });
      const chat = response.data;

      // Add to chats if not already present
      const { chats } = get();
      if (!chats.find((c) => c._id === chat._id)) {
        set({ chats: [chat, ...chats] });
      }

      set({ selectedChat: chat });
      return chat;
    } catch (error) {
      console.error('Access chat error:', error);
      toast.error('Failed to start chat');
      return null;
    }
  },

  /**
   * Create a group chat
   */
  createGroupChat: async (users, name) => {
    try {
      const response = await api.post('/chats/group', {
        users: JSON.stringify(users),
        name,
      });
      const chat = response.data;

      set({ chats: [chat, ...get().chats], selectedChat: chat });
      toast.success('Group created successfully!');
      return chat;
    } catch (error) {
      console.error('Create group error:', error);
      toast.error('Failed to create group');
      return null;
    }
  },

  /**
   * Rename group
   */
  renameGroup: async (chatId, chatName) => {
    try {
      const response = await api.put('/chats/group/rename', {
        chatId,
        chatName,
      });
      const updatedChat = response.data;

      // Update in chats list
      set({
        chats: get().chats.map((chat) =>
          chat._id === chatId ? updatedChat : chat
        ),
        selectedChat:
          get().selectedChat?._id === chatId
            ? updatedChat
            : get().selectedChat,
      });

      toast.success('Group renamed successfully!');
      return updatedChat;
    } catch (error) {
      console.error('Rename group error:', error);
      toast.error('Failed to rename group');
      return null;
    }
  },

  /**
   * Add user to group
   */
  addToGroup: async (chatId, userId) => {
    try {
      const response = await api.put('/chats/group/add', { chatId, userId });
      const updatedChat = response.data;

      set({
        chats: get().chats.map((chat) =>
          chat._id === chatId ? updatedChat : chat
        ),
        selectedChat:
          get().selectedChat?._id === chatId
            ? updatedChat
            : get().selectedChat,
      });

      toast.success('User added to group!');
      return updatedChat;
    } catch (error) {
      console.error('Add to group error:', error);
      toast.error('Failed to add user');
      return null;
    }
  },

  /**
   * Remove user from group
   */
  removeFromGroup: async (chatId, userId) => {
    try {
      const response = await api.put('/chats/group/remove', { chatId, userId });
      const updatedChat = response.data;

      set({
        chats: get().chats.map((chat) =>
          chat._id === chatId ? updatedChat : chat
        ),
        selectedChat:
          get().selectedChat?._id === chatId
            ? updatedChat
            : get().selectedChat,
      });

      toast.success('User removed from group!');
      return updatedChat;
    } catch (error) {
      console.error('Remove from group error:', error);
      toast.error('Failed to remove user');
      return null;
    }
  },

  /**
   * Update chat in list (for new messages)
   */
  updateChat: (chatId, updates) => {
    set({
      chats: get().chats.map((chat) =>
        chat._id === chatId ? { ...chat, ...updates } : chat
      ),
    });
  },

  /**
   * Move chat to top of list
   */
  moveChatToTop: (chatId) => {
    const { chats } = get();
    const chat = chats.find((c) => c._id === chatId);
    if (chat) {
      const filteredChats = chats.filter((c) => c._id !== chatId);
      set({ chats: [chat, ...filteredChats] });
    }
  },
}));

