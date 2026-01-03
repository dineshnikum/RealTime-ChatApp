import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import Button from './ui/Button';
import Input from './ui/Input';

const NewChatModal = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchUsers, users, clearUsers } = useUserStore();
  const { accessChat } = useChatStore();

  // Clear users when modal opens
  useEffect(() => {
    clearUsers();
  }, [clearUsers]);

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      // Clear users when search query is empty
      clearUsers();
    }
  }, [searchQuery, searchUsers, clearUsers]);

  const handleSelectUser = async (userId) => {
    await accessChat(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-lg bg-card p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">New Chat</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto max-h-64 sm:max-h-96">
          {users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {searchQuery ? 'No users found' : 'Search for users to start a chat'}
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <motion.button
                  key={user._id}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  onClick={() => handleSelectUser(user._id)}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NewChatModal;

