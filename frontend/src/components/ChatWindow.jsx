import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Info, Phone, Video, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar";
import { ScrollArea } from "./ui/ScrollArea";
import Button from "./ui/Button";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { getChatName, getChatAvatar, getOtherUser } from "../lib/utils";

const ChatWindow = () => {
  const { selectedChat, selectChat } = useChatStore();
  const { messages, fetchMessages, clearMessages } = useMessageStore();
  const { user } = useAuthStore();
  const { isUserOnline } = useUserStore();

  // Handle back button for mobile navigation
  const handleBackToChats = () => {
    selectChat(null);
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    } else {
      clearMessages();
    }
  }, [selectedChat, fetchMessages, clearMessages]);

  if (!selectedChat) {
    return (
      <div className="hidden md:flex h-screen flex-1 items-center justify-center bg-background">
        <div className="text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10"
          >
            <svg
              className="h-8 w-8 sm:h-10 sm:w-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Select a chat to start messaging
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Choose a conversation from the sidebar
          </p>
        </div>
      </div>
    );
  }

  const chatName = getChatName(selectedChat, user?._id);
  const chatAvatar = getChatAvatar(selectedChat, user?._id);
  const otherUser = getOtherUser(selectedChat, user?._id);
  const isOnline = otherUser && isUserOnline(otherUser._id);

  return (
    <div className="flex h-screen flex-1 flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border bg-card p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          {/* Back Button - visible only on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={handleBackToChats}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="relative shrink-0">
            <Avatar className="h-9 w-9 md:h-10 md:w-10">
              <AvatarImage src={chatAvatar} alt={chatName} />
              <AvatarFallback>
                {chatName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!selectedChat.isGroupChat && isOnline && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-green-500 ring-2 ring-card" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-foreground truncate text-sm md:text-base">{chatName}</h2>
            <p className="text-xs text-muted-foreground truncate">
              {selectedChat.isGroupChat
                ? `${selectedChat.users?.length} members`
                : isOnline
                ? "Online"
                : otherUser?.lastSeen
                ? `Last seen ${new Date(otherUser.lastSeen).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${new Date(otherUser.lastSeen).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}`
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
            <Phone className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8 md:h-10 md:w-10">
            <Video className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
            <Info className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
