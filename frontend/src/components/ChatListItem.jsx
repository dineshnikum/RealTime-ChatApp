import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { getChatName, getChatAvatar, formatRelativeTime, getOtherUser } from '../lib/utils';

const ChatListItem = ({ chat }) => {
  const { user } = useAuthStore();
  const { selectedChat, selectChat } = useChatStore();
  const { isUserOnline } = useUserStore();

  const chatName = getChatName(chat, user?._id);
  const chatAvatar = getChatAvatar(chat, user?._id);
  const isSelected = selectedChat?._id === chat._id;
  
  // Check if other user is online (for one-to-one chats)
  const otherUser = getOtherUser(chat, user?._id);
  const isOnline = otherUser && isUserOnline(otherUser._id);

  const handleClick = () => {
    selectChat(chat);
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`flex cursor-pointer items-center gap-3 p-4 transition-colors ${
        isSelected ? 'bg-accent' : 'hover:bg-accent/50'
      }`}
    >
      {/* Avatar with online indicator */}
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chatAvatar} alt={chatName} />
          <AvatarFallback>{chatName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {!chat.isGroupChat && isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-card" />
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground truncate">{chatName}</h3>
          {chat.latestMessage && (
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(chat.latestMessage.createdAt)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {chat.latestMessage?.content || 'No messages yet'}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatListItem;

