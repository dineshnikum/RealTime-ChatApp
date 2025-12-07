import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useSocketListeners } from '../hooks/useSocketListeners';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const { fetchChats } = useChatStore();

  // Initialize socket listeners
  useSocketListeners();

  useEffect(() => {
    // Fetch all chats on mount
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Chat;

