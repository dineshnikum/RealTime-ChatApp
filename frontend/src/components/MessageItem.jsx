import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar";
import { formatTime } from "../lib/utils";

const MessageItem = ({ message, isFirst }) => {
  const { user } = useAuthStore();
  const isOwn = message.sender._id === user?._id;
  const isSeen = message.seenBy && message.seenBy.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-4 flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar (show only for first message in sequence) */}
      {isFirst && !isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback>
            {message.sender.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {!isFirst && !isOwn && <div className="w-8" />}

      {/* Message Content */}
      <div
        className={`flex max-w-[70%] flex-col ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        {/* Sender Name (for group chats and not own messages) */}
        {isFirst && !isOwn && (
          <span className="mb-1 text-xs font-medium text-muted-foreground">
            {message.sender.name}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-secondary text-secondary-foreground rounded-bl-sm"
          }`}
        >
          {/* Image Message */}
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Attachment"
              className="mb-2 max-w-xs rounded-lg"
            />
          )}

          {/* Text Content */}
          {message.content && (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}

          {/* Time and Status */}
          <div
            className={`mt-1 flex items-center gap-1 text-xs ${
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <>
                {isSeen ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;
