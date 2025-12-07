import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, UserPlus } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import Button from './ui/Button';
import Input from './ui/Input';
import toast from 'react-hot-toast';

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { searchUsers, users } = useUserStore();
  const { createGroupChat } = useChatStore();

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, searchUsers]);

  const handleToggleUser = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u._id === user._id);
      if (isSelected) {
        return prev.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error('Please select at least 2 users');
      return;
    }

    const userIds = selectedUsers.map((u) => u._id);
    await createGroupChat(userIds, groupName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Create Group</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Group Name */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            autoFocus
          />
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1"
              >
                <span className="text-sm text-foreground">{user.name}</span>
                <button
                  onClick={() => handleToggleUser(user)}
                  className="rounded-full hover:bg-primary/20 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* User List */}
        <div className="mb-4 max-h-64 overflow-y-auto">
          {users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {searchQuery ? 'No users found' : 'Search for users to add'}
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => {
                const isSelected = selectedUsers.find((u) => u._id === user._id);
                return (
                  <motion.button
                    key={user._id}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                    onClick={() => handleToggleUser(user)}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                      isSelected ? 'bg-accent' : ''
                    }`}
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
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <X className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateGroup}
          className="w-full"
          disabled={!groupName.trim() || selectedUsers.length < 2}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Group ({selectedUsers.length})
        </Button>
      </motion.div>
    </div>
  );
};

export default CreateGroupModal;

