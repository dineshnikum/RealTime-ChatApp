import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to relative time
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return messageDate.toLocaleDateString();
}

/**
 * Format time
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get chat name
 */
export function getChatName(chat, currentUserId) {
  if (chat.isGroupChat) {
    return chat.chatName;
  }

  const otherUser = chat.users?.find((user) => user._id !== currentUserId);
  return otherUser?.name || 'Unknown';
}

/**
 * Get chat avatar
 */
export function getChatAvatar(chat, currentUserId) {
  if (chat.isGroupChat) {
    return chat.groupAvatar || null;
  }

  const otherUser = chat.users?.find((user) => user._id !== currentUserId);
  return otherUser?.avatar || null;
}

/**
 * Get other user in one-to-one chat
 */
export function getOtherUser(chat, currentUserId) {
  if (chat.isGroupChat) {
    return null;
  }

  return chat.users?.find((user) => user._id !== currentUserId);
}

