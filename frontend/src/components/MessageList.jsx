import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from './ui/ScrollArea';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { useChatStore } from '../store/chatStore';
import { useMessageStore } from '../store/messageStore';

const MessageList = ({ messages }) => {
  const { selectedChat } = useChatStore();
  const { typingUsers } = useMessageStore();
  const scrollRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isTyping = selectedChat && typingUsers[selectedChat._id];

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <MessageItem
            key={message._id}
            message={message}
            isFirst={index === 0 || messages[index - 1].sender._id !== message.sender._id}
          />
        ))}
      </AnimatePresence>

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator userName={isTyping} />}

      {/* Empty State */}
      {messages.length === 0 && !isTyping && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Send a message to start the conversation</p>
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;

