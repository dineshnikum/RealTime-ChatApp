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
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="flex h-screen overflow-hidden px-12 bg-gray-900">
      <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-auto`}>
        <Sidebar />
      </div>
      <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1`}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
