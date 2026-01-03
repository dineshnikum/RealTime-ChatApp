import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useSocketListeners } from '../hooks/useSocketListeners';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const { fetchChats, selectedChat } = useChatStore();

  // Initialize socket listeners
  useSocketListeners();

  useEffect(() => {
    // Fetch all chats on mount
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="flex h-screen overflow-hidden px-12 bg-gray-900">
      {/* Sidebar - hidden on mobile when a chat is selected */}
      <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-auto`}>
        <Sidebar />
      </div>
      {/* ChatWindow - hidden on mobile when no chat is selected */}
      <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1`}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
