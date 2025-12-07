import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Info, Phone, Video } from "lucide-react";
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
  const { selectedChat } = useChatStore();
  const { messages, fetchMessages, clearMessages } = useMessageStore();
  const { user } = useAuthStore();
  const { isUserOnline } = useUserStore();

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    } else {
      clearMessages();
    }
  }, [selectedChat, fetchMessages, clearMessages]);

  if (!selectedChat) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center bg-background">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
          >
            <svg
              className="h-10 w-10 text-primary"
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
          <h2 className="text-2xl font-semibold text-foreground">
            Select a chat to start messaging
          </h2>
          <p className="mt-2 text-muted-foreground">
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
      <div className="flex items-center justify-between border-b border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={chatAvatar} alt={chatName} />
              <AvatarFallback>
                {chatName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!selectedChat.isGroupChat && isOnline && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-card" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{chatName}</h2>
            <p className="text-xs text-muted-foreground">
              {selectedChat.isGroupChat
                ? `${selectedChat.users?.length} members`
                : isOnline
                ? "Online"
                : otherUser?.lastSeen
                ? `Last seen ${new Date(otherUser.lastSeen).toLocaleString()}`
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
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
