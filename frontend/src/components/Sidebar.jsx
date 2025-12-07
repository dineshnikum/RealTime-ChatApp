import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  LogOut,
  Moon,
  Sun,
  Settings,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useChatStore } from '../store/chatStore';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { ScrollArea } from './ui/ScrollArea';
import Button from './ui/Button';
import ChatListItem from './ChatListItem';
import NewChatModal from './NewChatModal';
import CreateGroupModal from './CreateGroupModal';
import UserProfileModal from './UserProfileModal';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { chats } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredChats = chats.filter((chat) => {
    const chatName = chat.isGroupChat
      ? chat.chatName
      : chat.users?.find((u) => u._id !== user?._id)?.name || '';
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <div className="flex h-screen w-full md:w-96 flex-col border-r border-border bg-card">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Chats</h1>
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="focus:outline-none"
                >
                  <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 rounded-md bg-card border border-border shadow-lg z-50"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowDropdown(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                      >
                        <Settings className="h-4 w-4" />
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowNewChatModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowCreateGroupModal(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              New Group
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No chats yet</p>
                <p className="text-sm mt-2">Start a new chat to begin messaging</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <ChatListItem key={chat._id} chat={chat} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Modals */}
      {showNewChatModal && (
        <NewChatModal onClose={() => setShowNewChatModal(false)} />
      )}
      {showCreateGroupModal && (
        <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} />
      )}
      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

export default Sidebar;

