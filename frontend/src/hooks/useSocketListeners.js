import { useEffect } from 'react';
import { getSocket, on, off } from '../services/socket';
import { useChatStore } from '../store/chatStore';
import { useMessageStore } from '../store/messageStore';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

/**
 * Custom hook to set up Socket.io event listeners
 */
export const useSocketListeners = () => {
  const { user } = useAuthStore();
  const { selectedChat, updateChat, moveChatToTop } = useChatStore();
  const { addMessage, setTyping, removeTyping, markAsSeen } = useMessageStore();
  const { setUserOnline, setUserOffline } = useUserStore();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    /**
     * Handle new message received
     */
    const handleMessageReceived = (message) => {
      console.log('Message received:', message);

      // Add message if in the same chat
      if (selectedChat && message.chat._id === selectedChat._id) {
        addMessage(message);

        // Mark as seen automatically
        if (message.sender._id !== user?._id) {
          markAsSeen([message._id]);
        }
      }

      // Update chat's latest message
      updateChat(message.chat._id, {
        latestMessage: message,
      });

      // Move chat to top
      moveChatToTop(message.chat._id);

      // Show notification if not in current chat
      if (!selectedChat || message.chat._id !== selectedChat._id) {
        if (message.sender._id !== user?._id) {
          toast(
            `${message.sender.name}: ${message.content || 'Sent an image'}`,
            {
              icon: '💬',
              duration: 3000,
            }
          );
        }
      }
    };

    /**
     * Handle typing indicator
     */
    const handleTyping = ({ chatId, userName }) => {
      if (selectedChat && chatId === selectedChat._id) {
        setTyping(chatId, userName);
      }
    };

    /**
     * Handle stop typing
     */
    const handleStopTyping = ({ chatId }) => {
      removeTyping(chatId);
    };

    /**
     * Handle user online
     */
    const handleUserOnline = ({ userId }) => {
      console.log('User online:', userId);
      setUserOnline(userId);
    };

    /**
     * Handle user offline
     */
    const handleUserOffline = ({ userId }) => {
      console.log('User offline:', userId);
      setUserOffline(userId);
    };

    /**
     * Handle user status changed
     */
    const handleUserStatusChanged = ({ userId, status }) => {
      console.log('User status changed:', userId, status);
      if (status === 'online') {
        setUserOnline(userId);
      } else {
        setUserOffline(userId);
      }
    };

    /**
     * Handle message seen
     */
    const handleMessageSeen = ({ messageId, userId }) => {
      // Update message seen status in UI if needed
      console.log('Message seen:', messageId, userId);
    };

    /**
     * Handle group created
     */
    const handleGroupCreated = (chat) => {
      toast.success(`You were added to ${chat.chatName}`);
    };

    /**
     * Handle added to group
     */
    const handleAddedToGroup = (chat) => {
      toast.success(`You were added to ${chat.chatName}`);
    };

    /**
     * Handle removed from group
     */
    const handleRemovedFromGroup = (chatId) => {
      toast.error('You were removed from a group');
    };

    /**
     * Handle group renamed
     */
    const handleGroupRenamed = (chat) => {
      if (selectedChat && chat._id === selectedChat._id) {
        updateChat(chat._id, { chatName: chat.chatName });
      }
    };

    // Register all event listeners
    on('message-received', handleMessageReceived);
    on('typing', handleTyping);
    on('stop-typing', handleStopTyping);
    on('user-online', handleUserOnline);
    on('user-offline', handleUserOffline);
    on('user-status-changed', handleUserStatusChanged);
    on('message-seen', handleMessageSeen);
    on('group-created', handleGroupCreated);
    on('added-to-group', handleAddedToGroup);
    on('removed-from-group', handleRemovedFromGroup);
    on('group-renamed', handleGroupRenamed);

    // Cleanup: remove all event listeners on unmount
    return () => {
      off('message-received', handleMessageReceived);
      off('typing', handleTyping);
      off('stop-typing', handleStopTyping);
      off('user-online', handleUserOnline);
      off('user-offline', handleUserOffline);
      off('user-status-changed', handleUserStatusChanged);
      off('message-seen', handleMessageSeen);
      off('group-created', handleGroupCreated);
      off('added-to-group', handleAddedToGroup);
      off('removed-from-group', handleRemovedFromGroup);
      off('group-renamed', handleGroupRenamed);
    };
  }, [
    selectedChat,
    user,
    addMessage,
    setTyping,
    removeTyping,
    markAsSeen,
    updateChat,
    moveChatToTop,
    setUserOnline,
    setUserOffline,
  ]);
};

